import { createPool } from './index.ts';

async function reset() {
  console.log('Resetting database...');
  const pool = createPool();
  try {
    await pool.query('DELETE FROM forum_posts');
    await pool.query('DELETE FROM forum_topics');
    await pool.query('DELETE FROM subcategories');
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM faqs');
    await pool.query('DELETE FROM feedbacks');
    await pool.query('DELETE FROM private_messages');
    await pool.query('DELETE FROM users');
    console.log('✓ Database reset');
  } catch (err) {
    console.error('Reset failed:', err);
  }
  process.exit(0);
}

reset();
