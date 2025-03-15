from divi.decorators import observable


def test_obs_function():
    @observable()
    def hello(message: str):
        return f"Hello {message}"

    assert hello("World") == "Hello World"


def test_obs_generator():
    @observable
    def hello_gen(n: int):
        for i in range(n):
            yield i

    assert list(hello_gen(3)) == [0, 1, 2]


def test_obs_nested():
    @observable
    def span(text: str):
        return llm(text)

    @observable
    def llm(text: str):
        return f"Hello {text}"

    @observable()
    def trace(text: str):
        completion1 = span(text)
        completion2 = span(text)
        return f"{completion1} {completion2}"

    message = trace("Hello", session_extra={"session_name": "test"})
    assert message == "Hello Hello Hello Hello"
