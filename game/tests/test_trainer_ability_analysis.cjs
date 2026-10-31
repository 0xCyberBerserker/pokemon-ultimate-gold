const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { resolveForm, trainerAbility, trainerAbilityContext, writeOutputExclusive } = require('../tools/extract_trainer_abilities.cjs');

function personalRecord(genderRatio, ability1, ability2) {
  const record = Buffer.alloc(44);
  record[0x10] = genderRatio;
  record[0x16] = ability1;
  record[0x17] = ability2;
  return record;
}

test('resolves HGSS alternate-form personal record IDs', () => {
  assert.equal(resolveForm(386, 3), 498);
  assert.equal(resolveForm(413, 2), 500);
  assert.equal(resolveForm(487, 1), 501);
  assert.equal(resolveForm(492, 1), 502);
  assert.equal(resolveForm(479, 5), 507);
  assert.equal(resolveForm(127, 1), 127);
});

test('default PID low byte selects ability 1 and IVs scale uniformly', () => {
  const personal = [personalRecord(127, 65, 66)];
  const result = trainerAbility(128, 0, 0, 0, personal);
  assert.equal(result.ability_slot, 1);
  assert.equal(result.ability_id, 65);
  assert.deepEqual(result.ivs, [15, 15, 15, 15, 15, 15]);
  assert.deepEqual(result.evs, [0, 0, 0, 0, 0, 0]);
});

test('explicit ability overrides set PID parity and missing ability 2 falls back', () => {
  const personal = [personalRecord(127, 65, 66), personalRecord(127, 67, 0)];
  assert.equal(trainerAbility(0, 0x10, 0, 0, personal).ability_id, 65);
  const missingSecond = trainerAbility(0, 0x20, 1, 0, personal);
  assert.equal(missingSecond.ability_slot, 1);
  assert.equal(missingSecond.ability_id, 67);
});

test('missing ability 1 reports the species record without a reference error', () => {
  const personal = [personalRecord(127, 0, 66)];
  assert.throws(() => trainerAbility(0, 0, 0, 0, personal), /Personal record 0 has no standard ability 1/);
});

test('trainer ability errors retain trainer, slot, and offset without raw record bytes', () => {
  const error = trainerAbilityContext(new Error('invalid record'), 12, 3, 2, 36);
  assert.equal(error.message, 'Trainer 12 kind 3 slot 2 offset 36: invalid record');
  assert.doesNotMatch(error.message, /raw|[0-9a-f]{16,}/i);
});

test('gender override uses resolved form ratio while ability comes from base species', () => {
  const personal = [];
  personal[479] = personalRecord(127, 65, 66);
  personal[503] = personalRecord(2, 67, 68);
  const result = trainerAbility(0, 0x01, 479, 1, personal);
  assert.equal(result.ability_slot_source, 'species_gender_override_pid_low_bit');
  assert.equal(result.ability_slot, 1);
  assert.equal(result.ability_id, 65);
});

test('output refuses existing files and links without modifying their targets', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'trainer-ability-output-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const original = path.join(dir, 'original.json');
  const existing = path.join(dir, 'existing.json');
  const symbolic = path.join(dir, 'symbolic.json');
  const hard = path.join(dir, 'hard.json');
  fs.writeFileSync(original, 'original');
  fs.writeFileSync(existing, 'existing');
  fs.symlinkSync(original, symbolic);
  fs.linkSync(original, hard);
  for (const destination of [existing, symbolic, hard]) {
    assert.throws(() => writeOutputExclusive(destination, 'replacement'), { code: 'EEXIST' });
  }
  assert.equal(fs.readFileSync(existing, 'utf8'), 'existing');
  assert.equal(fs.readFileSync(original, 'utf8'), 'original');
});
