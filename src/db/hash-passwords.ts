import { eq } from 'drizzle-orm';
import { db } from './index.ts';
import { users } from './schema.ts';
import { hashPassword, isPasswordHash } from '../authCrypto.ts';

/**
 * One-off migration: re-saves every plaintext password as a scrypt hash.
 * (Accounts are also upgraded automatically on their next login; run this to cover dormant ones.)
 * Safe to run repeatedly - rows that are already hashed are skipped.
 */
async function main() {
  const rows = await db.select().from(users);
  let migrated = 0;
  for (const u of rows) {
    if (!u.password || isPasswordHash(u.password)) continue;
    await db.update(users).set({ password: await hashPassword(u.password) }).where(eq(users.username, u.username));
    migrated++;
  }
  console.log(`Hashed ${migrated} plaintext password(s); ${rows.length - migrated} already hashed or empty.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Password migration failed:', err);
  process.exit(1);
});
