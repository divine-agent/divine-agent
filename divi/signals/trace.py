from datetime import UTC, datetime
from typing import Optional
from uuid import uuid4

from pydantic import UUID4
from typing_extensions import TypedDict

import divi


class NullTime(TypedDict, total=False):
    """Null time"""

    Time: str
    """Time in iso format"""
    Valid: bool
    """Valid"""


class TraceSignal(TypedDict, total=False):
    """Trace request"""

    id: str
    """Trace ID UUID4"""
    start_time: str
    """Start time in iso format"""
    end_time: NullTime
    """End time in iso format"""
    name: Optional[str]


class Trace:
    def __init__(self, session_id: UUID4, name: Optional[str] = None):
        self.trace_id: UUID4 = uuid4()
        self.start_time: str | None = None
        self.end_time: str | None = None
        self.name: Optional[str] = name
        self.session_id: UUID4 = session_id

        self.start()

    @property
    def signal(self) -> TraceSignal:
        if self.start_time is None:
            raise ValueError("Trace must be started.")
        signal = TraceSignal(
            id=str(self.trace_id),
            start_time=self.start_time,
            name=self.name,
        )
        if self.end_time is not None:
            signal["end_time"] = NullTime(
                Time=self.end_time,
                Valid=True,
            )
        return signal

    @staticmethod
    def unix_nano_to_iso(unix_nano: int) -> str:
        return datetime.utcfromtimestamp(unix_nano / 1e9).isoformat()

    def start(self):
        """Start the trace by recording the current time in nanoseconds."""
        self.start_time = datetime.now(UTC).isoformat()
        self.upsert_trace()

    def end(self):
        """End the trace by recording the end time in nanoseconds."""
        if self.start_time is None:
            raise ValueError("Span must be started before ending.")
        self.end_time = datetime.now(UTC).isoformat()
        self.upsert_trace()

    def upsert_trace(self):
        """Upsert trace with datapark."""
        if divi._datapark:
            divi._datapark.upsert_traces(
                session_id=self.session_id, traces=[self.signal]
            )
