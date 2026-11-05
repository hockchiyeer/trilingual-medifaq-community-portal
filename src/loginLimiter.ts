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
    return `${ip}|${normalizeLoginName(username)}`;
  }

  check(ip: string, username: unknown, now = Date.now()): LimitDecision {
    const blockedUntil = Math.max(
      this.perUser.get(this.userKey(ip, username))?.blockedUntil ?? 0,
      this.perIp.get(ip)?.blockedUntil ?? 0
    );
    if (blockedUntil > now) return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((blockedUntil - now) / 1000)) };
    return { allowed: true };
  }

  recordFailure(ip: string, username: unknown, now = Date.now()) {
    this.bump(this.perUser, this.userKey(ip, username), this.limits.maxAttempts, now);
    this.bump(this.perIp, ip, this.limits.maxPerIp, now);
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
