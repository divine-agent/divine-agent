import divi
from divi.services import init as init_services
from divi.session import Session, SessionExtra
from divi.signals.trace import Span
from divi.signals.trace.trace import Trace


def init(session_extra: SessionExtra) -> Session:
    """init initializes the services and the Run"""
    init_services()
    session = Session(name=session_extra.get("session_name"))
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
    # TOOD: merge run_extra input by user with the one from the context
    # temp solution: Priority: run_extra_context.get() > run_extra
    session_extra = session_extra or SessionExtra()

    # init the session if not already initialized
    if not divi._session:
        divi._session = init(session_extra=session_extra)

    # setup trace
    # init current span
    trace = session_extra.get("trace")
    parent_span_id = session_extra.get("parent_span_id")
    if trace and parent_span_id:
        span._add_parent(trace.trace_id, parent_span_id)
    else:
        trace = Trace(divi._session.id)
        trace.start()
        span._as_root(trace.trace_id)
        # create the trace
        if divi._datapark:
            divi._datapark.upsert_traces(
                session_id=divi._session.id, traces=[trace.signal]
            )

    # update the session_extra with the current span
    # session_extra["trace_id"] = span.trace_id
    # session_extra["parent_span_id"] = span.span_id
    session_extra = SessionExtra(
        session_name=divi._session.name,
        trace=trace,
        # set the parent_span_id to the current span_id
        parent_span_id=span.span_id,
    )

    # offer end hook to collect data at whe end of the span ?
    return session_extra
