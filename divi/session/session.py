from typing import Optional, TypedDict
from uuid import uuid4

from pydantic import UUID4


class SessionExtra(TypedDict, total=False):
    """Extra information for Session"""

    session_name: Optional[str]
    """Name of the session"""
    trace_id: Optional[UUID4]
    """Trace ID UUID4"""
    parent_span_id: Optional[UUID4]
    """Parent Span ID UUID4"""


class Session:
    def __init__(
        self,
        name: Optional[str] = None,
    ):
        self.id = uuid4()
        self.name = name
