import contextvars
import functools
import inspect
from typing import (
    Any,
    Callable,
    Generic,
    List,
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
    metadata: Optional[Mapping[str, Any]] = None,
) -> Callable[[Callable[P, R]], WithSessionExtra[P, R]]: ...


def observable(
    *args, **kwargs
) -> Union[Callable, Callable[[Callable], Callable]]:
    """Observable decorator factory."""

    kind = kwargs.pop("kind", "function")
    name = kwargs.pop("name", None)
    metadata = kwargs.pop("metadata", None)

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

            # TODO: collect inputs and outputs
            inputs = extract_flattened_inputs(func, *args, **kwargs)
            # create the span if it is the root span
            if divi._datapark and span.trace_id:
                divi._datapark.create_spans(
                    span.trace_id, ScopeSpans(spans=[span.signal])
                )
            # end the trace if it is the root span
            if divi._datapark and not span.parent_span_id:
                trace = session_extra.get("trace")
                if trace:
                    trace.end()
                    divi._datapark.upsert_traces(
                        session_id=trace.session_id, traces=[trace.signal]
                    )
            # create the chat completion if it is a chat completion
            if divi._datapark and isinstance(result, ChatCompletion):
                divi._datapark.create_chat_completion(
                    span_id=span.span_id, inputs=inputs, completion=result
                )
            return result

        @functools.wraps(func)
        def generator_wrapper(
            *args, session_extra: Optional[SessionExtra] = None, **kwargs
        ):
            span = Span(
                kind=kind, name=name or func.__name__, metadata=metadata
            )
            session_extra = setup(span, _SESSION_EXTRA.get() or session_extra)
            # set current context
            token = _SESSION_EXTRA.set(session_extra)
            # execute the function
            results: List[Any] = []
            span.start()
            for item in func(*args, **kwargs):
                results.append(item)
                yield item
            span.end()

            # recover parent context
            _SESSION_EXTRA.reset(token)
            # TODO: collect results

        if inspect.isgeneratorfunction(func):
            return generator_wrapper
        return wrapper

    # Function Decorator
    if len(args) == 1 and callable(args[0]) and not kwargs:
        return decorator(args[0])
    # Factory Decorator
    return decorator
