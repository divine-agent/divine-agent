import inspect
import pathlib
from typing import Any, Callable, Dict


def extract_flattened_inputs(
    func: Callable, *args: Any, **kwargs: Any
) -> Dict[str, Any]:
    """
    Extracts a flat dictionary of parameter names and values from a function call.
    Handles default values, removes 'self' and 'cls', and flattens **kwargs.
    """
    signature = inspect.signature(func)
    bound_args = signature.bind_partial(*args, **kwargs)
    bound_args.apply_defaults()

    arguments = dict(bound_args.arguments)
    arguments.pop("self", None)
    arguments.pop("cls", None)

    for param_name, param in signature.parameters.items():
        if (
            param.kind == inspect.Parameter.VAR_KEYWORD
            and param_name in arguments
        ):
            kwarg_dict = arguments.pop(param_name)
            if isinstance(kwarg_dict, dict):
                arguments.update(kwarg_dict)

    return arguments


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
