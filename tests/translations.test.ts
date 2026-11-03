import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { accessLevelKey, ADMIN_LEVEL } from '../src/accessLevels.ts';

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

// 3. Verify no translation contains empty or whitespace-only text
for (const key of enKeys) {
  assert.ok(T_DATA.EN[key]?.trim().length > 0, `Empty translation in EN for key: ${key}`);
  assert.ok(T_DATA.ZH[key]?.trim().length > 0, `Empty translation in ZH for key: ${key}`);
  assert.ok(T_DATA.BM[key]?.trim().length > 0, `Empty translation in BM for key: ${key}`);
}

// 4. Verify placeholder parity ({name}, {count}, {fields}, etc.) across languages
const getPlaceholders = (str: string): string[] =>
  [...str.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort();

for (const key of enKeys) {
  const enPh = getPlaceholders(T_DATA.EN[key]);
  const zhPh = getPlaceholders(T_DATA.ZH[key]);
  const bmPh = getPlaceholders(T_DATA.BM[key]);

  assert.deepEqual(zhPh, enPh, `Placeholder mismatch in ZH for key "${key}": expected ${JSON.stringify(enPh)}, got ${JSON.stringify(zhPh)}`);
  assert.deepEqual(bmPh, enPh, `Placeholder mismatch in BM for key "${key}": expected ${JSON.stringify(enPh)}, got ${JSON.stringify(bmPh)}`);
}

// 5. Scan src/App.tsx for all static, ternary, and dynamic menu t('...') invocations
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

// Dynamic menu items: { k: 'home', ... } passed to t(item.k)
const navItemRegex = /\bk:\s*['"]([a-zA-Z0-9_-]+)['"]/g;
while ((m = navItemRegex.exec(content)) !== null) {
  usedKeys.add(m[1]);
}

// Access level keys resolved via t(accessLevelKey(u))
const tierLevels = [
  { role: 'admin', adminLevel: ADMIN_LEVEL.ADMINISTRATOR },
  { role: 'moderator', adminLevel: ADMIN_LEVEL.MODERATOR },
  { role: 'user', adminLevel: ADMIN_LEVEL.NONE },
  null
];
for (const u of tierLevels) {
  usedKeys.add(accessLevelKey(u));
}

const missingUsedKeys = [...usedKeys].filter((k) => !enSet.has(k));
assert.deepEqual(missingUsedKeys, [], `Found t('...') calls referencing non-existent translation keys: ${missingUsedKeys.join(', ')}`);

console.log(`✓ Translation safeguard passed: ${enKeys.length} keys match perfectly across EN, ZH, and BM (non-empty & placeholder parity verified); ${usedKeys.size} static and dynamic keys validated.`);
