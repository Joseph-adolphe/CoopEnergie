import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const rows =
      await sql`SELECT id, name, email, role, phone, wallet_address, is_active, created_at FROM users ORDER BY created_at DESC`;
    return Response.json({ users: rows });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, is_active, role } = await request.json();
    if (!id) return Response.json({ error: "id requis" }, { status: 400 });
    let query = "UPDATE users SET updated_at = NOW()";
    const values = [];
    let idx = 1;
    if (is_active !== undefined) {
      query += `, is_active = $${idx++}`;
      values.push(is_active);
    }
    if (role) {
      query += `, role = $${idx++}`;
      values.push(role);
    }
    query += ` WHERE id = $${idx++} RETURNING id, name, email, role, is_active`;
    values.push(id);
    const rows = await sql(query, values);
    return Response.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
