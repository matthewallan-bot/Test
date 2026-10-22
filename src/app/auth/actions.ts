"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export type AuthFormState = {
  error?: string;
};

export async function signInAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/account/profile");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        error: "Invalid email or password. Is DATABASE_URL set and seeded?",
      };
    }
    throw err;
  }
  return {};
}

export async function signUpAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  if (!isDatabaseConfigured()) {
    return { error: "DATABASE_URL is not set — registration requires Postgres" };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim() || null;

  if (!email.includes("@")) {
    return { error: "valid email is required" };
  }
  if (password.length < 8) {
    return { error: "password must be at least 8 characters" };
  }

  const existing = await query(`SELECT id FROM users WHERE email = $1`, [email]);
  if (existing.rows[0]) {
    return { error: "email already registered" };
  }

  const passwordHash = await hashPassword(password);
  await query(
    `INSERT INTO users (email, password_hash, display_name, role)
     VALUES ($1, $2, $3, 'customer')`,
    [email, passwordHash, displayName],
  );

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/account/profile",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created — sign in failed. Try /auth/sign-in." };
    }
    throw err;
  }
  return {};
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
  redirect("/");
}
