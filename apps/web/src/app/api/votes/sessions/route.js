import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const {
      cooperative_id,
      offer_id,
      title,
      description,
      quorum_percentage,
      end_date,
      created_by,
    } = await request.json();
    if (!cooperative_id || !title || !end_date || !created_by) {
      return Response.json({ error: "Données manquantes" }, { status: 400 });
    }
    const txHash =
      "0x" +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");
    const rows = await sql`
      INSERT INTO vote_sessions (cooperative_id, offer_id, title, description, quorum_percentage, end_date, created_by, tx_hash)
      VALUES (${cooperative_id}, ${offer_id || null}, ${title}, ${description || ""}, ${quorum_percentage || 51}, ${end_date}, ${created_by}, ${txHash})
      RETURNING *
    `;
    return Response.json(
      { session: rows[0], tx_hash: txHash },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
