from divi.decorators.observable import observable


def test_obs_function():
    @observable
    def hello(message: str):
        return f"Hello {message}"

    # assert hello("World") == "Hello World"
    assert hello("world", inject="test") == "Hello worldtest"


def test_obs_generator():
    @observable
    def hello_gen(n: int):
        for i in range(n):
            yield i

    assert list(hello_gen(3)) == [0, 1, 2]


def test_obs_nested():
    @observable
    def span(text: str):
        llm(text, inject="llm")
        return text

    @observable(kind="llm")
    def llm(text: str):
        return text

    @observable()
    def chain(text: str):
        span(text, inject="call 1")
        span(text, inject="call 2")

    chain("Hello", inject="root")
