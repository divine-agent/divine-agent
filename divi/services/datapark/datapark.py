from typing import Any, Dict

from google.protobuf.json_format import MessageToDict
from openai.types.chat import ChatCompletion
from pydantic import UUID4

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
        inputs: Dict[str, Any],
        completion: ChatCompletion,
    ) -> None:
        hex_span_id = span_id.hex()
        self.post_concurrent(
            {
                "/api/v1/chat/completions/input": {
                    "span_id": hex_span_id,
                    "data": inputs,
                },
                "/api/v1/chat/completions": {
                    "span_id": hex_span_id,
                    "data": completion.model_dump(),
                },
            }
        )
