import atexit
import socket
import subprocess
import time

import grpc

from divi.services.core import Core
from divi.utils import get_server_path


def init(host="localhost", port=50051) -> Core:
    core = Core(host=host, port=port)
    _start_server(core)
    return core


def _start_server(core: Core):
    """Start the backend server."""
    # start the server
    bin_path = get_server_path()
    command = [bin_path, "-port", str(core.port)]
    core.process = subprocess.Popen(command)

    # Wait for the port to be open
    if not _wait_for_port(core.host, core.port, 10):
        core.process.terminate()
        raise RuntimeError("Service failed to start: port not open")

    # Check if the gRPC channel is ready
    channel = grpc.insecure_channel(core.target)
    try:
        grpc.channel_ready_future(channel).result(timeout=10)
    except grpc.FutureTimeoutError:
        core.process.terminate()
        raise RuntimeError("gRPC channel not ready")
    finally:
        channel.close()

    core.hooks.append(core.process.terminate)
    atexit.register(core.process.terminate)

    # Health check
    status = core.check_health()
    if not status:
        raise RuntimeError("Service failed health check")


def _wait_for_port(host, port, timeout_seconds):
    """Wait until the specified port is open."""
    start_time = time.time()
    while time.time() - start_time < timeout_seconds:
        if _is_port_open(host, port):
            return True
        time.sleep(0.1)
    return False


def _is_port_open(host, port):
    """Check if the given host and port are open."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            result = sock.connect_ex((host, port))
            if result == 0:
                return True
            else:
                return False
    except Exception as e:
        print(f"Error checking port: {e}")
        return False


if __name__ == "__main__":
    init()
