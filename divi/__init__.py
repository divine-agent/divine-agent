from typing import Optional

from .decorators import obs_openai, observable
from .evaluation import Evaluator
from .services import Auth, Core, DataPark
from .session import Session

name: str = "divi"

_session: Optional[Session] = None
_core: Optional[Core] = None
_auth: Optional[Auth] = None
_datapark: Optional[DataPark] = None
_evaluator: Optional[Evaluator] = None

__version__ = "0.0.1b2"
__all__ = ["obs_openai", "observable"]
