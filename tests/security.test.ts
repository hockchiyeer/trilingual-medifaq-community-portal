import assert from 'node:assert/strict';
import { buildCsp, escapeHtml, renderBroadcastHtml, singleLine, parseTrustProxy, securityHeaders } from '../src/security.ts';

// Broadcast e-mail: nothing the administrator types can become markup
const html = renderBroadcastHtml('<script>alert(1)</script> & "quotes"', 'Line 1\nLine <b>2</b> <img src=x onerror=alert(1)>');
assert.ok(!html.includes('<script>'));
assert.ok(!html.includes('<img'));
assert.ok(!html.includes('<b>2</b>'));
assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;quotes&quot;'));
assert.ok(html.includes('Line 1<br/>Line &lt;b&gt;2&lt;/b&gt;'), 'line breaks still become <br/>');
assert.equal(escapeHtml(undefined), '');
assert.equal(singleLine('Hello\r\nBcc: evil@example.com'), 'Hello Bcc: evil@example.com');

// TRUST_PROXY parsing
assert.equal(parseTrustProxy(undefined), undefined);
assert.equal(parseTrustProxy(''), undefined);
assert.equal(parseTrustProxy('true'), true);
assert.equal(parseTrustProxy('FALSE'), false);
assert.equal(parseTrustProxy('1'), 1);
assert.equal(parseTrustProxy('loopback'), 'loopback');
assert.equal(parseTrustProxy('10.0.0.0/8'), '10.0.0.0/8');

// CSP: own-origin scripts only, no eval, no plugins, no foreign API calls
const csp = buildCsp(undefined);
const dir = Object.fromEntries(csp.split('; ').map((d) => [d.split(' ')[0], d.split(' ').slice(1)]));
assert.deepEqual(dir['script-src'], ["'self'"]);
assert.ok(!csp.includes('unsafe-eval'));
assert.ok(!dir['script-src'].includes("'unsafe-inline'"));
assert.deepEqual(dir['connect-src'], ["'self'"]);
assert.deepEqual(dir['object-src'], ["'none'"]);
assert.deepEqual(dir['base-uri'], ["'self'"]);
assert.ok(dir['style-src'].includes('https://fonts.googleapis.com'));
assert.ok(dir['font-src'].includes('https://fonts.gstatic.com'));
assert.deepEqual(dir['frame-ancestors'], ["'self'"], 'framing is same-origin only by default');
assert.equal(buildCsp('https://example.com').includes('frame-ancestors https://example.com'), true);
const hostile = buildCsp("'self'; script-src *\r\nX-Evil: 1");
const hostileDirectives = hostile.split('; ').map((d) => d.split(' ')[0]);
assert.ok(!/[\r\n]/.test(hostile), 'no line breaks can reach the header');
assert.equal(hostileDirectives.filter((d) => d === 'script-src').length, 1, 'no extra directive can be injected');
assert.ok(hostile.includes("script-src 'self'") && !hostile.includes("script-src *;"));

// Middleware sets the headers and continues
const headers: Record<string, string> = {};
let called = false;
securityHeaders()({} as any, { setHeader: (k: string, v: string) => void (headers[k] = v) } as any, () => void (called = true));
assert.ok(called);
assert.equal(headers['Content-Security-Policy'], buildCsp());
assert.equal(headers['X-Content-Type-Options'], 'nosniff');
assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');

console.log('security.test.ts: all assertions passed');
