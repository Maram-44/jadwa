import pg from "pg";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.argv[2];

  let client;

  if (connectionString) {
    client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  } else {
    const password = process.env.SUPABASE_DB_PASSWORD || process.argv[2];
    if (!password) {
      console.error(
        "Error: PostgreSQL database password or connection string is required to run migrations directly.",
      );
      console.log(
        "Usage: node scripts/migrate.js [PASSWORD_OR_CONNECTION_STRING]",
      );
      process.exit(1);
    }

    client = new Client({
      host: "db.tplycvnvheakhgefcoud.supabase.co",
      port: 5432,
      database: "postgres",
      user: "postgres",
      password,
      ssl: { rejectUnauthorized: false },
    });
  }

  const migrationPath = resolve(
    __dirname,
    "../supabase/migrations/001_initial_schema.sql",
  );
  const sql = readFileSync(migrationPath, "utf8");

  console.log("Connecting to Supabase PostgreSQL at db.tplycvnvheakhgefcoud.supabase.co...");
  try {
    await client.connect();
    console.log("Connected successfully!");

    console.log("Executing migration 001_initial_schema.sql...");
    await client.query(sql);
    console.log("Migration executed successfully!");

    // Verify created tables
    const tableRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log(
      "Public tables in database:",
      tableRes.rows.map((r) => r.table_name),
    );

    // Verify RLS enabled
    const rlsRes = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
      WHERE pg_namespace.nspname = 'public' AND relkind = 'r';
    `);
    console.log("Row Level Security status:", rlsRes.rows);

    await client.end();
  } catch (err) {
    console.error("Migration failed with error:", err.message);
    if (client) await client.end().catch(() => {});
    process.exit(1);
  }
}

runMigration();
