from divi.services.service import Service


class DataPark(Service):
    def __init__(self, host="localhost", port=3001):
        super().__init__(host, port)
