import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json(
        { error: "Email et mot de passe requis" },
        { status: 400 },
      );
    }
    const users =
      await sql`SELECT * FROM users WHERE email = ${email} AND is_active = true LIMIT 1`;
    if (users.length === 0) {
      return Response.json(
        { error: "Identifiants invalides" },
        { status: 401 },
      );
    }
    const user = users[0];
    // For demo, accept any password (replace with argon2 in production)
    const token = Buffer.from(
      JSON.stringify({
        id: user.id,
        role: user.role,
        email: user.email,
        exp: Date.now() + 86400000,
      }),
    ).toString("base64");
    return Response.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        wallet_address: user.wallet_address,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
