#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const crypto = require('node:crypto');
const { narcRecords } = require('./extract_tmhm_compatibility.cjs');
function validate(data) {
  const fail = (message) => { throw new Error(message); };
  if (data.length < 16 || data.toString('ascii', 0, 4) !== 'NARC') fail('Invalid or truncated NARC header');
  if (data.readUInt16LE(4) !== 0xfeff || data.readUInt16LE(12) !== 16 || data.readUInt16LE(14) !== 3) fail('Unsupported byte order or header layout');
  if (data.readUInt32LE(8) !== data.length) fail('Declared file size differs from input');
  let pos = 16;
  const sections = [];
  for (const magic of ['BTAF', 'BTNF', 'GMIF']) {
    if (pos + 8 > data.length || data.toString('ascii', pos, pos + 4) !== magic) fail(`Missing or truncated ${magic}`);
    const length = data.readUInt32LE(pos + 4);
    if (length < 8 || pos + length > data.length) fail(`Invalid ${magic} size`);
    sections.push({ pos, length }); pos += length;
  }
  if (pos !== data.length) fail('Trailing bytes after GMIF');
  const [fat, , image] = sections;
  if (fat.length < 12) fail('Truncated BTAF');
  const count = data.readUInt16LE(fat.pos + 8);
  if (12 + count * 8 > fat.length) fail('Allocation table exceeds BTAF');
  let previousEnd = 0;
  for (let i = 0; i < count; i++) {
    const entry = fat.pos + 12 + 8 * i;
    const start = data.readUInt32LE(entry), end = data.readUInt32LE(entry + 4);
    if (start > end || end > image.length - 8 || start < previousEnd) fail(`Invalid or overlapping member ${i}`);
    previousEnd = end;
  }
  const records = narcRecords(data);
  return { status: 'INCOMPLETE', sha256: crypto.createHash('sha256').update(data).digest('hex'), bytes: data.length,
    members: records.length, checked: ['NARC header and size', 'section boundaries', 'allocation bounds and overlap'],
    not_checked: ['file names', 'member content', 'model, texture, palette and animation references', 'hardware behavior'] };
}
function main() {
  const args = process.argv.slice(2), json = args.includes('--json');
  const paths = args.filter((arg) => arg !== '--json');
  if (paths.length !== 1 || paths[0].startsWith('--')) throw new Error('Usage: node tools/validate_narc.cjs [--json] ARCHIVE.narc');
  const result = validate(fs.readFileSync(paths[0]));
  console.log(json ? JSON.stringify(result, null, 2) : `INCOMPLETE: ${result.members} members; ${result.bytes} bytes; SHA-256 ${result.sha256}\nUnchecked: ${result.not_checked.join('; ')}`);
  process.exitCode = 2;
}
if (require.main === module) {
  try { main(); } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(process.argv.includes('--json') ? JSON.stringify({ status: 'FAIL', error: message }) : `FAIL: ${message}`);
    process.exitCode = 1;
  }
}
module.exports = { validate };
