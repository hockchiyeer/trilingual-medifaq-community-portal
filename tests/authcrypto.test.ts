import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, isPasswordHash, passwordFingerprint, signSession, verifySession } from '../src/authCrypto.ts';

const run = async () => {
  // Hashing: salted, never the plaintext, verifies only the right password
  const h1 = await hashPassword('correct horse');
  const h2 = await hashPassword('correct horse');
  assert.ok(isPasswordHash(h1));
  assert.notEqual(h1, h2, 'each hash must use its own salt');
  assert.ok(!h1.includes('correct horse'));
  assert.deepEqual(await verifyPassword(h1, 'correct horse'), { ok: true, legacy: false });
  assert.deepEqual(await verifyPassword(h1, 'wrong'), { ok: false, legacy: false });
  assert.deepEqual(await verifyPassword('scrypt1$broken', 'x'), { ok: false, legacy: false });
  assert.deepEqual(await verifyPassword('', 'x'), { ok: false, legacy: false });
  assert.deepEqual(await verifyPassword(null, 'x'), { ok: false, legacy: false });

  // Legacy plaintext rows still verify, and are flagged for migration
  assert.deepEqual(await verifyPassword('admin', 'admin'), { ok: true, legacy: true });
  assert.deepEqual(await verifyPassword('admin', 'Admin'), { ok: false, legacy: true });

  // Sessions
  const secret = 'unit-test-secret-0123456789';
  const ver = passwordFingerprint(h1);
  const now = Date.UTC(2026, 0, 1);
  const tok = signSession(secret, 'alice', ver, 60, now);
  assert.equal(verifySession(secret, tok, now + 1000)?.sub, 'alice');
  assert.equal(verifySession(secret, tok, now + 1000)?.ver, ver);
  assert.equal(verifySession(secret, tok, now + 61_000), null, 'expired token must be rejected');
  assert.equal(verifySession('another-secret-0123456789', tok, now + 1000), null, 'wrong secret must be rejected');
  const [body, sig] = tok.split('.');
  const forged = Buffer.from(JSON.stringify({ sub: 'admin', ver, iat: 0, exp: 9999999999 })).toString('base64url');
  assert.equal(verifySession(secret, `${forged}.${sig}`, now), null, 'edited payload must be rejected');
  assert.equal(verifySession(secret, `${body}.`, now), null);
  for (const bad of ['', 'abc', 'a.b.c', undefined, null, 42]) assert.equal(verifySession(secret, bad as any, now), null);

  // Fingerprint changes when the stored password changes (this is what signs old sessions out)
  assert.notEqual(passwordFingerprint(h1), passwordFingerprint(h2));

  console.log('authcrypto.test.ts: all assertions passed');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
