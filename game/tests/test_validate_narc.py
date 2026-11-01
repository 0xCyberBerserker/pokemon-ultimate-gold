import hashlib
import json
from pathlib import Path
import struct
import subprocess
import tempfile
import unittest

TOOL = Path(__file__).resolve().parents[1] / 'tools' / 'validate_narc.cjs'


def fixture():
    fat = b'BTAF' + struct.pack('<IHHII', 20, 1, 0, 0, 4)
    names = b'BTNF' + struct.pack('<I', 8)
    image = b'GMIF' + struct.pack('<I', 12) + b'test'
    body = fat + names + image
    return b'NARC' + struct.pack('<HHIHH', 0xFEFF, 0x100, 16 + len(body), 16, 3) + body


class NarcValidationTest(unittest.TestCase):
    def run_cli(self, data):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'fixture.narc'
            path.write_bytes(data)
            result = subprocess.run(['node', str(TOOL), '--json', str(path)], capture_output=True, text=True)
            self.assertEqual(path.read_bytes(), data)
            return result, json.loads(result.stdout or result.stderr)

    def test_structurally_valid_is_incomplete(self):
        data = fixture()
        result, report = self.run_cli(data)
        self.assertEqual(result.returncode, 2)
        self.assertEqual(report['status'], 'INCOMPLETE')
        self.assertEqual(report['sha256'], hashlib.sha256(data).hexdigest())
        self.assertEqual(report['members'], 1)

    def test_bad_member_and_size_fail(self):
        for data in (fixture()[:-1], fixture()[:32] + struct.pack('<I', 100) + fixture()[36:]):
            with self.subTest(data=data):
                result, report = self.run_cli(data)
                self.assertEqual(result.returncode, 1)
                self.assertEqual(report['status'], 'FAIL')

    def test_empty_fails(self):
        result, report = self.run_cli(b'')
        self.assertEqual(result.returncode, 1)
        self.assertEqual(report['status'], 'FAIL')
