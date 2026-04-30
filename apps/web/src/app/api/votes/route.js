import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cooperative_id = searchParams.get("cooperative_id");
    const session_id = searchParams.get("session_id");
    let query = `SELECT vs.*, o.title as offer_title, o.unit_price, o.supplier_id,
      s.company_name as supplier_name,
      COUNT(v.id) as total_votes,
      SUM(CASE WHEN v.vote_value = 'pour' THEN 1 ELSE 0 END) as votes_pour,
      SUM(CASE WHEN v.vote_value = 'contre' THEN 1 ELSE 0 END) as votes_contre,
      SUM(CASE WHEN v.vote_value = 'abstention' THEN 1 ELSE 0 END) as votes_abstention
      FROM vote_sessions vs
      LEFT JOIN offers o ON vs.offer_id = o.id
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN votes v ON vs.id = v.vote_session_id
      WHERE 1=1`;
    const values = [];
    let idx = 1;
    if (cooperative_id) {
      query += ` AND vs.cooperative_id = $${idx++}`;
      values.push(cooperative_id);
    }
    if (session_id) {
      query += ` AND vs.id = $${idx++}`;
      values.push(session_id);
    }
    query += ` GROUP BY vs.id, o.title, o.unit_price, o.supplier_id, s.company_name ORDER BY vs.created_at DESC`;
    const rows = await sql(query, values);
    return Response.json({ sessions: rows });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { vote_session_id, cooperative_id, user_id, vote_value } =
      await request.json();
    if (!vote_session_id || !user_id || !vote_value) {
      return Response.json({ error: "Données manquantes" }, { status: 400 });
    }
    const existing =
      await sql`SELECT id FROM votes WHERE vote_session_id = ${vote_session_id} AND user_id = ${user_id}`;
    if (existing.length > 0) {
      return Response.json(
        { error: "Vous avez déjà voté pour cette session" },
        { status: 409 },
      );
    }
    const txHash =
      "0x" +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");
    const blockNumber = Math.floor(Math.random() * 1000000) + 18000000;
    const rows = await sql`
      INSERT INTO votes (vote_session_id, cooperative_id, user_id, vote_value, tx_hash, block_number)
      VALUES (${vote_session_id}, ${cooperative_id}, ${user_id}, ${vote_value}, ${txHash}, ${blockNumber})
      RETURNING *
    `;
    const session =
      await sql`SELECT * FROM vote_sessions WHERE id = ${vote_session_id}`;
    if (session.length > 0) {
      const members =
        await sql`SELECT COUNT(*) as count FROM cooperative_members WHERE cooperative_id = ${session[0].cooperative_id} AND status = 'active'`;
      const totalVotes =
        await sql`SELECT COUNT(*) as count FROM votes WHERE vote_session_id = ${vote_session_id}`;
      const participation =
        (parseInt(totalVotes[0].count) / parseInt(members[0].count)) * 100;
      if (participation >= session[0].quorum_percentage) {
        const pourVotes =
          await sql`SELECT COUNT(*) as count FROM votes WHERE vote_session_id = ${vote_session_id} AND vote_value = 'pour'`;
        const newStatus =
          parseInt(pourVotes[0].count) > parseInt(totalVotes[0].count) / 2
            ? "validated"
            : "rejected";
        if (newStatus === "validated" || participation >= 100) {
          await sql`UPDATE vote_sessions SET status = ${newStatus} WHERE id = ${vote_session_id}`;
        }
      }
    }
    return Response.json({ vote: rows[0], tx_hash: txHash }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
