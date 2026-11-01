import importlib.util
import json
from pathlib import Path
import struct
import subprocess
import sys
import tempfile
import unittest

TOOL = Path(__file__).resolve().parents[1] / 'tools' / 'validate_nitro_textures.py'
spec = importlib.util.spec_from_file_location('validate_nitro_textures', TOOL)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def dictionary(name, entry):
    size = 12 + 4 + 4 + len(entry) + 16
    return struct.pack('<BBHHHI', 0, 1, size, 8, 16, 0x17f) + bytes(4) + struct.pack('<HH', len(entry), 4 + len(entry)) + entry + name.ljust(16, b'\0')


def dictionary_many(entries):
    count = len(entries)
    unit = len(entries[0][1])
    size = 12 + 4 * count + 4 + unit * count + 16 * count
    return (struct.pack('<BBHHHI', 0, count, size, 8, 12 + 4 * count, 0x17f)
            + bytes(4 * count) + struct.pack('<HH', unit, 4 + unit * count)
            + b''.join(value for _, value in entries)
            + b''.join(name.ljust(16, b'\0') for name, _ in entries))


def container(magic, chunks):
    offset = 16 + 4 * len(chunks)
    positions = []
    for chunk in chunks:
        positions.append(offset)
        offset += len(chunk)
    return magic + struct.pack('<HHIHH', 0xfeff, 1, offset, 16, len(chunks)) + b''.join(struct.pack('<I', p) for p in positions) + b''.join(chunks)


def fixture():
    texdict = dictionary(b'tex', struct.pack('<II', 3 << 26, 0))
    paldict = dictionary(b'pal', bytes(4))
    block = bytearray(0x3c) + texdict + paldict
    tex_at = len(block)
    block += bytes(32)
    pal_at = len(block)
    block += bytes(32)
    block[:4] = b'TEX0'
    struct.pack_into('<I', block, 4, len(block))
    struct.pack_into('<HH', block, 0x0c, 4, 0x3c)
    struct.pack_into('<I', block, 0x14, tex_at)
    struct.pack_into('<I', block, 0x34, 0x3c + len(texdict))
    struct.pack_into('<H', block, 0x30, 4)
    struct.pack_into('<I', block, 0x38, pal_at)
    return container(b'BTX0', [block])


def compressed_fixture():
    texdict = dictionary(b'tex', struct.pack('<II', 5 << 26, 0))
    paldict = dictionary(b'pal', bytes(4))
    block = bytearray(0x3c) + texdict + paldict
    tex_at = len(block)
    block += bytes([0xe4] * 16)
    aux_at = len(block)
    block += struct.pack('<4H', 0, 0x4000, 0x8000, 0xc000)
    pal_at = len(block)
    block += bytes(32)
    block[:4] = b'TEX0'
    struct.pack_into('<I', block, 4, len(block))
    struct.pack_into('<H', block, 0x0e, 0x3c)
    struct.pack_into('<H', block, 0x1c, 2)
    struct.pack_into('<II', block, 0x24, tex_at, aux_at)
    struct.pack_into('<I', block, 0x34, 0x3c + len(texdict))
    struct.pack_into('<H', block, 0x30, 4)
    struct.pack_into('<I', block, 0x38, pal_at)
    return container(b'BTX0', [block])


