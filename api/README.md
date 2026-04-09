# SGCNR Live Ops API

This folder is the website-side ingest bridge for the Discord bot / FiveM bridge.

## Files

- `update.php`
  - trusted ingest endpoint for the bot
- `live-ops.php`
  - public read endpoint the website uses
- `config.example.php`
  - example config for the shared secret and defaults

## Setup

1. Copy `config.example.php` to `config.php`
2. Set a real `web_api_secret`
3. Point the bot `.env` to:
   - `WEB_API_URL=https://sgcnr.net/api/update.php`
   - `WEB_API_SECRET=your-secret`

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

## Storage

Data is stored in:

- `api/data/live-ops.json`

That file is ignored in git and created on the first successful push.

