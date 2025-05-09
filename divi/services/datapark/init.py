import os

from typing_extensions import Optional

from divi.services.datapark import DataPark

DIVI_DATAPARK_HOST = "DIVI_DATAPARK_HOST"
DIVI_DATAPARK_PORT = "DIVI_DATAPARK_PORT"


def init_datapark(
    host: Optional[str] = None, port: Optional[int] = None
) -> DataPark:
    host = (
        host
        if host
        else os.getenv(DIVI_DATAPARK_HOST, "datapark.divine-agent.com")
    )
    port = port if port else int(os.getenv(DIVI_DATAPARK_PORT, 80))

    return DataPark(host=host, port=port)
