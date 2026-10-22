"""Check malformed fixed-shop lists and observed native stock invariants."""
import importlib.util
from pathlib import Path
import struct
import unittest

spec = importlib.util.spec_from_file_location("shops", Path(__file__).resolve().parents[1] / "tools/build_shop_locations.py")
shops = importlib.util.module_from_spec(spec)
spec.loader.exec_module(shops)


class ShopDataTests(unittest.TestCase):
    def test_pointer_and_terminator_must_be_valid(self):
        data = struct.pack("<4H", 82, 83, 84, 0xFFFF)
        self.assertEqual(shops.inventory(data, 0x02000000), [82, 83, 84])
        for pointer in (0x01FFFFFF, 0x02000001, 0x02000008):
            with self.assertRaises(ValueError):
                shops.inventory(data, pointer)
        with self.assertRaises(ValueError):
            shops.inventory(struct.pack("<2H", 82, 83), 0x02000000)
        with self.assertRaises(ValueError):
            shops.inventory(struct.pack("<3H", 82, 82, 0xFFFF), 0x02000000)

    def test_goldenrod_floor_is_preserved_in_both_languages(self):
        label = shops.map_label("MAP_GOLDENROD_DEPARTMENT_STORE_2F")
        self.assertEqual(label["en"], "Goldenrod Department Store 2F")
        self.assertEqual(label["es"], "Centro Comercial de Ciudad Trigal 2F")

    def test_relocated_autoload_stock_is_read_by_ram_address(self):
        data = bytearray(0xC14)
        struct.pack_into("<9I", data, 0xBA0, 0x02000C08, 0x02000C14,
                         0x02000C00, 0, 0, 0, 0, 0xDEC00621, 0x2106C0DE)
        struct.pack_into("<4H", data, 0xC00, 82, 83, 84, 0xFFFF)
        struct.pack_into("<3I", data, 0xC08, 0x023D7C00, 8, 0)
        reader = shops.mapped_reader(data)
        self.assertEqual(shops.inventory(data, 0x023D7C00, reader), [82, 83, 84])
        with self.assertRaises(ValueError):
            reader(0x023D7C08, 2)
        struct.pack_into("<I", data, 0xC08, 0x02000000)
        with self.assertRaises(ValueError):
            shops.mapped_reader(data)
