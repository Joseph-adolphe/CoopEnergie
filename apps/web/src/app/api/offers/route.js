import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const supplier_id = searchParams.get("supplier_id");
    const status = searchParams.get("status");
    const cooperative_id = searchParams.get("cooperative_id");
    let query = `SELECT o.*, s.company_name, s.is_verified, s.rating FROM offers o JOIN suppliers s ON o.supplier_id = s.id WHERE 1=1`;
    const values = [];
    let idx = 1;
    if (supplier_id) {
      query += ` AND o.supplier_id = $${idx++}`;
      values.push(supplier_id);
    }
    if (status) {
      query += ` AND o.status = $${idx++}`;
      values.push(status);
    }
    if (cooperative_id) {
      query += ` AND o.cooperative_id = $${idx++}`;
      values.push(cooperative_id);
    }
    query += ` ORDER BY o.created_at DESC`;
    const rows = await sql(query, values);
    return Response.json({ offers: rows });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      supplier_id,
      title,
      description,
      equipment_type,
      unit_price,
      min_quantity,
      total_quantity,
      valid_until,
      cooperative_id,
    } = body;
    if (!supplier_id || !title || !unit_price) {
      return Response.json({ error: "Données manquantes" }, { status: 400 });
    }
    const rows = await sql`
      INSERT INTO offers (supplier_id, title, description, equipment_type, unit_price, min_quantity, total_quantity, valid_until, cooperative_id, status)
      VALUES (${supplier_id}, ${title}, ${description || ""}, ${equipment_type || "autre"}, ${unit_price}, ${min_quantity || 1}, ${total_quantity || null}, ${valid_until || null}, ${cooperative_id || null}, ${"pending"})
      RETURNING *
    `;
    return Response.json({ offer: rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status)
      return Response.json({ error: "id et status requis" }, { status: 400 });
    const rows =
      await sql`UPDATE offers SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *`;
    return Response.json({ offer: rows[0] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
