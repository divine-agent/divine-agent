import os
from typing import Optional

from openai.types.chat import (
    ChatCompletion,
    ChatCompletionMessageParam,
)
from typing_extensions import List

import divi
from divi.decorators.observe import observe
from divi.evaluation import Evaluator
from divi.evaluation.evaluator import EvaluatorConfig
from divi.evaluation.scores import Score
from divi.signals.span import Kind, Span

OPENAI_API_KEY = "OPENAI_API_KEY"
OPENAI_BASE_URL = "OPENAI_BASE_URL"


def init_evaluator(config: Optional[EvaluatorConfig] = None):
    _config = config or EvaluatorConfig()
    api_key = _config.api_key if _config.api_key else os.getenv(OPENAI_API_KEY)
    base_url = (
        _config.base_url if _config.base_url else os.getenv(OPENAI_BASE_URL)
    )
    if api_key is None:
        raise ValueError("API key is required for evaluator")
    _config.api_key = api_key
    _config.base_url = base_url
    evaluator = Evaluator(_config)
    return evaluator


def evaluate_scores(
    messages: Optional[List[ChatCompletionMessageParam]],
    outputs: Optional[ChatCompletion],
    scores: Optional[List[Score]],
    config: Optional[EvaluatorConfig] = None,
):
    if messages is None or scores is None or scores.__len__() == 0:
        return
    if not divi._evaluator:
        divi._evaluator = init_evaluator(config)

    if isinstance(outputs, ChatCompletion):
        output_message = outputs.choices[0].message.content
        if not output_message:
            return

        evaluation_span = Span(kind=Kind.evaluation, name="Evaluation")
        observe(
            func=divi._evaluator.evaluate,
            span=evaluation_span,
            target=output_message,
            conversation="\n".join(
                f"{m.get('role', 'unknown')}: {m.get('content')}"
                for m in messages
            ),
            scores=scores,
        )
