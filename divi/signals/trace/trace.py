import time
from typing import Any, Mapping, Optional
from uuid import uuid4

from pydantic import UUID4

from divi.proto.common.v1.common_pb2 import KeyValue
from divi.proto.trace.v1.trace_pb2 import Span as SpanProto


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
        self.span_id: UUID4 = uuid4()
        self.name = name
        self.kind = kind
        self.metadata = metadata
        self.start_time_unix_nano: int | None = None
        self.end_time_unix_nano: int | None = None

        self.trace_id: UUID4 | None = None
        self.parent_span_id: UUID4 | None = None

    @property
    def signal(self):
        signal: SpanProto = SpanProto(
            name=self.name,
            span_id=self.span_id.bytes,
            kind=self._get_kind(self.kind),
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

    def start(self):
        """Start the span by recording the current time in nanoseconds."""
        self.start_time_unix_nano = time.time_ns()

    def end(self):
        """End the span by recording the end time in nanoseconds."""
        if self.start_time_unix_nano is None:
            raise ValueError("Span must be started before ending.")
        self.end_time_unix_nano = time.time_ns()

    def _as_root(self):
        """Set the span as a root span."""
        self.trace_id = uuid4()
        print("as root")
        print(f"name: {self.name}")
        print(f"trace_id: {self.trace_id}")
        print(f"span_id: {self.span_id}")

    def _add_parent(self, trace_id: UUID4, parent_id: UUID4):
        """Set the parent span ID."""
        self.trace_id = trace_id
        self.parent_span_id = parent_id

        print("add parent")
        print(f"name: {self.name}")
        print(f"trace_id: {trace_id}")
        print(f"span_id: {self.span_id}")
        print(f"parent_span_id: {parent_id}")
