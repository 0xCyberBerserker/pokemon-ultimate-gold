#!/usr/bin/env python3
"""Generate the small, derived 493-species table from the exact candidate ROM."""
import csv
import hashlib
import json
import struct
import argparse
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
EXPECTED_SHA256 = "fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e"


def narc(data):
    assert data[:4] == b"NARC"
    pos = 16
    assert data[pos:pos + 4] == b"BTAF"
    length, count = struct.unpack_from("<IH", data, pos + 4)
    entries = [struct.unpack_from("<II", data, pos + 12 + i * 8) for i in range(count)]
    pos += length
    assert data[pos:pos + 4] == b"BTNF"
    pos += struct.unpack_from("<I", data, pos + 4)[0]
    assert data[pos:pos + 4] == b"GMIF"
    pos += 8
    return [data[pos + start:pos + end] for start, end in entries]


class Rom:
    def __init__(self, path):
        self.data = path.read_bytes()
        self.fnt, _, self.fat, _ = struct.unpack_from("<4I", self.data, 0x40)
        self.paths = {}
        self._walk(0xF000, "")

    def _walk(self, directory, prefix):
        offset, file_id, _ = struct.unpack_from("<IHH", self.data, self.fnt + (directory & 4095) * 8)
        pos = self.fnt + offset
        while self.data[pos]:
            flag = self.data[pos]; pos += 1
            size = flag & 127
            name = self.data[pos:pos + size].decode("ascii"); pos += size
            if flag & 128:
                child = struct.unpack_from("<H", self.data, pos)[0]; pos += 2
                self._walk(child, prefix + name + "/")
            else:
                self.paths[prefix + name] = file_id; file_id += 1

    def file(self, name):
        start, end = struct.unpack_from("<II", self.data, self.fat + self.paths[name] * 8)
        return self.data[start:end]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", type=Path, required=True, help="externally supplied exact patched ROM")
    parser.add_argument("--mapper", type=Path, help="optional external National-name JSON; otherwise use delivered species CSV")
    parser.add_argument("--out", type=Path, default=Path(__file__).parent)
    args = parser.parse_args()
    digest = hashlib.sha256(args.target.read_bytes()).hexdigest()
    if digest != EXPECTED_SHA256:
        raise ValueError(f"unexpected target ROM SHA-256: {digest}")
    rom = Rom(args.target)
    if args.mapper:
        mapper = json.loads(args.mapper.read_text(encoding="utf-8"))["records"]
        names = {row["national_id"]: row["name"] for row in mapper if row["national_id"] <= 493}
    else:
        with Path(__file__).with_name("species-493.csv").open(encoding="utf-8", newline="") as handle:
            names = {int(row["national_id"]): row["name"] for row in csv.DictReader(handle)}
    assert set(names) == set(range(1, 494)), "493 unique species names are required"
    personal = narc(rom.file("a/0/0/2"))
    learns = narc(rom.file("a/0/3/3"))
    evolutions = narc(rom.file("a/0/3/4"))
    encounters = narc(rom.file("a/0/3/7"))
    assert len(personal) >= 494 and all(len(row) == 44 for row in personal[:494])
    assert len(learns) >= 494 and all(len(row) % 2 == 0 for row in learns[:494])
    rows = []
    for sid in range(1, 494):
        p = personal[sid]
        moves = []
        for off in range(0, len(learns[sid]), 2):
            value = struct.unpack_from("<H", learns[sid], off)[0]
            if value == 0xFFFF:
                break
            moves.append({"level": value >> 9, "move_id": value & 0x1FF})
        evos = []
        for off in range(0, len(evolutions[sid]) - 5, 6):
            method, param, target = struct.unpack_from("<HHH", evolutions[sid], off)
            if method:
                evos.append({"method_id": method, "param": param, "target_species_id": target})
        rows.append({
            "national_id": sid, "name": names.get(sid),
            "base_stats": list(p[0:6]), "types": list(p[6:8]),
            "abilities": [p[22], p[23]], "levelup_moves": moves,
            "evolutions": evos,
        })
    metadata = {
        "schema": "sacred-gold-derived-species-493/v1",
        "scope": "National Dex 1..493 only; no Gen5+ records",
        "target": {"filename": "Sacred-Gold-Plus-Drayano-QoL-fix1.nds", "sha256": digest},
        "source_format": {
            "personal": {"path": "a/0/0/2", "records": len(personal), "record_size": 44, "stats_offsets": [0, 1, 2, 3, 4, 5], "type_offsets": [6, 7], "ability_offsets": [22, 23]},
            "learnsets": {"path": "a/0/3/3", "records": len(learns), "format": "u16 level=(word>>9), move_id=(word&511), terminator=65535"},
            "evolutions": {"path": "a/0/3/4", "records": len(evolutions), "format": "repeated u16 method,param,target triples; zero triple is empty"},
            "encounters": {"path": "a/0/3/7", "records": len(encounters), "per_species_join": "not asserted; encounter records have map-specific slots"},
        },
        "encoding_notes": {"fairy_type_id": 9, "ability_names": "IDs retained; no local enum join asserted", "move_names": "IDs retained; Plus-reused move IDs do not have reliable inherited names"},
        "species_count": len(rows), "species": rows,
    }
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "species-493.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (args.out / "species-493.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["national_id", "name", "base_stats", "type_ids", "ability_ids", "levelup_move_count", "evolution_count"])
        writer.writeheader()
        for row in rows:
            writer.writerow({"national_id": row["national_id"], "name": row["name"], "base_stats": ",".join(map(str, row["base_stats"])), "type_ids": ",".join(map(str, row["types"])), "ability_ids": ",".join(map(str, row["abilities"])), "levelup_move_count": len(row["levelup_moves"]), "evolution_count": len(row["evolutions"])})
    assert len(rows) == 493 and len({r["national_id"] for r in rows}) == 493


if __name__ == "__main__":
    main()
