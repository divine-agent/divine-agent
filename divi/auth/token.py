import time
from typing import Union

import jwt


class Token:
    """JWT Manager Class."""

    def __init__(self, api_key: str) -> None:
        self.api_key: Union[str, None] = api_key
        self.claims: dict = {}
        self.__token: str = ""

    def __str__(self) -> str:
        return self.__token

    @property
    def exp(self) -> int:
        """Return the expiration time."""
        return self.claims.get("exp", 0)

    @property
    def token(self) -> str:
        """Return the token string."""
        # If the token is expired, get a new one
        if not self.__token or self.exp - time.time() < 3600:
            self._init_token()
        return self.__token

    def _init_token(self):
        """Initialize the token."""
        if not self.api_key:
            raise ValueError("API key is required")
        self.__token = _get_token(self.api_key)
        claims = _decode_token(self.__token)
        self.claims = claims


def _get_token(api_key: str) -> str:
    """Get token with the API key."""
    # Simulate the token generation process
    return "token"


def _decode_token(token: str) -> dict:
    """Decode the token payload."""
    return jwt.decode(token, options={"verify_signature": False})
