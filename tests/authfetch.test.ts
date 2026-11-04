import assert from 'node:assert/strict';

// Minimal browser stand-ins (this module only needs window.fetch, localStorage and events)
const store = new Map<string, string>();
const events: string[] = [];
const calls: Array<{ url: string; auth: string | null }> = [];
let nextStatus = 200;

(globalThis as any).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
};
// Emulate browser environment where fetch is defined on Window.prototype with only a getter
const windowProto = {};
Object.defineProperty(windowProto, 'fetch', {
  get() {
    return async (input: any, init?: RequestInit) => {
      calls.push({ url: String(input), auth: new Headers(init?.headers).get('Authorization') });
      return new Response('{}', { status: nextStatus });
    };
  },
  configurable: true,
});

(globalThis as any).window = Object.create(windowProto);
(globalThis as any).window.location = { origin: 'http://localhost:3000' };
(globalThis as any).window.dispatchEvent = (e: Event) => void events.push(e.type);


const { installAuthFetch, setAuthToken, getAuthToken, SESSION_EXPIRED_EVENT } = await import('../src/authFetch.ts');
installAuthFetch();
installAuthFetch(); // idempotent
const f = (globalThis as any).window.fetch as typeof fetch;

// No token: requests are left alone
await f('/api/faqs');
assert.equal(calls.at(-1)!.auth, null);

// With a token: same-origin API calls carry it; other origins and non-API paths never do
setAuthToken('tok123');
await f('/api/pms');
assert.equal(calls.at(-1)!.auth, 'Bearer tok123');
await f('http://localhost:3000/api/pms');
assert.equal(calls.at(-1)!.auth, 'Bearer tok123');
await f('https://example.com/api/pms');
assert.equal(calls.at(-1)!.auth, null, 'the token must never be sent to another origin');
await f('/assets/app.js');
assert.equal(calls.at(-1)!.auth, null);
await f('/api/faqs', { headers: { Authorization: 'Bearer explicit' } });
assert.equal(calls.at(-1)!.auth, 'Bearer explicit', 'an explicit header is not overridden');

// A wrong password on login is not an expired session
nextStatus = 401;
await f('/api/members/login', { method: 'POST' });
assert.equal(getAuthToken(), 'tok123');
assert.deepEqual(events, []);

// A rejected session clears the token and notifies the app
await f('/api/pms');
assert.equal(getAuthToken(), null);
assert.deepEqual(events, [SESSION_EXPIRED_EVENT]);

console.log('authfetch.test.ts: all assertions passed');
