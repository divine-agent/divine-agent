import os
from typing import Optional

import divi
from divi.services.auth import Auth

DIVI_API_KEY = "DIVI_API_KEY"


def init(api_key: Optional[str] = None) -> Optional[Auth]:
    key = api_key if api_key else os.getenv(DIVI_API_KEY)
    if not key:
        raise ValueError("API key is required")
    divi._auth = Auth(api_key=key)
    # TODO: Test the token
    return divi._auth


if __name__ == "__main__":
    auth = init()
    if not auth:
        raise ValueError("Auth object is not available")
    print("=== Auth ===")
    print(auth.token)
