#!/usr/bin/env python3
"""
build_images.py: A script to build multiple Docker images for specified services and platforms.

Usage:
    # Build all images
    python build_images.py

    # Build only specific images by name or tag substrings
    python build_images.py graphql auth
"""

import argparse
import subprocess
import sys

# List of services with their identifiers, Dockerfile paths, image tags and contexts
images = [
    {
        "name": "graphql",
        "dockerfile": "apps/graphql/Dockerfile",
        "tag": "kaikaikaifang/divi-graphql:latest",
        "context": ".",
    },
    {
        "name": "datapark",
        "dockerfile": "services/cmd/datapark/Dockerfile",
        "tag": "kaikaikaifang/divi-datapark:latest",
        "context": "services",
    },
    {
        "name": "auth",
        "dockerfile": "services/cmd/auth/Dockerfile",
        "tag": "kaikaikaifang/divi-auth:latest",
        "context": "services",
    },
]

# Supported platforms
platforms = "linux/amd64,linux/arm64"


def parse_args():
    parser = argparse.ArgumentParser(
        description="Build Docker images for specified services."
    )
    parser.add_argument(
        "names",
        nargs="*",
        help=(
            "Filter images to build by service name or tag substring. "
            "If omitted, all images will be built."
        ),
    )
    return parser.parse_args()


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
    args = parse_args()

    # Select images to build
    if args.names:
        to_build = [
            img
            for img in images
            if any(name in img["name"] for name in args.names)
        ]
        if not to_build:
            print(
                f"No matching images found for: {', '.join(args.names)}",
                file=sys.stderr,
            )
            sys.exit(1)
    else:
        to_build = images

    for img in to_build:
        print(f"Building image {img['tag']} from {img['dockerfile']}...")
        build_image(img["dockerfile"], img["tag"], img["context"], platforms)


if __name__ == "__main__":
    main()
