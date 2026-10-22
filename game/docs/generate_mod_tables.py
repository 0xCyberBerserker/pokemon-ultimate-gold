#!/usr/bin/env python3
"""Derive the small move/trainer cross-check tables from two supplied ROMs.

Only stdlib is used. The ROMs stay external; this script writes derived rows only.
"""
import argparse
import csv
import hashlib
import json
import struct
from pathlib import Path

TARGET_SHA = "fdb2fcabc4b51c4b98b0e4fcaf02740c81f32ede54c5a5bc0004d58c3133357e"
DRAYANO_SHA = "49f29848878406990ea288f26872d4355c92c4a2677f56973750bbf2566c13c1"
MOVE_IDS = [4, 6, 27, 134, 140, 146, 160, 169, 174, 176, 186, 204, 236, 343, 345]
OLD_NAMES = {4:"COMET_PUNCH",6:"PAY_DAY",27:"ROLLING_KICK",134:"KINESIS",140:"BARRAGE",146:"DIZZY_PUNCH",160:"CONVERSION",169:"SPIDER_WEB",174:"CURSE",176:"CONVERSION_2",186:"SWEET_KISS",204:"CHARM",236:"MOONLIGHT",343:"COVET",345:"MAGICAL_LEAF"}
REPLACEMENTS = {6:"BABY_DOLL_EYES",140:"DAZZLING_GLEAM",27:"DISARMING_VOICE",134:"DRAINING_KISS",169:"FAIRY_WIND",160:"MOONBLAST",176:"PLAY_ROUGH"}
NARC_PATH = "a/0/1/1"

def narc(data):
    assert data[:4] == b"NARC"
    pos = 16; assert data[pos:pos+4] == b"BTAF"
    size, count = struct.unpack_from("<IH", data, pos + 4)
    entries = [struct.unpack_from("<II", data, pos + 12 + i * 8) for i in range(count)]
    pos += size; assert data[pos:pos+4] == b"BTNF"; pos += struct.unpack_from("<I", data, pos+4)[0]
    assert data[pos:pos+4] == b"GMIF"; pos += 8
    return [data[pos+a:pos+b] for a,b in entries]

class Rom:
    def __init__(self, path):
        self.data = path.read_bytes(); self.fnt, _, self.fat, _ = struct.unpack_from("<4I", self.data, 0x40)
        self.paths = {}; self._walk(0xF000, "")
    def _walk(self, directory, prefix):
        offset, file_id, _ = struct.unpack_from("<IHH", self.data, self.fnt + (directory & 4095) * 8)
        pos = self.fnt + offset
        while self.data[pos]:
            flag = self.data[pos]; pos += 1; n = flag & 127
            name = self.data[pos:pos+n].decode("ascii"); pos += n
            if flag & 128:
                child = struct.unpack_from("<H", self.data, pos)[0]; pos += 2; self._walk(child, prefix + name + "/")
            else: self.paths[prefix + name] = file_id; file_id += 1
    def file(self, name):
        a,b = struct.unpack_from("<II", self.data, self.fat + self.paths[name] * 8); return self.data[a:b]

