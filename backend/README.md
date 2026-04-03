# SGCNR Backend Blueprint

This website is currently a static frontend that is now prepared for a real Discord-only account system.

To make registration, login, account saving, role sync, and linked ingame identity actually work, you need a separate backend service plus a database.

Recommended stack:
- `Node.js`
- `Express` or `Fastify`
- `PostgreSQL`
- `Discord OAuth2`
- `Discord bot token` for guild role checks

## What We Need From You

Before the backend can go live, we need:

1. A backend host
- Example: `https://api.sgcnr.net`

2. A PostgreSQL database
- Local, VPS, Railway, Supabase, Neon, Render, etc.

3. A Discord application
- `CLIENT_ID`
- `CLIENT_SECRET`
- Redirect URL

4. A Discord bot
- `BOT_TOKEN`
- `GUILD_ID`
- Permission to read guild members / roles

5. A trusted FiveM identity bridge
- The backend needs a trusted way to map:
  - Discord user
  - ingame player
  - verified ingame name
- Best options:
  - server-side export / webhook from the FiveM server
  - shared database between game backend and website backend
  - signed API from the FiveM side to the website backend

## Target Login Flow

The intended production flow is:

1. User clicks `Continue with Discord` on the website
2. Discord sends the user back to your backend callback
3. Backend exchanges the OAuth code for tokens
4. Backend fetches the Discord user profile
5. Backend checks the user in your guild
6. Backend checks the Discord roles through the bot or Discord API
7. Backend links the Discord account to a local website user row
8. Backend resolves the verified ingame/FiveM identity
9. Backend stores a session
10. Website reads the logged-in account through `/api/account/me`

## Identity Rule

Your current requirement is:
- website login should be Discord only
- the website account should use Discord identity as the source of truth
- the ingame/FiveM name should be resolved from your trusted backend or bot bridge

That means:
- no email registration
- no phone registration
- no local password-based auth in production

## What The Frontend Expects

The frontend is already prepared for these config values:

- `backendApiUrl`
- `authApiUrl`
- `discordOAuthUrl`
- `discordOAuthCallbackUrl`
- `discordRoleVerifyUrl`
- `discordRoleSyncUrl`

## Main API Routes To Build

See:
- [API_CONTRACT.md](C:\Users\jerem\Documents\GitHub\siteexample\backend\API_CONTRACT.md)

## Database Schema

See:
- [schema.sql](C:\Users\jerem\Documents\GitHub\siteexample\backend\schema.sql)

## Env Vars

See:
- [.env.example](C:\Users\jerem\Documents\GitHub\siteexample\backend\.env.example)

## Minimum Viable Backend

If you want the smallest possible first version, build this first:

1. Discord OAuth login
2. PostgreSQL users + sessions
3. `/api/account/me`
4. Discord guild role verification
5. one trusted ingame-name sync endpoint from the FiveM side

After that, the website can already:
- log users in with Discord
- save accounts permanently
- show verified identity
- prepare role-based access

