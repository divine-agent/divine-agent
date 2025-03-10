from typing import Optional

from . import proto
from .decorators import obs_openai, observable
from .run import Run
from .services import Auth, Core, DataPark

name: str = "divi"

_run: Optional[Run] = None
_core: Optional[Core] = None
_auth: Optional[Auth] = None
_datapark: Optional[DataPark] = None

__version__ = "0.0.1.dev13"
__all__ = ["proto", "obs_openai", "observable"]
