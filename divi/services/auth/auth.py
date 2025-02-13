from divi.services.auth import Token
from divi.services.service import Service


class Auth(Service):
    def __init__(self, api_key: str, host="localhost", port=3000):
        super().__init__(host, port)
        self.token = Token(api_key)
