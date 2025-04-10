from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, Mapping, Sequence

import requests


class Service:
    """Service management class."""

    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port

    @property
    def target(self) -> str:
        """Return the target string: host:port."""
        return f"{self.host}:{self.port}"

    @property
    def headers(self) -> Dict[str, str]:
        """Override to provide default headers."""
        return {}

    def post(
        self,
        path: str,
        payload: Mapping[str, Any] | Sequence[Mapping[str, Any]],
    ) -> Any:
        response = requests.post(
            f"http://{self.target}{path}",
            json=payload,
            headers=self.headers,
        )
        if not 200 <= response.status_code < 300:
            raise ValueError(
                f"{path} failed: {response.json().get('message', 'Unknown error')}"
            )
        return response.json().get("data", response.json())

    def post_concurrent(
        self,
        calls: Dict[str, Mapping[str, Any] | Sequence[Mapping[str, Any]]],
    ) -> None:
        with ThreadPoolExecutor(max_workers=len(calls)) as executor:
            futures = [
                executor.submit(
                    self.post,
                    path,
                    payload,
                )
                for path, payload in calls.items()
            ]
            for future in futures:
                future.result()
