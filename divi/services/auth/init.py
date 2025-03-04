import os
from typing import Optional

from divi.services.auth import Auth

DIVI_API_KEY = "DIVI_API_KEY"


def init(api_key: Optional[str] = None) -> Auth:
    key = api_key if api_key else os.getenv(DIVI_API_KEY)
    if not key:
        raise ValueError("API key is required")
    return Auth(api_key=key)


if __name__ == "__main__":
    auth = init()
    if not auth:
        raise ValueError("Auth object is not available")
    print("=== Auth ===")
    print(auth.token)
