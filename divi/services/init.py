import divi
from divi.services.auth import init as init_auth
from divi.services.core import init as init_core
from divi.services.datapark import init as init_datapark


def init():
    if not divi._auth:
        divi._auth = init_auth(
            api_key="divi-54356151-b576-4b9b-a326-0dd5111e5cf3"
        )
    if not divi._core:
        divi._core = init_core(port=3002)
    if not divi._datapark:
        divi._datapark = init_datapark()
