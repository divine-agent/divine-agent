import requests
from google.protobuf.json_format import MessageToDict
from openai.types.chat.chat_completion import ChatCompletion
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
    def headers(self):
        return {"Authorization": f"Bearer {self.token}"}

    def create_session(self, session: SessionSignal):
        r = requests.post(
            f"http://{self.target}/api/session/",
            headers=self.headers,
            json=session,
        )
        if r.status_code != 201:
            raise ValueError(r.json()["message"])

    def upsert_traces(self, session_id: UUID4, traces: list[TraceSignal]):
        r = requests.post(
            f"http://{self.target}/api/session/{session_id}/traces",
            headers=self.headers,
            json=traces,
        )
        if r.status_code != 201:
            raise ValueError(r.json()["message"])

    def create_spans(self, trace_id: UUID4, spans: ScopeSpans):
        r = requests.post(
            f"http://{self.target}/api/trace/{trace_id}/spans",
            headers=self.headers,
            json=MessageToDict(spans),
        )
        if r.status_code != 201:
            raise ValueError(r.json()["message"])

    def create_chat_completion(
        self, span_id: bytes, completion: ChatCompletion
    ):
        r = requests.post(
            f"http://{self.target}/api/v1/chat/completions",
            headers=self.headers,
            json={
                "span_id": span_id.hex(),
                "data": completion.model_dump(),
            },
        )
        if r.status_code != 201:
            raise ValueError(r.json()["message"])
