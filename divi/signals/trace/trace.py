import time
from typing import Any, Mapping, Optional
from uuid import uuid4

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
        self.data: SpanProto = SpanProto(
            span_id=uuid4().bytes,
            kind=self._get_kind(kind),
        )

        self.data.metadata.extend(
            KeyValue(key=k, value=v) for k, v in (metadata or dict()).items()
        )
        print(f"init new span: {self.data.span_id}")

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
        self.data.end_time_unix_nano = time.time_ns()

    def _as_root(self):
        """Set the span as a root span."""
        self.data.trace_id = uuid4().bytes
        print("as root")
        print(f"trace_id: {self.data.trace_id}")

    def _add_parent(self, trace_id: bytes, parent_id: bytes):
        """Set the parent span ID."""

        if not isinstance(trace_id, bytes) or len(trace_id) != 16:
            raise ValueError("Trace ID must be a 16-byte UUID.")

        if not isinstance(parent_id, bytes) or len(parent_id) != 16:
            raise ValueError("Parent span ID must be a 16-byte UUID.")

        self.data.trace_id = trace_id
        self.data.parent_span_id = parent_id

        print("add parent")
        print(f"trace_id: {trace_id}")
        print(f"parent_span_id: {parent_id}")
