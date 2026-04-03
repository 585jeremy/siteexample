create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  website_display_name text not null,
  region text default 'EU',
  tracking_opt_in boolean not null default false,
  email_updates boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists discord_accounts (
  user_id uuid primary key references users(id) on delete cascade,
  discord_id text not null unique,
  discord_username text not null,
  discord_global_name text,
  guild_nickname text,
  avatar_hash text,
  guild_member boolean not null default false,
  verified_in_guild boolean not null default false,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists discord_role_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  discord_id text not null,
  role_id text not null,
  role_name text not null,
  captured_at timestamptz not null default now()
);

create index if not exists idx_discord_role_snapshots_user_id on discord_role_snapshots(user_id);
create index if not exists idx_discord_role_snapshots_discord_id on discord_role_snapshots(discord_id);

create table if not exists fivem_identities (
  user_id uuid primary key references users(id) on delete cascade,
  discord_id text not null unique,
  license_identifier text unique,
  citizen_id text,
  fivem_name text,
  verified_identity text,
  synced_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  session_token_hash text not null unique,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create index if not exists idx_sessions_user_id on sessions(user_id);
create index if not exists idx_sessions_expires_at on sessions(expires_at);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  event_type text not null,
  source text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_user_id on audit_logs(user_id);
create index if not exists idx_audit_logs_event_type on audit_logs(event_type);

