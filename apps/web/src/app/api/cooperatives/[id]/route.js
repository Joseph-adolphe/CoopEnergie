import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const coops = await sql`
      SELECT c.*, u.name as creator_name
      FROM cooperatives c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.id = ${id}
    `;
    if (coops.length === 0)
      return Response.json(
        { error: "Coopérative non trouvée" },
        { status: 404 },
      );
    const members = await sql`
      SELECT cm.*, u.name, u.email, u.wallet_address, u.avatar_url
      FROM cooperative_members cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.cooperative_id = ${id} AND cm.status = 'active'
    `;
    const cotisations = await sql`
      SELECT co.*, u.name as user_name FROM cotisations co
      JOIN users u ON co.user_id = u.id
      WHERE co.cooperative_id = ${id}
      ORDER BY co.created_at DESC LIMIT 10
    `;
    const votes = await sql`
      SELECT vs.*, o.title as offer_title,
        COUNT(v.id) as total_votes,
        SUM(CASE WHEN v.vote_value = 'pour' THEN 1 ELSE 0 END) as votes_pour,
        SUM(CASE WHEN v.vote_value = 'contre' THEN 1 ELSE 0 END) as votes_contre
      FROM vote_sessions vs
      LEFT JOIN offers o ON vs.offer_id = o.id
      LEFT JOIN votes v ON vs.id = v.vote_session_id
      WHERE vs.cooperative_id = ${id}
      GROUP BY vs.id, o.title
      ORDER BY vs.created_at DESC
    `;
    return Response.json({
      cooperative: coops[0],
      members,
      cotisations,
      votes,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    const rows =
      await sql`UPDATE cooperatives SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *`;
    return Response.json({ cooperative: rows[0] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
