/**
 * Single source of truth for the membership / access hierarchy.
 *
 * Stored values are intentionally 0 / 1 / 3 (level 2 is reserved for a future
 * tier). They are persisted in `users.admin_level` and enforced by the API,
 * so they must not be renumbered without a data migration.
 */
export const ADMIN_LEVEL = {
  NONE: 0, // Regular member – no admin rights
  MODERATOR: 1, // Doctor / Moderator
  ADMINISTRATOR: 3, // Back-end administrator
} as const;

export type MemberRole = 'user' | 'moderator' | 'admin';

type LevelLike = { role?: string | null; adminLevel?: number | null } | null | undefined;

export const roleFromLevel = (level: number): MemberRole =>
  level >= ADMIN_LEVEL.ADMINISTRATOR ? 'admin' : level >= ADMIN_LEVEL.MODERATOR ? 'moderator' : 'user';

export const isAdministrator = (u: LevelLike): boolean =>
  !!u && (u.role === 'admin' || (u.adminLevel ?? 0) >= ADMIN_LEVEL.ADMINISTRATOR);

export const isModeratorOrAbove = (u: LevelLike): boolean =>
  !!u && (u.role === 'moderator' || isAdministrator(u) || (u.adminLevel ?? 0) >= ADMIN_LEVEL.MODERATOR);

/** Translation key describing the member's tier (resolved via t() in the UI). */
export const accessLevelKey = (u: LevelLike): string =>
  isAdministrator(u) ? 'administratorRole' : isModeratorOrAbove(u) ? 'doctorRole' : 'standardMemberRole';
