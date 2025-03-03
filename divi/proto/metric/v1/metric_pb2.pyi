from divi.proto.common.v1 import common_pb2 as _common_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ScopeMetrics(_message.Message):
    __slots__ = ("scope", "metrics")
    SCOPE_FIELD_NUMBER: _ClassVar[int]
    METRICS_FIELD_NUMBER: _ClassVar[int]
    scope: _common_pb2.RunScope
    metrics: _containers.RepeatedCompositeFieldContainer[Metric]
    def __init__(self, scope: _Optional[_Union[_common_pb2.RunScope, _Mapping]] = ..., metrics: _Optional[_Iterable[_Union[Metric, _Mapping]]] = ...) -> None: ...

class Metric(_message.Message):
    __slots__ = ("name", "description", "data", "attributes")
    NAME_FIELD_NUMBER: _ClassVar[int]
    DESCRIPTION_FIELD_NUMBER: _ClassVar[int]
    DATA_FIELD_NUMBER: _ClassVar[int]
    ATTRIBUTES_FIELD_NUMBER: _ClassVar[int]
    name: str
    description: str
    data: _common_pb2.AnyValue
    attributes: _containers.RepeatedCompositeFieldContainer[_common_pb2.KeyValue]
    def __init__(self, name: _Optional[str] = ..., description: _Optional[str] = ..., data: _Optional[_Union[_common_pb2.AnyValue, _Mapping]] = ..., attributes: _Optional[_Iterable[_Union[_common_pb2.KeyValue, _Mapping]]] = ...) -> None: ...
