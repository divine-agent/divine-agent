#!/usr/bin/env python
"""Compile proto files to python and go files."""

import importlib.metadata
import os
import pathlib

import grpc_tools  # type: ignore
from grpc_tools import protoc  # type: ignore
from packaging import version


proto_root = os.path.join(os.path.dirname(grpc_tools.__file__), "_proto")

# messages
for proto_file in [
    "health.proto",
]:
    ret = protoc.main(
        (
            "",
            "-I",
            proto_root,
            "-I",
            ".",
            f"--python_out=.",
            f"--pyi_out=.",
            f"--go_out=.",
            f"divi/proto/{proto_file}",
        )
    )
    assert not ret

# grpc service
for proto_file in [
    "core.proto",
]:
    ret = protoc.main(
        (
            "",
            "-I",
            proto_root,
            "-I",
            ".",
            f"--python_out=.",
            f"--pyi_out=.",
            f"--grpc_python_out=.",
            f"--go_out=.",
            f"--go-grpc_out=.",
            f"divi/proto/{proto_file}",
        )
    )
    assert not ret
