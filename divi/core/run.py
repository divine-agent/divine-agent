import grpc

from subprocess import Popen
from typing import List, Optional, Callable

import divi

from divi.proto.core.v1.core_pb2_grpc import CoreStub
from divi.proto.core.v1.health_check_request_pb2 import HealthCheckRequest
from divi.proto.core.v1.health_check_response_pb2 import HealthCheckResponse


class Run:
    """Core Runtime"""

    def __init__(self, host, port) -> None:
        self.host: str = host if host else "localhost"
        self.port: int = port if port else 50051
        self.process: Optional[Popen] = None
        self.hooks: List[Callable[[], None]] = []

    @property
    def target(self) -> str:
        """Return the target string."""
        return f"{self.host}:{self.port}"

    def check_health(self) -> bool:
        """Check the health of the service."""
        with grpc.insecure_channel(self.target) as channel:
            stub = CoreStub(channel)
            response: HealthCheckResponse = stub.Check(
                HealthCheckRequest(version=divi.__version__)
            )
        print(f"Health check: {response.message}")
        return response.status
