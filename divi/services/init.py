import divi
from divi.services.auth import init_auth
from divi.services.datapark import init_datapark


def init_services():
    if not divi._auth:
        divi._auth = init_auth()
    if not divi._datapark:
        divi._datapark = init_datapark()
