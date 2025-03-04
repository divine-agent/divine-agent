from divi.proto.common.v1 import common_pb2 as _common_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Run(_message.Message):
    __slots__ = ("user_id", "run_id", "name", "kind", "start_time_unix_nano", "end_time_unix_nano", "metadata")
    class RunKind(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
        __slots__ = ()
        Observation: _ClassVar[Run.RunKind]
        Evaluation: _ClassVar[Run.RunKind]
        Dataset: _ClassVar[Run.RunKind]
    Observation: Run.RunKind
    Evaluation: Run.RunKind
    Dataset: Run.RunKind
    USER_ID_FIELD_NUMBER: _ClassVar[int]
    RUN_ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    KIND_FIELD_NUMBER: _ClassVar[int]
    START_TIME_UNIX_NANO_FIELD_NUMBER: _ClassVar[int]
    END_TIME_UNIX_NANO_FIELD_NUMBER: _ClassVar[int]
    METADATA_FIELD_NUMBER: _ClassVar[int]
    user_id: bytes
    run_id: bytes
    name: str
    kind: Run.RunKind
    start_time_unix_nano: int
    end_time_unix_nano: int
    metadata: _containers.RepeatedCompositeFieldContainer[_common_pb2.KeyValue]
    def __init__(self, user_id: _Optional[bytes] = ..., run_id: _Optional[bytes] = ..., name: _Optional[str] = ..., kind: _Optional[_Union[Run.RunKind, str]] = ..., start_time_unix_nano: _Optional[int] = ..., end_time_unix_nano: _Optional[int] = ..., metadata: _Optional[_Iterable[_Union[_common_pb2.KeyValue, _Mapping]]] = ...) -> None: ...
