import type { RequestHandler } from 'express';

/** HTML-escape text before placing it inside an HTML e-mail or page. */
export function escapeHtml(str: unknown): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** HTML body for an administrator broadcast. Both fields are escaped; line breaks become <br/>. */
export function renderBroadcastHtml(subject: string, message: string): string {
  return `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f766e;">${escapeHtml(subject)}</h2>
          <p>${escapeHtml(message).replace(/\r?\n/g, '<br/>')}</p>
          <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 16px 0;" />
          <small style="color: #64748b;">Sent to registered members by MediFAQ Administration</small>
        </div>`;
}

/** A mail header must stay on one line. */
export const singleLine = (value: string): string => String(value).replace(/[\r\n]+/g, ' ').trim();

/**
 * Express `trust proxy` setting from TRUST_PROXY: unset -> undefined (leave Express default, i.e. do not trust),
 * "true"/"false", a hop count such as "1", or a name/CIDR list such as "loopback" or "10.0.0.0/8".
 */
export function parseTrustProxy(value: string | undefined): boolean | number | string | undefined {
  if (value === undefined || value.trim() === '') return undefined;
  const v = value.trim();
  if (v.toLowerCase() === 'true') return true;
  if (v.toLowerCase() === 'false') return false;
  if (/^\d+$/.test(v)) return Number(v);
  return v;
}

/**
 * Content-Security-Policy for the production build: scripts only from our own origin (so injected markup
 * cannot run code or read the session token), Google Fonts for typography, API calls to our own origin only.
 * 'unsafe-inline' is limited to styles because the UI uses inline style attributes.
 * frame-ancestors defaults to 'self'; set CSP_FRAME_ANCESTORS to embed the app elsewhere.
 */
export function buildCsp(frameAncestors = process.env.CSP_FRAME_ANCESTORS): string {
  const safeAncestors = (frameAncestors || "'self'").replace(/[^a-zA-Z0-9:/.*\-' ]/g, '').trim() || "'self'";
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-ancestors ${safeAncestors}`,
  ].join('; ');
}

export const securityHeaders = (): RequestHandler => {
  const csp = buildCsp();
  return (_req, res, next) => {
    res.setHeader('Content-Security-Policy', csp);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  };
};
