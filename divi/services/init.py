import divi
from divi.services.auth import init as init_auth
from divi.services.core import init as init_core
from divi.services.datapark import init as init_datapark


def init():
    if not divi._auth:
        divi._auth = init_auth(
            api_key="divi-5df267e4-a5c7-4dc9-8dbe-2b73d8687645"
        )
    if not divi._core:
        divi._core = init_core(port=3002)
    if not divi._datapark:
        divi._datapark = init_datapark()
