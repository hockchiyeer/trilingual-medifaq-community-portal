/** Shared helpers for tests that call the authenticated API. */

export async function loginAs(baseUrl: string, username: string, password: string): Promise<string> {
  const res = await fetch(`${baseUrl}/api/members/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (res.status !== 200) {
    throw new Error(`Login as "${username}" failed with HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data.token) throw new Error(`Login as "${username}" returned no session token`);
  return data.token as string;
}

/**
 * Session for the seeded administrator. The password defaults to the development seed value;
 * if you seeded with ADMIN_SEED_PASSWORD, export the same value as TEST_ADMIN_PASSWORD.
 */
export async function getAdminToken(baseUrl: string): Promise<string> {
  const password = process.env.TEST_ADMIN_PASSWORD || process.env.ADMIN_SEED_PASSWORD || 'admin';
  try {
    return await loginAs(baseUrl, 'admin', password);
  } catch (err: any) {
    throw new Error(`${err.message}. Set TEST_ADMIN_PASSWORD to the password the 'admin' account was seeded with.`);
  }
}

/** fetch() that sends the given session token. */
export const withToken =
  (token: string | null): typeof fetch =>
  (input, init = {}) => {
    const headers = new Headers(init.headers);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };
