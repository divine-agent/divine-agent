from typing import Optional
from .core import Run, init, finish
from . import proto

name: str = "divi"
run: Optional[Run] = None

__version__ = "0.0.1.dev8"
__all__ = ["init", "finish", "proto"]
