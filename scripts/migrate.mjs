import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const dir = path.join(process.cwd(), "db", "migrations");
  const files = (await readdir(dir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const client = new Client({
    connectionString: databaseUrl,
    ssl:
      process.env.DATABASE_SSL === "false"
        ? undefined
        : { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    for (const file of files) {
      const sql = await readFile(path.join(dir, file), "utf8");
      process.stdout.write(`Applying ${file}... `);
      await client.query(sql);
      console.log("ok");
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
