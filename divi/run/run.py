from typing import Optional, TypedDict
from uuid import uuid4


class RunExtra(TypedDict, total=False):
    """Extra information for Run"""

    run_name: Optional[str]
    """Name of the Run"""
    trace_id: Optional[bytes]
    """Trace ID UUID4"""
    parent_span_id: Optional[bytes]
    """Parent Span ID UUID4"""


class Run:
    def __init__(
        self,
        name: Optional[str] = None,
    ):
        self.id = uuid4()
        self.name = name
