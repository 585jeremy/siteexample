# SGCNR Game Sync Contract

This is the recommended contract for `ExtraM_BotIntegr` when pushing FiveM data into the website.

## Endpoint

- `POST https://sgcnr.net/api/update.php`

## Authentication

Use the same shared secret already used by the bot bridge:

- body key: `secret`
- or header: `X-API-SECRET`
- or `Authorization: Bearer <secret>`

## Recommended identifiers

Use `license_primary` as the main stable website/game identifier.

Optional secondary identifiers:

- `citizenId`
- `discordId`
- `steamId`
- `rockstarId`

## Recommended full payload

```json
{
  "secret": "your-shared-secret",
  "source": "extram-botintegr",
  "game": {
    "server": {
      "status": "online",
      "serverName": "SGCNR",
      "onlinePlayers": 148,
      "maxPlayers": 256,
      "activeMissions": 7,
      "activeRobberies": 2,
      "activeHeists": 1,
      "uptimeSeconds": 86400,
      "updatedAt": "2026-04-19T20:15:00Z"
    },
    "profiles": {
      "updatedAt": "2026-04-19T20:15:00Z",
      "rows": [
        {
          "license": "license:1234567890abcdef",
          "citizenId": "CID-2041",
          "discordId": "751811158868099212",
          "steamId": "steam:110000112345678",
          "rockstarId": "fivem:2041",
          "characterName": "777",
          "displayName": "trippleseven777",
          "visibility": "public",
          "isOnline": true,
          "money": {
            "cash": 25000,
            "bank": 185000
          },
          "stats": {
            "playtimeMinutes": 9120,
            "kills": 84,
            "deaths": 30,
            "kdRatio": 2.8,
            "arrests": 17,
            "bankHeists": 4,
            "missionsCompleted": 52
          },
          "updatedAt": "2026-04-19T20:15:00Z"
        }
      ]
    },
    "leaderboards": {
      "updatedAt": "2026-04-19T20:15:00Z",
      "boards": {
        "money": [
          {
            "rank": 1,
            "license": "license:1234567890abcdef",
            "name": "trippleseven777",
            "value": 210000
          }
        ],
        "playtime": [],
        "kd": []
      }
    },
    "events": {
      "updatedAt": "2026-04-19T20:15:00Z",
      "rows": [
        {
          "type": "bank_heist",
          "severity": "high",
          "title": "Bank heist started",
          "description": "Pacific Standard robbery started.",
          "playerLicense": "license:1234567890abcdef",
          "playerDiscordId": "751811158868099212",
          "eventAt": "2026-04-19T20:14:10Z",
          "payload": {
            "location": "Pacific Standard",
            "unitsResponding": 3
          }
        }
      ]
    }
  }
}
```

## Lightweight single-key updates

These also work if the resource only wants to push quick realtime values:

```json
{
  "secret": "your-shared-secret",
  "source": "extram-botintegr",
  "updates": {
    "game_status": "online",
    "online_players": 148,
    "max_players": 256,
    "active_missions": 7,
    "active_robberies": 2,
    "active_heists": 1,
    "server_uptime_seconds": 86400
  }
}
```

## What the website is ready to do with this

- public live status cards
- public player profiles
- public leaderboards
- future staff-side event review
- future account linking between website, Discord, and FiveM identities

## What still needs to be decided before going fully live

- whether profiles are public or login-only
- which identifier is final (`license_primary` is the current assumption)
- which stats are public
- how often the resource should push updates
- whether event logs should be public, staff-only, or Discord-only
