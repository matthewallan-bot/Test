import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const seedPath = path.join(process.cwd(), "db", "seed.sql");
  const sql = await readFile(seedPath, "utf8");

  const client = new Client({
    connectionString: databaseUrl,
    ssl:
      process.env.DATABASE_SSL === "false"
        ? undefined
        : { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    process.stdout.write("Seeding db/seed.sql... ");
    await client.query(sql);
    console.log("ok");
    console.log(
      "Demo admin: admin@fixedreaction.demo (password in README — not printed here)",
    );
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
