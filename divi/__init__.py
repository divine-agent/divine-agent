from typing import Optional

from . import proto
from .services import Auth, Core, DataPark

name: str = "divi"


name: str = "divi"
_core: Optional[Core] = None
_auth: Optional[Auth] = None
_datapark: Optional[DataPark] = None

__version__ = "0.0.1.dev11"
__all__ = ["proto"]
