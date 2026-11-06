import { test as base, expect, type APIRequestContext, type Browser, type BrowserContext, type Page } from '@playwright/test';

/** Password of the seeded administrator (same variables the API tests use). */
export const ADMIN_PASSWORD =
  process.env.E2E_ADMIN_PASSWORD || process.env.TEST_ADMIN_PASSWORD || process.env.ADMIN_SEED_PASSWORD || 'admin';
export const MEMBER_PASSWORD = 'E2e_pass_123';

const runId = Date.now().toString(36);
let sequence = 0;

export interface Member {
  username: string;
  password: string;
}

const json = { 'Content-Type': 'application/json' };

export async function loginApi(request: APIRequestContext, username: string, password: string): Promise<string> {
  const res = await request.post('/api/members/login', { headers: json, data: { username, password } });
  if (res.status() !== 200) throw new Error(`API login as "${username}" failed with HTTP ${res.status()}`);
  return (await res.json()).token as string;
}

export const adminToken = (request: APIRequestContext) => loginApi(request, 'admin', ADMIN_PASSWORD);

/** Creates a throw-away member through the public registration API. */
export async function createMember(request: APIRequestContext, label = 'm'): Promise<Member> {
  const username = `e2e_${runId}_${label}${sequence++}`;
  const res = await request.post('/api/members/register', {
    headers: json,
    data: { username, password: MEMBER_PASSWORD, email: `${username}@example.com` },
  });
  expect(res.status(), `registering ${username}`).toBe(200);
  return { username, password: MEMBER_PASSWORD };
}

export async function deleteMember(request: APIRequestContext, username: string) {
  const token = await adminToken(request);
  await request.delete(`/api/members/${username}`, { headers: { Authorization: `Bearer ${token}` } });
}

/** Any FAQ / forum topic that exists in the database, so tests do not depend on fixed seed ids. */
export async function pickFaq(request: APIRequestContext) {
  const faqs = await (await request.get('/api/faqs')).json();
  const faq = faqs.find((f: any) => f.mainId && f.subId && f.q?.EN);
  expect(faq, 'the database needs at least one FAQ (run npm run db:seed)').toBeTruthy();
  return faq as { id: string; mainId: string; subId: string; q: { EN: string } };
}

export async function pickTopic(request: APIRequestContext) {
  const topics = await (await request.get('/api/topics')).json();
  const topic = topics.find((t: any) => t.forumId && t.subId && t.title?.EN);
  expect(topic, 'the database needs at least one forum topic (run npm run db:seed)').toBeTruthy();
  return topic as { id: string; forumId: string; subId: string; title: { EN: string } };
}

export const currentHash = (page: Page) => page.evaluate(() => window.location.hash);
export const storedToken = (page: Page) => page.evaluate(() => window.localStorage.getItem('medifaq_token'));

/** Fills the login form on the login page and clicks the button, exactly as a visitor would. */
export async function uiLogin(page: Page, username: string, password: string) {
  await page.getByPlaceholder('Enter username').fill(username);
  await page.getByPlaceholder('Enter password').fill(password);
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
}

export const openLoginFromHeader = async (page: Page) => {
  await page.getByRole('button', { name: 'User Sign In' }).first().click();
  await expect.poll(() => currentHash(page)).toBe('#/login');
};

/** A browser profile of its own (its own localStorage), i.e. "another device". */
export async function newDevice(browser: Browser): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 800 } });
  return { context, page: await context.newPage() };
}

export async function signedInDevice(browser: Browser, member: Member) {
  const device = await newDevice(browser);
  await device.page.goto('/');
  await openLoginFromHeader(device.page);
  await uiLogin(device.page, member.username, member.password);
  await expect.poll(() => storedToken(device.page)).not.toBeNull();
  return device;
}

export async function changePasswordInUi(page: Page, oldPassword: string, newPassword: string) {
  await page.evaluate(() => (window.location.hash = '#/changePassword'));
  const fields = page.locator('input[type="password"]');
  await expect(fields).toHaveCount(3);
  await fields.nth(0).fill(oldPassword);
  await fields.nth(1).fill(newPassword);
  await fields.nth(2).fill(newPassword);
  await page.getByRole('button', { name: 'Change Password!' }).click();
}

/** Every test that needs a signed-in user gets a fresh member, deleted again afterwards. */
export const test = base.extend<{ member: Member }>({
  member: async ({ request }, use) => {
    const member = await createMember(request);
    await use(member);
    await deleteMember(request, member.username);
  },
});

export { expect };
