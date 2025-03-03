import functools
import inspect
from typing import Any, Callable, List, overload


@overload
def observable(func: Callable) -> Callable: ...


@overload
def observable() -> Callable: ...


def observable(*args, **kwargs) -> Callable:
    """Observable decorator factory."""

    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            # TODO: collect result
            return result

        @functools.wraps(func)
        def generator_wrapper(*args, **kwargs):
            results: List[Any] = []
            for item in func(*args, **kwargs):
                results.append(item)
                yield item
            # TODO: collect results

        if inspect.isgeneratorfunction(func):
            return generator_wrapper
        return wrapper

    # Function Decorator
    if len(args) == 1 and callable(args[0]) and not kwargs:
        return decorator(args[0])
    # Factory Decorator
    return decorator
