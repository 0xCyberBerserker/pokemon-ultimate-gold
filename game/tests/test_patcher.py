import hashlib
import json
import os
from pathlib import Path
import tempfile
import unittest
import zipfile

from tools.patcher import PatchError, apply_patch


ROOT = Path(__file__).resolve().parents[1]
CLEAN = Path(os.environ.get("SACRED_GOLD_CLEAN_ROM", ""))
MANIFEST = ROOT / "patches" / "manifest.json"
SPEC = json.loads(MANIFEST.read_text(encoding="utf-8"))
DELTA = ROOT / "patches" / SPEC["delta"]["file"]
XDELTA = os.environ.get("SACRED_GOLD_XDELTA", "xdelta3")


def digest(path):
    value = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


@unittest.skipUnless(CLEAN.is_file(), "external clean ROM fixture unavailable")
class PatcherTests(unittest.TestCase):
    def test_positive_end_to_end(self):
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp) / SPEC["target"]["filename"]
            apply_patch(CLEAN, DELTA, output, MANIFEST, XDELTA)
            self.assertEqual(digest(output), SPEC["target"]["sha256"])
            self.assertEqual(output.stat().st_size, SPEC["target"]["size"])

    def test_negative_source_hash(self):
        with tempfile.NamedTemporaryFile(suffix=".nds") as altered, tempfile.TemporaryDirectory() as temp:
            altered.write(b"wrong source")
            altered.flush()
            with self.assertRaisesRegex(PatchError, "source SHA-256 mismatch"):
                apply_patch(Path(altered.name), DELTA, Path(temp) / "out.nds", MANIFEST, XDELTA)

    def test_negative_altered_delta(self):
        with tempfile.NamedTemporaryFile(suffix=".xdelta") as altered, tempfile.TemporaryDirectory() as temp:
            altered.write(DELTA.read_bytes() + b"altered")
            altered.flush()
            with self.assertRaisesRegex(PatchError, "delta SHA-256 mismatch"):
                apply_patch(CLEAN, Path(altered.name), Path(temp) / "out.nds", MANIFEST, XDELTA)

    def test_refuses_overwrite(self):
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp) / "out.nds"
            output.write_bytes(b"keep")
            with self.assertRaisesRegex(PatchError, "existing output"):
                apply_patch(CLEAN, DELTA, output, MANIFEST, XDELTA)

    def test_negative_target_hash(self):
        with tempfile.TemporaryDirectory() as temp:
            altered_manifest = Path(temp) / "manifest.json"
            altered_spec = json.loads(MANIFEST.read_text(encoding="utf-8"))
            altered_spec["target"]["sha256"] = "0" * 64
            altered_manifest.write_text(json.dumps(altered_spec), encoding="utf-8")
            with self.assertRaisesRegex(PatchError, "output SHA-256 mismatch"):
                apply_patch(CLEAN, DELTA, Path(temp) / "out.nds", altered_manifest, XDELTA)

    def test_refuses_source_output_conflict(self):
        with self.assertRaisesRegex(PatchError, "different paths"):
            apply_patch(CLEAN, DELTA, CLEAN, MANIFEST, XDELTA)

    def test_valid_single_nds_zip(self):
        with tempfile.TemporaryDirectory() as temp:
            archive = Path(temp) / "clean.zip"
            with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_STORED) as handle:
                handle.write(CLEAN, "HeartGold-USA.nds")
            output = Path(temp) / SPEC["target"]["filename"]
            apply_patch(archive, DELTA, output, MANIFEST, XDELTA)
            self.assertEqual(digest(output), SPEC["target"]["sha256"])

    def test_rejects_zip_size_mismatch_before_extraction(self):
        with tempfile.TemporaryDirectory() as temp:
            archive = Path(temp) / "wrong.zip"
            with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_STORED) as handle:
                handle.writestr("HeartGold-USA.nds", b"too short")
            with self.assertRaisesRegex(PatchError, "ZIP .nds size mismatch"):
                apply_patch(archive, DELTA, Path(temp) / "out.nds", MANIFEST, XDELTA)


if __name__ == "__main__":
    unittest.main()
