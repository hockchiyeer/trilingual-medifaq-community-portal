import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// 1. Read and parse T_DATA directly from src/App.tsx
const appPath = path.resolve('src/App.tsx');
const content = fs.readFileSync(appPath, 'utf8');

const match = content.match(/const T_DATA:\s*Translations\s*=\s*(\{[\s\S]*?\n\s*\};\n)/);
assert.ok(match, 'Failed to extract T_DATA from src/App.tsx');

const T_DATA = (new Function('return ' + match[1].trim().slice(0, -1)))();

assert.ok(T_DATA.EN, 'T_DATA.EN must be defined');
assert.ok(T_DATA.ZH, 'T_DATA.ZH must be defined');
assert.ok(T_DATA.BM, 'T_DATA.BM must be defined');

const enKeys = Object.keys(T_DATA.EN).sort();
const zhKeys = Object.keys(T_DATA.ZH).sort();
const bmKeys = Object.keys(T_DATA.BM).sort();

// 2. Verify complete key parity between EN, ZH, and BM
const missingInZh = enKeys.filter((k) => !(k in T_DATA.ZH));
const missingInBm = enKeys.filter((k) => !(k in T_DATA.BM));
const extraInZh = zhKeys.filter((k) => !(k in T_DATA.EN));
const extraInBm = bmKeys.filter((k) => !(k in T_DATA.EN));

assert.deepEqual(missingInZh, [], `Keys present in EN but missing in ZH: ${missingInZh.join(', ')}`);
assert.deepEqual(missingInBm, [], `Keys present in EN but missing in BM: ${missingInBm.join(', ')}`);
assert.deepEqual(extraInZh, [], `Keys present in ZH but missing in EN: ${extraInZh.join(', ')}`);
assert.deepEqual(extraInBm, [], `Keys present in BM but missing in EN: ${extraInBm.join(', ')}`);
assert.equal(enKeys.length, zhKeys.length, 'EN and ZH key counts must match');
assert.equal(enKeys.length, bmKeys.length, 'EN and BM key counts must match');

// 3. Scan src/App.tsx for all static and ternary t('...') invocations
const enSet = new Set(enKeys);
const usedKeys = new Set<string>();

// Direct calls: t('key') or t("key")
const tRegex = /\bt\(\s*['"]([a-zA-Z0-9_-]+)['"]\s*[\),]/g;
let m: RegExpExecArray | null;
while ((m = tRegex.exec(content)) !== null) {
  usedKeys.add(m[1]);
}

// Ternary calls: t(condition ? 'key1' : 'key2')
const ternaryRegex = /\bt\([^?]+\?\s*['"]([a-zA-Z0-9_-]+)['"]\s*:\s*['"]([a-zA-Z0-9_-]+)['"]\s*\)/g;
while ((m = ternaryRegex.exec(content)) !== null) {
  usedKeys.add(m[1]);
  usedKeys.add(m[2]);
}

const missingUsedKeys = [...usedKeys].filter((k) => !enSet.has(k));
assert.deepEqual(missingUsedKeys, [], `Found t('...') calls referencing non-existent translation keys: ${missingUsedKeys.join(', ')}`);

console.log(`✓ Translation safeguard passed: ${enKeys.length} keys match perfectly across EN, ZH, and BM; ${usedKeys.size} distinct t() calls verified.`);
