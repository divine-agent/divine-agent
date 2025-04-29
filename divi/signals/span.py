import os
import time
from enum import Enum
from typing import Any, Mapping, Optional

from pydantic import UUID4

import divi
from divi.proto.common.v1.common_pb2 import KeyValue
from divi.proto.trace.v1.trace_pb2 import ScopeSpans
from divi.proto.trace.v1.trace_pb2 import Span as SpanProto


class Kind(int, Enum):
    """Enum for the kind of span."""

    function = SpanProto.SpanKind.SPAN_KIND_FUNCTION
    llm = SpanProto.SpanKind.SPAN_KIND_LLM
    evaluation = SpanProto.SpanKind.SPAN_KIND_EVALUATION


class Span:
    def __init__(
        self,
        kind: Kind = Kind.function,
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
            kind=SpanProto.SpanKind.Name(self.kind),
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
    def _generate_span_id(cls) -> bytes:
        return os.urandom(8)

    def start(self):
        """Start the span by recording the current time in nanoseconds."""
        self.start_time_unix_nano = time.time_ns()
        self.upsert_span()

    def end(self):
        """End the span by recording the end time in nanoseconds."""
        if self.start_time_unix_nano is None:
            raise ValueError("Span must be started before ending.")
        self.end_time_unix_nano = time.time_ns()
        self.upsert_span()

    def _add_node(self, trace_id: UUID4, parent_id: Optional[bytes] = None):
        """Add node for obs tree."""
        self.trace_id = trace_id
        self.parent_span_id = parent_id

    def upsert_span(self):
        """Upsert span with datapark."""
        if divi._datapark and self.trace_id:
            divi._datapark.create_spans(
                self.trace_id, ScopeSpans(spans=[self.signal])
            )
