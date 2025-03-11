import functools
from collections.abc import Callable
from typing import TYPE_CHECKING, TypeVar, Union

from divi.decorators.observable import observable
from divi.utils import is_async

if TYPE_CHECKING:
    from openai import AsyncOpenAI, OpenAI

C = TypeVar("C", bound=Union["OpenAI", "AsyncOpenAI"])


def _get_observable_create(create: Callable) -> Callable:
    @functools.wraps(create)
    def observable_create(*args, stream: bool = False, **kwargs):
        decorator = observable(kind="llm")
        return decorator(create)(*args, stream=stream, **kwargs)

    # TODO Async Observable Create
    print("Is async", is_async(create))
    return observable_create if not is_async(create) else create


def obs_openai(client: C) -> C:
    """Make OpenAI client observable."""
    client.chat.completions.create = _get_observable_create(
        client.chat.completions.create
    )
    client.completions.create = _get_observable_create(
        client.completions.create
    )
    return client
