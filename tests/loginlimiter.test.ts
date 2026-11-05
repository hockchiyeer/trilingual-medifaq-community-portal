import assert from 'node:assert/strict';
import { LoginLimiter, ipBucketKey } from '../src/loginLimiter.ts';

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

// IPv6: every address inside one /64 shares a bucket
assert.equal(ipBucketKey('203.0.113.7'), '203.0.113.7', 'IPv4 is unchanged');
assert.equal(ipBucketKey('::ffff:203.0.113.7'), '203.0.113.7', 'IPv4-mapped IPv6 counts as IPv4');
assert.equal(ipBucketKey('2001:db8:1:2::1'), '2001:db8:1:2::/64');
assert.equal(ipBucketKey('2001:0DB8:0001:0002:abcd:ef01:2345:6789'), '2001:db8:1:2::/64');
assert.equal(ipBucketKey('2001:db8:1:2:ffff:ffff:ffff:ffff'), ipBucketKey('2001:db8:1:2::1'));
assert.equal(ipBucketKey('fe80::1%eth0'), 'fe80:0:0:0::/64', 'zone ids are ignored');
assert.equal(ipBucketKey('::1'), '0:0:0:0::/64');
assert.equal(ipBucketKey('2001:db8::'), '2001:db8:0:0::/64');
assert.equal(ipBucketKey('64:ff9b::1.2.3.4'), '64:ff9b:0:0::/64');
assert.notEqual(ipBucketKey('2001:db8:1:2::1'), ipBucketKey('2001:db8:1:3::1'), 'a different /64 is a different client');
assert.equal(ipBucketKey('not-an-ip'), 'not-an-ip', 'unparseable values pass through');
assert.equal(ipBucketKey(undefined as any), '');

// Rotating inside one /64 cannot dodge either bucket
l = new LoginLimiter(limits);
for (let i = 0; i < 3; i++) l.recordFailure(`2001:db8:1:2::${i + 1}`, 'admin', t0);
assert.equal(l.check('2001:db8:1:2:dead:beef:0:99', 'admin', t0).allowed, false, 'same /64, same account: still blocked');
assert.equal(l.check('2001:db8:1:9::1', 'admin', t0).allowed, true, 'a different /64 is unaffected');
l = new LoginLimiter(limits);
for (let i = 0; i < 12; i++) l.recordFailure(`2001:db8:1:2:0:0:0:${i + 1}`, `user${i}`, t0);
assert.equal(l.check('2001:db8:1:2:aaaa::1', 'fresh_name', t0).allowed, false, 'per-IP cap applies across the whole /64');
// the same client over IPv4 and IPv4-mapped IPv6 is one client
l = new LoginLimiter(limits);
fail(l, '203.0.113.7', 'admin', 3);
assert.equal(l.check('::ffff:203.0.113.7', 'admin', t0).allowed, false);

console.log('loginlimiter.test.ts: all assertions passed');
