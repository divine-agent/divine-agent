import requests

from divi.services.auth.tokman import Token
from divi.services.service import Service


class Auth(Service):
    def __init__(self, api_key: str, host="localhost", port=3000):
        super().__init__(host, port)
        self.api_key = api_key
        self.token = Token(self)

    def auth_with_api_key(self) -> str:
        """Get the token with the API key."""
        r = requests.post(
            f"http://{self.target}/api/auth/api_key",
            json={"api_key": self.api_key},
        )
        if r.status_code == 200:
            return r.json()["data"]
        raise ValueError(r.json()["message"])
