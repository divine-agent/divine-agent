from pydantic import BaseModel
from uuid import UUID
from divi.proto.run.v1.run_pb2 import Run

class RunBase(BaseModel):
    id: UUID
    name: str
