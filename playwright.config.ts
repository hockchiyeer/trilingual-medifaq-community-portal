import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT || 3100);
const baseURL = process.env.E2E_BASE_URL || `http://127.0.0.1:${port}`;

// Optional: use a Chromium you already have instead of the one from `npx playwright install chromium`.
const chromiumArgs = process.env.PW_CHROMIUM_ARGS
  ? process.env.PW_CHROMIUM_ARGS.trim().startsWith('[')
    ? (JSON.parse(process.env.PW_CHROMIUM_ARGS) as string[])
    : process.env.PW_CHROMIUM_ARGS.split(' ')
  : undefined;

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1, // the tests share one database and one rate limiter
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    locale: 'en-US',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: process.env.PW_CHROMIUM_PATH || undefined,
      args: chromiumArgs,
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Point E2E_BASE_URL at an already running production-mode server to skip this.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'node e2e/start-server.mjs', url: baseURL, timeout: 240_000, reuseExistingServer: false },
});
