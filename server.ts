import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { eq, desc } from 'drizzle-orm';
import { db } from './src/db/index.ts';
import {
  users,
  categories,
  subcategories,
  faqs,
  forumTopics,
  forumPosts,
  feedbacks,
  privateMessages
} from './src/db/schema.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Routes

// 1. Categories & Subcategories
app.get('/api/categories', async (_req, res) => {
  try {
    const cats = await db.select().from(categories).orderBy(categories.listOrder);
    const subs = await db.select().from(subcategories);

    const formatted = cats.map((cat) => ({
      id: cat.id,
      name: { EN: cat.nameEn, ZH: cat.nameZh, BM: cat.nameBm },
      desc: { EN: cat.descEn || '', ZH: cat.descZh || '', BM: cat.descBm || '' },
      color: cat.color || 'blue',
      listOrder: cat.listOrder || 1,
      subs: subs
        .filter((s) => s.mainId === cat.id)
        .map((s) => ({
          id: s.id,
          mainId: s.mainId,
          name: { EN: s.nameEn, ZH: s.nameZh, BM: s.nameBm },
          desc: s.descEn ? { EN: s.descEn, ZH: s.descZh || '', BM: s.descBm || '' } : undefined,
        })),
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { id, name, desc, color, listOrder } = req.body;
    await db.insert(categories).values({
      id,
      nameEn: name.EN,
      nameZh: name.ZH,
      nameBm: name.BM,
      descEn: desc?.EN,
      descZh: desc?.ZH,
      descBm: desc?.BM,
      color: color || 'blue',
      listOrder: listOrder || 1,
    });
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.post('/api/subcategories', async (req, res) => {
  try {
    const { id, mainId, name, desc } = req.body;
    await db.insert(subcategories).values({
      id,
      mainId,
      nameEn: name.EN,
      nameZh: name.ZH,
      nameBm: name.BM,
      descEn: desc?.EN,
      descZh: desc?.ZH,
      descBm: desc?.BM,
    });
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error creating subcategory:', err);
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
});

// 2. FAQs
app.get('/api/faqs', async (_req, res) => {
  try {
    const rows = await db.select().from(faqs);
    const formatted = rows.map((f) => ({
      id: f.id,
      mainId: f.mainId,
      subId: f.subId,
      q: { EN: f.qEn, ZH: f.qZh, BM: f.qBm },
      a: { EN: f.aEn, ZH: f.aZh, BM: f.aBm },
      doctorName: f.doctorName || 'Verified Medical Officer',
      createdBy: f.createdBy || 'admin',
      createdAt: f.createdAt,
      views: f.views || 0,
    }));
    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching faqs:', err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.post('/api/faqs', async (req, res) => {
  try {
    const { id, mainId, subId, q, a, doctorName, createdBy, createdAt, views } = req.body;
    await db.insert(faqs).values({
      id: id || `f_${Date.now()}`,
      mainId,
      subId,
      qEn: q.EN,
      qZh: q.ZH,
      qBm: q.BM,
      aEn: a.EN,
      aZh: a.ZH,
      aBm: a.BM,
      doctorName: doctorName || 'Verified Medical Officer',
      createdBy: createdBy || 'admin',
      createdAt: createdAt || new Date().toLocaleString(),
      views: views || 0,
    });
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error creating FAQ:', err);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

app.put('/api/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { q, a, doctorName, mainId, subId } = req.body;
    await db.update(faqs)
      .set({
        mainId: mainId || undefined,
        subId: subId || undefined,
        qEn: q?.EN,
        qZh: q?.ZH,
        qBm: q?.BM,
        aEn: a?.EN,
        aZh: a?.ZH,
        aBm: a?.BM,
        doctorName: doctorName || undefined,
      })
      .where(eq(faqs.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating FAQ:', err);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

app.delete('/api/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(faqs).where(eq(faqs.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting FAQ:', err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

app.post('/api/faqs/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const faqList = await db.select().from(faqs).where(eq(faqs.id, id));
    if (faqList.length > 0) {
      const currentViews = (faqList[0].views || 0) + 1;
      await db.update(faqs).set({ views: currentViews }).where(eq(faqs.id, id));
      res.json({ views: currentViews });
    } else {
      res.status(404).json({ error: 'FAQ not found' });
    }
  } catch (err: any) {
    console.error('Error incrementing FAQ views:', err);
    res.status(500).json({ error: 'Failed to increment view' });
  }
});

// 3. Discussion Board (Topics & Posts)
app.get('/api/topics', async (_req, res) => {
  try {
    const rows = await db.select().from(forumTopics).orderBy(desc(forumTopics.createdAt));
    const formatted = rows.map((t) => ({
      id: t.id,
      forumId: t.forumId,
      subId: t.subId,
      title: { EN: t.titleEn, ZH: t.titleZh, BM: t.titleBm },
      author: t.author,
      replies: t.replies || 0,
      views: t.views || 0,
      lastAuthor: t.lastAuthor || t.author,
      lastTime: t.lastTime || t.createdAt,
      priority: (t.priority || 'Normal') as 'Normal' | 'High' | 'Low',
      created: t.createdAt,
    }));
    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching topics:', err);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

app.post('/api/topics', async (req, res) => {
  try {
    const { id, forumId, subId, title, author, priority, created, initialPost } = req.body;
    const topicId = id || `t_${Date.now()}`;
    await db.insert(forumTopics).values({
      id: topicId,
      forumId,
      subId,
      titleEn: title.EN,
      titleZh: title.ZH,
      titleBm: title.BM,
      author,
      priority: priority || 'Normal',
      createdAt: created || new Date().toLocaleString(),
      lastAuthor: author,
      lastTime: created || new Date().toLocaleString(),
      replies: 0,
      views: 1,
    });

    if (initialPost) {
      await db.insert(forumPosts).values({
        id: initialPost.id || `p_${Date.now()}`,
        topicId,
        author: initialPost.author || author,
        avatar: initialPost.avatar || (author.substring(0, 2).toUpperCase()),
        postCount: initialPost.postCount || 1,
        time: initialPost.time || created || new Date().toLocaleString(),
        contentEn: initialPost.content.EN,
        contentZh: initialPost.content.ZH,
        contentBm: initialPost.content.BM,
      });
    }

    // Increment user's topicsCount & postsCount
    const authorUser = await db.select().from(users).where(eq(users.username, author));
    if (authorUser.length > 0) {
      await db.update(users).set({
        topicsCount: (authorUser[0].topicsCount || 0) + 1,
        postsCount: (authorUser[0].postsCount || 0) + 1,
      }).where(eq(users.username, author));
    }

    res.json({ success: true, topicId });
  } catch (err: any) {
    console.error('Error creating topic:', err);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

app.delete('/api/topics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(forumPosts).where(eq(forumPosts.topicId, id));
    await db.delete(forumTopics).where(eq(forumTopics.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting topic:', err);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

app.get('/api/posts', async (_req, res) => {
  try {
    const rows = await db.select().from(forumPosts);
    const formatted = rows.map((p) => ({
      id: p.id,
      topicId: p.topicId,
      author: p.author,
      avatar: p.avatar || 'US',
      postCount: p.postCount || 1,
      time: p.time,
      content: { EN: p.contentEn, ZH: p.contentZh, BM: p.contentBm },
    }));
    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { id, topicId, author, avatar, postCount, time, content } = req.body;
    const postId = id || `p_${Date.now()}`;
    await db.insert(forumPosts).values({
      id: postId,
      topicId,
      author,
      avatar: avatar || (author.substring(0, 2).toUpperCase()),
      postCount: postCount || 1,
      time: time || new Date().toLocaleString(),
      contentEn: content.EN,
      contentZh: content.ZH,
      contentBm: content.BM,
    });

    // Update topic replies and last info
    const currentTopic = await db.select().from(forumTopics).where(eq(forumTopics.id, topicId));
    if (currentTopic.length > 0) {
      await db.update(forumTopics).set({
        replies: (currentTopic[0].replies || 0) + 1,
        lastAuthor: author,
        lastTime: time || new Date().toLocaleString(),
      }).where(eq(forumTopics.id, topicId));
    }

    // Increment user post count
    const authorUser = await db.select().from(users).where(eq(users.username, author));
    if (authorUser.length > 0) {
      await db.update(users).set({
        postsCount: (authorUser[0].postsCount || 0) + 1,
      }).where(eq(users.username, author));
    }

    res.json({ success: true, postId });
  } catch (err: any) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await db.update(forumPosts).set({
      contentEn: content.EN,
      contentZh: content.ZH,
      contentBm: content.BM,
    }).where(eq(forumPosts.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postToDelete = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    if (postToDelete.length > 0) {
      const topicId = postToDelete[0].topicId;
      await db.delete(forumPosts).where(eq(forumPosts.id, id));
      const currentTopic = await db.select().from(forumTopics).where(eq(forumTopics.id, topicId));
      if (currentTopic.length > 0 && (currentTopic[0].replies || 0) > 0) {
        await db.update(forumTopics).set({
          replies: (currentTopic[0].replies || 1) - 1,
        }).where(eq(forumTopics.id, topicId));
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// 4. Members Management & Authentication
app.get('/api/members', async (_req, res) => {
  try {
    const rows = await db.select().from(users);
    const formatted = rows.map((u) => ({
      username: u.username,
      password: u.password || '',
      email: u.email,
      emailPrivate: u.emailPrivate ?? false,
      fullName: u.fullName || u.username,
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      address: u.address || '',
      homepageUrl: u.homepageUrl || '',
      signature: u.signature || '',
      biography: u.biography || '',
      age: u.age || '',
      gender: u.gender || 'Not specified',
      birthday: u.birthday || '',
      country: u.country || 'Malaysia',
      joinDate: u.joinDate || '2003-01-01',
      posts: u.postsCount || 0,
      topics: u.topicsCount || 0,
      role: (u.role || 'user') as 'user' | 'moderator' | 'admin',
      adminLevel: u.adminLevel ?? 0,
      lastOnline: u.lastOnline || 'Never',
      memberNumber: u.id,
    }));
    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

app.post('/api/members/register', async (req, res) => {
  try {
    const m = req.body;
    const existing = await db.select().from(users).where(eq(users.username, m.username));
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    await db.insert(users).values({
      uid: `uid_${m.username}_${Date.now()}`,
      username: m.username,
      password: m.password,
      email: m.email,
      emailPrivate: m.emailPrivate ?? false,
      fullName: m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.username,
      firstName: m.firstName || '',
      lastName: m.lastName || '',
      address: m.address || '',
      homepageUrl: m.homepageUrl || '',
      signature: m.signature || '',
      biography: m.biography || '',
      age: m.age ? String(m.age) : '',
      gender: m.gender || '',
      birthday: m.birthday || '',
      country: m.country || 'Malaysia',
      role: m.role || 'user',
      adminLevel: m.adminLevel ?? 0,
      joinDate: m.joinDate || new Date().toISOString().split('T')[0],
      lastOnline: 'Just now',
      postsCount: 0,
      topicsCount: 0,
    });

    res.json({ success: true, username: m.username });
  } catch (err: any) {
    console.error('Error registering member:', err);
    res.status(500).json({ error: 'Failed to register member' });
  }
});

app.put('/api/members/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const updateData: any = {};
    const body = req.body;

    if (body.password !== undefined) updateData.password = body.password;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.emailPrivate !== undefined) updateData.emailPrivate = body.emailPrivate;
    if (body.fullName !== undefined) updateData.fullName = body.fullName;
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.homepageUrl !== undefined) updateData.homepageUrl = body.homepageUrl;
    if (body.signature !== undefined) updateData.signature = body.signature;
    if (body.biography !== undefined) updateData.biography = body.biography;
    if (body.age !== undefined) updateData.age = String(body.age);
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.birthday !== undefined) updateData.birthday = body.birthday;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.adminLevel !== undefined) updateData.adminLevel = body.adminLevel;
    if (body.lastOnline !== undefined) updateData.lastOnline = body.lastOnline;

    await db.update(users).set(updateData).where(eq(users.username, username));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating member:', err);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.delete('/api/members/:username', async (req, res) => {
  try {
    const { username } = req.params;
    await db.delete(users).where(eq(users.username, username));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting member:', err);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

app.delete('/api/members/:username/posts', async (req, res) => {
  try {
    const { username } = req.params;
    await db.delete(forumPosts).where(eq(forumPosts.author, username));
    await db.update(users).set({ postsCount: 0 }).where(eq(users.username, username));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting member posts:', err);
    res.status(500).json({ error: 'Failed to delete member posts' });
  }
});

// 5. Feedbacks
app.get('/api/feedbacks', async (_req, res) => {
  try {
    const rows = await db.select().from(feedbacks).orderBy(desc(feedbacks.date));
    const formatted = rows.map((f) => ({
      id: f.id,
      name: f.name,
      email: f.email,
      subject: f.subject,
      message: f.message,
      cat: f.cat as 'suggestion' | 'complaint' | 'compliment',
      date: f.date,
    }));
    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

app.post('/api/feedbacks', async (req, res) => {
  try {
    const { id, name, email, subject, message, cat, date } = req.body;
    await db.insert(feedbacks).values({
      id: id || `fb_${Date.now()}`,
      name,
      email,
      subject,
      message,
      cat,
      date: date || new Date().toLocaleString(),
    });
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error creating feedback:', err);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

app.delete('/api/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(feedbacks).where(eq(feedbacks.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// 6. Private Messages
app.get('/api/pms', async (_req, res) => {
  try {
    const rows = await db.select().from(privateMessages).orderBy(desc(privateMessages.date));
    const formatted = rows.map((p) => ({
      id: p.id,
      from: p.fromUser,
      to: p.toUser,
      subject: p.subject,
      content: p.content,
      date: p.date,
      read: p.read ?? false,
    }));
    res.json(formatted);
  } catch (err: any) {
    console.error('Error fetching private messages:', err);
    res.status(500).json({ error: 'Failed to fetch private messages' });
  }
});

app.post('/api/pms', async (req, res) => {
  try {
    const { id, from, to, subject, content, date, read } = req.body;
    await db.insert(privateMessages).values({
      id: id || `pm_${Date.now()}`,
      fromUser: from,
      toUser: to,
      subject,
      content,
      date: date || new Date().toLocaleString(),
      read: read ?? false,
    });
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error creating private message:', err);
    res.status(500).json({ error: 'Failed to create private message' });
  }
});

app.put('/api/pms/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(privateMessages).set({ read: true }).where(eq(privateMessages.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating private message read state:', err);
    res.status(500).json({ error: 'Failed to update private message' });
  }
});

app.delete('/api/pms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(privateMessages).where(eq(privateMessages.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting private message:', err);
    res.status(500).json({ error: 'Failed to delete private message' });
  }
});

// Frontend Serving (Vite dev server middleware or static build)
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediFAQ server running on http://0.0.0.0:${PORT}`);
  });
}

export { app, startServer };

const isMainModule = Boolean(process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]));
if (isMainModule && process.env.NODE_ENV !== 'test') {
  startServer();
}
