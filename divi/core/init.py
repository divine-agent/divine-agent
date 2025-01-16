import grpc
import time
import socket
import atexit
import subprocess

from typing import Union

import divi

from divi.core.run import Run
from divi.utils import get_server_path


def init(
    host: Union[str, None] = None, port: Union[str, None] = None
) -> Union[Run, None]:
    divi.run = Run(host, port)
    _start_server()


def _start_server():
    """Start the backend server."""
    # get the run object
    run = divi.run
    if run is None:
        return

    # start the server
    bin_path = get_server_path()
    command = [bin_path]
    run.process = subprocess.Popen(command)

    # Wait for the port to be open
    if not _wait_for_port(run.host, run.port, 10):
        run.process.terminate()
        raise RuntimeError("Service failed to start: port not open")

    # Check if the gRPC channel is ready
    channel = grpc.insecure_channel(run.target)
    try:
        grpc.channel_ready_future(channel).result(timeout=10)
    except grpc.FutureTimeoutError:
        run.process.terminate()
        raise RuntimeError("gRPC channel not ready")
    finally:
        channel.close()

    # Health check
    status = run.check_health()
    if not status:
        run.process.terminate()
        raise RuntimeError("Service failed health check")

    run.hooks.append(run.process.terminate)
    atexit.register(run.process.terminate)


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
