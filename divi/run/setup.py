from typing_extensions import Optional

import divi
from divi.run import Run, RunExtra
from divi.services import init as init_services


def init(run_extra: Optional[RunExtra] = None) -> Run:
    """init initializes the services and the Run"""
    init_services()
    run_name = run_extra.get("run_name") if run_extra else None
    return Run(name=run_name)


def setup(run_extra: Optional[RunExtra] = None):
    """setup trace

    Args:
        run_extra (Optional[RunExtra]): Extra information from parent context
    """
    if not divi._run:
        divi._run = init(run_extra=run_extra)

    # setup current context
    # new span

    # set _RUNEXTRA

    # offer end hook to collect data at whe end of the span ?
