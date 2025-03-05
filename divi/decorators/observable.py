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

from divi.run import RunExtra
from divi.run.setup import setup
from divi.signals.trace import Span

R = TypeVar("R", covariant=True)
P = ParamSpec("P")

# ContextVar to store the extra information
# from the Run and parent Span
_RUNEXTRA = contextvars.ContextVar[Optional[RunExtra]](
    "_RUNEXTRA", default=None
)


@runtime_checkable
class WithRunExtra(Protocol, Generic[P, R]):
    def __call__(
        self,
        *args: P.args,
        run_extra: Optional[RunExtra] = None,  # type: ignore[valid-type]
        **kwargs: P.kwargs,
    ) -> R: ...


@overload
def observable(func: Callable[P, R]) -> WithRunExtra[P, R]: ...


@overload
def observable(
    kind: str = "function",
    *,
    name: Optional[str] = None,
    metadata: Optional[Mapping[str, Any]] = None,
) -> Callable[[Callable[P, R]], WithRunExtra[P, R]]: ...


def observable(
    *args, **kwargs
) -> Union[Callable, Callable[[Callable], Callable]]:
    """Observable decorator factory."""

    kind = kwargs.pop("kind", "function")
    span = Span(kind, name=kwargs.get("name"), metadata=kwargs.get("metadata"))

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, run_extra: Optional[RunExtra] = None, **kwargs):
            tmp = setup(span, run_extra, _RUNEXTRA)
            token = _RUNEXTRA.set(tmp)
            # execute the function
            span.start()
            result = func(*args, **kwargs)
            span.end()
            _RUNEXTRA.reset(token)
            # TODO: collect result
            return result

        @functools.wraps(func)
        def generator_wrapper(
            *args, run_extra: Optional[RunExtra] = None, **kwargs
        ):
            # set current context
            token = _RUNEXTRA.set(run_extra)
            # execute the function
            results: List[Any] = []
            for item in func(*args, **kwargs):
                results.append(item)
                yield item
            # recover parent context
            _RUNEXTRA.reset(token)
            # TODO: collect results

        if inspect.isgeneratorfunction(func):
            return generator_wrapper
        return wrapper

    # Function Decorator
    if len(args) == 1 and callable(args[0]) and not kwargs:
        return decorator(args[0])
    # Factory Decorator
    return decorator
