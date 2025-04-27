import asyncio
import concurrent.futures
import random
from typing import List, Literal, Optional

import openai
from pydantic import BaseModel

from divi.evaluation.prompts import PRESET_PROMPT, PROMPT_TEMPLATE
from divi.evaluation.scores import Score


class EvaluatorConfig:
    def __init__(
        self,
        model: str = "gpt-4.1-nano",
        temperature: float = 0.5,
        max_concurrency: int = 10,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
    ):
        self.model = model
        self.api_key = api_key
        self.base_url = base_url
        self.temperature = temperature
        self.max_concurrency = max_concurrency


class EvaluationResult(BaseModel):
    name: Score
    judgment: bool
    reasoning: str


class EvaluationScore(BaseModel):
    name: Score
    score: float
    representative_reasoning: str
    all_evaluations: List[EvaluationResult]


class Evaluator:
    def __init__(self, config: Optional[EvaluatorConfig] = None):
        self.config = config or EvaluatorConfig()
        self.async_client = openai.AsyncOpenAI(
            api_key=self.config.api_key, base_url=self.config.base_url
        )
        self.sync_client = openai.OpenAI(
            api_key=self.config.api_key, base_url=self.config.base_url
        )

    @staticmethod
    def generate_prompt(conversation: str, score: Score) -> str:
        return PROMPT_TEMPLATE.format(
            requirements=PRESET_PROMPT[score.value], conversation=conversation
        )

    def _sync_evaluate_once(
        self, conversation: str, score: Score
    ) -> Optional[EvaluationResult]:
        prompt = self.generate_prompt(conversation, score)
        response = self.sync_client.beta.chat.completions.parse(
            model=self.config.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=self.config.temperature,
            response_format=EvaluationResult,
        )
        return response.choices[0].message.parsed

    async def _async_evaluate_once(
        self, conversation: str, score: Score
    ) -> Optional[EvaluationResult]:
        prompt = self.generate_prompt(conversation, score)
        response = await self.async_client.beta.chat.completions.parse(
            model=self.config.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=self.config.temperature,
            response_format=EvaluationResult,
        )
        return response.choices[0].message.parsed

    def _aggregate_result(
        self, name: Score, evaluations: List[EvaluationResult]
    ) -> EvaluationScore:
        n = len(evaluations)
        true_count = sum(1 for e in evaluations if e.judgment is True)
        score = true_count / n
        majority_judgment = True if true_count >= (n / 2) else False
        majority_reasons = [
            e.reasoning for e in evaluations if e.judgment == majority_judgment
        ]
        representative_reasoning = (
            random.choice(majority_reasons) if majority_reasons else ""
        )
        return EvaluationScore(
            name=name,
            score=score,
            representative_reasoning=representative_reasoning,
            all_evaluations=evaluations,
        )

    def _aggregate_results(
        self, evaluations: List[EvaluationResult]
    ) -> List[EvaluationScore]:
        scores = {}
        for evaluation in evaluations:
            if evaluation.name not in scores:
                scores[evaluation.name] = []
            scores[evaluation.name].append(evaluation)

        aggregated_results = [
            self._aggregate_result(name, evals)
            for name, evals in scores.items()
        ]
        return aggregated_results

    def evaluate_sync(
        self, conversation: str, scores: list[Score], n_rounds: int
    ) -> List[EvaluationScore]:
        with concurrent.futures.ThreadPoolExecutor(
            max_workers=self.config.max_concurrency
        ) as executor:
            futures = [
                executor.submit(self._sync_evaluate_once, conversation, score)
                for _ in range(n_rounds)
                for score in scores
            ]
            evaluations = [
                f.result() for f in concurrent.futures.as_completed(futures)
            ]
        return self._aggregate_results(
            [e for e in evaluations if e is not None]
        )

    async def evaluate_async(
        self, conversation: str, scores: list[Score], n_rounds: int
    ) -> List[EvaluationScore]:
        semaphore = asyncio.Semaphore(self.config.max_concurrency)

        async def sem_task(score):
            async with semaphore:
                return await self._async_evaluate_once(conversation, score)

        tasks = [sem_task(score) for _ in range(n_rounds) for score in scores]
        evaluations = await asyncio.gather(*tasks)
        return self._aggregate_results(
            [e for e in evaluations if e is not None]
        )

    def evaluate(
        self,
        conversation: str,
        scores: list[Score],
        n_rounds: int = 5,
        mode: Literal["sync", "async"] = "sync",
    ) -> List[EvaluationScore]:
        if mode == "async":
            return asyncio.run(
                self.evaluate_async(conversation, scores, n_rounds)
            )
        return self.evaluate_sync(conversation, scores, n_rounds)
