import os
import time
from datetime import UTC, datetime
from typing import Any, Mapping, Optional
from uuid import uuid4

from pydantic import UUID4
from typing_extensions import TypedDict

import divi
from divi.proto.common.v1.common_pb2 import KeyValue
from divi.proto.trace.v1.trace_pb2 import Span as SpanProto


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


class Span:
    KIND_MAP = {
        "function": SpanProto.SpanKind.SPAN_KIND_FUNCTION,
        "llm": SpanProto.SpanKind.SPAN_KIND_LLM,
    }

    def __init__(
        self,
        kind: str = "function",
        name: Optional[str] = None,
        metadata: Optional[Mapping[str, Any]] = None,
    ):
        # span_id is a FixedString(8)
        self.span_id: bytes = self._generate_span_id()
        self.name = name
        self.kind = kind
        self.metadata = metadata
        self.start_time_unix_nano: int | None = None
        self.end_time_unix_nano: int | None = None

        self.trace_id: UUID4 | None = None
        self.parent_span_id: bytes | None = None

    @property
    def signal(self) -> SpanProto:
        signal: SpanProto = SpanProto(
            name=self.name,
            span_id=self.span_id,
            kind=self._get_kind(self.kind),
            start_time_unix_nano=self.start_time_unix_nano,
            end_time_unix_nano=self.end_time_unix_nano,
            trace_id=self.trace_id.bytes if self.trace_id else None,
            parent_span_id=self.parent_span_id,
        )
        signal.metadata.extend(
            KeyValue(key=k, value=v)
            for k, v in (self.metadata or dict()).items()
        )
        return signal

    @classmethod
    def _get_kind(cls, kind: str) -> SpanProto.SpanKind:
        if (k := cls.KIND_MAP.get(kind)) is None:
            raise ValueError(
                f"Unknown kind: {kind}. Now allowed: {cls.KIND_MAP.keys()}"
            )
        return k

    @classmethod
    def _generate_span_id(cls) -> bytes:
        return os.urandom(8)

    def start(self):
        """Start the span by recording the current time in nanoseconds."""
        self.start_time_unix_nano = time.time_ns()

    def end(self):
        """End the span by recording the end time in nanoseconds."""
        if self.start_time_unix_nano is None:
            raise ValueError("Span must be started before ending.")
        self.end_time_unix_nano = time.time_ns()

    def _add_node(self, trace_id: UUID4, parent_id: Optional[bytes] = None):
        """Add node for obs tree."""
        self.trace_id = trace_id
        self.parent_span_id = parent_id
