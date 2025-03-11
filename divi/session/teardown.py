import divi
from divi.services import finish as clean_up_services


def teardown():
    clean_up_services()
    divi._session = None
