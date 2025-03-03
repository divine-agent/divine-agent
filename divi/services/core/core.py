from subprocess import Popen
from typing import Callable, List, Optional

import grpc

import divi
from divi.proto.core.health.v1.health_service_pb2 import HealthCheckRequest
from divi.proto.core.health.v1.health_service_pb2_grpc import HealthServiceStub
from divi.services.service import Service


class Core(Service):
    """Core Runtime Class."""

    def __init__(self, host="localhost", port=50051) -> None:
        super().__init__(host, port)
        self.process: Optional[Popen] = None
        self.hooks: List[Callable[[], None]] = []

    def check_health(self) -> bool:
        """Check the health of the service."""
        with grpc.insecure_channel(self.target) as channel:
            stub = HealthServiceStub(channel)
            response, call = stub.Check.with_call(
                HealthCheckRequest(version=divi.__version__),
                # Note: ((),) notice the `,` at the end of the tuple
                metadata=(("version", divi.__version__),),
            )
        print(f"Health check: {response.message}")
        for key, value in call.trailing_metadata():
            print(
                "python client received trailing metadata: key=%s value=%s"
                % (key, value)
            )
        return response.status
