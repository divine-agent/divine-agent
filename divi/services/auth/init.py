import os
from typing import Union

import divi
from divi.services.auth import Auth

DIVI_API_KEY = "DIVI_API_KEY"


def init(api_key: Union[str, None] = None) -> Union[Auth, None]:
    key = api_key if api_key else os.getenv(DIVI_API_KEY)
    if not key:
        raise ValueError("API key is required")
    divi._auth = Auth(api_key=key)
    # TODO: Test the token
    return divi._auth
