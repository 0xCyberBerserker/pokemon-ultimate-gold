#!/usr/bin/env python3
"""Read-only partial checks for NDS model, texture and pattern-animation resources."""
import argparse
import hashlib
import json
from pathlib import Path
import struct


class Unsupported(ValueError):
    pass


class Reader:
    def __init__(self, data, start=0, end=None):
        self.data, self.start, self.end = data, start, len(data) if end is None else end

    def get(self, off, size):
        if off < self.start or size < 0 or off + size > self.end:
            raise ValueError('field outside containing block')
        return self.data[off:off + size]

    def u16(self, off):
        return struct.unpack('<H', self.get(off, 2))[0]

    def u32(self, off):
        return struct.unpack('<I', self.get(off, 4))[0]

    # Dictionary layout adapted from HoennB2 nsbtx.py; see MIT license in docs.
    def dictionary(self, off, min_unit):
        count = self.get(off, 2)[1]
        size = self.u16(off + 2)
        if size < 16:
            raise ValueError('invalid dictionary size')
        self.get(off, size)
        bounded = Reader(self.data, off, off + size)
        if bounded.u16(off + 4) != 8 or bounded.u16(off + 6) != 12 + 4 * count:
            raise ValueError('invalid dictionary tree length')
        root = bounded.get(off + 8, 4)
        if root[1] > count:
            raise ValueError('dictionary root references nonexistent node')
        for i in range(count):
            ref_bit, left, right, entry_index = bounded.get(off + 12 + 4 * i, 4)
            if ref_bit > 127 or left > count or right > count or entry_index >= count:
                raise ValueError('dictionary node reference out of bounds')
        tree = off + 12 + 4 * count
        unit = bounded.u16(tree)
        entries_size = bounded.u16(tree + 2)
        first = tree + 4
        if unit != min_unit:
            raise ValueError('unsupported dictionary entry size')
        if entries_size != 4 + unit * count:
            raise ValueError('invalid dictionary entries length')
        names_at = first + unit * count
        if names_at + 16 * count != bounded.end:
            raise ValueError('dictionary size does not match entries and names')
        bounded.get(first, unit * count + 16 * count)
        result = []
        for i in range(count):
            raw = bounded.get(names_at + 16 * i, 16).split(b'\0', 1)[0]
            if not raw:
                raise ValueError('empty resource name')
            result.append((raw.decode('ascii'), bounded.get(first + unit * i, unit)))
        if len({name for name, _ in result}) != count:
            raise ValueError('duplicate resource name')
        return result


def blocks(data, expected):
    r = Reader(data)
    if data[:4] not in expected:
        raise Unsupported('unsupported graphics container')
    if len(data) < 16:
        raise ValueError('truncated graphics container header')
    if r.u16(4) != 0xfeff or r.u32(8) != len(data) or r.u16(12) != 16:
        raise ValueError('invalid header or declared size')
    count = r.u16(14)
    if not count:
        raise ValueError('empty block table')
    r.get(16, count * 4)
    out = []
    for i in range(count):
        start = r.u32(16 + 4 * i)
        if start < 16 + 4 * count:
            raise ValueError('invalid block offset')
        size = r.u32(start + 4)
        if size < 8:
            raise ValueError('invalid block size')
        r.get(start, size)
        out.append((r.get(start, 4), Reader(data, start, start + size)))
    ordered = sorted((b.start, b.end) for _, b in out)
    if any(ordered[i][1] > ordered[i + 1][0] for i in range(len(ordered) - 1)):
        raise ValueError('overlapping blocks')
    return out


def one_block(data, expected, block):
    found = [b for magic, b in blocks(data, expected) if magic == block]
    required = ((data[:4] == b'BTX0' and block == b'TEX0')
                or (data[:4] == b'BMD0' and block == b'MDL0')
                or (data[:4] == b'BTP0' and block == b'PAT0'))
    if len(found) > 1 or (not found and required):
        raise ValueError(f'invalid {block.decode()} block count')
    if not found:
        raise Unsupported(f'missing {block.decode()} block')
    return found[0]


