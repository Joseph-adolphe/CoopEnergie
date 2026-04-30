import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function fixRoles() {
  console.log('Fixing admin roles...');
  try {
    await sql`UPDATE users SET role = 'superadmin' WHERE role = 'admin' OR email = 'admin@example.com'`;
    console.log('Roles updated to superadmin.');
  } catch (err) {
    console.error('Error updating roles:', err);
  } finally {
    await sql.end();
  }
}

fixRoles();
