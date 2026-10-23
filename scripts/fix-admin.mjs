import pg from "pg";

const email = process.env.ADMIN_EMAIL || "nagaa.admin@gmail.com";
const dbPassword = process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD;
if (!dbPassword && !process.env.DATABASE_URL) {
  console.error("Set SUPABASE_DB_PASSWORD or DATABASE_URL");
  process.exit(1);
}
const url =
  process.env.DATABASE_URL ||
  "postgresql://postgres.udsufonzoxgupxgkneev:" +
    encodeURIComponent(dbPassword) +
    "@aws-0-eu-west-1.pooler.supabase.com:6543/postgres";

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

await client.query(
  "update public.admin_profile set email = $1 where id = 1",
  [email]
);

const { rows } = await client.query(
  "select id, email from auth.users where email = $1 limit 1",
  [email]
);

if (!rows.length) {
  console.log("NO_USER");
  await client.end();
  process.exit(1);
}

const userId = rows[0].id;
const idCheck = await client.query(
  "select id from auth.identities where user_id = $1::uuid limit 1",
  [userId]
);

if (!idCheck.rows.length) {
  await client.query(
    `
    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      $1::uuid,
      jsonb_build_object('sub', $1::text, 'email', $2::text),
      'email',
      $1::text,
      now(),
      now(),
      now()
    )
    `,
    [userId, email]
  );
  console.log("IDENTITY_CREATED");
} else {
  console.log("IDENTITY_EXISTS");
}

console.log(`USER_OK ${email} ${userId}`);
await client.end();
