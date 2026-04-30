import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function updateSchema() {
  console.log('Updating schema for stats API...');
  try {
    // Add is_verified to suppliers
    await sql`ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false`;
    
    // Add status and total_contributed to cooperative_members
    await sql`ALTER TABLE cooperative_members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'`;
    await sql`ALTER TABLE cooperative_members ADD COLUMN IF NOT EXISTS total_contributed NUMERIC DEFAULT 0`;

    // Create notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        title TEXT NOT NULL,
        message TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Add vote_session_id to votes if missing (I used session_id)
    // Wait, let's check votes table
    // My schema had session_id. The query uses vote_session_id.
    await sql`ALTER TABLE votes RENAME COLUMN session_id TO vote_session_id`;

    console.log('Schema updated successfully.');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await sql.end();
  }
}

updateSchema();
