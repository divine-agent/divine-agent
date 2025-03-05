import divi
from divi.run import Run, RunExtra
from divi.signals.trace import Span


def init(run_extra: RunExtra) -> Run:
    """init initializes the services and the Run"""
    # init_services()
    return Run(name=run_extra.get("run_name"))


def setup(
    span: Span,
    run_extra: RunExtra | None,
):
    """setup trace

    Args:
        span (Span): Span instance
        run_extra (RunExtra | None): Extra information from user input
    """
    # TOOD: merge run_extra input by user with the one from the context
    # temp solution: Priority: run_extra_context.get() > run_extra
    run_extra = run_extra or RunExtra()

    # init the Run if not already initialized
    if not divi._run:
        divi._run = init(run_extra=run_extra)

    # setup current span
    trace_id = run_extra.get("trace_id")
    parent_span_id = run_extra.get("parent_span_id")
    if trace_id and parent_span_id:
        span._add_parent(trace_id, parent_span_id)
    else:
        span._as_root()

    # set _RUNEXTRA
    run_extra = RunExtra(
        run_name=divi._run.name,
        trace_id=span.trace_id,
        # set the parent_span_id to the current span_id
        parent_span_id=span.span_id,
    )

    # offer end hook to collect data at whe end of the span ?
    # offer hook to reset the context with the token
    # context = copy_context()
    # context.run(run_extra_context.set, run_extra)
    return run_extra
