/**
 * Forum timestamps.
 *
 * The seed data and the app store timestamps as plain strings of the form `HH:MM:SS on D/M/YYYY`
 * (day first, 24-hour clock; some PM/feedback entries use `on the`). Creating them with
 * `toLocaleTimeString()/toLocaleDateString()` made the stored format depend on each user's browser locale
 * (`11/2/2026` vs `2/11/2026`, `1:55:15 PM`, `下午1:55:15`), which cannot be sorted reliably. New timestamps are therefore
 * always written in the fixed format below, and `parseTimestamp` reads that format deterministically, with
 * fallbacks for older locale-formatted values.
 */

const pad = (n: number): string => String(n).padStart(2, '0');

/** Fixed-format timestamp, e.g. `14:05:12 on 7/2/2003` (or `... on the 7/2/2003` when `withThe` is true). */
export function formatTimestamp(date: Date = new Date(), withThe = false): string {
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  const day = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  return `${time} on ${withThe ? 'the ' : ''}${day}`;
}

const PM_MARKERS = /(?:\bpm\b|p\.m\.|下午|晚上)/i;
const AM_MARKERS = /(?:\bam\b|a\.m\.|上午|凌晨|早上)/i;

/**
 * Converts a forum timestamp string to epoch milliseconds so items can be ordered chronologically.
 * Returns 0 for empty or unrecognisable values (they sort first and, because Array.prototype.sort is stable,
 * keep their original relative order).
 *
 * Accepted: `HH:MM[:SS] [AM|PM] on [the] D/M/YYYY` (day first, matching the seed data and `formatTimestamp`),
 * the same with a year-first date (`2026-11-02`), and anything `Date.parse` understands (e.g. ISO 8601).
 */
export function parseTimestamp(str?: string | null): number {
  if (!str) return 0;
  const value = String(str).trim();
  if (!value) return 0;

  const match = value.match(/^(.*?\d{1,2}:\d{2}(?::\d{2})?[^\d]*?)\s+(?:on|于|在)?\s*(?:the\s+)?(\d{1,4})[\/.\-](\d{1,2})[\/.\-](\d{1,4})\s*$/i);
  if (match) {
    const timeText = match[1];
    const timeMatch = timeText.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
      let hours = Number(timeMatch[1]);
      const minutes = Number(timeMatch[2]);
      const seconds = Number(timeMatch[3] || 0);
      if (PM_MARKERS.test(timeText) && hours < 12) hours += 12;
      else if (AM_MARKERS.test(timeText) && hours === 12) hours = 0;

      const a = Number(match[2]);
      const b = Number(match[3]);
      const c = Number(match[4]);
      let day: number;
      let month: number;
      let year: number;
      if (match[2].length === 4) {
        year = a; month = b; day = c; // Y/M/D
      } else {
        day = a; month = b; year = c; // D/M/Y (app convention)
      }
      if (year < 100) year += 2000;

      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && hours < 24 && minutes < 60 && seconds < 60) {
        const d = new Date(year, month - 1, day, hours, minutes, seconds);
        // Reject overflowed dates such as 31/2/2026.
        if (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) return d.getTime();
      }
    }
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** Returns a new array ordered oldest-first (or newest-first), parsing each timestamp only once. */
export function sortByTimestamp<T>(items: readonly T[], getTimestamp: (item: T) => string | undefined, direction: 'asc' | 'desc' = 'asc'): T[] {
  const sign = direction === 'asc' ? 1 : -1;
  return items
    .map((item, index) => ({ item, index, key: parseTimestamp(getTimestamp(item)) }))
    .sort((x, y) => sign * (x.key - y.key) || x.index - y.index)
    .map((entry) => entry.item);
}

/** Translates English connector words ("on" / "on the") in stored timestamps to active language (EN, ZH, BM). */
export function formatDisplayTimestamp(str?: string | null, lang: 'EN' | 'ZH' | 'BM' = 'EN'): string {
  if (!str) return '';
  const val = String(str);
  const onWord = lang === 'ZH' ? '于' : lang === 'BM' ? 'pada' : 'on';
  return val
    .replace(/\bon\s+the\b/gi, onWord)
    .replace(/\bon\b/gi, onWord)
    .replace(/\b于\b/g, onWord);
}

