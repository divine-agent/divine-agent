from typing import Any, Dict

from google.protobuf.json_format import MessageToDict
from openai import NotGiven
from openai.types.chat import ChatCompletion
from pydantic import UUID4
from typing_extensions import Mapping

import divi
from divi.proto.trace.v1.trace_pb2 import ScopeSpans
from divi.services.service import Service
from divi.session.session import SessionSignal
from divi.signals.trace.trace import TraceSignal


class DataPark(Service):
    def __init__(self, host="localhost", port=3001):
        super().__init__(host, port)
        if not divi._auth:
            raise ValueError("No auth service")
        self.token = divi._auth.token

    @property
    def headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self.token}"}

    @staticmethod
    def strip_not_given(obj: object | None) -> object:
        """Remove all top-level keys where their values are instances of `NotGiven`"""
        if obj is None:
            return None

        if not isinstance(obj, Mapping):
            return obj

        return {
            key: value
            for key, value in obj.items()
            if not isinstance(value, NotGiven)
        }

    def create_session(self, session: SessionSignal) -> None:
        self.post("/api/session/", payload=session)

    def upsert_traces(
        self, session_id: UUID4, traces: list[TraceSignal]
    ) -> None:
        self.post(f"/api/session/{session_id}/traces", payload=traces)

    def create_spans(self, trace_id: UUID4, spans: ScopeSpans) -> None:
        self.post(f"/api/trace/{trace_id}/spans", payload=MessageToDict(spans))

    def create_chat_completion(
        self,
        span_id: bytes,
        trace_id: UUID4,
        inputs: Dict[str, Any],
        completion: ChatCompletion,
    ) -> None:
        hex_span_id = span_id.hex()
        self.post_concurrent(
            {
                "/api/v1/chat/completions/input": {
                    "span_id": hex_span_id,
                    "data": self.strip_not_given(inputs),
                },
                "/api/v1/chat/completions": {
                    "span_id": hex_span_id,
                    "trace_id": str(trace_id),
                    "data": completion.model_dump(),
                },
            }
        )
