#!/usr/bin/env python3
"""Apply and verify the local Sacred Gold Plus xdelta patch."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import zipfile


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "patches" / "manifest.json"


class PatchError(RuntimeError):
    pass


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def _source_path(source: Path, temp_dir: Path, expected_size: int) -> Path:
    if source.suffix.lower() != ".zip":
        return source
    with zipfile.ZipFile(source) as archive:
        names = [name for name in archive.namelist() if name.lower().endswith(".nds")]
        if len(names) != 1:
            raise PatchError("ZIP source must contain exactly one .nds file")
        info = archive.getinfo(names[0])
        if info.file_size != expected_size:
            raise PatchError("ZIP .nds size mismatch")
        extracted = temp_dir / "source.nds"
        with archive.open(names[0]) as src, extracted.open("wb") as dst:
            remaining = expected_size
            while remaining:
                block = src.read(min(1024 * 1024, remaining))
                if not block:
                    raise PatchError("ZIP .nds ended before expected size")
                dst.write(block)
                remaining -= len(block)
        return extracted


def apply_patch(source: Path, delta: Path, output: Path, manifest: Path, xdelta: str, force: bool = False) -> str:
    spec = json.loads(manifest.read_text(encoding="utf-8"))
    expected_source = spec["source"]["sha256"]
    expected_source_size = spec["source"]["size"]
    expected_delta = spec["delta"]["sha256"]
    expected_target = spec["target"]["sha256"]
    source = source.resolve()
    delta = delta.resolve()
    output = output.resolve()
    if source == output or delta == output:
        raise PatchError("source, delta, and output must be different paths")
    if output.exists() and not force:
        raise PatchError(f"refusing existing output: {output}")
    if not source.is_file() or not delta.is_file():
        raise PatchError("source and delta must be regular files")
    if sha256(delta) != expected_delta:
        raise PatchError("delta SHA-256 mismatch")
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="sacred-gold-patch-") as scratch:
        source_file = _source_path(source, Path(scratch), expected_source_size)
        if sha256(source_file) != expected_source:
            raise PatchError("source SHA-256 mismatch")
        fd, temporary_name = tempfile.mkstemp(prefix=f".{output.name}.", suffix=".tmp", dir=output.parent)
        os.close(fd)
        temporary_output = Path(temporary_name)
        command = [xdelta, "-f", "-d", "-s", str(source_file), str(delta), str(temporary_output)]
        try:
            subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        except FileNotFoundError as exc:
            raise PatchError(f"xdelta executable not found: {xdelta}") from exc
        except subprocess.CalledProcessError as exc:
            raise PatchError(f"xdelta failed: {exc.stderr.strip()}") from exc
        if sha256(temporary_output) != expected_target:
            raise PatchError("output SHA-256 mismatch")
        if output.exists() and not force:
            raise PatchError(f"refusing existing output: {output}")
        with temporary_output.open("rb") as handle:
            os.fsync(handle.fileno())
        try:
            if force:
                os.replace(temporary_output, output)
            else:
                os.link(temporary_output, output)
                temporary_output.unlink()
        finally:
            temporary_output.unlink(missing_ok=True)
    return expected_target


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="clean HeartGold .nds or ZIP containing one .nds")
    parser.add_argument("output", type=Path, help="new patched .nds path")
    parser.add_argument("--patch", dest="delta", type=Path, help="xdelta patch; defaults to manifest")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--xdelta", default="xdelta3", help="xdelta3 executable or PATH name")
    parser.add_argument("--force", action="store_true", help="replace an existing output")
    args = parser.parse_args()
    try:
        spec = json.loads(args.manifest.read_text(encoding="utf-8"))
        delta = args.delta or args.manifest.parent / spec["delta"]["file"]
        digest = apply_patch(args.source, delta, args.output, args.manifest, args.xdelta, args.force)
    except (OSError, PatchError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    print(f"patched: {args.output.resolve()}")
    print(f"sha256: {digest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