def texture_variant(fmt, fill=0):
    texdict = dictionary(b'tex', struct.pack('<II', fmt << 26, 0))
    paldict = dictionary(b'pal', bytes(4))
    block = bytearray(0x3c) + texdict + paldict
    length = {1: 64, 2: 16, 3: 32, 4: 64, 6: 64, 7: 128}[fmt]
    tex_at = len(block)
    block += bytes([fill] * length)
    pal_at = len(block)
    block += bytes(32)
    block[:4] = b'TEX0'
    struct.pack_into('<I', block, 4, len(block))
    struct.pack_into('<HH', block, 0x0c, length // 8, 0x3c)
    struct.pack_into('<I', block, 0x14, tex_at)
    struct.pack_into('<I', block, 0x34, 0x3c + len(texdict))
    struct.pack_into('<H', block, 0x30, 4)
    struct.pack_into('<I', block, 0x38, pal_at)
    return container(b'BTX0', [block])


def pattern(texture=b'tex', palette=b'pal', track_name=b'mat'):
    entry = struct.pack('<I', 48)
    block = bytearray(b'PAT0' + bytes(4) + dictionary(b'anim', entry))
    assert len(block) == 48
    track = dictionary(track_name, struct.pack('<IHH', 2, 0, 56))
    assert len(track) == 44
    anim = (bytes(4) + struct.pack('<HBBHH', 16, 1, 1, 64, 80) + track
            + struct.pack('<HBBHBB', 0, 0, 0, 8, 0, 0)
            + texture.ljust(16, b'\0') + palette.ljust(16, b'\0'))
    block += anim
    struct.pack_into('<I', block, 4, len(block))
    return container(b'BTP0', [block])


def model(texture=b'tex', palette=b'pal', material_index=0):
    # One model and one material, with names bound through two dictionaries.
    td = dictionary(texture, bytes(4))
    pd = dictionary(palette, bytes(4)) if palette is not None else struct.pack('<BBHHHIHH', 0, 0, 16, 8, 12, 0x7f, 4, 4)
    md = dictionary(b'mat', bytes(4))
    mats = bytearray(4) + md + td + pd + bytes([material_index, 0])
    struct.pack_into('<HH', mats, 0, 4 + len(md), 4 + len(md) + len(td))
    struct.pack_into('<HB', mats, 4 + len(md) + 20, len(mats) - 2, 1)
    if palette is not None:
        struct.pack_into('<HB', mats, 4 + len(md) + len(td) + 20, len(mats) - 1, 1)
    model_data = bytearray(12) + mats
    struct.pack_into('<I', model_data, 0, len(model_data))
    struct.pack_into('<I', model_data, 8, 12)
    mdl = bytearray(b'MDL0' + bytes(4) + dictionary(b'model', struct.pack('<I', 48))) + model_data
    struct.pack_into('<I', mdl, 4, len(mdl))
    return container(b'BMD0', [mdl, fixture()[20:]])


def ambiguous_model_and_textures():
    md = dictionary(b'mat', bytes(4))
    td = dictionary_many([(b'tex', bytes(4)), (b'alt', bytes(4))])
    pd = dictionary(b'pal', bytes(4))
    mats = bytearray(4) + md + td + pd + bytes([0, 0])
    td_at, pd_at = 4 + len(md), 4 + len(md) + len(td)
    struct.pack_into('<HH', mats, 0, td_at, pd_at)
    for i in range(2):
        struct.pack_into('<HB', mats, td_at + 24 + 4 * i, len(mats) - 2, 1)
    struct.pack_into('<HB', mats, pd_at + 20, len(mats) - 1, 1)
    model_data = bytearray(12) + mats
    struct.pack_into('<II', model_data, 0, len(model_data), 0)
    struct.pack_into('<I', model_data, 8, 12)
    mdl = bytearray(b'MDL0' + bytes(4) + dictionary(b'model', struct.pack('<I', 48))) + model_data
    struct.pack_into('<I', mdl, 4, len(mdl))
    model_resource = container(b'BMD0', [mdl])
    texentry = struct.pack('<II', 3 << 26, 0)
    texdict = dictionary_many([(b'tex', texentry), (b'alt', texentry)])
    paldict = dictionary(b'pal', bytes(4))
    block = bytearray(0x3c) + texdict + paldict
    tex_at = len(block)
    block += bytes(32)
    pal_at = len(block)
    block += bytes(32)
    block[:4] = b'TEX0'
    struct.pack_into('<I', block, 4, len(block))
    struct.pack_into('<HH', block, 0x0c, 4, 0x3c)
    struct.pack_into('<I', block, 0x14, tex_at)
    struct.pack_into('<I', block, 0x34, 0x3c + len(texdict))
    struct.pack_into('<H', block, 0x30, 4)
    struct.pack_into('<I', block, 0x38, pal_at)
    return model_resource, container(b'BTX0', [block])


def fixture_2d():
    def ntr(magic, block):
        return magic + struct.pack('<HHIHH', 0xfeff, 0x100, 16 + len(block), 16, 1) + block
    char = bytearray(b'RAHC' + bytes(28)) + bytes([0x21] * 32)
    struct.pack_into('<IHHI', char, 4, len(char), 1, 1, 3)
    struct.pack_into('<II', char, 24, 32, 24)
    scr = bytearray(b'NRCS' + bytes(16)) + bytes(2)
    struct.pack_into('<IHH', scr, 4, len(scr), 8, 8)
    struct.pack_into('<I', scr, 16, 2)
    pal = bytearray(b'TTLP' + bytes(20)) + bytes(32)
    struct.pack_into('<II', pal, 4, len(pal), 3)
    struct.pack_into('<II', pal, 16, 32, 16)
    return ntr(b'RGCN', char), ntr(b'RCSN', scr), ntr(b'RLCN', pal)


class NitroTextureTest(unittest.TestCase):
    def test_names_and_incomplete(self):
        report = module.validate(fixture())
        self.assertEqual(report['status'], 'INCOMPLETE')
        self.assertEqual(report['textures'], ['tex'])
        self.assertEqual(report['palettes'], ['pal'])

    def test_cli_json_exit_and_read_only(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'fixture.btx0'
            data = fixture()
            path.write_bytes(data)
            result = subprocess.run([sys.executable, str(TOOL), '--json', str(path)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(json.loads(result.stdout)['status'], 'INCOMPLETE')
            self.assertEqual(path.read_bytes(), data)

    def test_dictionary_size_and_entry_lengths(self):
        for offset, value in ((20 + 0x3c + 2, 0), (20 + 0x3c + 6, 0),
                              (20 + 0x3c + 16, 4), (20 + 0x3c + 18, 0)):
            data = bytearray(fixture())
            struct.pack_into('<H', data, offset, value)
            with self.subTest(offset=offset):
                with self.assertRaises(ValueError):
                    module.validate(data)

    def test_btx_zero_or_duplicate_tex_is_invalid(self):
        chunk = fixture()[20:]
        for data in (container(b'BTX0', [b'JUNK' + struct.pack('<I', 8)]),
                     container(b'BTX0', [chunk, chunk])):
            with self.subTest(size=len(data)):
                with self.assertRaisesRegex(ValueError, 'block count') as caught:
                    module.validate(data)
                self.assertNotIsInstance(caught.exception, module.Unsupported)

    def test_missing_required_animation_and_model_blocks_fail(self):
        junk = b'JUNK' + struct.pack('<I', 8)
        for data, call in ((container(b'BTP0', [junk]), module.pattern_names),
                           (container(b'BMD0', [fixture()[20:]]), module.material_names)):
            with self.subTest(magic=data[:4]):
                with self.assertRaisesRegex(ValueError, 'block count') as caught:
                    call(data)
                self.assertNotIsInstance(caught.exception, module.Unsupported)
        with self.assertRaisesRegex(ValueError, 'MDL0 block count') as caught:
            module.validate(container(b'BMD0', [junk]))
        self.assertNotIsInstance(caught.exception, module.Unsupported)
        source = model()
        start = struct.unpack_from('<I', source, 16)[0]
        size = struct.unpack_from('<I', source, start + 4)[0]
        with self.assertRaises(module.Unsupported):
            module.validate(container(b'BMD0', [source[start:start + size]]))

    def test_dictionary_node_references_and_empty(self):
        empty = struct.pack('<BBHHHIHH', 0, 0, 16, 8, 12, 0x7f, 4, 4)
        self.assertEqual(module.Reader(empty).dictionary(0, 4), [])
        for relative, value, message in ((8 + 1, 2, 'root'), (12, 128, 'node'),
                                          (12 + 1, 2, 'node'), (12 + 2, 2, 'node'),
                                          (12 + 3, 1, 'node')):
            data = bytearray(fixture())
            data[20 + 0x3c + relative] = value
            with self.subTest(relative=relative), self.assertRaisesRegex(ValueError, message):
                module.validate(data)
        # Backreferences and shared child nodes are not automatically rejected.
        data = bytearray(fixture())
        data[20 + 0x3c + 12 + 1] = 1
        data[20 + 0x3c + 12 + 2] = 1
        self.assertEqual(module.validate(data)['status'], 'INCOMPLETE')

    def test_invalid_dictionary_offset(self):
        data = bytearray(fixture())
        struct.pack_into('<I', data, 20 + 0x34, len(data))
        with self.assertRaises(ValueError):
            module.validate(data)

    def test_truncated_block(self):
        data = bytearray(fixture())
        struct.pack_into('<I', data, 24, len(data))
        with self.assertRaises(ValueError):
            module.validate(data)

    def test_texture_payload_out_of_bounds(self):
        data = bytearray(fixture())
        struct.pack_into('<H', data, 20 + 0x0c, 1)
        with self.assertRaisesRegex(ValueError, 'texture payload'):
            module.validate(data)

    def test_compressed_two_stream_bounds(self):
        data = compressed_fixture()
        self.assertEqual(module.validate(data)['status'], 'INCOMPLETE')
        damaged = bytearray(data)
        struct.pack_into('<H', damaged, 20 + 0x1c, 1)
        with self.assertRaisesRegex(ValueError, 'texture payload'):
            module.validate(damaged)
        damaged = bytearray(data)
        struct.pack_into('<I', damaged, 20 + 0x28, len(data) - 20 - 6)
        with self.assertRaises(ValueError):
            module.validate(damaged)

    def test_compressed_selected_pair_palette_reads(self):
        data = compressed_fixture()
        report = module.validate(data, selected_pair=('tex', 'pal'))
        self.assertIn('4x4 selected-pair palette-buffer reads (4 blocks)', report['checked'])
        self.assertEqual(report['selected_pair'], {'texture': 'tex', 'palette': 'pal'})
        damaged = bytearray(data)
        aux = 20 + struct.unpack_from('<I', damaged, 20 + 0x28)[0]
        struct.pack_into('<H', damaged, aux, 0x3fff)
        with self.assertRaisesRegex(ValueError, '4x4 palette read'):
            module.validate(damaged, selected_pair=('tex', 'pal'))
        # A transparent-only block has no palette access, even with a large base.
        pixels = 20 + struct.unpack_from('<I', damaged, 20 + 0x24)[0]
        damaged[pixels:pixels + 4] = bytes([0xff] * 4)
        module.validate(damaged, selected_pair=('tex', 'pal'))

    def test_compressed_pair_cli_requires_both_names(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'fixture.btx0'
            path.write_bytes(compressed_fixture())
            result = subprocess.run([sys.executable, str(TOOL), str(path), '--texture-name', 'tex'], capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('must be supplied together', result.stderr)
            result = subprocess.run([sys.executable, str(TOOL), str(path), '--texture-name', 'tex', '--palette-name', 'pal', '--json'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertIn('4x4 selected-pair palette-buffer reads (4 blocks)', json.loads(result.stdout)['checked'])

    def test_animation_name_match_and_missing(self):
        self.assertIn('pattern animation names exist in supplied TEX0', module.validate(fixture(), pattern())['checked'])
        with self.assertRaisesRegex(ValueError, 'animation names absent'):
            module.validate(fixture(), pattern(texture=b'missing'))

    def test_pattern_keyframe_bounds_and_order(self):
        for field, value, message in ((20 + 48 + 56 + 2, 1, 'index out of bounds'),
                                      (20 + 48 + 56 + 3, 1, 'index out of bounds')):
            data = bytearray(pattern())
            data[field] = value
            with self.subTest(field=field), self.assertRaisesRegex(ValueError, message):
                module.validate(fixture(), bytes(data))
        data = bytearray(pattern())
        struct.pack_into('<H', data, 20 + 48 + 56, 9)
        with self.assertRaisesRegex(ValueError, 'out of order'):
            module.validate(fixture(), bytes(data))
        data = bytearray(pattern())
        struct.pack_into('<H', data, 20 + 48 + 56 + 4, 16)
        self.assertTrue(module.validate(fixture(), bytes(data))['unsupported'])

    def test_pattern_tracks_against_model_names(self):
        result = module.validate(model(), pattern())
        self.assertIn('PAT0 track names present in supplied model set', result['checked'])
        mismatch = module.validate(model(), pattern(track_name=b'other'))
        self.assertEqual(mismatch['status'], 'INCOMPLETE')
        self.assertNotIn('PAT0 track names present in supplied model set', mismatch['checked'])
        self.assertTrue(any('track names absent' in item for item in mismatch['unsupported']))

    def test_material_references_match_and_missing(self):
        self.assertIn('material names exist in supplied TEX0', module.validate(model())['checked'])
        with self.assertRaisesRegex(ValueError, 'material references absent'):
            module.validate(model(texture=b'missing'))

    def test_material_binding_index_out_of_bounds(self):
        report = module.validate(model())
        self.assertIn('material binding indices within model dictionary', report['checked'])
        with self.assertRaisesRegex(ValueError, 'material binding index out of bounds'):
            module.validate(model(material_index=1))

    def test_model_local_bounds_and_alias(self):
        original = model()
        mdl_pos = struct.unpack_from('<I', original, 16)[0]
        model_pos = mdl_pos + 48
        model_size = struct.unpack_from('<I', original, model_pos)[0]
        unit = original[model_pos:model_pos + model_size]
        count = 3
        dict_size = 12 + 4 * count + 4 + 4 * count + 16 * count
        first = 8 + dict_size
        offsets = (first, first + len(unit), first)
        d = (struct.pack('<BBHHHI', 0, count, dict_size, 8, 12 + 4 * count, 0x17f)
             + bytes(4 * count) + struct.pack('<HH', 4, 4 + 4 * count)
             + struct.pack('<3I', *offsets)
             + b'one'.ljust(16, b'\0') + b'two'.ljust(16, b'\0') + b'alias'.ljust(16, b'\0'))
        mdl = bytearray(b'MDL0' + bytes(4) + d + unit + unit)
        struct.pack_into('<I', mdl, 4, len(mdl))
        data = container(b'BMD0', [mdl, fixture()[20:]])
        self.assertIn('material bindings bounded by declared model size', module.validate(data)['checked'])
        for field, value in ((8, len(unit) + 12), (0, 12)):
            damaged = bytearray(mdl)
            struct.pack_into('<I', damaged, first + field, value)
            with self.subTest(field=field), self.assertRaises(ValueError):
                module.validate(container(b'BMD0', [damaged, fixture()[20:]]))

    def test_static_material_pairs_formats_and_palette_bounds(self):
        for fmt in (1, 2, 3, 4, 6, 7):
            data = texture_variant(fmt)
            report = module.validate(model(palette=None if fmt == 7 else b'pal'), external=data)
            self.assertEqual(report['material_pair_checks'][0]['status'], 'BUFFER_BOUNDS_CHECKED')
            self.assertEqual(report['material_pair_checks'][0]['format'], fmt)
        report = module.validate(model(), external=compressed_fixture())
        self.assertEqual(report['material_pair_checks'][0]['format'], 5)
        self.assertEqual(report['material_pair_checks'][0]['status'], 'BUFFER_BOUNDS_CHECKED')
        for fmt, byte in ((1, 31), (4, 255)):
            with self.subTest(fmt=fmt), self.assertRaisesRegex(ValueError, 'material palette read'):
                module.validate(model(), external=texture_variant(fmt, byte))
        for fmt in (3, 6):
            damaged = bytearray(texture_variant(fmt, 0xff))
            struct.pack_into('<H', damaged, 20 + 0x30, 1)
            with self.subTest(fmt=fmt), self.assertRaisesRegex(ValueError, 'material palette read'):
                module.validate(model(), external=bytes(damaged))
        damaged = bytearray(compressed_fixture())
        aux = 20 + struct.unpack_from('<I', damaged, 20 + 0x28)[0]
        struct.pack_into('<H', damaged, aux, 0x3fff)
        with self.assertRaisesRegex(ValueError, '4x4 palette read'):
            module.validate(model(), external=bytes(damaged))
        missing = module.validate(model(palette=None), external=texture_variant(3))
        self.assertEqual(missing['material_pair_checks'][0]['status'], 'INCOMPLETE')

    def test_ambiguous_material_bindings_and_texture_alias(self):
        model_data, textures = ambiguous_model_and_textures()
        report = module.validate(model_data, external=textures)
        self.assertEqual(report['status'], 'INCOMPLETE')
        pair = report['material_pair_checks'][0]
        self.assertEqual(pair['status'], 'INCOMPLETE')
        self.assertIn('ambiguous', pair['reason'])
        self.assertIn('static material buffer bounds (0 of 1 materials)', report['checked'])
        alias = module.validate(model(texture=b'alt'), external=textures)
        self.assertEqual(alias['material_pair_checks'][0]['status'], 'BUFFER_BOUNDS_CHECKED')

    def test_external_texture_set(self):
        model_data = model()
        first = struct.unpack_from('<I', model_data, 16)[0]
        size = struct.unpack_from('<I', model_data, first + 4)[0]
        no_textures = container(b'BMD0', [model_data[first:first + size]])
        report = module.validate(no_textures, external=fixture())
        self.assertIsNotNone(report['texture_set_sha256'])
        self.assertIn('material names exist in supplied TEX0', report['checked'])
        with self.assertRaisesRegex(ValueError, 'material references absent'):
            module.validate(no_textures, external=fixture().replace(b'tex' + bytes(13), b'bad' + bytes(13)))

    def test_2d_tile_palette_checks(self):
        chars, screen, palette = fixture_2d()
        result = module.validate_2d(chars, screen, palette)
        self.assertEqual(result['status'], 'INCOMPLETE')
        damaged = bytearray(screen)
        struct.pack_into('<H', damaged, 36, 1)
        with self.assertRaisesRegex(ValueError, 'tile outside'):
            module.validate_2d(chars, bytes(damaged), palette)
        struct.pack_into('<H', damaged, 36, 0x1000)
        with self.assertRaisesRegex(ValueError, 'palette access'):
            module.validate_2d(chars, bytes(damaged), palette)
        damaged = bytearray(chars)
        struct.pack_into('<I', damaged, 16 + 12, 4)
        with self.assertRaises(module.Unsupported):
            module.validate_2d(bytes(damaged), screen, palette)

    def test_2d_palette_header_variants(self):
        chars, screen, palette = fixture_2d()
        self.assertEqual(module.validate_2d(chars, screen, palette)['status'], 'INCOMPLETE')
        for offset, value, message in ((16 + 20, 0, 'overlaps header'),
                                       (16 + 8, 0xffffffff, 'palette format'),
                                       (16 + 12, 2, 'extended flag')):
            damaged = bytearray(palette)
            struct.pack_into('<I', damaged, offset, value)
            with self.subTest(offset=offset), self.assertRaisesRegex(ValueError, message) as caught:
                module.validate_2d(chars, screen, bytes(damaged))
            self.assertNotIsInstance(caught.exception, module.Unsupported)
        for offset, value, message in ((16 + 12, 1, 'extended'),
                                       (16 + 16, 480, 'inverted')):
            damaged = bytearray(palette)
            struct.pack_into('<I', damaged, offset, value)
            with self.subTest(offset=offset), self.assertRaisesRegex(module.Unsupported, message):
                module.validate_2d(chars, screen, bytes(damaged))
        # Standard 8bpp NCLR can contain banks used by this 4bpp screen profile.
        valid = bytearray(palette)
        struct.pack_into('<I', valid, 16 + 8, 4)
        self.assertEqual(module.validate_2d(chars, screen, bytes(valid))['status'], 'INCOMPLETE')

    def test_2d_cli_read_only_json(self):
        data = fixture_2d()
        with tempfile.TemporaryDirectory() as tmp:
            files = [Path(tmp) / name for name in ('chars', 'screen', 'palette')]
            for path, content in zip(files, data):
                path.write_bytes(content)
            result = subprocess.run([sys.executable, str(TOOL), str(files[0]), '--screen', str(files[1]), '--palette', str(files[2]), '--json'], capture_output=True, text=True)
            self.assertEqual(result.returncode, 2)
            self.assertEqual(json.loads(result.stdout)['status'], 'INCOMPLETE')
            self.assertEqual([path.read_bytes() for path in files], list(data))

    def test_recognized_truncated_is_invalid(self):
        with self.assertRaisesRegex(ValueError, 'truncated graphics'):
            module.validate(b'BTX0' + bytes(4))

    def test_unsupported_magic(self):
        with self.assertRaises(module.Unsupported):
            module.validate(b'unknown' + bytes(20))
