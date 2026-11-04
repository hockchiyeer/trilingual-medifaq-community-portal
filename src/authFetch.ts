/**
 * Client-side session handling.
 * The server issues a signed token at login; this module keeps it in localStorage and attaches
 * it (Authorization: Bearer ...) to every same-origin /api request, so the existing fetch()
 * calls throughout the app need no changes. If the server rejects the token (expired, password
 * changed elsewhere, account removed) the token is dropped and SESSION_EXPIRED_EVENT is fired.
 */
export const TOKEN_KEY = 'medifaq_token';
export const SESSION_EXPIRED_EVENT = 'medifaq:session-expired';

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string | null | undefined) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

const isOwnApiUrl = (url: string) => url.startsWith('/api/') || url.startsWith(`${window.location.origin}/api/`);

const getUrlString = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  if (typeof Request !== 'undefined' && input instanceof Request) return input.url;
  return '';
};

let installed = false;

export function installAuthFetch() {
  if (installed || typeof window === 'undefined' || typeof window.fetch !== 'function') return;
  installed = true;
  const originalFetch = window.fetch.bind(window);

  const authFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = getUrlString(input);
    const token = url && isOwnApiUrl(url) ? getAuthToken() : null;
    if (!token) return originalFetch(input, init);

    const headers = new Headers(init?.headers);
    if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
    const response = await originalFetch(input, { ...init, headers });

    // Login/register answer 401 for a wrong password; that is not an expired session.
    if (response.status === 401 && !url.includes('/api/members/login') && !url.includes('/api/members/register')) {
      setAuthToken(null);
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    return response;
  };

  try {
    Object.defineProperty(window, 'fetch', {
      value: authFetch,
      writable: true,
      configurable: true,
    });
  } catch {
    try {
      (window as any).fetch = authFetch;
    } catch {
      try {
        Object.defineProperty(Object.getPrototypeOf(window), 'fetch', {
          value: authFetch,
          writable: true,
          configurable: true,
        });
      } catch (err) {
        console.warn('Unable to patch window.fetch:', err);
      }
    }
  }

  if (typeof globalThis !== 'undefined' && (globalThis as any) !== window) {
    try {
      Object.defineProperty(globalThis, 'fetch', {
        value: authFetch,
        writable: true,
        configurable: true,
      });
    } catch {}
  }
}

