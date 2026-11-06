/**
 * Starts the production build for the browser tests (cross-platform: no shell syntax, no cross-env).
 *   1. builds the front end (skip with E2E_SKIP_BUILD=1)
 *   2. runs `tsx server.ts` with NODE_ENV=production, so the real security headers (CSP, ...) are active
 *
 * It talks to whatever PostgreSQL your .env / environment points at, exactly like `npm start`.
 * Use a development database: the tests create (and delete) their own `e2e_*` members, and sign in as the
 * seeded `admin` (password from E2E_ADMIN_PASSWORD, TEST_ADMIN_PASSWORD, ADMIN_SEED_PASSWORD or 'admin').
 */
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Vite's package.json `exports` does not expose the CLI, so point at it directly (works on every OS).
const viteCli = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));

if (process.env.E2E_SKIP_BUILD !== '1') {
  console.log('[e2e] building front end...');
  execFileSync(process.execPath, [viteCli, 'build'], { stdio: 'inherit' });
}

const port = process.env.E2E_PORT || '3100';
const child = spawn(process.execPath, ['--import', 'tsx', 'server.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: port,
    APP_PORT: port,
    SESSION_SECRET: process.env.SESSION_SECRET || 'e2e-session-secret-0123456789abcdef',
    // the suite signs in many times from one address; keep the address-wide cap out of the way
    LOGIN_MAX_PER_IP: process.env.LOGIN_MAX_PER_IP || '1000',
  },
});

const stop = () => child.kill('SIGTERM');
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
child.on('exit', (code) => process.exit(code ?? 0));
