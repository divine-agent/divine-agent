import os
from typing import Optional

from divi.services.auth import Auth

DIVI_API_KEY = "DIVI_API_KEY"
DIVI_AUTH_HOST = "DIVI_AUTH_HOST"
DIVI_AUTH_PORT = "DIVI_AUTH_PORT"


def init_auth(
    host: Optional[str] = None,
    port: Optional[int] = None,
    api_key: Optional[str] = None,
) -> Auth:
    host = host if host else os.getenv(DIVI_AUTH_HOST, "auth.divine-agent.com")
    port = port if port else int(os.getenv(DIVI_AUTH_PORT, 80))
    key = api_key if api_key else os.getenv(DIVI_API_KEY)
    if not key:
        raise ValueError("DIVI_API_KEY is required")

    return Auth(api_key=key, host=host, port=port)
