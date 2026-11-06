import {
  test,
  expect,
  ADMIN_PASSWORD,
  MEMBER_PASSWORD,
  adminToken,
  changePasswordInUi,
  createMember,
  currentHash,
  deleteMember,
  loginApi,
  newDevice,
  openLoginFromHeader,
  pickFaq,
  pickTopic,
  signedInDevice,
  storedToken,
  uiLogin,
} from './support';

test.describe('return to the same page after login', () => {
  test('a discussion topic', async ({ page, request, member }) => {
    const topic = await pickTopic(request);
    const target = `#/discussionTopic?m=${topic.forumId}&s=${topic.subId}&t=${topic.id}`;
    await page.goto(`/${target}`);
    await expect(page.getByText(topic.title.EN).first()).toBeVisible();

    await openLoginFromHeader(page);
    await uiLogin(page, member.username, member.password);

    await expect.poll(() => currentHash(page)).toBe(target);
    await expect(page.getByText(topic.title.EN).first()).toBeVisible();
    await expect(page.getByPlaceholder('Enter username')).toHaveCount(0);
  });

  test('a subforum', async ({ page, request, member }) => {
    const topic = await pickTopic(request);
    const target = `#/discussionSub?m=${topic.forumId}&s=${topic.subId}`;
    await page.goto(`/${target}`);
    await openLoginFromHeader(page);
    await uiLogin(page, member.username, member.password);
    await expect.poll(() => currentHash(page)).toBe(target);
  });

  test('a FAQ category list', async ({ page, request, member }) => {
    const faq = await pickFaq(request);
    const target = `#/faqList?m=${faq.mainId}&s=${faq.subId}`;
    await page.goto(`/${target}`);
    await expect(page.getByText(faq.q.EN).first()).toBeVisible();
    await openLoginFromHeader(page);
    await uiLogin(page, member.username, member.password);
    await expect.poll(() => currentHash(page)).toBe(target);
    await expect(page.getByText(faq.q.EN).first()).toBeVisible();
  });

  test('an open FAQ answer: sign in from inside the answer, and the same answer reopens', async ({ page, request, member }) => {
    const faq = await pickFaq(request);
    const list = `#/faqList?m=${faq.mainId}&s=${faq.subId}`;
    const answer = `${list}&f=${faq.id}`;
    const modal = page.locator('div.fixed.inset-0').filter({ hasText: faq.q.EN });

    await page.goto(`/${list}`);
    await page.getByText(faq.q.EN).first().click();
    await expect(modal).toHaveCount(1);
    await expect.poll(() => currentHash(page)).toBe(answer);

    await modal.getByRole('button', { name: 'User Sign In' }).click();
    await expect.poll(() => currentHash(page)).toBe('#/login');
    await expect(modal).toHaveCount(0); // the answer no longer covers the login form

    await uiLogin(page, member.username, member.password);
    await expect.poll(() => currentHash(page)).toBe(answer);
    await expect(modal).toHaveCount(1);
  });

  test('a shared link to a FAQ answer opens that answer', async ({ page, request }) => {
    const faq = await pickFaq(request);
    await page.goto(`/#/faqList?m=${faq.mainId}&s=${faq.subId}&f=${faq.id}`);
    await expect(page.locator('div.fixed.inset-0').filter({ hasText: faq.q.EN })).toHaveCount(1);
  });

  test('the Back button after logging in does not return to the login screen', async ({ page, member }) => {
    await page.goto('/');
    await openLoginFromHeader(page);
    await uiLogin(page, member.username, member.password);
    await expect.poll(() => storedToken(page)).not.toBeNull();
    await expect.poll(() => currentHash(page)).not.toBe('#/login');

    await page.evaluate(() => window.history.back());
    await page.waitForTimeout(300);
    expect(await currentHash(page)).not.toBe('#/login');
    await expect(page.getByPlaceholder('Enter username')).toHaveCount(0);
  });

  test('a refresh on the login page keeps the return target', async ({ page, request, member }) => {
    const topic = await pickTopic(request);
    const target = `#/discussionTopic?m=${topic.forumId}&s=${topic.subId}&t=${topic.id}`;
    await page.goto(`/${target}`);
    await openLoginFromHeader(page);
    await page.reload();
    await expect(page.getByPlaceholder('Enter username')).toBeVisible();
    await uiLogin(page, member.username, member.password);
    await expect.poll(() => currentHash(page)).toBe(target);
  });

  test('abandoning the login and signing in later does not jump to the old page', async ({ page, request, member }) => {
    const topic = await pickTopic(request);
    await page.goto(`/#/discussionTopic?m=${topic.forumId}&s=${topic.subId}&t=${topic.id}`);
    await openLoginFromHeader(page);
    await page.getByRole('button', { name: 'Home', exact: true }).first().click();
    await expect.poll(() => currentHash(page)).toBe('#/home');
    await openLoginFromHeader(page);
    await uiLogin(page, member.username, member.password);
    await expect.poll(() => currentHash(page)).toBe('#/home');
  });
});

