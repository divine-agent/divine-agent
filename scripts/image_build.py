#!/usr/bin/env python3
"""
build_images.py: A script to build multiple Docker images for specified services and platforms.
"""

import subprocess
import sys

# List of services with their Dockerfile paths and image tags
images = [
    {
        "dockerfile": "apps/graphql/Dockerfile",
        "tag": "kaikaikaifang/divi-graphql:latest",
        "context": ".",
    },
    {
        "dockerfile": "services/cmd/datapark/Dockerfile",
        "tag": "kaikaikaifang/divi-datapark:latest",
        "context": "services",
    },
    {
        "dockerfile": "services/cmd/auth/Dockerfile",
        "tag": "kaikaikaifang/divi-auth:latest",
        "context": "services",
    },
]

# Supported platforms
platforms = "linux/amd64,linux/arm64"


def build_image(dockerfile, tag, context, platforms):
    """
    Build a Docker image using the specified Dockerfile, tag, and platforms.

    :param dockerfile: Path to the Dockerfile
    :param tag: Image tag to assign
    :param context: Build context directory
    :param platforms: Comma-separated list of target platforms
    """
    cmd = [
        "docker",
        "build",
        "-f",
        dockerfile,
        "-t",
        tag,
        "--platform",
        platforms,
        context,
    ]

    try:
        subprocess.run(cmd, check=True)
        print(f"Successfully built {tag}")
    except subprocess.CalledProcessError as e:
        print(f"Error building {tag}: {e}", file=sys.stderr)
        sys.exit(e.returncode)


def main():
    for img in images:
        print(f"Building image {img['tag']} from {img['dockerfile']}...")
        build_image(img["dockerfile"], img["tag"], img["context"], platforms)


if __name__ == "__main__":
    main()
