import postgres from 'postgres';

const sql = process.env.DATABASE_URL
  ? postgres(process.env.DATABASE_URL, {
      ssl: 'require',
    })
  : async (strings, ...values) => {
      const query = strings.join('?');
      console.log('Mock SQL Query:', query, values);

      if (query.includes('FROM users')) {
        return [
          {
            id: 'admin-id',
            name: 'Admin User',
            email: values[0] || 'admin@example.com',
            role: 'admin',
            is_active: true,
            phone: '+237 600 000 000',
            wallet_address: '0x1234...5678',
            avatar_url: null,
          },
        ];
      }
      return [];
    };

export default sql;