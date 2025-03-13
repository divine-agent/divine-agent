import requests
from google.protobuf.json_format import MessageToDict
from pydantic import UUID4

import divi
from divi.proto.trace.v1.trace_pb2 import ScopeSpans
from divi.services.service import Service


class DataPark(Service):
    def __init__(self, host="localhost", port=3001):
        super().__init__(host, port)
        if not divi._auth:
            raise ValueError("No auth service")
        self.token = divi._auth.token

    @property
    def headers(self):
        return {"Authorization": f"Bearer {self.token}"}

    def create_spans(self, trace_id: UUID4, spans: ScopeSpans):
        r = requests.post(
            f"http://{self.target}/api/trace/{trace_id}/spans",
            json=MessageToDict(spans),
            headers=self.headers,
        )
        print(spans.spans[0].kind)
        print(MessageToDict(spans))
        if r.status_code == 200:
            return r.json()["data"]
        raise ValueError(r.json()["message"])
