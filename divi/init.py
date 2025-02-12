from divi.auth import init as init_auth
from divi.core import init as init_core


async def init():
    init_core()
    await init_auth()
