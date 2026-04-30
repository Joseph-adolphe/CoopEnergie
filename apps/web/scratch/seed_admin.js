import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function seed() {
  console.log('Seeding admin user...');
  try {
    const existing = await sql`SELECT id FROM users WHERE email = 'admin@example.com'`;
    if (existing.length === 0) {
      await sql`
        INSERT INTO users (name, email, password_hash, role, is_active)
        VALUES ('Admin', 'admin@example.com', 'hashed_admin', 'admin', true)
      `;
      console.log('Admin user created: admin@example.com / any password');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Error seeding admin user:', err);
  } finally {
    await sql.end();
  }
}

seed();
