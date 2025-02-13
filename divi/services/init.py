from divi.services.auth import init as init_auth
from divi.services.core import init as init_core


def init():
    init_core()
    init_auth()
