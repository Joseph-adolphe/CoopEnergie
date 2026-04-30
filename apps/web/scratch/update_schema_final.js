import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function updateSchema() {
  console.log('Final schema touch-up...');
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
    console.log('updated_at added.');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await sql.end();
  }
}

updateSchema();
