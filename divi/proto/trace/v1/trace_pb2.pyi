from divi.proto.common.v1 import common_pb2 as _common_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ScopeSpans(_message.Message):
    __slots__ = ("spans",)
    SPANS_FIELD_NUMBER: _ClassVar[int]
    spans: _containers.RepeatedCompositeFieldContainer[Span]
    def __init__(self, spans: _Optional[_Iterable[_Union[Span, _Mapping]]] = ...) -> None: ...

class Span(_message.Message):
    __slots__ = ("trace_id", "span_id", "parent_span_id", "name", "kind", "start_time_unix_nano", "end_time_unix_nano", "metadata")
    class SpanKind(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
        __slots__ = ()
        SPAN_KIND_FUNCTION: _ClassVar[Span.SpanKind]
        SPAN_KIND_LLM: _ClassVar[Span.SpanKind]
    SPAN_KIND_FUNCTION: Span.SpanKind
    SPAN_KIND_LLM: Span.SpanKind
    TRACE_ID_FIELD_NUMBER: _ClassVar[int]
    SPAN_ID_FIELD_NUMBER: _ClassVar[int]
    PARENT_SPAN_ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    KIND_FIELD_NUMBER: _ClassVar[int]
    START_TIME_UNIX_NANO_FIELD_NUMBER: _ClassVar[int]
    END_TIME_UNIX_NANO_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    trace_id: bytes
    span_id: bytes
    parent_span_id: bytes
    name: str
    kind: Span.SpanKind
    start_time_unix_nano: int
    end_time_unix_nano: int
    metadata: _containers.RepeatedCompositeFieldContainer[_common_pb2.KeyValue]
    def __init__(self, trace_id: _Optional[bytes] = ..., span_id: _Optional[bytes] = ..., parent_span_id: _Optional[bytes] = ..., name: _Optional[str] = ..., kind: _Optional[_Union[Span.SpanKind, str]] = ..., start_time_unix_nano: _Optional[int] = ..., end_time_unix_nano: _Optional[int] = ..., metadata: _Optional[_Iterable[_Union[_common_pb2.KeyValue, _Mapping]]] = ...) -> None: ...
