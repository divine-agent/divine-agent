from typing import Optional

import divi
from divi.services.datapark import DataPark


def init() -> Optional[DataPark]:
    divi._datapark = DataPark()
    return divi._datapark
