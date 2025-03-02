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
        decorator = observable()
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


if __name__ == "__main__":
    from openai import OpenAI

    client = obs_openai(
        OpenAI(
            api_key="sk-JxFTWMdorm6GvAh0AfC95e7e5c934127A810B40c423c31D4",
            base_url="https://aihubmix.com/v1",
        )
    )
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say this is a test",
            }
        ],
        model="gpt-3.5-turbo",
    )
    print(chat_completion)
    completion = client.completions.create(
        prompt="This is a test",
        model="gpt-3.5-turbo-instruct",
    )
    print(completion)
