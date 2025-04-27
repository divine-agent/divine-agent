import contextvars
import functools
from typing import (
    Any,
    Callable,
    Generic,
    Mapping,
    Optional,
    ParamSpec,
    Protocol,
    TypeVar,
    Union,
    overload,
    runtime_checkable,
)

from openai.types.chat import ChatCompletion

import divi
from divi.evaluation.evaluate import evaluate_scores
from divi.evaluation.scores import Score
from divi.proto.trace.v1.trace_pb2 import ScopeSpans
from divi.session import SessionExtra
from divi.session.setup import setup
from divi.signals.trace import Span
from divi.utils import extract_flattened_inputs

R = TypeVar("R", covariant=True)
P = ParamSpec("P")

# ContextVar to store the extra information
# from the Session and parent Span
_SESSION_EXTRA = contextvars.ContextVar[Optional[SessionExtra]](
    "_SESSION_EXTRA", default=None
)


@runtime_checkable
class WithSessionExtra(Protocol, Generic[P, R]):
    def __call__(
        self,
        *args: P.args,
        session_extra: Optional[SessionExtra] = None,  # type: ignore[valid-type]
        **kwargs: P.kwargs,
    ) -> R: ...


@overload
def observable(func: Callable[P, R]) -> WithSessionExtra[P, R]: ...


@overload
def observable(
    kind: str = "function",
    *,
    name: Optional[str] = None,
    scores: Optional[list[Score]] = None,
    metadata: Optional[Mapping[str, Any]] = None,
) -> Callable[[Callable[P, R]], WithSessionExtra[P, R]]: ...


def observable(
    *args, **kwargs
) -> Union[Callable, Callable[[Callable], Callable]]:
    """Observable decorator factory."""

    kind = kwargs.pop("kind", "function")
    name = kwargs.pop("name", None)
    metadata = kwargs.pop("metadata", None)
    scores: list[Score] = kwargs.pop("scores", None)

    def decorator(func):
        @functools.wraps(func)
        def wrapper(
            *args, session_extra: Optional[SessionExtra] = None, **kwargs
        ):
            span = Span(
                kind=kind, name=name or func.__name__, metadata=metadata
            )
            session_extra = setup(span, _SESSION_EXTRA.get() or session_extra)
            # set current context
            token = _SESSION_EXTRA.set(session_extra)
            # execute the function
            span.start()
            result = func(*args, **kwargs)
            span.end()
            # recover parent context
            _SESSION_EXTRA.reset(token)

            # get the trace to collect data
            trace = session_extra.get("trace")
            if not trace:
                raise ValueError("Trace not found in session context.")
            # TODO: collect inputs and outputs for SPAN_KIND_FUNCTION
            inputs = extract_flattened_inputs(func, *args, **kwargs)
            # create the span if it is the root span
            if divi._datapark and span.trace_id:
                divi._datapark.create_spans(
                    span.trace_id, ScopeSpans(spans=[span.signal])
                )
            # end the trace if it is the root span
            if divi._datapark and not span.parent_span_id:
                trace.end()
            # create the chat completion if it is a chat completion
            if divi._datapark and isinstance(result, ChatCompletion):
                divi._datapark.create_chat_completion(
                    span_id=span.span_id,
                    trace_id=trace.trace_id,
                    inputs=inputs,
                    completion=result,
                )
                # evaluate the scores if they are provided
                if scores is not None and scores.__len__() > 0:
                    evaluate_scores(inputs, outputs=result, scores=scores)

            return result

        return wrapper

    # Function Decorator
    if len(args) == 1 and callable(args[0]) and not kwargs:
        return decorator(args[0])
    # Factory Decorator
    return decorator
