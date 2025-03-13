import divi
from divi.services import init as init_services
from divi.session import Session, SessionExtra
from divi.signals.trace import Span


def init(session_extra: SessionExtra) -> Session:
    """init initializes the services and the Run"""
    init_services()
    return Session(name=session_extra.get("session_name"))


def setup(
    span: Span,
    session_extra: SessionExtra | None,
):
    """setup trace

    Args:
        span (Span): Span instance
        session_extra (SessionExtra | None): Extra information from user input
    """
    # TOOD: merge run_extra input by user with the one from the context
    # temp solution: Priority: run_extra_context.get() > run_extra
    session_extra = session_extra or SessionExtra()

    # init the session if not already initialized
    if not divi._session:
        divi._session = init(session_extra=session_extra)

    # setup trace
    # init current span
    trace_id = session_extra.get("trace_id")
    parent_span_id = session_extra.get("parent_span_id")
    if trace_id and parent_span_id:
        span._add_parent(trace_id, parent_span_id)
    else:
        span._as_root()

    # update the session_extra with the current span
    # session_extra["trace_id"] = span.trace_id
    # session_extra["parent_span_id"] = span.span_id
    session_extra = SessionExtra(
        session_name=divi._session.name,
        trace_id=span.trace_id,
        # set the parent_span_id to the current span_id
        parent_span_id=span.span_id,
    )

    # offer end hook to collect data at whe end of the span ?
    return session_extra
