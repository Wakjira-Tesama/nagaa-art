import pg from "pg";

const email = process.env.ADMIN_EMAIL || "nagaa.admin@gmail.com";
const password = process.env.ADMIN_PASSWORD || "nagaa2026";
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

const existing = await client.query(
  "select id, email from auth.users where email = $1 limit 1",
  [email]
);
if (existing.rows.length) {
  console.log(`EXISTS ${existing.rows[0].email} ${existing.rows[0].id}`);
  await client.end();
  process.exit(0);
}

const inserted = await client.query(
  `
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    is_super_admin
  ) values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    $1,
    crypt($2, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false
  )
  returning id, email
  `,
  [email, password]
);

const user = inserted.rows[0];
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
    $1,
    jsonb_build_object('sub', $1::text, 'email', $2),
    'email',
    $1::text,
    now(),
    now(),
    now()
  )
  `,
  [user.id, email]
);

console.log(`CREATED ${user.email} ${user.id}`);
await client.end();
