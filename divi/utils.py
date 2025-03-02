import inspect
import pathlib
from typing import Callable


def get_server_path() -> str:
    """Get the path to the server binary."""
    path = pathlib.Path(__file__).parent / "bin" / "core"
    if not path.exists():
        raise FileNotFoundError(f"Server binary not found: {path}")

    return str(path)


def is_async(func: Callable) -> bool:
    """Inspect function or wrapped function to see if it is async."""
    unwrapped_func = inspect.unwrap(func)
    return inspect.iscoroutinefunction(unwrapped_func)


if __name__ == "__main__":
    print(get_server_path())
