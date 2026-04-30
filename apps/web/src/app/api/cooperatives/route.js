import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const region = searchParams.get("region");
    let query = `SELECT c.*, u.name as creator_name FROM cooperatives c LEFT JOIN users u ON c.created_by = u.id WHERE 1=1`;
    const values = [];
    let idx = 1;
    if (status) {
      query += ` AND c.status = $${idx++}`;
      values.push(status);
    }
    if (region) {
      query += ` AND c.region = $${idx++}`;
      values.push(region);
    }
    query += ` ORDER BY c.created_at DESC`;
    const rows = await sql(query, values);
    return Response.json({ cooperatives: rows });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      goal_amount,
      max_members,
      deadline,
      region,
      created_by,
    } = body;
    if (!name || !goal_amount || !deadline || !created_by) {
      return Response.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 },
      );
    }
    const contractAddress =
      "0x" +
      Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");
    const rows = await sql`
      INSERT INTO cooperatives (name, description, goal_amount, max_members, deadline, region, created_by, contract_address)
      VALUES (${name}, ${description || ""}, ${goal_amount}, ${max_members || 20}, ${deadline}, ${region || ""}, ${created_by}, ${contractAddress})
      RETURNING *
    `;
    const coop = rows[0];
    await sql`INSERT INTO cooperative_members (cooperative_id, user_id, role) VALUES (${coop.id}, ${created_by}, ${"admin"})`;
    await sql`UPDATE cooperatives SET current_members = 1 WHERE id = ${coop.id}`;
    return Response.json({ cooperative: coop }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
