import { Pool, type QueryResultRow } from "pg";

/**
 * Neon-ready Postgres pool. Works with any Postgres URL via DATABASE_URL.
 * Leave unset in local UI-only development — callers should use
 * `isDatabaseConfigured()` / `withDb` and fall back to seed data.
 */
let pool: Pool | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getPool(): Pool {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_SSL === "false"
          ? undefined
          : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return getPool().query<T>(text, params);
}

/** Run `fn` when DB is configured; otherwise return `fallback`. */
export async function withDb<T>(
  fn: () => Promise<T>,
  fallback: T | (() => T | Promise<T>),
): Promise<T> {
  if (!isDatabaseConfigured()) {
    return typeof fallback === "function"
      ? await (fallback as () => T | Promise<T>)()
      : fallback;
  }
  try {
    return await fn();
  } catch (err) {
    console.error("[db]", err);
    return typeof fallback === "function"
      ? await (fallback as () => T | Promise<T>)()
      : fallback;
  }
}
