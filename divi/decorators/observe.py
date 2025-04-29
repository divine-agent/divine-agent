import contextvars
from typing import (
    Callable,
    Optional,
)

from divi.decorators.collect import collect
from divi.session import SessionExtra
from divi.session.setup import setup
from divi.signals.span import Span
from divi.utils import extract_flattened_inputs

# ContextVar to store the extra information
# from the Session and parent Span
_SESSION_EXTRA = contextvars.ContextVar[Optional[SessionExtra]](
    "_SESSION_EXTRA", default=None
)


def observe(
    *args,
    func: Callable,
    span: Span,
    session_extra: Optional[SessionExtra] = None,
    **kwargs,
):
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
    # end the trace if it is the root span
    if trace and not span.parent_span_id:
        trace.end()

    # collect inputs and outputs
    inputs = extract_flattened_inputs(func, *args, **kwargs)
    collect(span, inputs, result)

    return result
