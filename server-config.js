window.SGCNR_SERVER_CONFIG = {
  name: "SGCNR",
  joinCode: "pbe6gy",
  joinUrl: "",
  discordUrl: "https://discord.gg/Y8HNFPtxkE",
  statusRefreshMs: 60000,
  maxPlayerPreview: 12,
  region: "EU",

  // Optional txAdmin hooks.
  txAdminStatusUrl: "",
  txAdminPlayersUrl: "",

  // Preferred: one combined endpoint that returns any live ops data you want
  // the website to show. The app will look for:
  // {
  //   "liveMap": { "updatedAt": "...", "players": [ { "id": 1, "name": "Player", "mapX": 54.2, "mapY": 38.7 } ] },
  //   "uptime": { "startedAt": "...", "uptimeSeconds": 12345 },
  //   "restart": { "nextRestartAt": "...", "label": "Daily restart" },
  //   "queue": { "count": 18, "estimatedWaitMinutes": 7 },
  //   "counts": { "cops": 12, "ems": 4, "civs": 67, "gangs": 19 },
  //   "events": [ { "title": "Bank robbery", "location": "Vinewood", "status": "Active" } ],
  //   "history": {
  //     "uptime": [ { "label": "Today", "uptimeSeconds": 75600 } ],
  //     "outages": [ { "label": "ISP issue", "startedAt": "...", "durationMinutes": 14 } ]
  //   },
  //   "hotZones": [ { "name": "Vinewood", "heat": 92, "type": "crime" } ],
  //   "serverHealth": { "status": "online", "message": "Stable", "latencyMs": 42 },
  //   "websiteHealth": { "status": "online", "message": "Healthy", "latencyMs": 18 }
  // }
  liveOpsUrl: "",

  // Optional separate endpoints if you do not want one combined API.
  // For live map players, the website accepts either:
  // - mapX/mapY in percent (0-100), or
  // - lat/lng if your endpoint already uses the same map projection.
  livePlayerMapUrl: "",
  uptimeStatusUrl: "",
  restartInfoUrl: "",
  serverHealthUrl: "",
  websiteHealthUrl: "",

  // Optional public status page link and fallback restart label.
  publicStatusUrl: "",
  nextRestartLabel: "Scheduled restart",
  websiteName: "SGCNR Portal"
};
