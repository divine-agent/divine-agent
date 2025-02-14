import time
from weakref import ref

import jwt


class Token:
    """JWT Manager Class."""

    def __init__(self, auth) -> None:
        self.auth = ref(auth)
        self.claims: dict = {}
        self.__token: str = ""

    def __str__(self) -> str:
        return self.token

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
        auth = self.auth()
        if not auth:
            raise ValueError("Auth object is not available")
        self.__token = auth.auth_with_api_key()
        self.claims = _decode_token(self.__token)


def _decode_token(token: str) -> dict:
    """Decode the token payload."""
    return jwt.decode(token, options={"verify_signature": False})
