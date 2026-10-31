import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { memberForMode } from '../src/data/team.ts';

test('all current encyclopedia and trainer references resolve without altering mode data', async () => {
  const data = JSON.parse(await readFile(new URL('../../web/data/wiki-data.json', import.meta.url)));
  const species = new Set(data.species.map((entry) => entry.id));
  assert.equal(species.size, 493);
  assert.equal(species.size, data.species.length);
  const trainers = new Set(data.trainers.map((entry) => entry.id));
  assert.equal(trainers.size, data.trainers.length);
  for (const entry of data.species) {
    for (const ability of entry.abilities) assert.ok(data.abilities[ability], `species ${entry.id}: ability ${ability}`);
    for (const move of entry.learnset) assert.ok(data.moves[move.move_id], `species ${entry.id}: move ${move.move_id}`);
    for (const evolution of entry.evolutions) assert.ok(species.has(evolution.target), `species ${entry.id}: evolution ${evolution.target}`);
  }
  for (const trainer of data.trainers) {
    for (const member of trainer.members) {
      assert.ok(species.has(member.species_id), `trainer ${trainer.id}: species ${member.species_id}`);
      if (member.item_id) assert.ok(data.items[member.item_id], `trainer ${trainer.id}: item ${member.item_id}`);
      for (const mode of ['normal', 'plus']) {
        const resolved = memberForMode(member, mode);
        assert.equal(resolved.level, member.levels_by_mode[mode]);
        assert.deepEqual(resolved.moveIds, member.move_ids_by_mode[mode]);
        assert.deepEqual(resolved.ivs, member.ivs);
        assert.deepEqual(resolved.evs, member.evs);
        for (const move of resolved.moveIds) assert.ok(data.moves[move], `trainer ${trainer.id}: move ${move}`);
      }
    }
  }
  for (const machine of data.tmhm) {
    assert.ok(data.items[machine.item_id], `machine ${machine.kind} ${machine.number}: item`);
    assert.ok(data.moves[machine.move_id], `machine ${machine.kind} ${machine.number}: move`);
  }
});

test('all referenced species, trainer and item sprites are local PNG files', async () => {
  const web = new URL('../../web/', import.meta.url);
  const data = JSON.parse(await readFile(new URL('data/wiki-data.json', web)));
  const paths = new Set(data.species.map((entry) => `sprites/pokemon/${entry.id}.png`));
  for (const entry of data.trainers) if (entry.portrait?.src) {
    assert.match(entry.portrait.src, /^\.\.\/sprites\/trainers\/[a-z0-9._-]+\.png$/i);
    paths.add(entry.portrait.src.slice(3));
  }
  for (const entry of Object.values(data.items)) if (entry.sprite) {
    assert.match(entry.sprite, /^\.\.\/sprites\/items\/[a-z0-9._-]+\.png$/i);
    paths.add(entry.sprite.slice(3));
  }
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  for (const path of paths) {
    const bytes = await readFile(new URL(path, web));
    assert.ok(bytes.subarray(0, 8).equals(signature), `Invalid PNG: ${path}`);
  }
});
