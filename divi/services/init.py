import divi
from divi.services.auth import init as init_auth
from divi.services.core import init as init_core
from divi.services.datapark import init as init_datapark


def init():
    if not divi._auth:
        divi._auth = init_auth(
            api_key="divi-a8773279-f5e8-4126-8626-0e00d4cf4990"
        )
    if not divi._core:
        divi._core = init_core(port=3002)
    if not divi._datapark:
        divi._datapark = init_datapark()
