class Service:
    """Service management class."""

    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port

    @property
    def target(self) -> str:
        """Return the target string: host:port."""
        return f"{self.host}:{self.port}"
