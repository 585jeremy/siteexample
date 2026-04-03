window.SGCNR_SERVER_CONFIG = {
  name: "SGCNR",
  joinCode: "pbe6gy",
  joinUrl: "",
  discordUrl: "https://discord.gg/Y8HNFPtxkE",
  discordGuildId: "",
  discordWidgetUrl: "",
  discordOAuthUrl: "",
  discordOAuthCallbackUrl: "",
  discordBotInviteUrl: "",
  discordSupportUrl: "",
  discordRoleVerifyUrl: "",
  discordRoleSyncUrl: "",
  backendApiUrl: "",
  authApiUrl: "",
  authLoginUrl: "",
  authRegisterUrl: "",
  authProfileUrl: "",
  statusRefreshMs: 60000,
  maxPlayerPreview: 12,
  region: "EU",

  // Optional txAdmin hooks.
  txAdminStatusUrl: "",
  txAdminPlayersUrl: "",

  // Preferred: one combined endpoint that returns any live ops data you want
  // the website to show. The app will look for:
  // {
  //   "liveMap": {
  //     "updatedAt": "...",
  //     "requiresOptIn": true,
  //     "settingLabel": "Website Live Tracking",
  //     "players": [
  //       { "id": 1, "name": "Player", "mapX": 54.2, "mapY": 38.7, "trackingEnabled": true }
  //     ]
  //   },
  //   "uptime": { "startedAt": "...", "uptimeSeconds": 12345 },
  //   "restart": { "nextRestartAt": "...", "label": "Daily restart" },
  //   "queue": { "count": 18, "estimatedWaitMinutes": 7 },
  //   "counts": { "cops": 12, "ems": 4, "civs": 67, "gangs": 19 },
  //   "leaderboard": {
  //     "updatedAt": "...",
  //     "rows": [
  //       { "name": "Player", "role": "Police", "crew": "Mission Row", "kd": 2.1, "netWorth": 5200000, "playtimeHours": 188 }
  //     ]
  //   },
  //   "events": [ { "title": "Bank robbery", "location": "Vinewood", "status": "Active" } ],
  //   "history": {
  //     "uptime": [ { "label": "Today", "uptimeSeconds": 75600 } ],
  //     "outages": [ { "label": "ISP issue", "startedAt": "...", "durationMinutes": 14 } ]
  //   },
  //   "hotZones": [ { "name": "Vinewood", "heat": 92, "type": "crime" } ],
  //   "discord": {
  //     "botStatus": { "status": "online", "message": "Stable", "latencyMs": 88 },
  //     "guild": { "name": "SGCNR", "onlineMembers": 214, "totalMembers": 1820, "verifiedMembers": 906 },
  //     "support": { "openTickets": 11, "pendingReports": 4, "pendingApplications": 3 },
  //     "linking": { "enabled": true, "linkedAccounts": 682, "syncRoles": true, "oauthUrl": "https://..." },
  //     "announcements": [
  //       { "title": "Weekend event", "channel": "#announcements", "createdAt": "...", "detail": "Bonus payouts are live." }
  //     ]
  //   },
  //   "serverHealth": { "status": "online", "message": "Stable", "latencyMs": 42 },
  //   "websiteHealth": { "status": "online", "message": "Healthy", "latencyMs": 18 }
  // }
  liveOpsUrl: "",
  leaderboardUrl: "",

  // Optional separate endpoints if you do not want one combined API.
  // For live map players, the website accepts either:
  // - mapX/mapY in percent (0-100), or
  // - lat/lng if your endpoint already uses the same map projection.
  // For Discord account linking / role sync, the expected flow is:
  // 1. discordOAuthUrl starts the website login with Discord
  // 2. discordOAuthCallbackUrl receives the OAuth return and hands it to your backend
  // 3. discordRoleVerifyUrl lets the backend confirm guild roles securely
  // 4. discordRoleSyncUrl can expose linked role-sync state back to the website
  // The verified Discord user / guild nickname should become the source of truth
  // for the website account name if you want website and ingame identity to match.
  livePlayerMapUrl: "",
  uptimeStatusUrl: "",
  restartInfoUrl: "",
  discordStatusUrl: "",
  serverHealthUrl: "",
  websiteHealthUrl: "",

  // Optional public status page link and fallback restart label.
  publicStatusUrl: "",
  nextRestartLabel: "Scheduled restart",
  websiteName: "SGCNR Portal",
  liveTrackingRequiresOptIn: true
};
