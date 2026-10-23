import fs from "fs";
import pg from "pg";

const sql = fs.readFileSync(
  "supabase/migrations/20261021120000_nagaa_art_schema.sql",
  "utf8"
);
const password = encodeURIComponent(
  process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD || ""
);
if (!password) {
  console.error("Set SUPABASE_DB_PASSWORD (or DATABASE_URL) before running.");
  process.exit(1);
}
const urls = process.env.DATABASE_URL
  ? [process.env.DATABASE_URL]
  : [
      `postgresql://postgres:${password}@db.udsufonzoxgupxgkneev.supabase.co:5432/postgres`,
      `postgresql://postgres.udsufonzoxgupxgkneev:${password}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
      `postgresql://postgres.udsufonzoxgupxgkneev:${password}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
    ];

for (const url of urls) {
  const label = url.replace(/:[^:@]+@/, ":***@");
  process.stdout.write(`TRY ${label} ... `);
  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });
  try {
    await client.connect();
    console.log("CONNECTED");
    await client.query(sql);
    console.log("MIGRATION_OK");
    const { rows } = await client.query(
      "select count(*)::int as n from public.artworks"
    );
    console.log(`ARTWORKS=${rows[0].n}`);
    await client.end();
    process.exit(0);
  } catch (e) {
    console.log(`FAIL: ${e.message || e}`);
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}
process.exit(1);
