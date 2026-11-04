import crypto from 'node:crypto';
import { promisify } from 'node:util';

/**
 * Server-side credential helpers (Node built-ins only, no extra dependencies).
 *  - Passwords are stored as   scrypt1$<salt>$<hash>   (random 16-byte salt per password).
 *  - Sessions are stateless signed tokens   <payload>.<hmac>   carrying the username, an expiry
 *    and a fingerprint of the stored password hash, so changing the password signs every other
 *    device out. The caller still re-reads the user row on each request, so role changes and
 *    account deletion take effect immediately.
 */

const scrypt = promisify(crypto.scrypt) as (
  password: crypto.BinaryLike,
  salt: crypto.BinaryLike,
  keylen: number,
  options: crypto.ScryptOptions
) => Promise<Buffer>;

const HASH_PREFIX = 'scrypt1';
const KEY_LENGTH = 64;
const SCRYPT_PARAMS: crypto.ScryptOptions = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export const MAX_PASSWORD_LENGTH = 256;
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

export const isPasswordHash = (stored: unknown): stored is string =>
  typeof stored === 'string' && stored.startsWith(`${HASH_PREFIX}$`);

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH, SCRYPT_PARAMS);
  return `${HASH_PREFIX}$${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest();

/**
 * `legacy: true` means the stored value was an old plaintext password that matched;
 * the caller should re-save it with hashPassword() (transparent migration on login).
 */
export async function verifyPassword(
  stored: string | null | undefined,
  supplied: string
): Promise<{ ok: boolean; legacy: boolean }> {
  if (!stored || typeof supplied !== 'string') return { ok: false, legacy: false };
  if (isPasswordHash(stored)) {
    const [, saltB64, hashB64] = stored.split('$');
    if (!saltB64 || !hashB64) return { ok: false, legacy: false };
    const expected = Buffer.from(hashB64, 'base64url');
    const derived = await scrypt(supplied, Buffer.from(saltB64, 'base64url'), expected.length, SCRYPT_PARAMS);
    return { ok: derived.length === expected.length && crypto.timingSafeEqual(derived, expected), legacy: false };
  }
  return { ok: crypto.timingSafeEqual(sha256(stored), sha256(supplied)), legacy: true };
}

/** Short value that changes whenever the stored password (hash) changes. */
export const passwordFingerprint = (stored: string | null | undefined): string =>
  sha256(stored || '').toString('hex').slice(0, 16);

export interface SessionPayload {
  sub: string;
  ver: string;
  iat: number;
  exp: number;
}

const hmac = (secret: string, body: string) => crypto.createHmac('sha256', secret).update(body).digest('base64url');

export function signSession(
  secret: string,
  username: string,
  fingerprint: string,
  ttlSeconds = SESSION_TTL_SECONDS,
  nowMs = Date.now()
): string {
  const iat = Math.floor(nowMs / 1000);
  const payload: SessionPayload = { sub: username, ver: fingerprint, iat, exp: iat + ttlSeconds };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmac(secret, body)}`;
}

export function verifySession(secret: string, token: unknown, nowMs = Date.now()): SessionPayload | null {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = Buffer.from(hmac(secret, body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.sub !== 'string' || typeof payload.ver !== 'string' || typeof payload.exp !== 'number') return null;
    if (payload.exp <= Math.floor(nowMs / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
