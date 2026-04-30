import postgres from 'postgres';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function init() {
  console.log('Initializing schema...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        phone TEXT,
        wallet_address TEXT,
        is_active BOOLEAN DEFAULT true,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS suppliers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        company_name TEXT NOT NULL,
        phone TEXT,
        region TEXT,
        status TEXT DEFAULT 'pending',
        rating NUMERIC DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cooperatives (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        goal_amount NUMERIC NOT NULL,
        current_members INTEGER DEFAULT 0,
        max_members INTEGER DEFAULT 20,
        current_amount NUMERIC DEFAULT 0,
        status TEXT DEFAULT 'active',
        region TEXT,
        created_by UUID REFERENCES users(id),
        contract_address TEXT,
        deadline TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cooperative_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cooperative_id UUID REFERENCES cooperatives(id),
        user_id UUID REFERENCES users(id),
        role TEXT DEFAULT 'member',
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(cooperative_id, user_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cotisations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        cooperative_id UUID REFERENCES cooperatives(id),
        amount NUMERIC NOT NULL,
        status TEXT DEFAULT 'completed',
        transaction_hash TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vote_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        cooperative_id UUID REFERENCES cooperatives(id),
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES vote_sessions(id),
        user_id UUID REFERENCES users(id),
        option TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(session_id, user_id)
      );
    `;

    console.log('Schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing schema:', err);
  } finally {
    await sql.end();
  }
}

init();
