#!/usr/bin/env python3
"""Preview or install non-overwriting XDG launchers for the Qt patcher."""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
GUI = ROOT / "tools" / "patcher_gui.py"
ICON = ROOT / "assets" / "icon.svg"
DESKTOP_ID = "sacred-gold-qol-patcher.desktop"


def desktop_dir() -> Path:
    try:
        result = subprocess.run(["xdg-user-dir", "DESKTOP"], check=False, capture_output=True, text=True)
    except FileNotFoundError:
        return Path.home() / "Desktop"
    return Path(result.stdout.strip()) if result.returncode == 0 and result.stdout.strip() else Path.home() / "Desktop"


def desktop_quote(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"').replace("%", "%%")
    return f'"{escaped}"' if any(char.isspace() or char in '"\\%' for char in value) else escaped


def content(xdelta: str = "", library_path: str = "") -> str:
    python = shutil.which("python3") or "python3"
    command = [python, str(GUI)]
    if xdelta:
        command += ["--xdelta", xdelta]
    if library_path:
        command = ["/usr/bin/env", f"LD_LIBRARY_PATH={library_path}", *command]
    exec_line = " ".join(desktop_quote(part) for part in command)
    return ("[Desktop Entry]\nType=Application\nVersion=1.0\n"
            "Name=Ultimate Gold Patcher\nName[es]=Patcher de Ultimate Gold\n"
            "Comment=Apply the local verified xdelta patch\n"
            "Comment[es]=Aplicar el patch xdelta local verificado\n"
            f"Exec={exec_line}\nIcon={ICON}\nTerminal=false\nCategories=Game;\n")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--install", action="store_true", help="write missing launchers")
    parser.add_argument("--xdelta", default="")
    parser.add_argument("--library-path", default="")
    args = parser.parse_args()
    data_home = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share"))
    app_path = data_home / "applications" / DESKTOP_ID
    user_desktop = desktop_dir() / DESKTOP_ID
    targets = (app_path, user_desktop)
    if not args.install:
        print("Preview (use --install to write missing files):")
        print("\n".join(map(str, targets))); print(content(args.xdelta, args.library_path)); return 0
    for target in targets:
        if target.exists(): print(f"preserved existing: {target}"); continue
        target.parent.mkdir(parents=True, exist_ok=True); target.write_text(content(args.xdelta, args.library_path), encoding="utf-8"); target.chmod(0o755)
        print(f"installed: {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
