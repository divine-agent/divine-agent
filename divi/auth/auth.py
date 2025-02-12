from divi.auth import Token


class Auth:
    def __init__(self, api_key: str):
        self.token = Token(api_key)