test.describe('password change', () => {
  test('changing it keeps the current session signed in, and only the new password works afterwards', async ({ browser, request, member }) => {
    const { context, page } = await signedInDevice(browser, member);
    const newPassword = 'E2e_changed_456';

    await changePasswordInUi(page, member.password, newPassword);
    await expect(page.getByText('Password changed successfully!')).toBeVisible();
    await expect.poll(() => currentHash(page)).toBe('#/memberPanel');

    await page.reload(); // still signed in with the replacement session
    expect(await storedToken(page)).not.toBeNull();
    expect(await page.evaluate(() => fetch('/api/pms').then((r) => r.status))).toBe(200);

    await expect(loginApi(request, member.username, member.password)).rejects.toThrow(/401/);
    await loginApi(request, member.username, newPassword);
    await context.close();
  });

  test('a wrong current password is refused and nothing changes', async ({ browser, request, member }) => {
    const { context, page } = await signedInDevice(browser, member);
    await changePasswordInUi(page, 'not-my-password', 'E2e_changed_456');
    await expect(page.getByText(/old password/i).first()).toBeVisible();
    await loginApi(request, member.username, member.password); // the original still works
    await context.close();
  });

  test('on another device the session ends once the password was changed elsewhere', async ({ browser, member }) => {
    const deviceA = await signedInDevice(browser, member);
    const deviceB = await signedInDevice(browser, member);

    await changePasswordInUi(deviceB.page, member.password, 'E2e_changed_456');
    await expect(deviceB.page.getByText('Password changed successfully!')).toBeVisible();

    // Device A's next API call is rejected: it is signed out and told why.
    await deviceA.page.evaluate(() => fetch('/api/pms'));
    await expect(deviceA.page.getByText('Your session has expired. Please log in again.')).toBeVisible();
    expect(await storedToken(deviceA.page)).toBeNull();
    await expect(deviceA.page.getByRole('button', { name: 'User Sign In' }).first()).toBeVisible();

    await deviceA.context.close();
    await deviceB.context.close();
  });

  test('tabs of one browser share the new session (they are one device)', async ({ browser, member }) => {
    const { context, page: tab1 } = await signedInDevice(browser, member);
    const tab2 = await context.newPage();
    await tab2.goto('/');
    await changePasswordInUi(tab2, member.password, 'E2e_changed_456');
    await expect(tab2.getByText('Password changed successfully!')).toBeVisible();

    expect(await tab1.evaluate(() => fetch('/api/pms').then((r) => r.status))).toBe(200);
    await expect(tab1.getByText('Your session has expired. Please log in again.')).toHaveCount(0);
    await context.close();
  });
});

