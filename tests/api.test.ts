import assert from 'node:assert/strict';
import { TestGuardian } from './test-guardian.ts';

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

    const catRes = await fetch(`${baseUrl}/api/categories`, {
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

    const subRes = await fetch(`${baseUrl}/api/subcategories`, {
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
    const verifyRes = await fetch(`${baseUrl}/api/categories`);
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
    const res = await fetch(`${baseUrl}/api/faqs`, {
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

    const getRes = await fetch(`${baseUrl}/api/faqs`);
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
    const putRes = await fetch(`${baseUrl}/api/faqs/${mockFaqId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: { EN: "Updated Question?", ZH: "更新的问题？", BM: "Soalan Dikemas Kini?" },
      }),
    });
    assert.equal(putRes.status, 200);

    const getRes = await fetch(`${baseUrl}/api/faqs`);
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
    const updateRes = await fetch(`${baseUrl}/api/members/${mockUsername}`, {
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

    const membersRes = await fetch(`${baseUrl}/api/members`);
    const members = await membersRes.json();
    const user = members.find((m: any) => m.username === mockUsername);
    assert.equal(user.fullName, "Updated Mock Name");
    assert.equal(user.adminLevel, 1);
    assert.equal(user.role, "moderator");
    assert.equal(user.signature, "Health is wealth");
  });

  // 4. Discussion Board (Topics & Posts)
  const mockTopicId = `${guardian.prefix}top`;
  const mockPostId = `${guardian.prefix}post`;
  await testCase('POST /api/topics - creates new forum topic with initial post', async () => {
    const topRes = await fetch(`${baseUrl}/api/topics`, {
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

    const topicsRes = await fetch(`${baseUrl}/api/topics`);
    const topics = await topicsRes.json();
    const createdTopic = topics.find((t: any) => t.id === mockTopicId);
    assert.ok(createdTopic, 'Created topic must exist');
    assert.equal(createdTopic.priority, "High");
    assert.equal(createdTopic.author, mockUsername);
  });

  const mockReplyId = `${guardian.prefix}reply`;
  await testCase('POST /api/posts - creates reply and increments topic replies counter', async () => {
    const replyRes = await fetch(`${baseUrl}/api/posts`, {
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

    const postsRes = await fetch(`${baseUrl}/api/posts`);
    const posts = await postsRes.json();
    const reply = posts.find((p: any) => p.id === mockReplyId);
    assert.ok(reply, 'Reply post must exist');

    const topicsRes = await fetch(`${baseUrl}/api/topics`);
    const topics = await topicsRes.json();
    const topic = topics.find((t: any) => t.id === mockTopicId);
    assert.equal(topic.replies, 1, 'Topic replies counter should increment to 1');
  });

  await testCase('PUT /api/posts/:id - edits post content', async () => {
    const editRes = await fetch(`${baseUrl}/api/posts/${mockReplyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { EN: "Edited reply text", ZH: "已编辑的回复内容", BM: "Teks balasan telah disunting" },
      }),
    });
    assert.equal(editRes.status, 200);

    const postsRes = await fetch(`${baseUrl}/api/posts`);
    const posts = await postsRes.json();
    const updated = posts.find((p: any) => p.id === mockReplyId);
    assert.equal(updated.content.EN, "Edited reply text");
  });

  await testCase('DELETE /api/posts/:id - deletes reply and decrements topic replies counter', async () => {
    const delRes = await fetch(`${baseUrl}/api/posts/${mockReplyId}`, { method: 'DELETE' });
    assert.equal(delRes.status, 200);

    const postsRes = await fetch(`${baseUrl}/api/posts`);
    const posts = await postsRes.json();
    assert.ok(!posts.some((p: any) => p.id === mockReplyId), 'Deleted post must not exist');

    const topicsRes = await fetch(`${baseUrl}/api/topics`);
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

    const listRes = await fetch(`${baseUrl}/api/feedbacks`);
    const list = await listRes.json();
    const found = list.find((fb: any) => fb.id === mockFeedbackId);
    assert.ok(found, 'Created feedback must exist in list');

    const delRes = await fetch(`${baseUrl}/api/feedbacks/${mockFeedbackId}`, { method: 'DELETE' });
    assert.equal(delRes.status, 200);

    const listAfterRes = await fetch(`${baseUrl}/api/feedbacks`);
    const listAfter = await listAfterRes.json();
    assert.ok(!listAfter.some((fb: any) => fb.id === mockFeedbackId), 'Deleted feedback must be removed');
  });

  // 6. Private Messages
  const mockPmId = `${guardian.prefix}pm`;
  await testCase('POST /api/pms & PUT /api/pms/:id/read - handles private messaging lifecycle', async () => {
    const pmRes = await fetch(`${baseUrl}/api/pms`, {
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

    const listRes = await fetch(`${baseUrl}/api/pms`);
    const list = await listRes.json();
    const pm = list.find((p: any) => p.id === mockPmId);
    assert.ok(pm, 'Sent private message must exist');
    assert.equal(pm.read, false);

    const readRes = await fetch(`${baseUrl}/api/pms/${mockPmId}/read`, { method: 'PUT' });
    assert.equal(readRes.status, 200);

    const listAfterRes = await fetch(`${baseUrl}/api/pms`);
    const listAfter = await listAfterRes.json();
    const readPm = listAfter.find((p: any) => p.id === mockPmId);
    assert.equal(readPm.read, true, 'Message status must be updated to read: true');
  });

  return { passed, failed };
}
