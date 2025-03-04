from typing import Optional, TypedDict
from uuid import uuid4

from pydantic.types import UUID4


class RunExtra(TypedDict, total=False):
    """Extra information for Run"""

    run_name: Optional[str]
    """Name of the Run"""
    trace_id: Optional[UUID4]
    """Trace ID"""
    parent_span_id: Optional[UUID4]
    """Parent Span ID"""


class Run:
    def __init__(
        self,
        name: Optional[str] = None,
    ):
        self.id = uuid4()
        self.name = name
