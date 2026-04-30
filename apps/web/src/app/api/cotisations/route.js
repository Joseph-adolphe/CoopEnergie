import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cooperative_id = searchParams.get("cooperative_id");
    const user_id = searchParams.get("user_id");
    let query = `SELECT co.*, u.name as user_name, c.name as cooperative_name
      FROM cotisations co
      JOIN users u ON co.user_id = u.id
      JOIN cooperatives c ON co.cooperative_id = c.id
      WHERE 1=1`;
    const values = [];
    let idx = 1;
    if (cooperative_id) {
      query += ` AND co.cooperative_id = $${idx++}`;
      values.push(cooperative_id);
    }
    if (user_id) {
      query += ` AND co.user_id = $${idx++}`;
      values.push(user_id);
    }
    query += ` ORDER BY co.created_at DESC`;
    const rows = await sql(query, values);
    return Response.json({ cotisations: rows });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { cooperative_id, user_id, amount, payment_method, notes } =
      await request.json();
    if (!cooperative_id || !user_id || !amount) {
      return Response.json({ error: "Données manquantes" }, { status: 400 });
    }
    // Simulate blockchain tx hash for Celo
    const txHash =
      "0x" +
      Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");
    const blockNumber = Math.floor(Math.random() * 1000000) + 18000000;
    const rows = await sql`
      INSERT INTO cotisations (cooperative_id, user_id, amount, tx_hash, block_number, status, payment_method, notes)
      VALUES (${cooperative_id}, ${user_id}, ${amount}, ${txHash}, ${blockNumber}, ${"confirmed"}, ${payment_method || "celo"}, ${notes || null})
      RETURNING *
    `;
    await sql`UPDATE cooperatives SET current_amount = current_amount + ${amount} WHERE id = ${cooperative_id}`;
    await sql`
      INSERT INTO cooperative_members (cooperative_id, user_id, total_contributed)
      VALUES (${cooperative_id}, ${user_id}, ${amount})
      ON CONFLICT (cooperative_id, user_id)
      DO UPDATE SET total_contributed = cooperative_members.total_contributed + ${amount}
    `;
    await sql`
      INSERT INTO transactions_log (user_id, cooperative_id, type, amount, tx_hash, block_number)
      VALUES (${user_id}, ${cooperative_id}, ${"cotisation"}, ${amount}, ${txHash}, ${blockNumber})
    `;
    await sql`
      INSERT INTO notifications (user_id, title, message, type, related_id, related_type)
      VALUES (${user_id}, ${"Cotisation confirmée"}, ${"Votre cotisation de " + amount + " FCFA a été enregistrée sur la blockchain Celo."}, ${"cotisation"}, ${rows[0].id}, ${"cotisation"})
    `;
    return Response.json(
      { cotisation: rows[0], tx_hash: txHash, block_number: blockNumber },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
