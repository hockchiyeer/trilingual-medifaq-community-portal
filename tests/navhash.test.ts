import assert from 'node:assert/strict';
import { buildNavHash, parseNavHash, guardRoute } from '../src/navHash.ts';

// Round trips keep exactly the ids that belong to the page
assert.equal(buildNavHash('home', { mainId: 'x', subId: 'y' }), '#/home');
assert.equal(buildNavHash('faqList', { mainId: 'pharmacy', subId: 'vitamin', faqId: 'f1' }), '#/faqList?m=pharmacy&s=vitamin&f=f1');
assert.equal(buildNavHash('discussionTopic', { mainId: 'a', subId: 'b', topicId: 'top_1', faqId: 'f1' }), '#/discussionTopic?m=a&s=b&t=top_1');
assert.deepEqual(parseNavHash('#/discussionTopic?m=a&s=b&t=top_1'), { page: 'discussionTopic', mainId: 'a', subId: 'b', topicId: 'top_1' });
assert.deepEqual(parseNavHash('#/faqList?m=pharmacy&s=vitamin&f=f1'), { page: 'faqList', mainId: 'pharmacy', subId: 'vitamin', faqId: 'f1' });
assert.deepEqual(parseNavHash('#/login'), { page: 'login' });

// Bad / hostile hashes are rejected or sanitised
for (const bad of ['', '#', '#/', '#/nope', '#/__proto__', '#/home/../x', '#/<script>', 'faqList']) {
  assert.equal(parseNavHash(bad), null, `expected null for ${bad}`);
}
assert.equal(parseNavHash('#/home?t=zzz&f=zzz&m=zzz')?.topicId, undefined); // ids from other pages are dropped
assert.equal(parseNavHash('#/home?t=zzz&f=zzz&m=zzz')?.faqId, undefined);
assert.equal(parseNavHash('#/discussionTopic?m=a&s=b')?.page, 'discussionSub'); // topic page without a topic
assert.equal(parseNavHash('#/createTopicForm?m=a&s=b')?.page, 'discussionSub'); // form input cannot be restored
assert.equal(parseNavHash('#/loggingOutPage')?.page, 'home');
assert.equal(parseNavHash('#/feedbackConfirmation')?.page, 'home');

// Route guards
const guest = null;
const member = { role: 'user', adminLevel: 0 };
const admin = { role: 'admin', adminLevel: 3 };
assert.deepEqual(guardRoute({ page: 'faqList', mainId: 'a' }, guest), { page: 'faqList', returnTarget: null });
assert.deepEqual(guardRoute({ page: 'pmCenter' }, guest), { page: 'login', returnTarget: { page: 'pmCenter' } });
assert.deepEqual(guardRoute({ page: 'adminFaq' }, guest), { page: 'login', returnTarget: { page: 'adminFaq' } });
assert.deepEqual(guardRoute({ page: 'adminFaq' }, member), { page: 'memberPanel', returnTarget: null });
assert.deepEqual(guardRoute({ page: 'adminFaq' }, admin), { page: 'adminFaq', returnTarget: null });
assert.deepEqual(guardRoute({ page: 'memberPanel' }, member), { page: 'memberPanel', returnTarget: null });
assert.deepEqual(guardRoute({ page: 'login' }, member), { page: 'home', returnTarget: null });
assert.deepEqual(guardRoute({ page: 'register' }, guest), { page: 'register', returnTarget: null });

console.log('navhash.test.ts: all assertions passed');
