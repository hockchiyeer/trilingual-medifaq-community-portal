import { isIPv6 } from 'node:net';

/**
 * Brute-force brake for the login endpoint (in memory; per server process).
 *
 *  - Two counters: one per (client IP + username) and one per client IP overall.
 *    A third party therefore cannot lock the real administrator out by guessing wrong passwords
 *    from their own address, and a single address cannot spray many usernames either.
 *  - No hard lock-out: after `maxAttempts` failures the bucket is blocked for a delay that doubles
 *    with every further failure (baseDelayMs, 2x, 4x ... up to maxDelayMs). Callers answer 429 + Retry-After.
 *  - A successful login clears the (IP + username) counter only. The per-IP counter is left alone so a
 *    valid account of the attacker's own cannot be used to reset it.
 *  - Unknown usernames and wrong passwords must both call recordFailure() so the limiter cannot be
 *    used to tell which usernames exist.
 */
export interface LoginLimits {
  maxAttempts: number; // failures per (ip + username) before delays start
  maxPerIp: number; // failures per ip (any username) before delays start
  windowMs: number; // failures are forgotten after this much quiet time
  baseDelayMs: number;
  maxDelayMs: number;
}

export const DEFAULT_LOGIN_LIMITS: LoginLimits = {
  maxAttempts: 5,
  maxPerIp: 30,
  windowMs: 15 * 60_000,
  baseDelayMs: 30_000,
  maxDelayMs: 10 * 60_000,
};

interface Bucket {
  fails: number;
  lastFail: number;
  blockedUntil: number;
}

export type LimitDecision = { allowed: true } | { allowed: false; retryAfterSec: number };

const MAX_TRACKED = 5000;

/**
 * Key under which a client address is throttled. IPv4 addresses are used as they are. IPv6 clients usually
 * control a whole /64, so every address inside one /64 shares a bucket (otherwise rotating the low 64 bits
 * would give an attacker unlimited fresh buckets). IPv4-mapped addresses (::ffff:1.2.3.4) count as IPv4.
 */
export function ipBucketKey(ip: string): string {
  let a = String(ip ?? '').trim().toLowerCase();
  const zone = a.indexOf('%');
  if (zone !== -1) a = a.slice(0, zone);
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(a);
  if (mapped) return mapped[1];
  if (!isIPv6(a)) return a;

  // an embedded dotted quad (e.g. 64:ff9b::1.2.3.4) becomes two hextets
  const quad = /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(a);
  if (quad) {
    const [b1, b2, b3, b4] = quad.slice(1).map(Number);
    a = a.slice(0, quad.index) + `${((b1 << 8) | b2).toString(16)}:${((b3 << 8) | b4).toString(16)}`;
  }
  const [head, tail] = a.split('::');
  const left = head ? head.split(':') : [];
  const right = tail ? tail.split(':') : [];
  const groups = a.includes('::') ? [...left, ...Array(8 - left.length - right.length).fill('0'), ...right] : left;
  const prefix = groups.slice(0, 4).map((g) => parseInt(g, 16).toString(16));
  return `${prefix.join(':')}::/64`;
}

export const normalizeLoginName = (username: unknown): string => String(username ?? '').trim().toLowerCase().slice(0, 100);

export class LoginLimiter {
  private perUser = new Map<string, Bucket>();
  private perIp = new Map<string, Bucket>();

  constructor(private limits: LoginLimits = DEFAULT_LOGIN_LIMITS) {}

  configure(partial: Partial<LoginLimits>) {
    this.limits = { ...this.limits, ...partial };
  }

  reset() {
    this.perUser.clear();
    this.perIp.clear();
  }

  private userKey(ip: string, username: unknown) {
    return `${ipBucketKey(ip)}|${normalizeLoginName(username)}`;
  }

  check(ip: string, username: unknown, now = Date.now()): LimitDecision {
    const blockedUntil = Math.max(
      this.perUser.get(this.userKey(ip, username))?.blockedUntil ?? 0,
      this.perIp.get(ipBucketKey(ip))?.blockedUntil ?? 0
    );
    if (blockedUntil > now) return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((blockedUntil - now) / 1000)) };
    return { allowed: true };
  }

  recordFailure(ip: string, username: unknown, now = Date.now()) {
    this.bump(this.perUser, this.userKey(ip, username), this.limits.maxAttempts, now);
    this.bump(this.perIp, ipBucketKey(ip), this.limits.maxPerIp, now);
    if (this.perUser.size > MAX_TRACKED || this.perIp.size > MAX_TRACKED) this.prune(now);
  }

  recordSuccess(ip: string, username: unknown) {
    this.perUser.delete(this.userKey(ip, username));
  }

  private bump(map: Map<string, Bucket>, key: string, threshold: number, now: number) {
    let bucket = map.get(key);
    if (bucket && bucket.blockedUntil <= now && now - bucket.lastFail > this.limits.windowMs) bucket = undefined; // forgotten
    if (!bucket) bucket = { fails: 0, lastFail: now, blockedUntil: 0 };
    bucket.fails += 1;
    bucket.lastFail = now;
    if (bucket.fails >= threshold) {
      const delay = Math.min(this.limits.maxDelayMs, this.limits.baseDelayMs * 2 ** Math.min(bucket.fails - threshold, 30));
      bucket.blockedUntil = now + delay;
    }
    map.set(key, bucket);
  }

  private prune(now: number) {
    for (const map of [this.perUser, this.perIp]) {
      for (const [key, b] of map) {
        if (b.blockedUntil <= now && now - b.lastFail > this.limits.windowMs) map.delete(key);
      }
    }
  }
}
