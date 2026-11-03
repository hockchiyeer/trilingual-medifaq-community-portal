import assert from 'node:assert/strict';
import { formatTimestamp, parseTimestamp, sortByTimestamp } from '../src/timestamp.ts';

const at = (y: number, mo: number, d: number, h = 0, mi = 0, s = 0) => new Date(y, mo - 1, d, h, mi, s).getTime();

// Seed formats (day first, 24h, optional "the")
assert.equal(parseTimestamp('05:13:58 on 6/2/2003'), at(2003, 2, 6, 5, 13, 58));
assert.equal(parseTimestamp('14:05:12 on the 7/2/2003'), at(2003, 2, 7, 14, 5, 12));
assert.equal(parseTimestamp('08:00:00 on 13/5/2026'), at(2026, 5, 13, 8)); // 13 can only be a day: proves D/M/Y
// 12-hour clocks written by older locale-formatted clients
assert.equal(parseTimestamp('1:55:15 PM on 2/11/2026'), at(2026, 11, 2, 13, 55, 15));
assert.equal(parseTimestamp('12:30:00 AM on 2/11/2026'), at(2026, 11, 2, 0, 30));
assert.equal(parseTimestamp('12:30:00 PM on 2/11/2026'), at(2026, 11, 2, 12, 30));
assert.equal(parseTimestamp('下午1:55:15 on 2/11/2026'), at(2026, 11, 2, 13, 55, 15));
assert.equal(parseTimestamp('01:55 on 2/11/26'), at(2026, 11, 2, 1, 55)); // two-digit year -> 20xx, no seconds
// Year-first and ISO
assert.equal(parseTimestamp('14:05:12 on 2026-11-02'), at(2026, 11, 2, 14, 5, 12));
assert.equal(parseTimestamp('2026-11-02T14:05:12'), at(2026, 11, 2, 14, 5, 12));
// Unparseable / invalid -> 0, never NaN
for (const bad of [undefined, null, '', '   ', 'yesterday', '25:00:00 on 1/1/2026', '10:00:00 on 31/2/2026', '10:00:00 on 1/13/2026']) {
  assert.equal(parseTimestamp(bad as any), 0, `expected 0 for ${String(bad)}`);
}

// formatTimestamp is locale independent and round-trips
const sample = new Date(2026, 10, 2, 9, 5, 7);
assert.equal(formatTimestamp(sample), '09:05:07 on 2/11/2026');
assert.equal(formatTimestamp(sample, true), '09:05:07 on the 2/11/2026');
assert.equal(parseTimestamp(formatTimestamp(sample)), sample.getTime());
assert.equal(parseTimestamp(formatTimestamp(sample, true)), sample.getTime());

// Sorting: chronological, stable for ties, does not mutate input, desc supported
const items = [
  { id: 'c', t: '08:00:00 on 13/5/2026' },
  { id: 'a', t: '05:13:58 on 6/2/2003' },
  { id: 'x', t: 'garbage' },
  { id: 'b', t: '14:05:12 on the 7/2/2003' },
  { id: 'y', t: '' },
];
const asc = sortByTimestamp(items, (i) => i.t).map((i) => i.id);
assert.deepEqual(asc, ['x', 'y', 'a', 'b', 'c']);
assert.deepEqual(sortByTimestamp(items, (i) => i.t, 'desc').map((i) => i.id), ['c', 'b', 'a', 'x', 'y']);
assert.deepEqual(items.map((i) => i.id), ['c', 'a', 'x', 'b', 'y']);
// A numeric day/month sort would put 13/5/2026 before 6/2/2003 lexicographically; make sure it does not.
assert.ok(parseTimestamp('08:00:00 on 13/5/2026') > parseTimestamp('14:05:12 on 7/2/2003'));

// formatDisplayTimestamp localization tests
import { formatDisplayTimestamp } from '../src/timestamp.ts';
assert.equal(formatDisplayTimestamp('14:05:12 on 7/2/2003', 'EN'), '14:05:12 on 7/2/2003');
assert.equal(formatDisplayTimestamp('14:05:12 on the 7/2/2003', 'EN'), '14:05:12 on 7/2/2003');
assert.equal(formatDisplayTimestamp('14:05:12 on the 7/2/2003', 'ZH'), '14:05:12，7/2/2003');
assert.equal(formatDisplayTimestamp('14:05:12 on 7/2/2003', 'BM'), '14:05:12, 7/2/2003');
assert.equal(formatDisplayTimestamp(undefined, 'ZH'), '');
assert.equal(formatDisplayTimestamp('2026-05-13 09:00', 'BM'), '2026-05-13 09:00'); // no connector -> unchanged

console.log('Timestamp tests passed');

