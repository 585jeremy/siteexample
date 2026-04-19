# SGCNR Live Ops API

This folder is the website-side ingest bridge for the Discord bot / FiveM bridge.

## Files

- `update.php`
  - trusted ingest endpoint for the bot
- `live-ops.php`
  - public read endpoint the website uses
- `player-profile.php`
  - public profile read endpoint for future game profiles
- `leaderboard.php`
  - public leaderboard read endpoint for future stat boards
- `game-sync-schema.sql`
  - recommended database schema for game profiles, stats, live status, and events
- `game-sync-contract.md`
  - exact payload contract for `ExtraM_BotIntegr`
- `config.example.php`
  - example config for the shared secret and defaults

## Setup

1. Copy `config.example.php` to `config.php`
2. Set a real `web_api_secret`
3. Point the bot `.env` to:
   - `WEB_API_URL=https://sgcnr.net/api/update.php`
   - `WEB_API_SECRET=your-secret`

## Optional game/profile database

If you want player profiles and leaderboards on the website, set these in `api/config.php`:

- `game_mysql_dsn`
- `game_mysql_user`
- `game_mysql_password`

Then run:

- `api/game-sync-schema.sql`

The recommended payload contract for the FiveM bridge is documented in:

- `api/game-sync-contract.md`

## Optional bot DB fallback

If the live snapshot has not received every stat yet, `live-ops.php` can now also read the Discord bot database directly.

Set these optional keys in `api/config.php` when the bot uses a separate MySQL database:

- `bot_mysql_dsn`
- `bot_mysql_user`
- `bot_mysql_password`

Fallback values currently supported:

- linked account count from `players`
- verified account count from `verified`
- open ticket count from `tickets`

## Accepted update shapes

### Single key update

```json
{
  "secret": "your-secret",
  "key": "bot_status",
  "value": "online"
}
```

### Batched simple updates

```json
{
  "secret": "your-secret",
  "updates": {
    "bot_status": "online",
    "bot_latency": 88,
    "bot_message": "Stable",
    "total_members": 1820,
    "online_members": 214,
    "verified_members": 906,
    "open_tickets": 11,
    "pending_reports": 4
  }
}
```

### Full combined payload

```json
{
  "secret": "your-secret",
  "discord": {
    "botStatus": {
      "status": "online",
      "message": "Stable",
      "latencyMs": 88
    },
    "guild": {
      "name": "SGCNR",
      "onlineMembers": 214,
      "totalMembers": 1820,
      "verifiedMembers": 906
    },
    "support": {
      "open_tickets": 11,
      "pending_reports": 4
    }
  },
  "leaderboard": {
    "updatedAt": "2026-04-09T18:30:00Z",
    "rows": []
  }
}
```

### Full FiveM / website payload

See:

- `api/game-sync-contract.md`

## Built-in simple keys

These map straight into the website live dashboard:

- `bot_status`
- `bot_latency`
- `bot_message`
- `guild_name`
- `total_members`
- `online_members`
- `verified_members`
- `open_tickets`
- `pending_reports`
- `pending_applications`
- `linked_accounts`
- `sync_roles`
- `linking_enabled`
- `oauth_url`
- `support_url`
- `queue_count`
- `queue_estimated_wait_minutes`
- `uptime_seconds`
- `uptime_started_at`
- `next_restart_at`
- `restart_label`
- `server_health`
- `website_health`
- `leaderboard`
- `announcements`
- `live_map`
- `game_status`
- `online_players`
- `max_players`
- `active_missions`
- `active_robberies`
- `active_heists`
- `server_uptime_seconds`
- `game_profiles`
- `game_leaderboards`
- `game_events`

## Storage

Data is stored in:

- `api/data/live-ops.json`

That file is ignored in git and created on the first successful push.
