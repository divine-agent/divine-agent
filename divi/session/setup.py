from typing_extensions import Optional

import divi
from divi.services import init as init_services
from divi.session import Session, SessionExtra
from divi.signals.trace import Span
from divi.signals.trace.trace import Trace


def init_session(name: Optional[str] = None) -> Session:
    """init initializes the services and the Run"""
    init_services()
    session = Session(name=name)
    if divi._datapark:
        divi._datapark.create_session(session.signal)
    return session


def setup(
    span: Span,
    session_extra: SessionExtra | None,
):
    """setup trace

    Args:
        span (Span): Span instance
        session_extra (SessionExtra | None): Extra information from user input
    """
    session_extra = session_extra or SessionExtra()

    # init the session if not already initialized
    if not divi._session:
        divi._session = init_session(
            name=session_extra.get("session_name") or span.name
        )

    # setup trace
    trace = session_extra.get("trace") or Trace(divi._session.id, span.name)
    parent_span_id = session_extra.get("parent_span_id")
    span._add_node(trace.trace_id, parent_span_id)

    # update the session_extra with the current trace and span
    return SessionExtra(
        session_name=divi._session.name,
        trace=trace,
        # set the parent_span_id to the current span_id
        parent_span_id=span.span_id,
    )
