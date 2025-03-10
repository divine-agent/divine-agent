from unittest.mock import MagicMock, patch

from divi.decorators import obs_openai


@patch("openai.OpenAI")
def test_obs_openai(mock_openai):
    mock_client = MagicMock()
    mock_openai.return_value = mock_client

    client = obs_openai(mock_client)

    assert client is not None


@patch("openai.OpenAI")
def test_chat_completion(mock_openai):
    # mock openai client
    mock_client = MagicMock()
    mock_openai.return_value = mock_client

    # mock chat.completions.create method
    mock_chat_completion = MagicMock()
    mock_client.chat.completions.create.return_value = mock_chat_completion

    client = obs_openai(mock_client)
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say this is a test",
            }
        ],
        model="gpt-3.5-turbo",
    )

    assert chat_completion is not None


@patch("openai.OpenAI")
def test_completion(mock_openai):
    mock_client = MagicMock()
    mock_openai.return_value = mock_client

    mock_completion = MagicMock()
    mock_client.completions.create.return_value = mock_completion

    client = obs_openai(mock_client)
    completion = client.completions.create(
        prompt="This is a test",
        model="gpt-3.5-turbo-instruct",
    )

    assert completion is not None
