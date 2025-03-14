from datetime import datetime
from unittest.mock import MagicMock, patch

from openai.types.chat import ChatCompletionMessage
from openai.types.chat.chat_completion import ChatCompletion, Choice

from divi.decorators import obs_openai


@patch("openai.OpenAI")
def test_obs_openai(mock_openai):
    mock_client = MagicMock()
    mock_openai.return_value = mock_client

    client = obs_openai(mock_client)

    assert client is not None


def create_chat_completion(response: str) -> ChatCompletion:
    return ChatCompletion(
        id="foo",
        model="gpt-3.5-turbo",
        object="chat.completion",
        choices=[
            Choice(
                finish_reason="stop",
                index=0,
                message=ChatCompletionMessage(
                    content=response,
                    role="assistant",
                ),
            )
        ],
        created=int(datetime.now().timestamp()),
    )


@patch("openai.resources.chat.Completions.create")
def test_chat_completion(openai_create):
    from openai import OpenAI

    EXPECTED_RESPONSE = "The mock is working! ;)"
    openai_create.__name__ = "createChatCompletion"
    openai_create.return_value = create_chat_completion(EXPECTED_RESPONSE)
    client = obs_openai(OpenAI(api_key="sk-..."))
    r = client.chat.completions.create(
        messages=[{"role": "user", "content": "Do you know any jokes?"}],
        model="gpt-3.5-turbo",
    )
    response = r.choices[0].message.content
    assert response == EXPECTED_RESPONSE
