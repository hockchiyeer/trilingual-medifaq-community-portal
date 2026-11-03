import { isAdministrator } from './accessLevels';

/**
 * Hash routing helpers. The URL fragment mirrors the visible view:
 *   #/<page>?m=<mainId>&s=<subId>&t=<topicId>&f=<faqId>
 * Only ids that belong to the page are written / accepted, and unknown pages are rejected,
 * so a hand-edited hash can never put the app into an undefined view.
 * No credentials or personal data ever go into the hash.
 */

// Where to send a visitor after login/register: the page plus the category /
// subforum / topic / FAQ context needed to rebuild that exact view.
export interface ReturnTarget {
  page: string;
  mainId?: string;
  subId?: string;
  topicId?: string;
  faqId?: string;
}

type UserLike = { role?: string | null; adminLevel?: number | null } | null | undefined;

const ROUTABLE_PAGES = new Set([
  'home', 'faqMain', 'faqSub', 'faqList', 'faqSearch',
  'discussionMain', 'discussionSub', 'discussionTopic', 'discussionSearch', 'createTopicForm',
  'feedback', 'login', 'register',
  'memberPanel', 'changePassword', 'editProfile', 'pmCenter',
  'adminBoard', 'adminFaq', 'adminForum', 'adminEmail', 'adminMembers', 'adminFeedback',
]);

/** Pages a guest cannot use: a deep link to one of these goes to login first, then returns. */
export const AUTH_REQUIRED_PAGES = new Set([
  'memberPanel', 'changePassword', 'editProfile', 'pmCenter',
  'adminBoard', 'adminFaq', 'adminForum', 'adminEmail', 'adminMembers', 'adminFeedback',
]);

const CONTEXT_PAGES = /^(faq|discussion)(Main|Sub|List|Topic)$/;

export const buildNavHash = (page: string, ctx: Omit<ReturnTarget, 'page'> = {}): string => {
  const q = new URLSearchParams();
  if (CONTEXT_PAGES.test(page) || page === 'createTopicForm') {
    if (ctx.mainId) q.set('m', ctx.mainId);
    if (ctx.subId) q.set('s', ctx.subId);
  }
  if (page === 'discussionTopic' && ctx.topicId) q.set('t', ctx.topicId);
  if (page.startsWith('faq') && ctx.faqId) q.set('f', ctx.faqId);
  const qs = q.toString();
  return `#/${page}${qs ? `?${qs}` : ''}`;
};

export const parseNavHash = (hash: string): ReturnTarget | null => {
  const m = /^#\/([A-Za-z]+)(?:\?(.*))?$/.exec(hash || '');
  if (!m) return null;
  let page = m[1];
  // Transient views cannot be rebuilt from a URL.
  if (page === 'createTopicForm') page = 'discussionSub'; // typed form input is not restorable
  else if (page === 'feedbackConfirmation' || page === 'loggingOutPage') page = 'home';
  if (!ROUTABLE_PAGES.has(page)) return null;

  const q = new URLSearchParams(m[2] || '');
  const out: ReturnTarget = { page };
  if (CONTEXT_PAGES.test(page)) {
    out.mainId = q.get('m') || undefined;
    out.subId = q.get('s') || undefined;
  }
  if (page === 'discussionTopic') {
    out.topicId = q.get('t') || undefined;
    if (!out.topicId) out.page = 'discussionSub'; // a topic page needs a topic
  }
  if (page.startsWith('faq')) out.faqId = q.get('f') || undefined;
  return out;
};

/** Decide where a URL may actually land for this user (guests, non-admins, signed-in users on /login). */
export const guardRoute = (
  nav: ReturnTarget,
  user: UserLike
): { page: string; returnTarget: ReturnTarget | null } => {
  if ((nav.page === 'login' || nav.page === 'register') && user) return { page: 'home', returnTarget: null };
  if (AUTH_REQUIRED_PAGES.has(nav.page)) {
    if (!user) return { page: 'login', returnTarget: nav };
    if (nav.page.startsWith('admin') && !isAdministrator(user)) return { page: 'memberPanel', returnTarget: null };
  }
  return { page: nav.page, returnTarget: null };
};
