import { NextResponse } from "next/server";
import { isDatabaseConfigured, query } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not set — registration requires Postgres" },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
    displayName?: string;
  } | null;

  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;
  const displayName = body?.displayName?.trim() || null;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "valid email is required" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json(
      { error: "password must be at least 8 characters" },
      { status: 400 },
    );
  }

  const existing = await query(`SELECT id FROM users WHERE email = $1`, [email]);
  if (existing.rows[0]) {
    return NextResponse.json({ error: "email already registered" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const created = await query<{ id: string; email: string }>(
    `INSERT INTO users (email, password_hash, display_name, role)
     VALUES ($1, $2, $3, 'customer')
     RETURNING id, email::text AS email`,
    [email, passwordHash, displayName],
  );

  return NextResponse.json(
    { id: created.rows[0].id, email: created.rows[0].email },
    { status: 201 },
  );
}
