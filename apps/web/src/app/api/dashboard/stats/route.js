import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const user_id = searchParams.get("user_id");

    if (role === "superadmin") {
      const [users, coops, suppliers, transactions, offers, votes] =
        await sql.transaction([
          sql`SELECT COUNT(*) as count, role FROM users GROUP BY role`,
          sql`SELECT COUNT(*) as count, status FROM cooperatives GROUP BY status`,
          sql`SELECT COUNT(*) as count FROM suppliers WHERE is_verified = true`,
          sql`SELECT COALESCE(SUM(amount), 0) as total FROM cotisations WHERE status = 'confirmed'`,
          sql`SELECT COUNT(*) as count, status FROM offers GROUP BY status`,
          sql`SELECT COUNT(*) as count FROM vote_sessions WHERE status = 'active'`,
        ]);
      return Response.json({
        users,
        coops,
        suppliers,
        transactions,
        offers,
        votes,
      });
    }

    if (role === "fournisseur") {
      const supplier =
        await sql`SELECT id FROM suppliers WHERE user_id = ${user_id} LIMIT 1`;
      if (supplier.length === 0)
        return Response.json(
          { error: "Fournisseur non trouvé" },
          { status: 404 },
        );
      const sid = supplier[0].id;
      const [myOffers, pendingOffers, approvedOffers] = await sql.transaction([
        sql`SELECT COUNT(*) as count FROM offers WHERE supplier_id = ${sid}`,
        sql`SELECT COUNT(*) as count FROM offers WHERE supplier_id = ${sid} AND status = 'pending'`,
        sql`SELECT COUNT(*) as count FROM offers WHERE supplier_id = ${sid} AND status = 'approved'`,
      ]);
      const orders =
        await sql`SELECT COUNT(*) as count, status FROM orders o JOIN offers of2 ON o.offer_id = of2.id WHERE of2.supplier_id = ${sid} GROUP BY status`;
      const revenue =
        await sql`SELECT COALESCE(SUM(o.total_amount), 0) as total FROM orders o JOIN offers of2 ON o.offer_id = of2.id WHERE of2.supplier_id = ${sid} AND o.payment_status = 'paid'`;
      const recentOffers =
        await sql`SELECT o.*, c.name as cooperative_name FROM offers o LEFT JOIN cooperatives c ON o.cooperative_id = c.id WHERE o.supplier_id = ${sid} ORDER BY o.created_at DESC LIMIT 5`;
      return Response.json({
        myOffers: myOffers[0],
        pendingOffers: pendingOffers[0],
        approvedOffers: approvedOffers[0],
        orders,
        revenue: revenue[0],
        recentOffers,
      });
    }

    // User dashboard
    const myCoops = await sql`
      SELECT c.*, cm.total_contributed, cm.role as member_role
      FROM cooperative_members cm
      JOIN cooperatives c ON cm.cooperative_id = c.id
      WHERE cm.user_id = ${user_id} AND cm.status = 'active'
    `;
    const myVotes = await sql`
      SELECT vs.*, v.vote_value FROM vote_sessions vs
      LEFT JOIN votes v ON vs.id = v.vote_session_id AND v.user_id = ${user_id}
      WHERE vs.cooperative_id IN (SELECT cooperative_id FROM cooperative_members WHERE user_id = ${user_id})
      ORDER BY vs.created_at DESC LIMIT 5
    `;
    const totalContrib =
      await sql`SELECT COALESCE(SUM(amount), 0) as total FROM cotisations WHERE user_id = ${user_id} AND status = 'confirmed'`;
    const recentTx = await sql`
      SELECT co.*, c.name as cooperative_name FROM cotisations co
      JOIN cooperatives c ON co.cooperative_id = c.id
      WHERE co.user_id = ${user_id}
      ORDER BY co.created_at DESC LIMIT 5
    `;
    const notifications =
      await sql`SELECT * FROM notifications WHERE user_id = ${user_id} ORDER BY created_at DESC LIMIT 5`;
    return Response.json({
      myCoops,
      myVotes,
      totalContrib: totalContrib[0],
      recentTx,
      notifications,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