def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def decode_trainers(control, target, species_names, changed_ids):
    """Decode the two real trainer NARCs; no audit JSON is an input."""
    headers = narc(target.file("a/0/5/5")); parties = narc(target.file("a/0/5/6"))
    old_headers = narc(control.file("a/0/5/5")); old_parties = narc(control.file("a/0/5/6"))
    if len(headers) != 738 or len(parties) != 738 or headers != old_headers or parties != old_parties:
        raise SystemExit("trainer NARCs are not the expected preserved 738-record Drayano data")
    sizes = {0: 8, 1: 16, 2: 10, 3: 18}; rows = []
    for trainer_id, (header, party) in enumerate(zip(headers, parties)):
        if len(header) != 20: raise SystemExit(f"trainer {trainer_id} header size mismatch")
        kind, count = header[0], header[3]
        if not count: continue
        if kind not in sizes or count > 6 or len(party) < sizes[kind] * count: raise SystemExit(f"trainer {trainer_id} party layout mismatch")
        for slot in range(count):
            off = slot * sizes[kind]; level, packed = struct.unpack_from("<HH", party, off + 2)
            species, form = packed & 0x3FF, packed >> 10
            item = struct.unpack_from("<H", party, off + 6)[0] if kind & 2 else 0
            moves = list(struct.unpack_from("<4H", party, off + 6 + (2 if kind & 2 else 0))) if kind & 1 else []
            rows.append({"trainer_id": trainer_id, "slot": slot, "data_kind": kind, "species_id": species,
                         "species_name": species_names.get(species, "UNKNOWN"), "form": form, "level": level,
                         "item_id": item, "move_ids": moves,
                         "move_source": "explicit_trainer_record" if moves else "implicit_learnset",
                         "changed_move_ids": sorted(set(moves) & changed_ids)})
    return rows

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--target", type=Path, required=True); ap.add_argument("--drayano-external", type=Path, required=True); ap.add_argument("--out", type=Path, default=Path(__file__).parent); args = ap.parse_args()
    target_hash, base_hash = digest(args.target), digest(args.drayano_external)
    if target_hash != TARGET_SHA: raise SystemExit(f"unexpected target SHA-256: {target_hash}")
    if base_hash != DRAYANO_SHA: raise SystemExit(f"unexpected Drayano SHA-256: {base_hash}")
    target, base = Rom(args.target), Rom(args.drayano_external)
    left, right = narc(base.file(NARC_PATH)), narc(target.file(NARC_PATH))
    if len(left) != len(right) or len(right) <= max(MOVE_IDS): raise SystemExit("move NARC shape mismatch")
    all_changed = {i for i, pair in enumerate(zip(left, right)) if pair[0] != pair[1]}
    if all_changed != set(MOVE_IDS): raise SystemExit(f"unexpected changed move IDs: {sorted(all_changed)}")
    moves = []
    for mid in MOVE_IDS:
        if left[mid] == right[mid]: raise SystemExit(f"expected changed move is equal: {mid}")
        moves.append({"move_id": mid, "baseline_name": OLD_NAMES[mid], "target_name": REPLACEMENTS.get(mid, "UNRESOLVED_FROM_TARGET_TEXT"), "baseline_raw_hex": left[mid].hex(), "target_raw_hex": right[mid].hex(), "record_size_baseline": len(left[mid]), "record_size_target": len(right[mid]), "name_confidence": "manual-replacement" if mid in REPLACEMENTS else "baseline-only"})
    names = {}
    with (args.out / "species-493.csv").open(encoding="utf-8", newline="") as f:
        names = {int(r["national_id"]): r["name"] for r in csv.DictReader(f)}
    trainers_all = decode_trainers(base, target, names, all_changed)
    trainers = [r for r in trainers_all if r["changed_move_ids"]]
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "moves-final.json").write_text(json.dumps({"schema":"sacred-gold-derived-moves/v1","target_sha256":target_hash,"drayano_sha256":base_hash,"records":moves}, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    (args.out / "trainers-final.json").write_text(json.dumps({"schema":"sacred-gold-derived-trainer-references/v1","target_sha256":target_hash,"drayano_sha256":base_hash,"records":trainers}, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    (args.out / "trainers-all-final.json").write_text(json.dumps({"schema":"sacred-gold-derived-all-trainer-members/v1","target_sha256":target_hash,"drayano_sha256":base_hash,"records":trainers_all}, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    with (args.out / "moves-final.csv").open("w", newline="", encoding="utf-8") as f:
        w=csv.DictWriter(f, fieldnames=["move_id","baseline_name","target_name","baseline_raw_hex","target_raw_hex","name_confidence","record_size_baseline","record_size_target"]); w.writeheader(); w.writerows(moves)
    with (args.out / "trainers-final.csv").open("w", newline="", encoding="utf-8") as f:
        w=csv.DictWriter(f, fieldnames=["trainer_id","slot","data_kind","species_id","species_name","form","level","item_id","move_ids","move_source","changed_move_ids"]); w.writeheader()
        for r in trainers:
            q=dict(r); q["move_ids"]=";".join(map(str,q["move_ids"])); q["changed_move_ids"]=";".join(map(str,q["changed_move_ids"])); w.writerow(q)
    with (args.out / "trainers-all-final.csv").open("w", newline="", encoding="utf-8") as f:
        w=csv.DictWriter(f, fieldnames=["trainer_id","slot","data_kind","species_id","species_name","form","level","item_id","move_ids","move_source","changed_move_ids"]); w.writeheader()
        for r in trainers_all:
            q=dict(r); q["move_ids"]=";".join(map(str,q["move_ids"])); q["changed_move_ids"]=";".join(map(str,q["changed_move_ids"])); w.writerow(q)
    assert len(moves)==15 and len(trainers)==14 and len(trainers_all)==2086
    print(f"wrote {len(moves)} moves, {len(trainers)} affected and {len(trainers_all)} trainer members")

if __name__ == "__main__": main()
