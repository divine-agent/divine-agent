import divi
from divi.services.auth import init as init_auth
from divi.services.core import init as init_core
from divi.services.datapark import init as init_datapark


def init():
    if not divi._auth:
        divi._auth = init_auth(
            api_key="divi-3ff01c47-05ef-4fe9-ad7b-75cf76685b1e"
        )
    if not divi._core:
        divi._core = init_core(port=3002)
    if not divi._datapark:
        divi._datapark = init_datapark()
