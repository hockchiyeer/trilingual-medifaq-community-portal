import assert from 'node:assert/strict';
import { eq } from 'drizzle-orm';
import { TestGuardian } from './test-guardian.ts';
import { db } from '../src/db/index.ts';
import { users } from '../src/db/schema.ts';
import { loginAs, getAdminToken, withToken } from './auth-helpers.ts';

export async function runApiTests(baseUrl: string, guardian: TestGuardian): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const testCase = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}`);
      failed++;
    }
  };

  console.log(`\n--- Running API Integration Test Suite [Namespace: ${guardian.prefix}] ---`);

  // Sessions: the seeded administrator, plus a member and a moderator created (and later purged) by this run.
  // Members and moderators are created through the public API and promoted by the administrator,
  // so the suite does not depend on any test-only privilege bootstrap.
  const adminFetch = withToken(await getAdminToken(baseUrl));
  let memberFetch: typeof fetch = fetch;
  let modFetch: typeof fetch = fetch;
  const modUsername = `${guardian.prefix}mod`;

  // 1. Categories & Subcategories
  await testCase('GET /api/categories - returns categories array with valid structure', async () => {
    const res = await fetch(`${baseUrl}/api/categories`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    assert.ok(data[0].id);
    assert.ok(data[0].name.EN);
    assert.ok(data[0].name.ZH);
    assert.ok(data[0].name.BM);
  });

  await testCase('POST /api/categories & POST /api/subcategories - creates isolated mock category and subcategory', async () => {
    const mockCatId = `${guardian.prefix}cat`;
    const mockSubId = `${guardian.prefix}sub`;

    const catRes = await adminFetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mockCatId,
        name: { EN: "Mock Health", ZH: "测试健康", BM: "Kesihatan Olok" },
        desc: { EN: "Mock Desc", ZH: "测试描述", BM: "Penerangan Olok" },
        color: "blue",
        listOrder: 999,
      }),
    });
    assert.equal(catRes.status, 200);

    const subRes = await adminFetch(`${baseUrl}/api/subcategories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mockSubId,
        mainId: mockCatId,
        name: { EN: "Mock Subtopic", ZH: "测试子专题", BM: "Subtopik Olok" },
        desc: { EN: "Sub desc", ZH: "子描述", BM: "Penerangan sub" },
      }),
    });
    assert.equal(subRes.status, 200);

    // Verify presence
    const verifyRes = await adminFetch(`${baseUrl}/api/categories`);
    const cats = await verifyRes.json();
    const createdCat = cats.find((c: any) => c.id === mockCatId);
    assert.ok(createdCat, 'Created category should exist');
    assert.equal(createdCat.name.EN, "Mock Health");
    const createdSub = createdCat.subs.find((s: any) => s.id === mockSubId);
    assert.ok(createdSub, 'Created subcategory should exist inside category');
  });

  // 2. FAQs CRUD
  const mockFaqId = `${guardian.prefix}faq`;
  await testCase('POST /api/faqs - creates a doctor-verified clinical FAQ', async () => {
    const res = await adminFetch(`${baseUrl}/api/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mockFaqId,
        mainId: `${guardian.prefix}cat`,
        subId: `${guardian.prefix}sub`,
        q: { EN: "How to stay hydrated?", ZH: "如何保持充足水分？", BM: "Bagaimana kekal hidrasi?" },
        a: { EN: "Drink 2-3 liters of clean water daily.", ZH: "每日饮用2-3升清水。", BM: "Minum 2-3 liter air bersih setiap hari." },
        doctorName: "Verified Medical Officer",
        createdBy: "admin",
        createdAt: "10:00:00 on 29/10/2026",
        views: 10,
      }),
    });
    assert.equal(res.status, 200);

    const getRes = await adminFetch(`${baseUrl}/api/faqs`);
    const faqs = await getRes.json();
    const createdFaq = faqs.find((f: any) => f.id === mockFaqId);
    assert.ok(createdFaq, 'Created FAQ must exist');
    assert.equal(createdFaq.doctorName, "Verified Medical Officer");
    assert.equal(createdFaq.views, 10);
  });

  await testCase('POST /api/faqs/:id/view - increments FAQ view click count', async () => {
    const viewRes = await fetch(`${baseUrl}/api/faqs/${mockFaqId}/view`, { method: 'POST' });
    assert.equal(viewRes.status, 200);
    const viewData = await viewRes.json();
    assert.equal(viewData.views, 11, 'Views counter must increment from 10 to 11');
  });

  await testCase('PUT /api/faqs/:id - updates FAQ question content', async () => {
    const putRes = await adminFetch(`${baseUrl}/api/faqs/${mockFaqId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: { EN: "Updated Question?", ZH: "更新的问题？", BM: "Soalan Dikemas Kini?" },
      }),
    });
    assert.equal(putRes.status, 200);

    const getRes = await adminFetch(`${baseUrl}/api/faqs`);
    const faqs = await getRes.json();
    const updated = faqs.find((f: any) => f.id === mockFaqId);
    assert.equal(updated.q.EN, "Updated Question?");
  });

  // 3. User Registration & Member Management
  const mockUsername = `${guardian.prefix}user`;
  await testCase('POST /api/members/register - registers new member', async () => {
    const regRes = await fetch(`${baseUrl}/api/members/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: mockUsername,
        password: "test_password_123",
        email: `${mockUsername}@example.com`,
        fullName: "Mock Test Member",
        age: "29",
        gender: "Female",
        birthday: "1997-04-12",
        country: "Malaysia",
        private: false,
      }),
    });
    assert.equal(regRes.status, 200);

    const membersRes = await fetch(`${baseUrl}/api/members`);
    const members = await membersRes.json();
    const user = members.find((m: any) => m.username === mockUsername);
    assert.ok(user, 'Registered user must exist in members list');
    assert.equal(user.fullName, "Mock Test Member");
  });

  await testCase('POST /api/members/register - rejects duplicate username with 400', async () => {
    const dupRes = await fetch(`${baseUrl}/api/members/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: mockUsername,
        password: "another_password",
        email: "other@example.com",
      }),
    });
    assert.equal(dupRes.status, 400);
    const err = await dupRes.json();
    assert.ok(err.error.includes('already taken'));
  });

  await testCase('PUT /api/members/:username - updates member profile and admin access level', async () => {
    const updateRes = await adminFetch(`${baseUrl}/api/members/${mockUsername}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: "Updated Mock Name",
        adminLevel: 1,
        role: "moderator",
        signature: "Health is wealth",
      }),
    });
    assert.equal(updateRes.status, 200);

    const membersRes = await adminFetch(`${baseUrl}/api/members`);
    const members = await membersRes.json();
    const user = members.find((m: any) => m.username === mockUsername);
    assert.equal(user.fullName, "Updated Mock Name");
    assert.equal(user.adminLevel, 1);
    assert.equal(user.role, "moderator");
    assert.equal(user.signature, "Health is wealth");
  });

  await testCase('POST /api/members/login - issues session tokens; moderator and member sessions work', async () => {
    const bad = await fetch(`${baseUrl}/api/members/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: mockUsername, password: 'not-the-password' }),
    });
    assert.equal(bad.status, 401);
    const nobody = await fetch(`${baseUrl}/api/members/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `${guardian.prefix}nobody`, password: 'x' }),
    });
    assert.equal(nobody.status, 404);

    // The member was promoted to moderator by the earlier test; demote back so topic tests run as a plain member
    await adminFetch(`${baseUrl}/api/members/${mockUsername}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user', adminLevel: 0 }),
    });
    memberFetch = withToken(await loginAs(baseUrl, mockUsername, 'test_password_123'));

    await fetch(`${baseUrl}/api/members/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: modUsername, password: 'mod_password_123', email: `${modUsername}@example.com` }),
    });
    const promote = await adminFetch(`${baseUrl}/api/members/${modUsername}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'moderator', adminLevel: 1 }),
    });
    assert.equal(promote.status, 200);
    modFetch = withToken(await loginAs(baseUrl, modUsername, 'mod_password_123'));

    assert.equal((await memberFetch(`${baseUrl}/api/pms`)).status, 200);
    assert.equal((await modFetch(`${baseUrl}/api/pms`)).status, 200);
  });

  // 4. Discussion Board (Topics & Posts)
  const mockTopicId = `${guardian.prefix}top`;
  const mockPostId = `${guardian.prefix}post`;
  await testCase('POST /api/topics - creates new forum topic with initial post', async () => {
    const topRes = await memberFetch(`${baseUrl}/api/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mockTopicId,
        forumId: `${guardian.prefix}cat`,
        subId: `${guardian.prefix}sub`,
        title: { EN: "Mock Health Discussion", ZH: "测试健康讨论", BM: "Perbincangan Kesihatan Olok" },
        author: mockUsername,
        priority: "High",
        created: "10:15:00 on 29/10/2026",
        initialPost: {
          id: mockPostId,
          author: mockUsername,
          content: { EN: "First question content.", ZH: "首贴内容。", BM: "Kandungan pos pertama." },
        },
      }),
    });
    assert.equal(topRes.status, 200);

    const topicsRes = await memberFetch(`${baseUrl}/api/topics`);
    const topics = await topicsRes.json();
    const createdTopic = topics.find((t: any) => t.id === mockTopicId);
    assert.ok(createdTopic, 'Created topic must exist');
    assert.equal(createdTopic.priority, "High");
    assert.equal(createdTopic.author, mockUsername);
  });

  const mockReplyId = `${guardian.prefix}reply`;
  await testCase('POST /api/posts - creates reply and increments topic replies counter', async () => {
    const replyRes = await memberFetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mockReplyId,
        topicId: mockTopicId,
        author: mockUsername,
        content: { EN: "This is a reply post.", ZH: "这是一则回复。", BM: "Ini adalah pos balasan." },
        time: "10:20:00 on 29/10/2026",
      }),
    });
    assert.equal(replyRes.status, 200);

    const postsRes = await memberFetch(`${baseUrl}/api/posts`);
    const posts = await postsRes.json();
    const reply = posts.find((p: any) => p.id === mockReplyId);
    assert.ok(reply, 'Reply post must exist');

    const topicsRes = await memberFetch(`${baseUrl}/api/topics`);
    const topics = await topicsRes.json();
    const topic = topics.find((t: any) => t.id === mockTopicId);
    assert.equal(topic.replies, 1, 'Topic replies counter should increment to 1');
  });

  await testCase('PUT /api/posts/:id - edits post content', async () => {
    const editRes = await memberFetch(`${baseUrl}/api/posts/${mockReplyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { EN: "Edited reply text", ZH: "已编辑的回复内容", BM: "Teks balasan telah disunting" },
      }),
    });
    assert.equal(editRes.status, 200);

    const postsRes = await memberFetch(`${baseUrl}/api/posts`);
    const posts = await postsRes.json();
    const updated = posts.find((p: any) => p.id === mockReplyId);
    assert.equal(updated.content.EN, "Edited reply text");
  });

  await testCase('DELETE /api/posts/:id - deletes reply and decrements topic replies counter', async () => {
    const delRes = await memberFetch(`${baseUrl}/api/posts/${mockReplyId}`, { method: 'DELETE' });
    assert.equal(delRes.status, 200);

    const postsRes = await memberFetch(`${baseUrl}/api/posts`);
    const posts = await postsRes.json();
    assert.ok(!posts.some((p: any) => p.id === mockReplyId), 'Deleted post must not exist');

    const topicsRes = await memberFetch(`${baseUrl}/api/topics`);
    const topics = await topicsRes.json();
    const topic = topics.find((t: any) => t.id === mockTopicId);
    assert.equal(topic.replies, 0, 'Topic replies counter should decrement to 0');
  });

  // 5. Feedbacks
  const mockFeedbackId = `${guardian.prefix}fb`;
  await testCase('POST /api/feedbacks & DELETE /api/feedbacks/:id - handles user feedback lifecycle', async () => {
    const fbRes = await fetch(`${baseUrl}/api/feedbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mockFeedbackId,
        name: "Mock Feedbacker",
        email: "feedback@example.com",
        subject: "Test Suggestion",
        message: "Make navigation faster",
        cat: "suggestion",
        date: "10:30:00 on 29/10/2026",
      }),
    });
    assert.equal(fbRes.status, 200);

    const listRes = await adminFetch(`${baseUrl}/api/feedbacks`);
    const list = await listRes.json();
    const found = list.find((fb: any) => fb.id === mockFeedbackId);
    assert.ok(found, 'Created feedback must exist in list');

    const delRes = await adminFetch(`${baseUrl}/api/feedbacks/${mockFeedbackId}`, { method: 'DELETE' });
    assert.equal(delRes.status, 200);

    const listAfterRes = await adminFetch(`${baseUrl}/api/feedbacks`);
    const listAfter = await listAfterRes.json();
    assert.ok(!listAfter.some((fb: any) => fb.id === mockFeedbackId), 'Deleted feedback must be removed');
  });

  // 6. Private Messages
  const mockPmId = `${guardian.prefix}pm`;
  await testCase('POST /api/pms & PUT /api/pms/:id/read - handles private messaging lifecycle', async () => {
    const pmRes = await memberFetch(`${baseUrl}/api/pms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mockPmId,
        from: mockUsername,
        to: "admin",
        subject: "Medical Inquiry",
        content: "Private medical advice question",
        date: "10:35:00 on 29/10/2026",
        read: false,
      }),
    });
    assert.equal(pmRes.status, 200);

    const listRes = await memberFetch(`${baseUrl}/api/pms`);
    const list = await listRes.json();
    const pm = list.find((p: any) => p.id === mockPmId);
    assert.ok(pm, 'Sent private message must exist');
    assert.equal(pm.read, false);

    const readRes = await adminFetch(`${baseUrl}/api/pms/${mockPmId}/read`, { method: 'PUT' });
    assert.equal(readRes.status, 200);

    const listAfterRes = await adminFetch(`${baseUrl}/api/pms`);
    const listAfter = await listAfterRes.json();
    const readPm = listAfter.find((p: any) => p.id === mockPmId);
    assert.equal(readPm.read, true, 'Message status must be updated to read: true');

    const delPmRes = await adminFetch(`${baseUrl}/api/pms/${mockPmId}`, { method: 'DELETE' });
    assert.equal(delPmRes.status, 200);
  });

  // 7. Category & Subcategory Update and Delete (Admin CRUD)
  await testCase('PUT & DELETE /api/subcategories/:id and /api/categories/:id - completes category CRUD lifecycle', async () => {
    const testCatId = `${guardian.prefix}crud_cat`;
    const testSubId = `${guardian.prefix}crud_sub`;

    // Create
    await adminFetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testCatId,
        name: { EN: "Temp Health", ZH: "临时健康", BM: "Kesihatan Temp" },
        listOrder: 100,
      }),
    });
    await adminFetch(`${baseUrl}/api/subcategories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testSubId,
        mainId: testCatId,
        name: { EN: "Temp Topic", ZH: "临时子项", BM: "Topik Temp" },
      }),
    });

    // Update
    const putSubRes = await adminFetch(`${baseUrl}/api/subcategories/${testSubId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: { EN: "Renamed Subtopic", ZH: "已重命名子专题", BM: "Subtopik Dinamakan Semula" },
      }),
    });
    assert.equal(putSubRes.status, 200);

    const putCatRes = await adminFetch(`${baseUrl}/api/categories/${testCatId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: { EN: "Renamed Main Category", ZH: "已重命名主分类", BM: "Kategori Utama Dinamakan Semula" },
      }),
    });
    assert.equal(putCatRes.status, 200);

    // Verify update
    const verifyCatsRes = await adminFetch(`${baseUrl}/api/categories`);
    const allCats = await verifyCatsRes.json();
    const updatedCat = allCats.find((c: any) => c.id === testCatId);
    assert.ok(updatedCat);
    assert.equal(updatedCat.name.EN, "Renamed Main Category");
    const updatedSub = updatedCat.subs.find((s: any) => s.id === testSubId);
    assert.ok(updatedSub);
    assert.equal(updatedSub.name.EN, "Renamed Subtopic");

    // Delete subcategory
    const delSubRes = await adminFetch(`${baseUrl}/api/subcategories/${testSubId}`, { method: 'DELETE' });
    assert.equal(delSubRes.status, 200);

    // Delete category
    const delCatRes = await adminFetch(`${baseUrl}/api/categories/${testCatId}`, { method: 'DELETE' });
    assert.equal(delCatRes.status, 200);

    // Verify deletion
    const finalCatsRes = await adminFetch(`${baseUrl}/api/categories`);
    const finalCats = await finalCatsRes.json();
    assert.ok(!finalCats.some((c: any) => c.id === testCatId), 'Category must be deleted');
  });

  // 8. Doctor / Moderator Clinical Workflow
  await testCase('Doctor / Moderator - verifies role and creates clinical FAQ with doctor attribution', async () => {
    // Verify default doctor account
    const membersRes = await adminFetch(`${baseUrl}/api/members`);
    const members = await membersRes.json();
    const dr = members.find((m: any) => m.username === 'dr_lee');
    assert.ok(dr, 'Doctor dr_lee account must exist');
    assert.equal(dr.role, 'moderator');
    assert.equal(dr.adminLevel, 1);

    // Doctor creates clinical verified FAQ
    const docFaqId = `${guardian.prefix}doc_faq`;
    const docFaqRes = await modFetch(`${baseUrl}/api/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: docFaqId,
        mainId: 'pharmacy',
        subId: 'vitamin',
        q: { EN: "Can vitamin C prevent acute viral infections?", ZH: "维生素C能预防急性病毒感染吗？", BM: "Bolehkah vitamin C mencegah jangkitan virus akut?" },
        a: { EN: "Vitamin C supports cellular immune function, but regular supplementation does not entirely prevent catching common viral infections; it may marginally shorten symptom duration.", ZH: "维生素C支持细胞免疫机能，但日常补充并不能完全阻止病毒感染，仅可能略微缩短病程。", BM: "Vitamin C menyokong fungsi imun selular, tetapi suplemen harian tidak menghalang jangkitan secara mutlak." },
        doctorName: "Dr. Lee, Medical Officer",
        createdBy: "dr_lee",
        views: 0,
      }),
    });
    assert.equal(docFaqRes.status, 200);

    const faqsRes = await adminFetch(`${baseUrl}/api/faqs`);
    const faqs = await faqsRes.json();
    const docFaq = faqs.find((f: any) => f.id === docFaqId);
    assert.ok(docFaq);
    assert.equal(docFaq.doctorName, "Dr. Lee, Medical Officer");
    assert.equal(docFaq.createdBy, modUsername, 'createdBy must come from the session, not the request body');

    // Clean up
    await modFetch(`${baseUrl}/api/faqs/${docFaqId}`, { method: 'DELETE' });
  });

  // 9. Topic Deletion Cascading Posts (Moderator/Admin action)
  await testCase('DELETE /api/topics/:id - cascades deletion to associated topic posts', async () => {
    const cascadeTopicId = `${guardian.prefix}casc_topic`;
    const cascadePost1Id = `${guardian.prefix}casc_p1`;
    const cascadePost2Id = `${guardian.prefix}casc_p2`;

    const findMember = async () =>
      (await (await memberFetch(`${baseUrl}/api/members`)).json()).find((m: any) => m.username === mockUsername);
    const memberBefore = await findMember();

    // Create topic with first post
    await memberFetch(`${baseUrl}/api/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: cascadeTopicId,
        forumId: "healthy",
        subId: "quit",
        title: { EN: "Topic to delete", ZH: "待删主题", BM: "Topik untuk dipadam" },
        author: mockUsername,
        initialPost: {
          id: cascadePost1Id,
          author: mockUsername,
          content: { EN: "Initial post", ZH: "首贴", BM: "Pos awal" },
        },
      }),
    });

    // Add reply post
    await memberFetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: cascadePost2Id,
        topicId: cascadeTopicId,
        author: mockUsername,
        content: { EN: "Reply to be deleted with topic", ZH: "随主题被删的回复", BM: "Balasan yang akan dipadam bersama topik" },
      }),
    });

    // Verify both posts exist
    const postsBefore = await (await memberFetch(`${baseUrl}/api/posts`)).json();
    assert.ok(postsBefore.some((p: any) => p.id === cascadePost1Id));
    assert.ok(postsBefore.some((p: any) => p.id === cascadePost2Id));

    // Delete topic
    const delTopicRes = await adminFetch(`${baseUrl}/api/topics/${cascadeTopicId}`, { method: 'DELETE' });
    assert.equal(delTopicRes.status, 200);

    // Verify topic and posts are gone
    const topicsAfter = await (await memberFetch(`${baseUrl}/api/topics`)).json();
    assert.ok(!topicsAfter.some((t: any) => t.id === cascadeTopicId), 'Topic must be deleted');

    const postsAfter = await (await memberFetch(`${baseUrl}/api/posts`)).json();
    assert.ok(!postsAfter.some((p: any) => p.id === cascadePost1Id), 'Initial post must be cascaded');
    assert.ok(!postsAfter.some((p: any) => p.id === cascadePost2Id), 'Reply post must be cascaded');

    // The author's stored counters must return to their pre-topic values (no drift after a reload)
    if (memberBefore) {
      const memberAfter = await findMember();
      assert.equal(memberAfter.posts, memberBefore.posts, 'postsCount must be restored after topic deletion');
      assert.equal(memberAfter.topics, memberBefore.topics, 'topicsCount must be restored after topic deletion');
    }
  });

  // 10. Admin Email Broadcast & Outbox Status
  await testCase('POST /api/admin/broadcast-email & GET /api/admin/email-status - handles system-wide announcements', async () => {
    const broadcastRes = await adminFetch(`${baseUrl}/api/admin/broadcast-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `${guardian.prefix} Seasonal Health Advisory`,
        message: "Stay hydrated and wear masks during regional haze alerts.",
      }),
    });
    assert.equal(broadcastRes.status, 200);
    const broadcastData = await broadcastRes.json();
    assert.ok(broadcastData.success);
    assert.ok(broadcastData.count > 0);

    const statusRes = await adminFetch(`${baseUrl}/api/admin/email-status`);
    assert.equal(statusRes.status, 200);
    const statusData = await statusRes.json();
    assert.ok(Array.isArray(statusData.adminEmails));
    assert.ok(statusData.adminEmails.includes('admin@medifaq.my'));
    assert.ok(Array.isArray(statusData.logs));
    assert.ok(statusData.logs.some((l: any) => l.subject.includes(guardian.prefix)));
  });

  // 11. Admin Lockout Prevention
  await testCase('Admin Lockout Prevention - blocks demotion or deletion of last remaining administrator', async () => {
    // Attempting to demote the sole default admin 'admin' to user level 0
    const demoteRes = await adminFetch(`${baseUrl}/api/members/admin`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'user', adminLevel: 0 }),
    });
    assert.equal(demoteRes.status, 400, 'Demoting sole administrator must return 400 Bad Request');
    const demoteData = await demoteRes.json();
    assert.ok(demoteData.error.includes('administrator'));

    // Attempting to delete the sole default admin 'admin'
    const deleteRes = await adminFetch(`${baseUrl}/api/members/admin`, {
      method: 'DELETE',
    });
    assert.equal(deleteRes.status, 400, 'Deleting sole administrator must return 400 Bad Request');
    const deleteData = await deleteRes.json();
    assert.ok(deleteData.error.includes('administrator'));
  });

  // 12. Authentication & authorization enforcement
  const json = { 'Content-Type': 'application/json' };

  await testCase('Auth - anonymous callers are rejected (401) on every protected endpoint', async () => {
    const protectedCalls: Array<[string, string]> = [
      ['POST', '/api/categories'], ['PUT', '/api/categories/x'], ['DELETE', '/api/categories/x'],
      ['POST', '/api/subcategories'], ['POST', '/api/faqs'], ['DELETE', '/api/faqs/x'],
      ['POST', '/api/topics'], ['POST', '/api/posts'], ['PUT', '/api/posts/x'], ['DELETE', '/api/posts/x'],
      ['PUT', '/api/members/admin'], ['DELETE', '/api/members/admin'], ['DELETE', '/api/members/admin/posts'],
      ['GET', '/api/feedbacks'], ['DELETE', '/api/feedbacks'], ['GET', '/api/pms'], ['POST', '/api/pms'],
      ['GET', '/api/admin/email-status'], ['POST', '/api/admin/broadcast-email'],
    ];
    for (const [method, path] of protectedCalls) {
      const res = await fetch(`${baseUrl}${path}`, { method, headers: json, body: method === 'GET' || method === 'DELETE' ? undefined : '{}' });
      assert.equal(res.status, 401, `${method} ${path} must require a session`);
    }
  });

  await testCase('Auth - forged, tampered and garbage tokens are rejected', async () => {
    for (const token of ['garbage', 'a.b', `${Buffer.from('{"sub":"admin","ver":"x","exp":9999999999}').toString('base64url')}.AAAA`]) {
      const res = await withToken(token)(`${baseUrl}/api/pms`);
      assert.equal(res.status, 401);
    }
  });

  await testCase('Auth - members cannot use administrator or moderator endpoints (403)', async () => {
    const calls: Array<[string, string, any]> = [
      ['POST', '/api/categories', { id: `${guardian.prefix}nope`, name: { EN: 'x', ZH: 'x', BM: 'x' } }],
      ['POST', '/api/faqs', { q: { EN: 'x', ZH: 'x', BM: 'x' }, a: { EN: 'x', ZH: 'x', BM: 'x' } }],
      ['POST', '/api/admin/broadcast-email', { subject: 'x', message: 'x' }],
      ['DELETE', '/api/members/admin', undefined],
      ['PUT', '/api/members/admin', { fullName: 'hijacked' }],
    ];
    for (const [method, path, body] of calls) {
      const res = await memberFetch(`${baseUrl}${path}`, { method, headers: json, body: body ? JSON.stringify(body) : undefined });
      assert.equal(res.status, 403, `${method} ${path} must be forbidden for a plain member`);
    }
    assert.equal((await memberFetch(`${baseUrl}/api/feedbacks`)).status, 403);
    assert.equal((await modFetch(`${baseUrl}/api/admin/email-status`)).status, 403, 'a moderator is not an administrator');
  });

  await testCase('Auth - a member cannot promote themselves; profile edits that echo current values still work', async () => {
    const promote = await memberFetch(`${baseUrl}/api/members/${mockUsername}`, {
      method: 'PUT', headers: json, body: JSON.stringify({ role: 'admin', adminLevel: 3 }),
    });
    assert.equal(promote.status, 403);
    const echo = await memberFetch(`${baseUrl}/api/members/${mockUsername}`, {
      method: 'PUT', headers: json, body: JSON.stringify({ role: 'user', adminLevel: 0, signature: 'echoed profile' }),
    });
    assert.equal(echo.status, 200);
    const members = await (await fetch(`${baseUrl}/api/members`)).json();
    const me = members.find((m: any) => m.username === mockUsername);
    assert.equal(me.adminLevel, 0);
    assert.equal(me.signature, 'echoed profile');
  });

  await testCase('Auth - public registration never grants privileges when not running under NODE_ENV=test', async () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const escalationName = `${guardian.prefix}esc`;
    try {
      const res = await fetch(`${baseUrl}/api/members/register`, {
        method: 'POST', headers: json,
        body: JSON.stringify({ username: escalationName, password: 'esc_password_123', email: 'esc@example.com', role: 'admin', adminLevel: 3 }),
      });
      assert.equal(res.status, 200);
    } finally {
      process.env.NODE_ENV = previous;
    }
    const members = await (await fetch(`${baseUrl}/api/members`)).json();
    const esc = members.find((m: any) => m.username === escalationName);
    assert.equal(esc.adminLevel, 0);
    assert.equal(esc.role, 'user');
  });

  await testCase('Auth - author, sender and creator come from the session, not the request body', async () => {
    const topicId = `${guardian.prefix}forged_topic`;
    const topicRes = await memberFetch(`${baseUrl}/api/topics`, {
      method: 'POST', headers: json,
      body: JSON.stringify({
        id: topicId, forumId: 'healthy', subId: 'quit', author: 'admin',
        title: { EN: 'Forged', ZH: 'Forged', BM: 'Forged' },
        initialPost: { id: `${topicId}_p`, author: 'admin', content: { EN: 'x', ZH: 'x', BM: 'x' } },
      }),
    });
    assert.equal(topicRes.status, 200);
    const topics = await (await fetch(`${baseUrl}/api/topics`)).json();
    assert.equal(topics.find((t: any) => t.id === topicId).author, mockUsername);
    const posts = await (await fetch(`${baseUrl}/api/posts`)).json();
    assert.equal(posts.find((p: any) => p.id === `${topicId}_p`).author, mockUsername);

    const pmId = `${guardian.prefix}forged_pm`;
    await memberFetch(`${baseUrl}/api/pms`, {
      method: 'POST', headers: json,
      body: JSON.stringify({ id: pmId, from: 'admin', to: modUsername, subject: 's', content: 'c' }),
    });
    const modPms = await (await modFetch(`${baseUrl}/api/pms`)).json();
    assert.equal(modPms.find((p: any) => p.id === pmId).from, mockUsername);
  });

  await testCase('Auth - only the author or a moderator can edit/delete forum content', async () => {
    const topicId = `${guardian.prefix}forged_topic`;
    const postId = `${topicId}_p`;
    const content = { content: { EN: 'edit', ZH: 'edit', BM: 'edit' } };
    // another plain member: create a third account on the fly
    const otherName = `${guardian.prefix}other`;
    await fetch(`${baseUrl}/api/members/register`, {
      method: 'POST', headers: json,
      body: JSON.stringify({ username: otherName, password: 'other_password_123', email: `${otherName}@example.com` }),
    });
    const otherFetch = withToken(await loginAs(baseUrl, otherName, 'other_password_123'));
    assert.equal((await otherFetch(`${baseUrl}/api/posts/${postId}`, { method: 'PUT', headers: json, body: JSON.stringify(content) })).status, 403);
    assert.equal((await otherFetch(`${baseUrl}/api/posts/${postId}`, { method: 'DELETE' })).status, 403);
    assert.equal((await otherFetch(`${baseUrl}/api/topics/${topicId}`, { method: 'DELETE' })).status, 403);
    assert.equal((await modFetch(`${baseUrl}/api/posts/${postId}`, { method: 'PUT', headers: json, body: JSON.stringify(content) })).status, 200);
    assert.equal((await memberFetch(`${baseUrl}/api/topics/${topicId}`, { method: 'DELETE' })).status, 200, 'the author may delete their own topic');
  });

  await testCase('Auth - private messages are visible only to their sender and recipient', async () => {
    const pmId = `${guardian.prefix}secret_pm`;
    assert.equal((await memberFetch(`${baseUrl}/api/pms`, {
      method: 'POST', headers: json,
      body: JSON.stringify({ id: pmId, to: modUsername, subject: 'Private', content: 'For the moderator only' }),
    })).status, 200);
    const ids = async (f: typeof fetch) => (await (await f(`${baseUrl}/api/pms`)).json()).map((p: any) => p.id);
    assert.ok((await ids(modFetch)).includes(pmId));
    assert.ok((await ids(memberFetch)).includes(pmId));
    assert.ok(!(await ids(adminFetch)).includes(pmId), 'not even administrators can read other people\'s messages');
    assert.equal((await adminFetch(`${baseUrl}/api/pms/${pmId}/read`, { method: 'PUT' })).status, 403);
    assert.equal((await adminFetch(`${baseUrl}/api/pms/${pmId}`, { method: 'DELETE' })).status, 403);
    assert.equal((await memberFetch(`${baseUrl}/api/pms/${pmId}/read`, { method: 'PUT' })).status, 403, 'only the recipient marks a message read');
    assert.equal((await modFetch(`${baseUrl}/api/pms/${pmId}/read`, { method: 'PUT' })).status, 200);
  });

  await testCase('Auth - private e-mail addresses are hidden from other members', async () => {
    await memberFetch(`${baseUrl}/api/members/${mockUsername}`, { method: 'PUT', headers: json, body: JSON.stringify({ emailPrivate: true }) });
    const asGuest = (await (await fetch(`${baseUrl}/api/members`)).json()).find((m: any) => m.username === mockUsername);
    const asSelf = (await (await memberFetch(`${baseUrl}/api/members`)).json()).find((m: any) => m.username === mockUsername);
    const asAdmin = (await (await adminFetch(`${baseUrl}/api/members`)).json()).find((m: any) => m.username === mockUsername);
    assert.equal(asGuest.email, '');
    assert.equal(asSelf.email, `${mockUsername}@example.com`);
    assert.equal(asAdmin.email, `${mockUsername}@example.com`);
  });

  // 13. Password storage & change
  await testCase('Passwords - stored hashed; legacy plaintext rows are upgraded on login', async () => {
    const [row] = await db.select().from(users).where(eq(users.username, mockUsername));
    assert.ok(row.password?.startsWith('scrypt1$'), 'registered passwords must be stored as scrypt hashes');
    assert.ok(!row.password?.includes('test_password_123'));

    const legacyName = `${guardian.prefix}legacy`;
    await db.insert(users).values({ uid: `uid_${legacyName}`, username: legacyName, password: 'legacy_plain_pw', email: `${legacyName}@example.com`, role: 'user', adminLevel: 0 });
    await loginAs(baseUrl, legacyName, 'legacy_plain_pw');
    const [upgraded] = await db.select().from(users).where(eq(users.username, legacyName));
    assert.ok(upgraded.password?.startsWith('scrypt1$'), 'a plaintext row must be re-saved as a hash after a successful login');
    await loginAs(baseUrl, legacyName, 'legacy_plain_pw'); // still works after the upgrade
  });

  await testCase('Passwords - changing needs the current password, issues a new session and ends old ones', async () => {
    const oldSession = withToken(await loginAs(baseUrl, mockUsername, 'test_password_123'));
    const wrong = await oldSession(`${baseUrl}/api/members/${mockUsername}`, {
      method: 'PUT', headers: json, body: JSON.stringify({ currentPassword: 'nope', password: 'brand_new_pw_1' }),
    });
    assert.equal(wrong.status, 403);
    const noCurrent = await oldSession(`${baseUrl}/api/members/${mockUsername}`, {
      method: 'PUT', headers: json, body: JSON.stringify({ password: 'brand_new_pw_1' }),
    });
    assert.equal(noCurrent.status, 403);

    const ok = await oldSession(`${baseUrl}/api/members/${mockUsername}`, {
      method: 'PUT', headers: json, body: JSON.stringify({ currentPassword: 'test_password_123', password: 'brand_new_pw_1' }),
    });
    assert.equal(ok.status, 200);
    const { token } = await ok.json();
    assert.ok(token, 'a fresh session token must be returned');

    assert.equal((await oldSession(`${baseUrl}/api/pms`)).status, 401, 'sessions issued before the change must stop working');
    assert.equal((await withToken(token)(`${baseUrl}/api/pms`)).status, 200);
    await assert.rejects(() => loginAs(baseUrl, mockUsername, 'test_password_123'));
    await loginAs(baseUrl, mockUsername, 'brand_new_pw_1');
  });

  return { passed, failed };
}
