import assert from 'node:assert/strict';
import { LoginLimiter } from '../src/loginLimiter.ts';

const limits = { maxAttempts: 3, maxPerIp: 12, windowMs: 15 * 60_000, baseDelayMs: 30_000, maxDelayMs: 120_000 };
const t0 = Date.UTC(2026, 0, 1);
const fail = (l: LoginLimiter, ip: string, user: string, n: number, at = t0) => {
  for (let i = 0; i < n; i++) l.recordFailure(ip, user, at);
};

// Under the threshold nothing is blocked
let l = new LoginLimiter(limits);
fail(l, '1.1.1.1', 'admin', 2);
assert.deepEqual(l.check('1.1.1.1', 'admin', t0), { allowed: true });

// At the threshold: blocked with Retry-After = base delay, not a permanent lock
fail(l, '1.1.1.1', 'admin', 1);
assert.deepEqual(l.check('1.1.1.1', 'admin', t0), { allowed: false, retryAfterSec: 30 });
assert.deepEqual(l.check('1.1.1.1', 'admin', t0 + 29_000), { allowed: false, retryAfterSec: 1 });
assert.deepEqual(l.check('1.1.1.1', 'admin', t0 + 30_000), { allowed: true }, 'the block expires');

// Username matching ignores case and surrounding spaces
assert.equal(l.check('1.1.1.1', '  ADMIN ', t0).allowed, false);

// Progressive: every further failure after a block doubles the delay, capped at maxDelayMs
l.recordFailure('1.1.1.1', 'admin', t0 + 30_000); // 4th failure
assert.deepEqual(l.check('1.1.1.1', 'admin', t0 + 30_000), { allowed: false, retryAfterSec: 60 });
l.recordFailure('1.1.1.1', 'admin', t0 + 90_000); // 5th
assert.deepEqual(l.check('1.1.1.1', 'admin', t0 + 90_000), { allowed: false, retryAfterSec: 120 });
l.recordFailure('1.1.1.1', 'admin', t0 + 210_000); // 6th: would be 240s, capped
assert.deepEqual(l.check('1.1.1.1', 'admin', t0 + 210_000), { allowed: false, retryAfterSec: 120 });

// A third party cannot lock the real admin out: other IPs and other usernames are unaffected
assert.equal(l.check('2.2.2.2', 'admin', t0).allowed, true);
assert.equal(l.check('1.1.1.1', 'someone_else', t0).allowed, true);

// Success clears the (ip + username) counter
l = new LoginLimiter(limits);
fail(l, '1.1.1.1', 'admin', 2);
l.recordSuccess('1.1.1.1', 'admin');
fail(l, '1.1.1.1', 'admin', 2);
assert.equal(l.check('1.1.1.1', 'admin', t0).allowed, true, 'counter restarted after a successful login');

// Per-IP cap: spraying many usernames from one address is stopped, and a success cannot reset it
l = new LoginLimiter(limits);
for (let i = 0; i < 12; i++) l.recordFailure("9.9.9.9", `user${i}`, t0);
assert.equal(l.check('9.9.9.9', 'brand_new_user', t0).allowed, false, 'the whole address is slowed down');
assert.equal(l.check('8.8.8.8', 'brand_new_user', t0).allowed, true);
l.recordSuccess('9.9.9.9', 'attackers_own_account');
assert.equal(l.check('9.9.9.9', 'brand_new_user', t0).allowed, false, 'a success on the attacker\'s own account must not reset the IP counter');

// Quiet time forgets old failures
l = new LoginLimiter(limits);
fail(l, '1.1.1.1', 'admin', 2);
const later = t0 + 16 * 60_000;
l.recordFailure('1.1.1.1', 'admin', later);
assert.equal(l.check('1.1.1.1', 'admin', later).allowed, true, 'only 1 failure counts after the window expired');

// configure() / reset()
l = new LoginLimiter(limits);
l.configure({ maxAttempts: 1 });
l.recordFailure('1.1.1.1', 'a', t0);
assert.equal(l.check('1.1.1.1', 'a', t0).allowed, false);
l.reset();
assert.equal(l.check('1.1.1.1', 'a', t0).allowed, true);

console.log('loginlimiter.test.ts: all assertions passed');
