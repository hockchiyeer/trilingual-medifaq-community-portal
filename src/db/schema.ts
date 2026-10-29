import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  username: text('username').notNull().unique(),
  password: text('password'),
  email: text('email').notNull(),
  emailPrivate: boolean('email_private').default(false),
  fullName: text('full_name'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  address: text('address'),
  homepageUrl: text('homepage_url'),
  signature: text('signature'),
  biography: text('biography'),
  age: text('age'),
  gender: text('gender'),
  birthday: text('birthday'),
  country: text('country').default('Malaysia'),
  role: text('role').default('user'),
  adminLevel: integer('admin_level').default(0),
  joinDate: text('join_date'),
  lastOnline: text('last_online'),
  postsCount: integer('posts_count').default(0),
  topicsCount: integer('topics_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  nameEn: text('name_en').notNull(),
  nameZh: text('name_zh').notNull(),
  nameBm: text('name_bm').notNull(),
  descEn: text('desc_en'),
  descZh: text('desc_zh'),
  descBm: text('desc_bm'),
  color: text('color').default('blue'),
  icon: text('icon').default('BookOpen'),
  listOrder: integer('list_order').default(1),
});

export const subcategories = pgTable('subcategories', {
  id: text('id').primaryKey(),
  mainId: text('main_id').references(() => categories.id).notNull(),
  nameEn: text('name_en').notNull(),
  nameZh: text('name_zh').notNull(),
  nameBm: text('name_bm').notNull(),
  descEn: text('desc_en'),
  descZh: text('desc_zh'),
  descBm: text('desc_bm'),
});

export const faqs = pgTable('faqs', {
  id: text('id').primaryKey(),
  mainId: text('main_id').notNull(),
  subId: text('sub_id').notNull(),
  qEn: text('q_en').notNull(),
  qZh: text('q_zh').notNull(),
  qBm: text('q_bm').notNull(),
  aEn: text('a_en').notNull(),
  aZh: text('a_zh').notNull(),
  aBm: text('a_bm').notNull(),
  doctorName: text('doctor_name').default('Verified Medical Officer'),
  createdBy: text('created_by').default('admin'),
  createdAt: text('created_at').notNull(),
  views: integer('views').default(0),
});

export const forumTopics = pgTable('forum_topics', {
  id: text('id').primaryKey(),
  forumId: text('forum_id').notNull(),
  subId: text('sub_id').notNull(),
  titleEn: text('title_en').notNull(),
  titleZh: text('title_zh').notNull(),
  titleBm: text('title_bm').notNull(),
  author: text('author').notNull(),
  replies: integer('replies').default(0),
  views: integer('views').default(0),
  lastAuthor: text('last_author'),
  lastTime: text('last_time'),
  priority: text('priority').default('Normal'),
  createdAt: text('created_at').notNull(),
});

export const forumPosts = pgTable('forum_posts', {
  id: text('id').primaryKey(),
  topicId: text('topic_id').references(() => forumTopics.id).notNull(),
  author: text('author').notNull(),
  avatar: text('avatar'),
  postCount: integer('post_count').default(1),
  time: text('time').notNull(),
  contentEn: text('content_en').notNull(),
  contentZh: text('content_zh').notNull(),
  contentBm: text('content_bm').notNull(),
});

export const feedbacks = pgTable('feedbacks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  cat: text('cat').notNull(),
  date: text('date').notNull(),
});

export const privateMessages = pgTable('private_messages', {
  id: text('id').primaryKey(),
  fromUser: text('from_user').notNull(),
  toUser: text('to_user').notNull(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(),
  read: boolean('read').default(false),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  subs: many(subcategories),
}));

export const subcategoriesRelations = relations(subcategories, ({ one }) => ({
  category: one(categories, {
    fields: [subcategories.mainId],
    references: [categories.id],
  }),
}));

export const forumTopicsRelations = relations(forumTopics, ({ many }) => ({
  posts: many(forumPosts),
}));

export const forumPostsRelations = relations(forumPosts, ({ one }) => ({
  topic: one(forumTopics, {
    fields: [forumPosts.topicId],
    references: [forumTopics.id],
  }),
}));
