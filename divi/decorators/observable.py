import contextvars
import functools
import inspect
from typing import (
    Any,
    Callable,
    Generic,
    List,
    Mapping,
    Optional,
    ParamSpec,
    Protocol,
    TypeVar,
    Union,
    overload,
    runtime_checkable,
)

R = TypeVar("R", covariant=True)
P = ParamSpec("P")

_INJECT = contextvars.ContextVar[Optional[str]]("_INJECT", default=None)


@runtime_checkable
class SupportsInject(Protocol, Generic[P, R]):
    def __call__(
        self,
        *args: P.args,
        inject: Optional[str] = None,
        **kwargs: P.kwargs,
    ) -> R: ...


@overload
def observable(func: Callable[P, R]) -> SupportsInject[P, R]: ...


@overload
def observable(
    kind: str = "function",
    *,
    name: Optional[str] = None,
    metadata: Optional[Mapping[str, Any]] = None,
) -> Callable[[Callable[P, R]], SupportsInject[P, R]]: ...


def observable(
    *args, **kwargs
) -> Union[Callable, Callable[[Callable], Callable]]:
    """Observable decorator factory."""

    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, inject: Optional[str] = "", **kwargs):
            print(inject, "Parent", _INJECT.get())
            token = _INJECT.set(inject)

            result = func(*args, **kwargs)

            _INJECT.reset(token)
            # TODO: collect result
            return result + inject

        @functools.wraps(func)
        def generator_wrapper(*args, inject: Optional[str] = None, **kwargs):
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
