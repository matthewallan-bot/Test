import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

export const CART_SESSION_COOKIE = "fr_cart_session";

/** Ensure a guest cart session key cookie exists; return its value. */
export async function getOrCreateCartSessionKey(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(CART_SESSION_COOKIE)?.value;
  if (existing) return existing;

  const key = randomUUID();
  jar.set(CART_SESSION_COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return key;
}

export async function getCartSessionKey(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(CART_SESSION_COOKIE)?.value;
}
