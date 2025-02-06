import re
import shutil
import pathlib
import sysconfig
import subprocess

from hatchling.builders.hooks.plugin.interface import BuildHookInterface


class CustomBuildHook(BuildHookInterface):
    def initialize(self, version, build_data):
        target_path = pathlib.Path("services", "cmd", "core", "core.go")
        output_path = pathlib.Path("divi", "bin", "core")
        self._go_build(target_path, output_path)
        build_data["tag"] = f"py3-none-{self._get_platform_tag()}"
        build_data["pure_python"] = False

    def _get_platform_tag(self) -> str:
        """Returns the platform tag for the current platform."""
        # Replace dots, spaces and dashes with underscores following
        # https://packaging.python.org/en/latest/specifications/platform-compatibility-tags/#platform-tag
        platform_tag = re.sub("[-. ]", "_", sysconfig.get_platform())

        # On macOS versions >=11, pip expects the minor version to be 0:
        #   https://github.com/pypa/packaging/issues/435
        #
        # You can see the list of tags that pip would support on your machine
        # using `pip debug --verbose`. On my macOS, get_platform() returns
        # 14.1, but `pip debug --verbose` reports only these py3 tags with 14:
        #
        # * py3-none-macosx_14_0_arm64
        # * py3-none-macosx_14_0_universal2
        #
        # We do this remapping here because otherwise, it's possible for `pip wheel`
        # to successfully produce a wheel that you then cannot `pip install` on the
        # same machine.
        macos_match = re.fullmatch(r"macosx_(\d+_\d+)_(\w+)", platform_tag)
        if macos_match:
            major, _ = macos_match.group(1).split("_")
            if int(major) >= 11:
                arch = macos_match.group(2)
                platform_tag = f"macosx_{major}_0_{arch}"

        return self._to_compatibility_tag(platform_tag)

    def _to_compatibility_tag(self, platform_tag: str) -> str:
        """Converts a platform tag to a compatibility tag."""
        # os: linux -> manylinux1
        parts = platform_tag.split("_")
        os = parts[0]
        if os == "linux":
            parts[0] = "manylinux1"
        return "_".join(parts)

    def _go_build(
        self,
        target_path: pathlib.PurePath,
        output_path: pathlib.PurePath,
    ):
        """go build -o output_path target_path"""
        output_flags = ["-o", str(output_path)]
        subprocess.check_call(
            [
                str(self._get_and_require_go_binary()),
                "build",
                *output_flags,
                str(target_path),
            ],
        )

    def _get_and_require_go_binary(self) -> pathlib.Path:
        go = shutil.which("go")

        if not go:
            self.app.abort(
                "Did not find the 'go' binary. You need Go to build wandb"
                " from source. See https://go.dev/doc/install.",
            )
            raise AssertionError("unreachable")

        return pathlib.Path(go)
