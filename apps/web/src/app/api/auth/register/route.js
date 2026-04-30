import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { name, email, password, role, phone } = await request.json();
    if (!name || !email || !password) {
      return Response.json(
        { error: "Nom, email et mot de passe requis" },
        { status: 400 },
      );
    }
    const validRoles = ["user", "fournisseur"];
    const userRole = validRoles.includes(role) ? role : "user";
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return Response.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 },
      );
    }
    // Generate a mock wallet address for Celo
    const walletAddress =
      "0x" +
      Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("");
    const newUsers = await sql`
      INSERT INTO users (name, email, password_hash, role, phone, wallet_address)
      VALUES (${name}, ${email}, ${"hashed_" + password}, ${userRole}, ${phone || null}, ${walletAddress})
      RETURNING id, name, email, role, phone, wallet_address
    `;
    const user = newUsers[0];
    if (userRole === "fournisseur") {
      await sql`INSERT INTO suppliers (user_id, company_name, phone, region) VALUES (${user.id}, ${name}, ${phone || ""}, ${"Non définie"})`;
    }
    const token = Buffer.from(
      JSON.stringify({
        id: user.id,
        role: user.role,
        email: user.email,
        exp: Date.now() + 86400000,
      }),
    ).toString("base64");
    return Response.json({ token, user });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
