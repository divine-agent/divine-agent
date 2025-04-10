from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
from dotenv import load_dotenv
from openai.types.chat import ChatCompletionMessage
from openai.types.chat.chat_completion import ChatCompletion, Choice

from divi.decorators import obs_openai, observable


@pytest.fixture(autouse=True, scope="session")
def load_test_env():
    load_dotenv()


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


@patch("openai.resources.chat.Completions.create")
def test_nested_chat_completion(openai_create):
    from openai import OpenAI

    EXPECTED_RESPONSE = "The mock is working! ;)"
    openai_create.__name__ = "createChatCompletion"
    openai_create.return_value = create_chat_completion(EXPECTED_RESPONSE)

    openai_client = obs_openai(OpenAI(api_key="sk-..."))

    class QaAgent:
        def completion(self, prompt: str):
            res = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a qa engineer and only output python code, no markdown tags.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.5,
            )
            return res.choices[0].message.content

    class EngineerAgent:
        def completion(self, prompt: str):
            res = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a software engineer and only output python code, no markdown tags.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.5,
            )
            return res.choices[0].message.content

    class AnalystAgent:
        def completion(self, prompt: str):
            res = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a data analyst and only output true or false based on test cases' outputs.",
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=0.5,
            )
            return res.choices[0].message.content

    qa = QaAgent()
    engineer = EngineerAgent()
    analyst = AnalystAgent()

    @observable
    def execute_code(code: str, test_code: str):
        return "success"

    @observable
    def analyze_code(code: str, test_code: str):
        output = execute_code(code, test_code)
        assert output == "success"
        generated_analyst = analyst.completion(
            "Analyze the following code and test cases with outputs: \n"
            + code
            + "\n"
            + test_code
            + "\n"
            + output
        )
        return generated_analyst

    @observable
    def code(demand: str):
        generated_func = engineer.completion(demand)
        assert generated_func == EXPECTED_RESPONSE
        generated_test = qa.completion(
            "Write a python unit test that test the following function: \n "
            + generated_func
        )
        assert generated_test == EXPECTED_RESPONSE
        generated_analyst = analyze_code(generated_func, generated_test)
        assert generated_analyst == EXPECTED_RESPONSE
        return generated_func

    func = code("python function to test prime number")
    assert func == EXPECTED_RESPONSE
