import copy
import os
from typing import Any, Dict, Optional

from openai.types.chat import ChatCompletion
from typing_extensions import List

import divi
from divi.evaluation import Evaluator
from divi.evaluation.evaluator import EvaluatorConfig
from divi.evaluation.scores import Score

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
    inputs: Dict[str, Any],
    outputs: ChatCompletion,
    scores: List[Score],
    config: Optional[EvaluatorConfig] = None,
):
    if not divi._evaluator:
        divi._evaluator = init_evaluator(config)

    # create conversation with result and inputs
    input_messages = inputs.get("messages", None)
    if input_messages is None:
        raise ValueError("No messages found in inputs")
    output_message = outputs.choices[0].message
    if output_message is None:
        raise ValueError("No message found in outputs")

    conversations = copy.deepcopy(input_messages)
    conversations.append(
        {"role": output_message.role, "content": output_message.content}
    )
    evaluation_scores = divi._evaluator.evaluate(
        "\n".join(f"{m['role']}: {m['content']}" for m in conversations), scores
    )

    # TODO: collect all evaluation scores and link them to span
    print(evaluation_scores)
