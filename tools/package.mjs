// Package the skill for upload to Claude chat:  node tools/package.mjs  ->  dist/learning-database.zip
// Writes a standard zip (deflate) with no dependencies. The archive contains one top-level folder, learning-database/.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, '.claude/skills/learning-database');
const out = path.join(root, 'dist/learning-database.zip');

const table = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

function walk(dir, rel = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((e) => {
    const r = rel ? rel + '/' + e.name : e.name;
    return e.isDirectory() ? walk(path.join(dir, e.name), r) : [r];
  });
}

const DATE = ((2026 - 1980) << 9) | (1 << 5) | 1, TIME = 0;      // fixed timestamp so the zip is reproducible
const parts = [], central = [];
let offset = 0;
for (const rel of walk(src)) {
  const data = fs.readFileSync(path.join(src, rel));
  const comp = zlib.deflateRawSync(data, { level: 9 });
  const name = Buffer.from('learning-database/' + rel, 'utf8');
  const crc = crc32(data);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
  local.writeUInt16LE(TIME, 10); local.writeUInt16LE(DATE, 12); local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(comp.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(name.length, 26); local.writeUInt16LE(0, 28);
  const cd = Buffer.alloc(46);
  cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6); cd.writeUInt16LE(0x0800, 8); cd.writeUInt16LE(8, 10);
  cd.writeUInt16LE(TIME, 12); cd.writeUInt16LE(DATE, 14); cd.writeUInt32LE(crc, 16);
  cd.writeUInt32LE(comp.length, 20); cd.writeUInt32LE(data.length, 24); cd.writeUInt16LE(name.length, 28);
  cd.writeUInt32LE(offset, 42);
  parts.push(local, name, comp); central.push(cd, name);
  offset += local.length + name.length + comp.length;
}
const cdBuf = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(central.length / 2, 8); end.writeUInt16LE(central.length / 2, 10);
end.writeUInt32LE(cdBuf.length, 12); end.writeUInt32LE(offset, 16);

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.concat([...parts, cdBuf, end]));
console.log(`Wrote ${out}: ${central.length / 2} files, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