test.describe('route guards', () => {
  test('a member who opens an admin page by address is sent to the member panel', async ({ browser, member }) => {
    const { context, page } = await signedInDevice(browser, member);

    // typing the address into a page that is already open
    await page.evaluate(() => (window.location.hash = '#/adminFaq'));
    await expect.poll(() => currentHash(page)).toBe('#/memberPanel');

    // opening the link fresh (new page load)
    await page.goto('about:blank');
    await page.goto('/#/adminFaq');
    await expect.poll(() => currentHash(page)).toBe('#/memberPanel');
    await expect(page.getByText('Access Denied')).toHaveCount(0);
    await context.close();
  });

  test('a guest is sent to login, and an administrator lands on the page that was asked for', async ({ browser }) => {
    const { context, page } = await newDevice(browser);
    await page.goto('/#/adminFaq');
    await expect.poll(() => currentHash(page)).toBe('#/login');

    await uiLogin(page, 'admin', ADMIN_PASSWORD);
    await expect.poll(() => currentHash(page)).toBe('#/adminFaq');
    await expect(page.getByText('Access Denied')).toHaveCount(0);
    await context.close();
  });

  test('the server enforces what the screens hide', async ({ request, member }) => {
    const token = await loginApi(request, member.username, member.password);
    const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    expect((await request.post('/api/categories', { headers: auth, data: { id: 'e2e_nope', name: { EN: 'x', ZH: 'x', BM: 'x' } } })).status()).toBe(403);
    expect((await request.put(`/api/members/${member.username}`, { headers: auth, data: { role: 'admin', adminLevel: 3 } })).status()).toBe(403);
    expect((await request.get('/api/feedbacks', { headers: auth })).status()).toBe(403);
    expect((await request.get('/api/feedbacks')).status()).toBe(401);
  });

  test('registering through the public form can never create an administrator', async ({ request }) => {
    const username = `e2e_priv_${Date.now().toString(36)}`;
    const res = await request.post('/api/members/register', {
      headers: { 'Content-Type': 'application/json' },
      data: { username, password: MEMBER_PASSWORD, email: `${username}@example.com`, role: 'admin', adminLevel: 3 },
    });
    expect(res.status()).toBe(200);
    const created = (await (await request.get('/api/members')).json()).find((m: any) => m.username === username);
    expect(created.role).toBe('user');
    expect(created.adminLevel).toBe(0);
    await deleteMember(request, username);
  });
});

test.describe('login errors and throttling', () => {
  test('unknown username and wrong password show the same single message, without echoing the username', async ({ page, member }) => {
    await page.goto('/#/login');
    const card = page.locator('div.bg-amber-50').first();

    const unknown = `nobody_${Date.now().toString(36)}`;
    await uiLogin(page, unknown, 'whatever-123');
    await expect(card).toContainText('Invalid username or password.');
    const unknownText = await card.innerText();
    expect(unknownText).not.toContain(unknown);

    await uiLogin(page, member.username, 'wrong-password-123');
    await expect(card).toContainText('Invalid username or password.');
    const wrongText = await card.innerText();
    expect(wrongText).not.toContain(member.username);
    expect(wrongText).toBe(unknownText);
  });

  test('the API answers both cases identically (same status and body)', async ({ request, member }) => {
    const unknown = await request.post('/api/members/login', { data: { username: `nobody_${Date.now().toString(36)}`, password: 'x1234' } });
    const wrong = await request.post('/api/members/login', { data: { username: member.username, password: 'x1234' } });
    expect(unknown.status()).toBe(401);
    expect(wrong.status()).toBe(401);
    expect(await unknown.json()).toEqual(await wrong.json());
  });

  test('one click on "Log in" sends exactly one login request', async ({ page, member }) => {
    await page.goto('/#/login');
    const attempts: string[] = [];
    page.on('request', (r) => r.url().includes('/api/members/login') && attempts.push(r.method()));
    await uiLogin(page, member.username, 'wrong-password-123');
    await expect(page.getByText('Invalid username or password.')).toBeVisible();
    await page.waitForTimeout(500);
    expect(attempts).toHaveLength(1);
  });

  test('after repeated failures the login screen asks the visitor to wait', async ({ page, request, member }) => {
    for (let i = 0; i < 5; i++) {
      const res = await request.post('/api/members/login', { data: { username: member.username, password: `wrong-${i}-xyz` } });
      expect(res.status()).toBe(401);
    }
    await page.goto('/#/login');
    await uiLogin(page, member.username, member.password); // even the right password has to wait
    await expect(page.getByText('Too many failed login attempts. Please wait a few minutes and try again.')).toBeVisible();
    expect(await storedToken(page)).toBeNull();

    // other accounts are not affected by this account's failures
    const other = await createMember(request, 'o');
    await uiLogin(page, other.username, other.password);
    await expect.poll(() => storedToken(page)).not.toBeNull();
    await deleteMember(request, other.username);
  });
});
