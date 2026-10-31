import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, readFileSync, symlinkSync, linkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
const manifest = JSON.parse(await readFile(new URL('../../web/data/patch-manifest-alpha2.json', import.meta.url)));
const sidecarBytes = await readFile(new URL('../../docs/tmhm-compatibility.json', import.meta.url));
const compatibilityReport = JSON.parse(sidecarBytes);
const require = createRequire(import.meta.url);
const { extractMachineCompatibility, writeNewFile } = require('../../tools/extract_tmhm_compatibility.cjs');

test('TM/HM rows resolve to Alpha 2 item and move records', () => {
  assert.equal(data.target_sha256, manifest.target.sha256);
  assert.equal(data.tmhm.length, 100);

  for (const [index, machine] of data.tmhm.entries()) {
    const kind = index < 92 ? 'tm' : 'hm';
    const number = index < 92 ? index + 1 : index - 91;
    const itemId = 328 + index;
    const prefix = kind === 'tm' ? ['TM', 'MT'] : ['HM', 'MO'];
    const item = data.items[itemId];

    assert.deepEqual(
      { item_id: machine.item_id, kind: machine.kind, number: machine.number },
      { item_id: itemId, kind, number },
    );
    assert.ok(item, `machine item ${itemId}`);
    assert.equal(item.move_id, machine.move_id, `machine move ${kind}${number}`);
    assert.ok(data.moves[machine.move_id], `machine move record ${machine.move_id}`);
    assert.deepEqual(item.name, {
      en: `${prefix[0]}${String(number).padStart(2, '0')}`,
      es: `${prefix[1]}${String(number).padStart(2, '0')}`,
    });
  }
});

test('species compatibility is pinned to verified matching target data', () => {
  assert.equal(createHash('sha256').update(sidecarBytes).digest('hex'), 'fea58ae4ab0f66bdbe435e6dd3a60a31cc0dbbaad14898dc3a674573bb298701');
  assert.equal(data.tmhm_compatibility.target_sha256, data.target_sha256);
  assert.equal(compatibilityReport.comparison.personal_narc_equal, true);
  assert.equal(compatibilityReport.comparison.machine_move_ids_equal, true);
  assert.equal(compatibilityReport.comparison.compatibility_equal, true);
  const alpha2 = compatibilityReport.targets.alpha2;
  const candidate = compatibilityReport.targets['kris-sprint2'];
  assert.deepEqual(alpha2.by_species, candidate.by_species);
  assert.deepEqual(data.tmhm_compatibility.by_species, alpha2.by_species);

  const itemIds = new Set(data.tmhm.map(({ item_id }) => item_id));
  assert.deepEqual(Object.keys(data.tmhm_compatibility.by_species), Array.from({ length: 493 }, (_, i) => String(i + 1)));
  for (const compatible of Object.values(data.tmhm_compatibility.by_species)) {
    assert.deepEqual(compatible, [...new Set(compatible)].sort((a, b) => a - b));
    assert.ok(compatible.every((itemId) => itemIds.has(itemId)));
  }
  assert.ok(data.tmhm_compatibility.by_species['1'].includes(333));
});

test('personal-record bitfields map first and last machine flags in LSB0 order', () => {
  const records = Array.from({ length: 508 }, () => Buffer.alloc(44));
  records[1][28] = 0x01;
  records[1][40] = 0x08;
  const machines = Array.from({ length: 100 }, (_, index) => ({
    item_id: 328 + index,
    kind: index < 92 ? 'tm' : 'hm',
    number: index < 92 ? index + 1 : index - 91,
  }));
  const result = extractMachineCompatibility(records, machines, 'target-hash');
  assert.deepEqual(result.by_species['1'], [328, 427]);
  assert.equal(Object.keys(result.by_species).length, 493);
  records[1][40] = 0x88;
  assert.throws(() => extractMachineCompatibility(records, machines, 'target-hash'), /Reserved TM\/HM bits/);
});

test('extractor never overwrites an existing source or links to it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tmhm-output-test-'));
  try {
    const source = join(dir, 'source.nds');
    const symlink = join(dir, 'source-symlink');
    const hardlink = join(dir, 'source-hardlink');
    writeFileSync(source, 'original fixture');
    symlinkSync(source, symlink);
    linkSync(source, hardlink);
    for (const target of [source, symlink, hardlink]) assert.throws(() => writeNewFile(target, 'derived data'), { code: 'EEXIST' });
    assert.equal(readFileSync(source, 'utf8'), 'original fixture');
    const output = join(dir, 'compatibility.json');
    writeNewFile(output, 'derived data');
    assert.equal(readFileSync(output, 'utf8'), 'derived data');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
