import functools
from typing import (
    Any,
    Callable,
    Generic,
    Mapping,
    Optional,
    ParamSpec,
    Protocol,
    TypeVar,
    Union,
    overload,
    runtime_checkable,
)

from divi.decorators.observe import observe
from divi.evaluation.evaluate import evaluate_scores
from divi.evaluation.scores import Score
from divi.session import SessionExtra
from divi.signals.span import Kind, Span

R = TypeVar("R", covariant=True)
P = ParamSpec("P")


@runtime_checkable
class WithSessionExtra(Protocol, Generic[P, R]):
    def __call__(
        self,
        *args: P.args,
        session_extra: Optional[SessionExtra] = None,  # type: ignore[valid-type]
        **kwargs: P.kwargs,
    ) -> R: ...


@overload
def observable(func: Callable[P, R]) -> WithSessionExtra[P, R]: ...


@overload
def observable(
    kind: Kind = Kind.function,
    *,
    name: Optional[str] = None,
    scores: Optional[list[Score]] = None,
    metadata: Optional[Mapping[str, Any]] = None,
) -> Callable[[Callable[P, R]], WithSessionExtra[P, R]]: ...


def observable(
    *args, **kwargs
) -> Union[Callable, Callable[[Callable], Callable]]:
    """Observable decorator factory."""

    kind = kwargs.pop("kind", Kind.function)
    name = kwargs.pop("name", None)
    metadata = kwargs.pop("metadata", None)
    scores: list[Score] = kwargs.pop("scores", None)

    def decorator(func):
        @functools.wraps(func)
        def wrapper(
            *args, session_extra: Optional[SessionExtra] = None, **kwargs
        ):
            # 1. init the span
            span = Span(
                kind=kind, name=name or func.__name__, metadata=metadata
            )

            # 2. observe the function
            result = observe(
                *args,
                func=func,
                span=span,
                session_extra=session_extra,
                **kwargs,
            )

            # 3. evaluate the scores if they are provided
            messages = kwargs.get("messages", [])
            evaluate_scores(messages, outputs=result, scores=scores)

            return result

        return wrapper

    # Function Decorator
    if len(args) == 1 and callable(args[0]) and not kwargs:
        return decorator(args[0])
    # Factory Decorator
    return decorator
