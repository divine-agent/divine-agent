from typing import Optional

from . import proto
from .decorators import obs_openai, observable
from .services import Auth, Core, DataPark
from .session import Session

name: str = "divi"

_session: Optional[Session] = None
_core: Optional[Core] = None
_auth: Optional[Auth] = None
_datapark: Optional[DataPark] = None

__version__ = "0.0.1.dev23"
__all__ = ["proto", "obs_openai", "observable"]
