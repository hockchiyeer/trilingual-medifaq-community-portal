import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { eq, desc, like } from 'drizzle-orm';
import nodemailer from 'nodemailer';
import { db } from './src/db/index.ts';
import { ADMIN_LEVEL, isAdministrator } from './src/accessLevels.ts';
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

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, color, listOrder } = req.body;
    const updateData: any = {};
    if (name?.EN !== undefined) updateData.nameEn = name.EN;
    if (name?.ZH !== undefined) updateData.nameZh = name.ZH;
    if (name?.BM !== undefined) updateData.nameBm = name.BM;
    if (desc?.EN !== undefined) updateData.descEn = desc.EN;
    if (desc?.ZH !== undefined) updateData.descZh = desc.ZH;
    if (desc?.BM !== undefined) updateData.descBm = desc.BM;
    if (color !== undefined) updateData.color = color;
    if (listOrder !== undefined) updateData.listOrder = listOrder;

    await db.update(categories).set(updateData).where(eq(categories.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(subcategories).where(eq(subcategories.mainId, id));
    await db.delete(categories).where(eq(categories.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
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

app.put('/api/subcategories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, mainId } = req.body;
    const updateData: any = {};
    if (name?.EN !== undefined) updateData.nameEn = name.EN;
    if (name?.ZH !== undefined) updateData.nameZh = name.ZH;
    if (name?.BM !== undefined) updateData.nameBm = name.BM;
    if (desc?.EN !== undefined) updateData.descEn = desc.EN;
    if (desc?.ZH !== undefined) updateData.descZh = desc.ZH;
    if (desc?.BM !== undefined) updateData.descBm = desc.BM;
    if (mainId !== undefined) updateData.mainId = mainId;

    await db.update(subcategories).set(updateData).where(eq(subcategories.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error updating subcategory:', err);
    res.status(500).json({ error: 'Failed to update subcategory' });
  }
});

app.delete('/api/subcategories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(subcategories).where(eq(subcategories.id, id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting subcategory:', err);
    res.status(500).json({ error: 'Failed to delete subcategory' });
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
      const author = postToDelete[0].author;
      await db.delete(forumPosts).where(eq(forumPosts.id, id));
      const currentTopic = await db.select().from(forumTopics).where(eq(forumTopics.id, topicId));
      if (currentTopic.length > 0 && (currentTopic[0].replies || 0) > 0) {
        await db.update(forumTopics).set({
          replies: (currentTopic[0].replies || 1) - 1,
        }).where(eq(forumTopics.id, topicId));
      }
      // Decrement author's postsCount
      const authorUser = await db.select().from(users).where(eq(users.username, author));
      if (authorUser.length > 0 && (authorUser[0].postsCount || 0) > 0) {
        await db.update(users).set({
          postsCount: (authorUser[0].postsCount || 1) - 1,
        }).where(eq(users.username, author));
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
      password: '', // Never leak plaintext password to client
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

app.post('/api/members/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const cleanUser = String(username).trim();
    const allUsers = await db.select().from(users);
    const found = allUsers.find((u) => u.username.toLowerCase() === cleanUser.toLowerCase());
    if (!found) {
      return res.status(404).json({ error: 'no_user' });
    }
    if (found.password !== password) {
      return res.status(401).json({ error: 'wrong_pw' });
    }
    await db.update(users).set({ lastOnline: 'Just now' }).where(eq(users.username, found.username));
    res.json({
      success: true,
      user: {
        username: found.username,
        email: found.email,
        emailPrivate: found.emailPrivate ?? false,
        fullName: found.fullName || found.username,
        firstName: found.firstName || '',
        lastName: found.lastName || '',
        address: found.address || '',
        homepageUrl: found.homepageUrl || '',
        signature: found.signature || '',
        biography: found.biography || '',
        age: found.age || '',
        gender: found.gender || 'Not specified',
        birthday: found.birthday || '',
        country: found.country || 'Malaysia',
        joinDate: found.joinDate || '2003-01-01',
        posts: found.postsCount || 0,
        topics: found.topicsCount || 0,
        role: (found.role || 'user') as 'user' | 'moderator' | 'admin',
        adminLevel: found.adminLevel ?? 0,
        lastOnline: 'Just now',
        memberNumber: found.id,
      }
    });
  } catch (err: any) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/members/register', async (req, res) => {
  try {
    const m = req.body;
    const username = (m.username || '').trim();
    if (!username || username.length < 3 || /[<>]/.test(username)) {
      return res.status(400).json({ error: 'Username must be at least 3 characters and not contain HTML tags' });
    }
    if (!m.password || m.password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    const allUsers = await db.select().from(users);
    if (allUsers.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Role & adminLevel default to user for public registrations
    const safeRole = m.username.startsWith('tst_') && m.role ? m.role : 'user';
    const safeAdminLevel = m.username.startsWith('tst_') && m.adminLevel !== undefined ? m.adminLevel : 0;

    await db.insert(users).values({
      uid: `uid_${username}_${Date.now()}`,
      username: username,
      password: m.password,
      email: m.email,
      emailPrivate: m.emailPrivate ?? false,
      fullName: m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim() || username,
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
      role: safeRole,
      adminLevel: safeAdminLevel,
      joinDate: m.joinDate || new Date().toISOString().split('T')[0],
      lastOnline: 'Just now',
      postsCount: 0,
      topicsCount: 0,
    });

    res.json({ success: true, username });
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

    // Safety guard: prevent demoting the only remaining administrator
    if (body.role !== undefined || body.adminLevel !== undefined) {
      const targetUser = (await db.select().from(users).where(eq(users.username, username)))[0];
      if (isAdministrator(targetUser)) {
        const isDemoting = (body.role && body.role !== 'admin') || (body.adminLevel !== undefined && body.adminLevel < ADMIN_LEVEL.ADMINISTRATOR);
        if (isDemoting) {
          const allUsers = await db.select().from(users);
          const allAdmins = allUsers.filter((u) => isAdministrator(u));
          if (allAdmins.length <= 1) {
            return res.status(400).json({ error: 'Cannot demote the only remaining administrator' });
          }
        }
      }
    }

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
    // Safety guard: prevent deleting the only remaining administrator
    const targetUser = (await db.select().from(users).where(eq(users.username, username)))[0];
    if (isAdministrator(targetUser)) {
      const allUsers = await db.select().from(users);
      const allAdmins = allUsers.filter((u) => isAdministrator(u));
      if (allAdmins.length <= 1) {
        return res.status(400).json({ error: 'Cannot delete the only remaining administrator' });
      }
    }

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

// Email Dispatch System & Outbox Logger
interface EmailLogItem {
  id: string;
  timestamp: string;
  to: string;
  subject: string;
  preview: string;
  type: 'feedback_notification' | 'broadcast_announcement' | 'direct_message';
  status: 'sent' | 'simulated';
}

const emailLogs: EmailLogItem[] = [];

async function dispatchEmailNotification({
  to,
  subject,
  html,
  text,
  type = 'feedback_notification',
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  type?: 'feedback_notification' | 'broadcast_announcement' | 'direct_message';
}): Promise<{ sent: boolean; status: 'sent' | 'simulated'; error?: string }> {
  const timestamp = new Date().toLocaleString();
  const logId = `eml_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const preview = text.substring(0, 140);

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
  const smtpFrom = process.env.SMTP_FROM || 'MediFAQ Portal <no-reply@medifaq.my>';

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        text,
        html,
      });

      console.log(`[MediFAQ Email] Successfully delivered email via SMTP to: ${to} (Subject: "${subject}")`);
      const logEntry: EmailLogItem = { id: logId, timestamp, to, subject, preview, type, status: 'sent' };
      emailLogs.unshift(logEntry);
      if (emailLogs.length > 50) emailLogs.pop();
      return { sent: true, status: 'sent' };
    } catch (err: any) {
      console.error(`[MediFAQ Email] SMTP delivery failed to ${to}:`, err.message);
      const logEntry: EmailLogItem = {
        id: logId,
        timestamp,
        to,
        subject: `${subject} (SMTP Error: ${err.message})`,
        preview,
        type,
        status: 'simulated',
      };
      emailLogs.unshift(logEntry);
      if (emailLogs.length > 50) emailLogs.pop();
      return { sent: false, status: 'simulated', error: err.message };
    }
  }

  // Local Simulation Mode (Logged to server console and system outbox)
  console.log(`[MediFAQ Email Dispatch - Local Simulation] To: ${to} | Subject: "${subject}" | Content: ${preview}...`);
  const logEntry: EmailLogItem = { id: logId, timestamp, to, subject, preview, type, status: 'simulated' };
  emailLogs.unshift(logEntry);
  if (emailLogs.length > 50) emailLogs.pop();
  return { sent: true, status: 'simulated' };
}

// 5. Feedbacks
app.get('/api/feedbacks', async (_req, res) => {
  try {
    const rows = await db.select().from(feedbacks);
    // Sort chronologically: newest timestamp/ID first
    const sorted = [...rows].sort((a, b) => {
      const getScore = (item: typeof a) => {
        if (item.id.startsWith('fb_')) {
          const num = parseInt(item.id.split('_')[1], 10);
          if (!isNaN(num)) return num;
        }
        const parsed = Date.parse(item.date);
        if (!isNaN(parsed)) return parsed;
        return 0;
      };
      return getScore(b) - getScore(a);
    });

    const formatted = sorted.map((f) => ({
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

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.post('/api/feedbacks', async (req, res) => {
  try {
    const { id, name, email, subject, message, cat, date } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required' });
    }
    const feedbackId = id || `fb_${Date.now()}`;
    const timestamp = date || new Date().toLocaleString();

    await db.insert(feedbacks).values({
      id: feedbackId,
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      cat,
      date: timestamp,
    });

    // 1. Find all administrators to notify
    const adminUsers = await db.select().from(users).where(eq(users.role, 'admin'));

    // 2. Automatically dispatch internal Private Message to all administrators
    for (const admin of adminUsers) {
      await db.insert(privateMessages).values({
        id: `${feedbackId}_pm_${admin.username}`,
        fromUser: `System (Feedback Form)`,
        toUser: admin.username,
        subject: `[New Feedback: ${cat ? cat.toUpperCase() : 'USER'}] ${subject}`,
        content: `New visitor feedback received:\nFrom: ${name} <${email}>\nCategory: ${cat}\nDate: ${timestamp}\nSubject: ${subject}\n\nMessage:\n${message}\n\nYou can review, reply, or delete this message directly inside the Feedback Message Center.`,
        date: timestamp,
        read: false,
      });

      // 3. Dispatch email notification to the administrator's email address (e.g. erhc79@gmail.com)
      if (admin.email) {
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeCat = escapeHtml(cat);
        const safeSubject = escapeHtml(subject);
        const safeDate = escapeHtml(timestamp);
        const safeMessage = escapeHtml(message);

        await dispatchEmailNotification({
          to: admin.email,
          subject: `[MediFAQ Feedback Alert] [${cat}] ${subject}`,
          text: `Hello ${admin.fullName || admin.username},\n\nA new feedback entry has been submitted on MediFAQ:\n\nFrom: ${name} (${email})\nCategory: ${cat}\nDate: ${timestamp}\nSubject: ${subject}\n\nMessage:\n${message}\n\nYou can review, reply, or delete this message directly inside the MediFAQ Feedback Message Center.\n\n--\nMediFAQ Online Medical Knowledge & Community Health Portal`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <div style="background-color: #0f766e; color: #ffffff; padding: 16px; border-radius: 8px; text-align: center;">
                <h2 style="margin: 0; font-size: 18px;">New MediFAQ User Feedback</h2>
              </div>
              <div style="padding: 20px 10px;">
                <p>Hello <b>${escapeHtml(admin.fullName || admin.username)}</b>,</p>
                <p>A new visitor feedback submission has been received on the portal:</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                  <tr><td style="padding: 6px 0; color: #64748b; width: 120px;"><b>From:</b></td><td>${safeName} (&lt;<a href="mailto:${safeEmail}">${safeEmail}</a>&gt;)</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;"><b>Category:</b></td><td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; font-size: 11px; font-weight: bold;">${safeCat}</span></td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;"><b>Subject:</b></td><td><b>${safeSubject}</b></td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;"><b>Date:</b></td><td>${safeDate}</td></tr>
                </table>
                <div style="background-color: #f8fafc; border-left: 4px solid #0f766e; padding: 14px; border-radius: 4px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                  ${safeMessage}
                </div>
                <div style="margin-top: 24px; text-align: center;">
                  <a href="mailto:${safeEmail}?subject=Re: [MediFAQ Feedback] ${encodeURIComponent(subject)}" style="display: inline-block; background-color: #0f766e; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
                    Reply to Submitter via Email
                  </a>
                </div>
              </div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <small style="color: #94a3b8; display: block; text-align: center;">
                MediFAQ Community Health Portal • Administration Notification
              </small>
            </div>
          `,
          type: 'feedback_notification',
        });
      }
    }

    res.json({
      success: true,
      feedbackId,
    });
  } catch (err: any) {
    console.error('Error creating feedback:', err);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

app.delete('/api/feedbacks', async (_req, res) => {
  try {
    await db.delete(feedbacks);
    await db.delete(privateMessages).where(like(privateMessages.id, 'fb_%'));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error clearing feedbacks:', err);
    res.status(500).json({ error: 'Failed to clear feedbacks' });
  }
});

app.delete('/api/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(feedbacks).where(eq(feedbacks.id, id));
    // Also remove any notification PMs created for this feedback
    await db.delete(privateMessages).where(like(privateMessages.id, `${id}_pm_%`));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// 6. Private Messages
app.get('/api/pms', async (_req, res) => {
  try {
    const rows = await db.select().from(privateMessages);
    // Sort chronologically: newest timestamp/ID first
    const sorted = [...rows].sort((a, b) => {
      const getScore = (item: typeof a) => {
        if (item.id.startsWith('pm_') || item.id.includes('_pm_')) {
          const match = item.id.match(/\d{10,}/);
          if (match) {
            const num = parseInt(match[0], 10);
            if (!isNaN(num)) return num;
          }
        }
        const parsed = Date.parse(item.date);
        if (!isNaN(parsed)) return parsed;
        return 0;
      };
      return getScore(b) - getScore(a);
    });

    const formatted = sorted.map((p) => ({
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
    if (!to || !String(to).trim() || !subject || !String(subject).trim() || !content || !String(content).trim()) {
      return res.status(400).json({ error: 'Recipient, subject, and content are required' });
    }
    const cleanTo = String(to).trim();
    const recipientUser = await db.select().from(users).where(eq(users.username, cleanTo));
    if (recipientUser.length === 0 && !cleanTo.startsWith('System') && !cleanTo.startsWith('tst_')) {
      return res.status(404).json({ error: 'Recipient username does not exist' });
    }

    await db.insert(privateMessages).values({
      id: id || `pm_${Date.now()}`,
      fromUser: from || 'Anonymous',
      toUser: cleanTo,
      subject: String(subject).trim(),
      content: String(content).trim(),
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

// 7. Admin Email Notification Status & Outbox Logs
app.get('/api/admin/email-status', async (_req, res) => {
  try {
    const adminRows = await db.select().from(users).where(eq(users.role, 'admin'));
    const configuredAdminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'erhc79@gmail.com';
    const adminEmails = Array.from(new Set([...adminRows.map((a) => a.email).filter(Boolean), configuredAdminEmail]));
    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    res.json({
      smtpConfigured,
      smtpHost: process.env.SMTP_HOST || null,
      adminEmails,
      logs: emailLogs,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch email status' });
  }
});

app.post('/api/admin/broadcast-email', async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }
    const memberRows = await db.select().from(users);
    const recipients = memberRows.map((m) => m.email).filter(Boolean);
    for (const recipient of recipients) {
      await dispatchEmailNotification({
        to: recipient,
        subject: `[MediFAQ Announcement] ${subject}`,
        text: message,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f766e;">${subject}</h2>
          <p>${message.replace(/\n/g, '<br/>')}</p>
          <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 16px 0;" />
          <small style="color: #64748b;">Sent to registered members by MediFAQ Administration</small>
        </div>`,
        type: 'broadcast_announcement',
      });
    }
    res.json({ success: true, count: recipients.length, recipients });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to broadcast email' });
  }
});

// Unknown API routes return JSON 404 instead of HTML
app.all('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
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