def texture_set(data):
    t = one_block(data, (b'BTX0', b'BMD0'), b'TEX0')
    base = t.start
    t.get(base, 0x3c)
    textures = t.dictionary(base + t.u16(base + 0x0e), 8)
    palettes = t.dictionary(base + t.u32(base + 0x34), 4)
    # Standard and compressed data are distinct TEX0 regions, sized in 8-byte units.
    standard_size = t.u16(base + 0x0c) * 8
    standard_at = base + t.u32(base + 0x14)
    compressed_size = t.u16(base + 0x1c) * 8
    compressed_at = base + t.u32(base + 0x24)
    compressed_index = base + t.u32(base + 0x28)
    palette_size = t.u16(base + 0x30) * 8
    palette_at = base + t.u32(base + 0x38)
    for off, size in ((standard_at, standard_size), (compressed_at, compressed_size),
                      (compressed_index, compressed_size // 2), (palette_at, palette_size)):
        t.get(off, size)
    unsupported = []
    for name, entry in textures:
        param = struct.unpack_from('<I', entry)[0]
        fmt = (param >> 26) & 7
        width, height = 8 << ((param >> 20) & 7), 8 << ((param >> 23) & 7)
        offset = (param & 0xffff) * 8
        bpp = {1: 8, 2: 2, 3: 4, 4: 8, 5: 2, 6: 8, 7: 16}.get(fmt)
        if bpp is None:
            unsupported.append(f'texture {name}: unsupported format {fmt}')
            continue
        length = width * height * bpp // 8
        if offset + length > (compressed_size if fmt == 5 else standard_size):
            raise ValueError(f'texture payload out of bounds: {name}')
    for name, entry in palettes:
        offset = struct.unpack_from('<H', entry)[0] * 8
        if offset >= palette_size:
            raise ValueError(f'palette offset out of bounds: {name}')
    return [x[0] for x in textures], [x[0] for x in palettes], unsupported


def check_compressed_pair(data, texture_name, palette_name):
    """Check actual 4x4 color reads against the selected TEX0 palette buffer."""
    t = one_block(data, (b'BTX0', b'BMD0'), b'TEX0')
    base = t.start
    textures = dict(t.dictionary(base + t.u16(base + 0x0e), 8))
    palettes = dict(t.dictionary(base + t.u32(base + 0x34), 4))
    if texture_name not in textures or palette_name not in palettes:
        raise Unsupported('selected texture or palette name is absent')
    param = struct.unpack_from('<I', textures[texture_name])[0]
    if (param >> 26) & 7 != 5:
        raise Unsupported('selected texture is not compressed 4x4')
    width, height = 8 << ((param >> 20) & 7), 8 << ((param >> 23) & 7)
    offset = (param & 0xffff) * 8
    count = width * height // 16
    pixels_at = base + t.u32(base + 0x24) + offset
    aux_at = base + t.u32(base + 0x28) + offset // 2
    pixels, auxiliary = t.get(pixels_at, 4 * count), t.get(aux_at, 2 * count)
    pal_size = t.u16(base + 0x30) * 8
    pal_start = struct.unpack_from('<H', palettes[palette_name])[0] * 8
    for block in range(count):
        packed = struct.unpack_from('<I', pixels, block * 4)[0]
        info = struct.unpack_from('<H', auxiliary, block * 2)[0]
        mode, color_base = info >> 14, (info & 0x3fff) * 2
        for pixel in range(16):
            value = (packed >> (2 * pixel)) & 3
            if value == 3 and mode in (0, 1):
                continue
            used = (0, 1) if mode in (1, 3) and value >= 2 else (value,)
            for color in used:
                if pal_start + (color_base + color + 1) * 2 > pal_size:
                    raise ValueError(f'4x4 palette read out of supplied buffer: block {block}')
    return count


def check_material_pair(data, texture_name, palette_name):
    """Validate reads for one unambiguous static material binding."""
    t = one_block(data, (b'BTX0', b'BMD0'), b'TEX0')
    base = t.start
    textures = dict(t.dictionary(base + t.u16(base + 0x0e), 8))
    palettes = dict(t.dictionary(base + t.u32(base + 0x34), 4))
    param = struct.unpack_from('<I', textures[texture_name])[0]
    fmt = (param >> 26) & 7
    if fmt == 7:
        return fmt
    if fmt not in (1, 2, 3, 4, 5, 6):
        raise Unsupported(f'unsupported texture format {fmt}')
    if palette_name is None:
        raise Unsupported('indexed texture has no unique palette binding')
    if fmt == 5:
        check_compressed_pair(data, texture_name, palette_name)
        return fmt
    width, height = 8 << ((param >> 20) & 7), 8 << ((param >> 23) & 7)
    bpp = {1: 8, 2: 2, 3: 4, 4: 8, 6: 8}[fmt]
    offset = (param & 0xffff) * 8
    raw = t.get(base + t.u32(base + 0x14) + offset, width * height * bpp // 8)
    if fmt in (1, 6):
        mask = 31 if fmt == 1 else 7
        max_index = max((byte & mask for byte in raw), default=0)
    elif fmt in (2, 3):
        bits = 2 if fmt == 2 else 4
        mask = (1 << bits) - 1
        max_index = max(((byte >> shift) & mask for byte in raw for shift in range(0, 8, bits)), default=0)
    else:
        max_index = max(raw, default=0)
    pal_start = struct.unpack_from('<H', palettes[palette_name])[0] * 8
    pal_size = t.u16(base + 0x30) * 8
    if pal_start + (max_index + 1) * 2 > pal_size:
        raise ValueError(f'material palette read out of supplied buffer: {texture_name}')
    return fmt


# Binding dictionary layout adapted from HoennB2 nsbtx.py (MIT).
def material_names(data):
    mdl = one_block(data, (b'BMD0',), b'MDL0')
    models = mdl.dictionary(mdl.start + 8, 4)
    tex_names, pal_names, model_materials, bindings = set(), set(), set(), []
    for model_name, entry in models:
        model = mdl.start + struct.unpack_from('<I', entry)[0]
        size = mdl.u32(model)
        if size < 12:
            raise ValueError('model size smaller than supported header')
        mdl.get(model, size)
        local = Reader(data, model, model + size)
        mats = model + local.u32(model + 8)
        materials = local.dictionary(mats + 4, 4)
        material_count = len(materials)
        model_materials.update(name for name, _ in materials)
        material_bindings = [{'model': model_name, 'material': name, 'textures': set(), 'palettes': set()} for name, _ in materials]
        for offset, dest, kind in ((local.u16(mats), tex_names, 'textures'), (local.u16(mats + 2), pal_names, 'palettes')):
            for name, binding in local.dictionary(mats + offset, 4):
                rel, count = struct.unpack_from('<HB', binding)
                material_ids = local.get(mats + rel, count)
                if any(index >= material_count for index in material_ids):
                    raise ValueError(f'material binding index out of bounds: {name}')
                if count:
                    dest.add(name)
                for index in material_ids:
                    material_bindings[index][kind].add(name)
        bindings.extend(material_bindings)
    return tex_names, pal_names, model_materials, bindings


# PAT0 name table layout adapted from HoennB2 anim_tex_check.py (MIT).
def pattern_names(data):
    pat = one_block(data, (b'BTP0',), b'PAT0')
    textures, palettes, track_names = set(), set(), set()
    warnings = []
    animations = pat.dictionary(pat.start + 8, 4)
    if not animations:
        raise Unsupported('PAT0 contains no animation entries')
    for _, entry in animations:
        anim = pat.start + struct.unpack_from('<I', entry)[0]
        pat.get(anim, 12)
        ntex, npal = pat.get(anim + 6, 2)
        texoff, paloff = pat.u16(anim + 8), pat.u16(anim + 10)
        duration = pat.u16(anim + 4)
        for track_name, track in pat.dictionary(anim + 12, 8):
            track_names.add(track_name)
            key_count, _, key_offset = struct.unpack_from('<IHH', track)
            pat.get(anim + key_offset, 4 * key_count)
            previous = -1
            for index in range(key_count):
                frame, texture_index, palette_index = struct.unpack('<HBB', pat.get(anim + key_offset + 4 * index, 4))
                if texture_index >= ntex or palette_index >= npal:
                    raise ValueError(f'PAT0 keyframe resource index out of bounds: {track_name}')
                if frame < previous:
                    raise ValueError(f'PAT0 keyframes out of order: {track_name}')
                if frame >= duration or frame == previous:
                    warnings.append(f'PAT0 timing needs review: {track_name} frame {frame}, duration {duration}')
                previous = frame
        for offset, count, dest in ((texoff, ntex, textures), (paloff, npal, palettes)):
            for i in range(count):
                raw = pat.get(anim + offset + 16 * i, 16).split(b'\0', 1)[0]
                if not raw:
                    raise ValueError('empty animation resource name')
                dest.add(raw.decode('ascii'))
    if not textures and not palettes:
        raise Unsupported('PAT0 has no texture or palette names to compare')
    return textures, palettes, warnings, track_names


def validate(data, animation=None, external=None, selected_pair=None):
    if external is not None and data[:4] != b'BMD0':
        raise Unsupported('external texture sets require a BMD0 model')
    model_refs = material_names(data) if data[:4] == b'BMD0' else None
    textures, palettes, unsupported = texture_set(external if external is not None else data)
    checks = ['TEX0 dictionary bounds and node references', 'texture payload bounds', 'palette starting offsets']
    material_pair_checks = []
    if model_refs is not None:
        mt, mp, model_materials, bindings = model_refs
        if not mt and not mp:
            raise Unsupported('model has no texture or palette bindings to compare')
        missing = (mt - set(textures)) | (mp - set(palettes))
        if missing:
            raise ValueError('material references absent from supplied texture set: ' + ', '.join(sorted(missing)))
        checks.append('material bindings bounded by declared model size')
        checks.append('material binding indices within model dictionary')
        checks.append('material names exist in supplied TEX0')
        texture_data = external if external is not None else data
        for binding in bindings:
            record = {'model': binding['model'], 'material': binding['material']}
            if len(binding['textures']) != 1 or len(binding['palettes']) > 1:
                record['status'] = 'INCOMPLETE'
                record['reason'] = 'missing or ambiguous static texture/palette binding'
                material_pair_checks.append(record)
                continue
            texture = next(iter(binding['textures']))
            palette = next(iter(binding['palettes'])) if binding['palettes'] else None
            record.update({'texture': texture, 'palette': palette})
            try:
                record['format'] = check_material_pair(texture_data, texture, palette)
                record['status'] = 'BUFFER_BOUNDS_CHECKED'
            except Unsupported as exc:
                record['status'] = 'INCOMPLETE'
                record['reason'] = str(exc)
            material_pair_checks.append(record)
        checked_count = sum(item['status'] == 'BUFFER_BOUNDS_CHECKED' for item in material_pair_checks)
        checks.append(f'static material buffer bounds ({checked_count} of {len(material_pair_checks)} materials)')
    if animation is not None:
        at, ap, timing_warnings, track_names = pattern_names(animation)
        missing = (at - set(textures)) | (ap - set(palettes))
        if missing:
            raise ValueError('animation names absent from supplied texture set: ' + ', '.join(sorted(missing)))
        checks.append('pattern animation keyframe bounds and indices')
        checks.append('pattern animation names exist in supplied TEX0')
        unsupported.extend(timing_warnings)
        if model_refs is not None:
            missing_tracks = track_names - model_materials
            if missing_tracks:
                unsupported.append('PAT0 track names absent from supplied model set: ' + ', '.join(sorted(missing_tracks)))
            else:
                checks.append('PAT0 track names present in supplied model set')
    if selected_pair is not None:
        block_count = check_compressed_pair(external if external is not None else data, *selected_pair)
        checks.append(f'4x4 selected-pair palette-buffer reads ({block_count} blocks)')
    return {'status': 'INCOMPLETE', 'sha256': hashlib.sha256(data).hexdigest(),
            'textures': textures, 'palettes': palettes, 'checked': checks, 'unsupported': unsupported,
            'material_pair_checks': material_pair_checks,
            'animation_sha256': hashlib.sha256(animation).hexdigest() if animation is not None else None,
            'texture_set_sha256': hashlib.sha256(external).hexdigest() if external is not None else None,
            'selected_pair': {'texture': selected_pair[0], 'palette': selected_pair[1]} if selected_pair is not None else None,
            'not_checked': ['dictionary lookup semantics', 'palette lengths and binding semantics', 'dynamic animation substitutions and inferred palette extents', 'PAT0 duration and duplicate-frame semantics', 'per-model animation binding', 'other animation types', 'hardware behavior']}


def validate_2d(chars, screen, palette):
    """Validate the bounded 4bpp tiled-screen profile; does not emulate VRAM."""
    def ntr_blocks(data, magic):
        r = Reader(data)
        if r.get(0, 4) != magic:
            raise Unsupported(f'expected {magic.decode()} container')
        if r.u16(4) != 0xfeff or r.u32(8) != len(data) or r.u16(12) != 16:
            raise ValueError('invalid 2D container header or size')
        count, pos, found = r.u16(14), 16, {}
        if not count:
            raise ValueError('empty 2D block table')
        for _ in range(count):
            kind, size = r.get(pos, 4), r.u32(pos + 4)
            if size < 8:
                raise ValueError('invalid 2D block size')
            r.get(pos, size)
            if kind in found:
                raise ValueError('duplicate 2D block')
            found[kind] = Reader(data, pos, pos + size)
            pos += size
        if pos != len(data):
            raise ValueError('2D blocks do not cover declared file')
        return found

    def required(found, kind):
        if kind not in found:
            raise ValueError(f'missing {kind.decode()} block')
        return found[kind]

    char = required(ntr_blocks(chars, b'RGCN'), b'RAHC')
    scr = required(ntr_blocks(screen, b'RCSN'), b'NRCS')
    pal = required(ntr_blocks(palette, b'RLCN'), b'TTLP')
    c, q, p = char.start, scr.start, pal.start
    char.get(c, 32); scr.get(q, 20); pal.get(p, 24)
    if char.u32(c + 12) != 3 or char.u32(c + 20) != 0 or scr.u16(q + 12) != 0 or scr.u16(q + 14) != 0:
        raise Unsupported('only 4bpp non-scanned text-screen profile is supported')
    tile_size, tile_off = char.u32(c + 24), char.u32(c + 28)
    if tile_size == 0 or tile_size % 32 or tile_off != 24:
        raise Unsupported('unsupported 4bpp character payload layout')
    tile_data = char.get(c + 8 + tile_off, tile_size)
    width, height, screen_size = scr.u16(q + 8), scr.u16(q + 10), scr.u32(q + 16)
    if not width or not height or width % 8 or height % 8 or screen_size != width * height // 32:
        raise ValueError('invalid 4bpp screen dimensions or entry size')
    entries = scr.get(q + 20, screen_size)
    pal_format, extended = pal.u32(p + 8), pal.u32(p + 12)
    if pal_format not in (3, 4):
        raise ValueError('invalid 2D palette format')
    if extended == 1:
        raise Unsupported('extended 2D palette is not supported')
    if extended != 0:
        raise ValueError('invalid 2D palette extended flag')
    pal_size, pal_off = pal.u32(p + 16), pal.u32(p + 20)
    if pal_off < 16:
        raise ValueError('2D palette payload overlaps header')
    if pal_off != 16:
        raise Unsupported('unsupported 2D palette payload offset')
    available = pal.end - (p + 8 + pal_off)
    if pal_size != available:
        if pal_size <= 0x200 and 0x200 - pal_size == available:
            raise Unsupported('inverted 2D palette size is not supported')
        raise ValueError('2D palette size differs from section payload')
    if not pal_size or pal_size % 2:
        raise ValueError('invalid 2D palette size')
    pal.get(p + 8 + pal_off, pal_size)
    for i in range(0, len(entries), 2):
        entry = struct.unpack_from('<H', entries, i)[0]
        tile, bank = entry & 0x3ff, entry >> 12
        if tile >= tile_size // 32:
            raise ValueError(f'screen tile outside character payload: entry {i // 2}')
        for byte in tile_data[tile * 32:(tile + 1) * 32]:
            for index in (byte & 15, byte >> 4):
                if (bank * 16 + index + 1) * 2 > pal_size:
                    raise ValueError(f'screen palette access out of bounds: entry {i // 2}')
    return {'status': 'INCOMPLETE', 'sha256': hashlib.sha256(chars).hexdigest(),
            'screen_sha256': hashlib.sha256(screen).hexdigest(),
            'palette_sha256': hashlib.sha256(palette).hexdigest(),
            'checked': ['4bpp screen tile indices and palette-buffer accesses'],
            'not_checked': ['runtime VRAM allocation and mapping', 'visual correctness', 'other 2D layouts', 'hardware behavior']}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('path', type=Path)
    parser.add_argument('--animation', type=Path)
    parser.add_argument('--screen', type=Path)
    parser.add_argument('--palette', type=Path)
    parser.add_argument('--textures', type=Path)
    parser.add_argument('--texture-name')
    parser.add_argument('--palette-name')
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    if (args.screen is None) != (args.palette is None):
        parser.error('--screen and --palette must be supplied together')
    if args.screen and (args.animation or args.textures or args.texture_name or args.palette_name):
        parser.error('2D and 3D options cannot be combined')
    if (args.texture_name is None) != (args.palette_name is None):
        parser.error('--texture-name and --palette-name must be supplied together')
    selected_pair = (args.texture_name, args.palette_name) if args.texture_name is not None else None
    try:
        if args.screen:
            result = validate_2d(args.path.read_bytes(), args.screen.read_bytes(), args.palette.read_bytes())
        else:
            result = validate(args.path.read_bytes(), args.animation.read_bytes() if args.animation else None,
                              args.textures.read_bytes() if args.textures else None, selected_pair)
    except Unsupported as exc:
        result = {'status': 'UNSUPPORTED', 'error': str(exc)}
    except (OSError, ValueError, UnicodeError, struct.error) as exc:
        result = {'status': 'FAIL', 'error': str(exc)}
    if args.json:
        print(json.dumps(result, indent=2))
    elif result['status'] == 'INCOMPLETE':
        print(f"INCOMPLETE: SHA-256 {result['sha256']}; checks: {', '.join(result['checked'])}")
    else:
        print(f"{result['status']}: {result['error']}")
    return 1 if result['status'] == 'FAIL' else 2


if __name__ == '__main__':
    raise SystemExit(main())
