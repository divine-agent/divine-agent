import divi
from divi.services.core import finish as clean_up_core


def finish():
    clean_up_core()
    divi._auth = None
    divi._core = None
    divi._datapark = None
