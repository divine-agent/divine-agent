from typing import Optional, TypedDict
from uuid import uuid4

from divi.signals.trace.trace import Trace


class SessionExtra(TypedDict, total=False):
    """Extra information for Session"""

    session_name: Optional[str]
    """Name of the session"""
    trace: Trace
    """Trace in session"""
    parent_span_id: Optional[bytes]
    """Parent Span ID fixed string(8)"""


class SessionSignal(TypedDict):
    """Session request"""

    id: str
    """Session ID UUID4"""
    name: Optional[str]
    """Session name"""


class Session:
    def __init__(
        self,
        name: Optional[str] = None,
    ):
        self.id = uuid4()
        self.name = name

    @property
    def signal(self) -> SessionSignal:
        return SessionSignal(
            id=str(self.id),
            name=self.name,
        )
