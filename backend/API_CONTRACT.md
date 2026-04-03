# SGCNR Backend API Contract

This is the recommended first API contract for the website.

## Auth

### `GET /auth/discord/start`
Redirects the user to Discord OAuth.

Response:
- redirect to Discord

### `GET /auth/discord/callback`
Handles the OAuth callback from Discord.

Backend should:
- exchange code for token
- fetch Discord user
- verify guild membership
- verify roles
- create or update website user
- create session cookie
- redirect back to website

### `POST /auth/logout`
Destroys the current session.

### `GET /api/account/me`
Returns the logged-in website account.

Example:
```json
{
  "authenticated": true,
  "user": {
    "id": "usr_123",
    "discordId": "123456789012345678",
    "discordUsername": "Jeremy",
    "discordDisplayName": "Jeremy",
    "guildNickname": "Jeremy",
    "discordAvatarHash": "a_1234567890abcdef",
    "discordAvatarUrl": "https://cdn.discordapp.com/avatars/123456789012345678/a_1234567890abcdef.png?size=128",
    "websiteDisplayName": "Jeremy",
    "fivemName": "Jeremy",
    "verifiedIdentity": "Jeremy",
    "roles": ["verified", "supporter"],
    "region": "EU",
    "trackingOptIn": true,
    "createdAt": "2026-04-03T10:00:00Z",
    "lastLoginAt": "2026-04-03T12:20:00Z"
  }
}
```

The frontend is now prepared to:
- show the Discord avatar on the website
- use the Discord / guild / verified ingame identity as the visible website name

## Account

### `PATCH /api/account/settings`
Updates website-side account settings.

Supported fields:
- `trackingOptIn`
- `emailUpdates`

Example request:
```json
{
  "trackingOptIn": true,
  "emailUpdates": false
}
```

## Discord

### `GET /api/discord/verify`
Returns current Discord verification / guild membership / role-sync state.

Example:
```json
{
  "linked": true,
  "guildMember": true,
  "roles": ["verified", "supporter"],
  "syncStatus": "ok",
  "verifiedAt": "2026-04-03T12:22:00Z"
}
```

### `POST /api/discord/sync`
Forces a role-sync refresh.

## FiveM Identity Bridge

### `POST /internal/fivem/identity-sync`
Trusted internal endpoint from your server/backend bridge.

Purpose:
- map a Discord ID to the verified ingame player identity

Example request:
```json
{
  "discordId": "123456789012345678",
  "license": "license:abcdef",
  "fivemName": "Jeremy",
  "citizenId": "SG1234",
  "updatedAt": "2026-04-03T12:24:00Z"
}
```

This route should be protected with:
- shared secret
- IP allowlist
- or internal-only access

## Live Ops

### `GET /api/live/ops`
Combined endpoint for:
- player count
- queue
- restarts
- server health
- website health
- discord stats
- hot zones
- leaderboard

The website is already prepared for this.
