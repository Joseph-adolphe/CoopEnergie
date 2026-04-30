import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const rows = await sql`
      SELECT s.*, u.email as user_email, u.name as user_name
      FROM suppliers s JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `;
    return Response.json({ suppliers: rows });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, is_verified, rating } = await request.json();
    if (!id) return Response.json({ error: "id requis" }, { status: 400 });
    let query = "UPDATE suppliers SET";
    const values = [];
    let idx = 1;
    const parts = [];
    if (is_verified !== undefined) {
      parts.push(` is_verified = $${idx++}`);
      values.push(is_verified);
    }
    if (rating !== undefined) {
      parts.push(` rating = $${idx++}`);
      values.push(rating);
    }
    if (parts.length === 0)
      return Response.json(
        { error: "Aucune donnée à mettre à jour" },
        { status: 400 },
      );
    query += parts.join(",") + ` WHERE id = $${idx++} RETURNING *`;
    values.push(id);
    const rows = await sql(query, values);
    return Response.json({ supplier: rows[0] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
