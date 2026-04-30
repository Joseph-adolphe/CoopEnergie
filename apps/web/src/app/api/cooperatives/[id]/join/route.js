import sql from "@/app/api/utils/sql";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { user_id } = await request.json();
    const coop = await sql`SELECT * FROM cooperatives WHERE id = ${id}`;
    if (coop.length === 0)
      return Response.json(
        { error: "Coopérative non trouvée" },
        { status: 404 },
      );
    if (coop[0].current_members >= coop[0].max_members)
      return Response.json(
        { error: "La coopérative est complète" },
        { status: 400 },
      );
    const existing =
      await sql`SELECT id FROM cooperative_members WHERE cooperative_id = ${id} AND user_id = ${user_id}`;
    if (existing.length > 0)
      return Response.json({ error: "Vous êtes déjà membre" }, { status: 409 });
    await sql`INSERT INTO cooperative_members (cooperative_id, user_id) VALUES (${id}, ${user_id})`;
    await sql`UPDATE cooperatives SET current_members = current_members + 1 WHERE id = ${id}`;
    await sql`INSERT INTO notifications (user_id, title, message, type) VALUES (${user_id}, ${"Adhésion confirmée"}, ${"Vous avez rejoint la coopérative " + coop[0].name}, ${"system"})`;
    return Response.json({ message: "Adhésion réussie" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
