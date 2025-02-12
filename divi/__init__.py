from typing import Optional

from . import proto
from .auth import Auth
from .core import Core
from .finish import finish
from .init import init

name: str = "divi"
_core: Optional[Core] = None
_auth: Optional[Auth] = None

__version__ = "0.0.1.dev11"
__all__ = ["init", "finish", "proto"]
