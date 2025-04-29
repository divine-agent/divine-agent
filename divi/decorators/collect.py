from typing import Any

from google.protobuf.message import Error
from openai.types.chat import ChatCompletion
from typing_extensions import Dict

import divi
from divi.evaluation.evaluator import EvaluationScore
from divi.signals.span import Span


def collect(span: Span, input: Dict[str, Any], result: Any):
    if not divi._datapark or span.trace_id is None:
        raise Error("divi._datapark or span.trace_id is None")
    # TODO: collect inputs and outputs for SPAN_KIND_FUNCTION

    # collect inputs and outputs for SPAN_KIND_LLM
    if isinstance(result, ChatCompletion):
        divi._datapark.create_chat_completion(
            span_id=span.span_id,
            trace_id=span.trace_id,
            inputs=input,
            completion=result,
        )

    # collect inputs and outputs for SPAN_KIND_EVALUATION
    if isinstance(result, list) and all(
        isinstance(x, EvaluationScore) for x in result
    ):
        divi._datapark.create_scores(
            span_id=span.span_id,
            trace_id=span.trace_id,
            scores=result,
        )
