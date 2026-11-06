import { test, expect, pickFaq, pickTopic } from './support';

// These checks need the production build (the Vite dev server is deliberately exempt from the CSP).
// `npm run test:e2e` starts that for you; set E2E_EXPECT_CSP=0 only when pointing E2E_BASE_URL at a dev server.
test.skip(process.env.E2E_EXPECT_CSP === '0', 'running against a development server');

test.describe('production security headers', () => {
  test('the page is served with the CSP, nosniff and referrer policy; the API is not decorated', async ({ request }) => {
    const page = await request.get('/');
    expect(page.status()).toBe(200);
    const csp = page.headers()['content-security-policy'];
    expect(csp, 'Content-Security-Policy header').toBeTruthy();
    expect(csp).toContain("script-src 'self'");
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain('https://fonts.googleapis.com');
    expect(csp).toContain('https://fonts.gstatic.com');
    expect(page.headers()['x-content-type-options']).toBe('nosniff');
    expect(page.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(page.headers()['x-powered-by']).toBeUndefined();

    const api = await request.get('/api/faqs');
    expect(api.headers()['content-security-policy']).toBeUndefined();
    expect(api.headers()['x-powered-by']).toBeUndefined();
  });

  test('the app and its fonts load and run without a single CSP violation', async ({ page, request }) => {
    const violations: string[] = [];
    page.on('console', (m) => /content security policy/i.test(m.text()) && violations.push(m.text()));
    page.on('pageerror', (e) => violations.push(`pageerror: ${e.message}`));
    page.on('requestfailed', (r) => /BLOCKED_BY_CSP/.test(r.failure()?.errorText || '') && violations.push(`blocked: ${r.url()}`));

    const faq = await pickFaq(request);
    const topic = await pickTopic(request);
    for (const route of [
      '#/home',
      `#/faqList?m=${faq.mainId}&s=${faq.subId}&f=${faq.id}`,
      `#/discussionTopic?m=${topic.forumId}&s=${topic.subId}&t=${topic.id}`,
      '#/login',
      '#/register',
    ]) {
      await page.goto('about:blank');
      await page.goto(`/${route}`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('#root')).not.toBeEmpty();
    }
    // the fonts stylesheet is referenced, and the policy allows it
    await expect(page.locator('link[href*="fonts.googleapis.com"]').first()).toHaveCount(1);
    expect(violations).toEqual([]);
  });

  test('the policy really blocks injected inline scripts', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const ran = await page.evaluate(() => {
      const s = document.createElement('script');
      s.textContent = 'window.__injected = true';
      document.head.appendChild(s);
      return (window as any).__injected === true;
    });
    expect(ran).toBe(false);
  });

  test('framing from another origin is not allowed by default', async ({ request }) => {
    const csp = (await request.get('/')).headers()['content-security-policy'] || '';
    test.skip(!!process.env.CSP_FRAME_ANCESTORS, 'CSP_FRAME_ANCESTORS is customised');
    expect(csp).toContain("frame-ancestors 'self'");
  });
});
