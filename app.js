const rulesRoot = document.getElementById("rules");
const meta = document.getElementById("meta");
const searchWrap = document.getElementById("searchWrap");
const searchInput = document.getElementById("searchInput");
const localTimeEl = document.getElementById("localTime");
const authArea = document.getElementById("authArea");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const accountBtn = document.getElementById("accountBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authModalRoot = document.getElementById("authModalRoot");

const AUTH_ACCOUNTS_KEY = "sgcnr_demo_accounts_v1";
const AUTH_SESSION_KEY = "sgcnr_demo_session_v1";
const STORE_CART_KEY = "sgcnr_store_cart_v1";
const DEFAULT_SERVER_CONFIG = {
  name: "SGCNR",
  joinCode: "",
  joinUrl: "",
  discordUrl: "https://discord.gg/Y8HNFPtxkE",
  discordGuildId: "",
  discordWidgetUrl: "",
  discordStatusUrl: "",
  discordOAuthUrl: "",
  discordOAuthCallbackUrl: "",
  discordBotInviteUrl: "",
  discordTicketChannelUrl: "",
  discordSupportUrl: "",
  discordRoleVerifyUrl: "",
  discordRoleSyncUrl: "",
  backendApiUrl: "",
  authApiUrl: "",
  authLoginUrl: "",
  authLogoutUrl: "",
  authRegisterUrl: "",
  authProfileUrl: "",
  adminPanelLabel: "Manager",
  adminPanelRoles: [],
  statusRefreshMs: 60000,
  maxPlayerPreview: 12,
  region: "EU",
  txAdminStatusUrl: "",
  txAdminPlayersUrl: "",
  liveOpsUrl: "",
  leaderboardUrl: "",
  livePlayerMapUrl: "",
  uptimeStatusUrl: "",
  restartInfoUrl: "",
  serverHealthUrl: "",
  websiteHealthUrl: "",
  publicStatusUrl: "",
  nextRestartLabel: "Scheduled restart",
  websiteName: "SGCNR",
  liveTrackingRequiresOptIn: true
};
const SERVER_CONFIG = {
  ...DEFAULT_SERVER_CONFIG,
  ...(window.SGCNR_SERVER_CONFIG || {})
};
const DISCORD_INVITE_URL = SERVER_CONFIG.discordUrl;
const DISCORD_TICKET_CHANNEL_URL = SERVER_CONFIG.discordTicketChannelUrl || SERVER_CONFIG.discordSupportUrl || DISCORD_INVITE_URL;
const SERVER_JOIN_CODE = SERVER_CONFIG.joinCode;
const SERVER_JOIN_URL = SERVER_CONFIG.joinUrl || (SERVER_JOIN_CODE ? `https://cfx.re/join/${SERVER_JOIN_CODE}` : "");
const SERVER_SINGLE_API_URL = SERVER_JOIN_CODE
  ? `https://servers-frontend.fivem.net/api/servers/single/${SERVER_JOIN_CODE}`
  : "";
const SITE_ASSET_VERSION = "20260403q";
const APP_ASSET_BASE_URL = document.currentScript?.src
  ? new URL(".", document.currentScript.src).href
  : "./";
const BRAND_LOGO_BANNER_URL = `${APP_ASSET_BASE_URL}branding/sg-cops-and-robbers.png?v=${SITE_ASSET_VERSION}`;
const BRAND_LOGO_BADGE_URL = `${APP_ASSET_BASE_URL}branding/sgcnr-badge.png?v=${SITE_ASSET_VERSION}`;
const MAP_SOURCE_URL = "https://gta-5-map.com?embed=light";
const MAP_IMAGE_URL = `${APP_ASSET_BASE_URL}map-assets/los-santos-satellite-z6.jpg?v=${SITE_ASSET_VERSION}`;
const MAP_IMAGE_FALLBACK_URL = `${APP_ASSET_BASE_URL}satellite-map.jpg?v=${SITE_ASSET_VERSION}`;
const MAP_IMAGE_LEGACY_URL = `${APP_ASSET_BASE_URL}map.jpg?v=${SITE_ASSET_VERSION}`;
const MAP_TILE_GRID = {
  zoom: 6,
  tileSize: 256,
  minX: 0,
  maxX: 21,
  minY: 0,
  maxY: 21
};
const MAP_INITIAL_VIEW = {
  lat: 66.722541,
  lng: -140.625,
  zoom: 4.25
};
const MAP_MIN_ZOOM = 3;
const MAP_MAX_ZOOM = 7;
const MAP_VIEW_MIN_SCALE = 1;
const MAP_VIEW_MAX_SCALE = 3;
const MAP_VIEW_ZOOM_STEP = 0.35;
const MAP_MAX_BOUNDS = [
  [55.25, -151.5],
  [84.25, -98.5]
];
const MAPGENIE_MARKER_SPRITES = {
  police: {
    width: 32,
    height: 37,
    y: 1184
  },
  hospital: {
    width: 32,
    height: 37,
    y: 814
  },
  fire: {
    width: 32,
    height: 37,
    y: 629
  },
  carwash: {
    width: 32,
    height: 37,
    y: 296
  }
};
const MAP_TYPE_META = {
  police: {
    label: "Police Station",
    groupLabel: "Police",
    color: "#63a7ff",
    glow: "rgba(99, 167, 255, .22)"
  },
  hospital: {
    label: "Hospital",
    groupLabel: "Hospitals",
    color: "#54e0a6",
    glow: "rgba(84, 224, 166, .22)"
  },
  fire: {
    label: "Fire Station",
    groupLabel: "Fire",
    color: "#ff7b63",
    glow: "rgba(255, 123, 99, .24)"
  },
  carwash: {
    label: "Car Wash",
    groupLabel: "Car Washes",
    color: "#f7c85f",
    glow: "rgba(247, 200, 95, .24)"
  },
  underground: {
    label: "Lester's House",
    groupLabel: "Lester",
    color: "#ff9b54",
    glow: "rgba(255, 155, 84, .24)"
  }
};
const LEADERBOARD_METRICS = [
  { key: "kd", label: "K/D", valueKey: "kd", description: "Kill to death ratio for combat-heavy players.", format: (value) => `${Number(value).toFixed(2)}` },
  { key: "networth", label: "Net worth", valueKey: "netWorth", description: "Combined money, stash value, and owned assets.", format: (value) => formatMoneyCompact(value) },
  { key: "playtime", label: "Playtime", valueKey: "playtimeHours", description: "Tracked total playtime in hours.", format: (value) => `${Math.round(Number(value) || 0)}h` },
  { key: "kills", label: "Kills", valueKey: "kills", description: "Confirmed total player eliminations.", format: (value) => formatLeaderboardInteger(value) },
  { key: "arrests", label: "Arrests", valueKey: "arrests", description: "Successful police detains and processed arrests.", format: (value) => formatLeaderboardInteger(value) },
  { key: "robberies", label: "Robberies", valueKey: "robberies", description: "Completed robberies, takeovers, and major hits.", format: (value) => formatLeaderboardInteger(value) },
  { key: "revives", label: "Revives", valueKey: "revives", description: "Completed EMS revives and medical saves.", format: (value) => formatLeaderboardInteger(value) },
  { key: "exports", label: "Exports", valueKey: "exports", description: "Vehicle exports and high-value recovery runs.", format: (value) => formatLeaderboardInteger(value) }
];
const MAP_LOCATIONS = [
  {
    id: "beaver-bush-ranger-station-13325",
    type: "police",
    name: "Beaver Bush Ranger Station",
    region: "Vinewood Hills",
    lat: 72.147523448012,
    lng: -120.92376708984,
    sourceId: 13325
  },
  {
    id: "davis-sheriff-s-station-12666",
    type: "police",
    name: "Davis Sheriff's Station",
    region: "Davis",
    lat: 63.519175,
    lng: -120.981445,
    sourceId: 12666
  },
  {
    id: "del-perro-police-station-85422",
    type: "police",
    name: "Del Perro Police Station",
    region: "Del Perro",
    lat: 66.149950045763,
    lng: -139.83592821285,
    sourceId: 85422
  },
  {
    id: "fib-headquarters-12836",
    type: "police",
    name: "FIB Headquarters",
    region: "Downtown",
    lat: 67.033413,
    lng: -123.601685,
    sourceId: 12836
  },
  {
    id: "international-affairs-agency-12837",
    type: "police",
    name: "International Affairs Agency",
    region: "Downtown",
    lat: 67.411971285626,
    lng: -123.37097167969,
    sourceId: 12837
  },
  {
    id: "la-mesa-police-station-12664",
    type: "police",
    name: "La Mesa Police Station",
    region: "La Mesa",
    lat: 64.820907,
    lng: -116.433105,
    sourceId: 12664
  },
  {
    id: "mission-row-police-department-12657",
    type: "police",
    name: "Mission Row Police Department",
    region: "Mission Row",
    lat: 66.071546493516,
    lng: -119.99267578125,
    sourceId: 12657
  },
  {
    id: "paleto-bay-police-station-12694",
    type: "police",
    name: "Paleto Bay Police Station",
    region: "Paleto Bay",
    lat: 82.587523847968,
    lng: -128.935546875,
    sourceId: 12694
  },
  {
    id: "rockford-hills-police-station-12637",
    type: "police",
    name: "Rockford Hills Police Station",
    region: "Rockford Hills",
    lat: 69.271708670316,
    lng: -130.10009765625,
    sourceId: 12637
  },
  {
    id: "sandy-shores-police-station-12723",
    type: "police",
    name: "Sandy Shores Police Station",
    region: "Sandy Shores",
    lat: 79.036348173338,
    lng: -106.6552734375,
    sourceId: 12723
  },
  {
    id: "vespucci-beach-police-station-14088",
    type: "police",
    name: "Vespucci Beach Police Station",
    region: "Vespucci Beach",
    lat: 63.868467,
    lng: -137.416992,
    sourceId: 14088
  },
  {
    id: "vespucci-police-department-12624",
    type: "police",
    name: "Vespucci Police Department",
    region: "Vespucci",
    lat: 66.731223038576,
    lng: -135.087890625,
    sourceId: 12624
  },
  {
    id: "vinewood-police-department-12650",
    type: "police",
    name: "Vinewood Police Department",
    region: "Vinewood",
    lat: 69.62651,
    lng: -118.476563,
    sourceId: 12650
  },
  {
    id: "central-los-santos-medical-center-12710",
    type: "hospital",
    name: "Central Los Santos Medical Center",
    region: "South Los Santos",
    lat: 64.320871579903,
    lng: -121.16821289062,
    sourceId: 12710
  },
  {
    id: "eclipse-medical-tower-471210",
    type: "hospital",
    name: "Eclipse Medical Tower",
    region: "West Vinewood",
    lat: 70.702482204775,
    lng: -130.91438804994,
    sourceId: 471210
  },
  {
    id: "mount-zonah-medical-center-12709",
    type: "hospital",
    name: "Mount Zonah Medical Center",
    region: "Rockford Hills",
    lat: 68.483955367346,
    lng: -129.21020507812,
    sourceId: 12709
  },
  {
    id: "pillbox-hill-medical-center-12711",
    type: "hospital",
    name: "Pillbox Hill Medical Center",
    region: "Pillbox Hill",
    lat: 67.579907914307,
    lng: -121.2451171875,
    sourceId: 12711
  },
  {
    id: "portola-trinity-medical-center-471209",
    type: "hospital",
    name: "Portola Trinity Medical Center",
    region: "Rockford Hills",
    lat: 68.621039649988,
    lng: -133.11241149902,
    sourceId: 471209
  },
  {
    id: "sandy-shores-medical-center-12722",
    type: "hospital",
    name: "Sandy Shores Medical Center",
    region: "Sandy Shores",
    lat: 79.000770658962,
    lng: -106.875,
    sourceId: 12722
  },
  {
    id: "st-fiacre-hospital-471208",
    type: "hospital",
    name: "St Fiacre Hospital",
    region: "El Burro Heights",
    lat: 63.836808081018,
    lng: -113.34076669157,
    sourceId: 471208
  },
  {
    id: "the-bay-care-center-12716",
    type: "hospital",
    name: "The Bay Care Center",
    region: "Paleto Bay",
    lat: 82.902418825355,
    lng: -127.51831054688,
    sourceId: 12716
  },
  {
    id: "car-wash-12628",
    type: "carwash",
    name: "Car Wash",
    region: "West Los Santos",
    lat: 66.258011,
    lng: -131.638184,
    sourceId: 12628
  },
  {
    id: "car-wash-12729",
    type: "carwash",
    name: "Car Wash",
    region: "Downtown",
    lat: 64.415921,
    lng: -124.398193,
    sourceId: 12729
  },
  {
    id: "davis-fire-dept-13647",
    type: "fire",
    name: "Davis Fire Dept.",
    region: "Davis",
    lat: 63.327481,
    lng: -122.536011,
    sourceId: 13647
  },
  {
    id: "fire-department-headquarters-13309",
    type: "fire",
    name: "Fire Department Headquarters",
    region: "Rockford Hills",
    lat: 69.281427,
    lng: -130.852661,
    sourceId: 13309
  },
  {
    id: "fire-station-7-13650",
    type: "fire",
    name: "Fire Station 7",
    region: "East Los Santos",
    lat: 64.09620743849,
    lng: -112.96142578125,
    sourceId: 13650
  },
  {
    id: "fort-zancudo-fire-station-13609",
    type: "fire",
    name: "Fort Zancudo Fire Station",
    region: "Fort Zancudo",
    lat: 77.329399607775,
    lng: -145.107421875,
    sourceId: 13609
  },
  {
    id: "lsia-fire-dept-469915",
    type: "fire",
    name: "LSIA Fire Dept.",
    region: "Los Santos International Airport",
    lat: 60.08539303028,
    lng: -134.82971191406,
    sourceId: 469915
  },
  {
    id: "paleto-bay-fire-station-13799",
    type: "fire",
    name: "Paleto Bay Fire Station",
    region: "Paleto Bay",
    lat: 82.740426243033,
    lng: -128.24340820312,
    sourceId: 13799
  },
  {
    id: "sandy-shores-fire-station-13228",
    type: "fire",
    name: "Sandy Shores Fire Station",
    region: "Sandy Shores",
    lat: 78.850945620592,
    lng: -108.193359375,
    sourceId: 13228
  },
  {
    id: "lesters-house-13244",
    type: "underground",
    name: "Lester's House",
    region: "El Burro Heights",
    address: "Amarillo Vista",
    lat: 62.99687,
    lng: -112.109474,
    description: "Lester's house in El Burro Heights, kept as a custom contact point on top of the imported services map.",
    sourceId: 13244
  }
];

const ORDER_STATUS_DEMO = {
  "SGC-1024": {
    state: "In Progress",
    tone: "progress",
    updated: "Today, 17:20",
    details: "Your order is currently being prepared by the team.",
    nextStep: "You'll receive a Discord update once it moves to delivery."
  },
  "SGC-2048": {
    state: "Completed",
    tone: "complete",
    updated: "Today, 14:05",
    details: "Your order has been completed and delivered.",
    nextStep: "If anything is missing, open a support ticket with your order number."
  },
  "SGC-3099": {
    state: "Awaiting Review",
    tone: "review",
    updated: "Today, 12:48",
    details: "Your order is waiting for staff review before processing.",
    nextStep: "If this takes too long, contact support on Discord."
  }
};

let currentQuery = "";
let storeHandlersBound = false;
let customMapState = null;
let siteFxState = null;
let serverStatusPageState = {
  timer: null,
  controller: null,
  lastSnapshot: null
};
let leaderboardPageState = {
  requestId: 0
};
const APPLICATION_API = {
  list: "./auth/applications-list.php",
  detail: "./auth/applications-detail.php",
  submit: "./auth/applications-submit.php",
  message: "./auth/applications-message.php"
};
const APPLICATION_STATUS_LABELS = {
  submitted: "Submitted",
  in_review: "Under Review",
  needs_info: "Needs Info",
  interview: "Interview",
  accepted: "Accepted",
  denied: "Rejected",
  closed: "Closed"
};
const APPLICATION_OPEN_STATUSES = ["submitted", "in_review", "needs_info", "interview"];
const ADMIN_OVERVIEW_API = "./auth/admin-overview.php";
let applicationCenterState = {
  loading: false,
  submitting: false,
  sending: false,
  error: "",
  success: "",
  historyUnavailable: false,
  items: [],
  activeId: "",
  detail: null,
  formValues: {},
  pollTimer: null,
  requestId: 0
};
let adminOverviewState = {
  loading: false,
  loaded: false,
  error: "",
  data: null
};
let accountUiState = {
  menuOpen: false,
  panel: "",
  feedback: {
    profile: { tone: "", text: "" },
    settings: { tone: "", text: "" },
    services: { tone: "", text: "" }
  }
};

function normalize(s) {
  return (s ?? "").toString().toLowerCase().trim();
}

function escapeHtml(s) {
  return (s ?? "").toString().replace(/[&<>"']/g, (c) => {
    if (c === "&") return "&amp;";
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    if (c === '"') return "&quot;";
    return "&#39;";
  });
}

async function requestJson(url, options = {}) {
  const {
    method = "GET",
    body = null,
    headers = {}
  } = options;

  const response = await fetch(url, {
    method,
    cache: "no-store",
    credentials: "include",
    headers: {
      "X-Requested-With": "fetch",
      ...(body != null ? { "Content-Type": "application/json" } : {}),
      ...headers
    },
    body: body != null ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw Object.assign(new Error(payload?.error || `HTTP ${response.status}`), {
      status: response.status,
      payload
    });
  }

  return payload;
}

function isAdminRouteActive() {
  try {
    return parseRoute().name === "admin";
  } catch {
    return false;
  }
}

async function loadAdminOverview(options = {}) {
  const { force = false } = options;

  if (adminOverviewState.loading) return;
  if (adminOverviewState.loaded && !force) return;

  adminOverviewState.loading = true;
  adminOverviewState.error = "";
  if (isAdminRouteActive()) renderAdminDashboard(getCurrentAccount());

  try {
    adminOverviewState.data = await requestJson(ADMIN_OVERVIEW_API);
    adminOverviewState.loaded = true;
  } catch (error) {
    const reason = error?.payload?.error || error?.message || "admin_overview_failed";
    if (reason === "forbidden") {
      adminOverviewState.error = "Your Discord role does not allow this admin overview.";
    } else if (reason === "not_authenticated") {
      adminOverviewState.error = "Sign in again to refresh the admin overview.";
    } else {
      adminOverviewState.error = "The admin overview could not be loaded right now.";
    }
  } finally {
    adminOverviewState.loading = false;
    if (isAdminRouteActive()) renderAdminDashboard(getCurrentAccount());
  }
}

function normalizeRouteTarget(target) {
  let value = String(target || "/").trim();
  if (!value) return "/";
  value = value.replace(/^#/, "");
  if (!value.startsWith("/")) value = `/${value}`;
  value = value.replace(/\/+/g, "/");
  if (value === "/home" || value === "/index.html") return "/";
  return value;
}

function getCurrentRoutePath() {
  if (location.hash && location.hash.startsWith("#/")) {
    return normalizeRouteTarget(location.hash);
  }
  return normalizeRouteTarget(location.pathname || "/");
}

function rewriteInternalLinks(scope = document) {
  if (!scope?.querySelectorAll) return;
  scope.querySelectorAll('a[href^="#/"]').forEach((link) => {
    const path = normalizeRouteTarget(link.getAttribute("href") || "/");
    link.setAttribute("href", path);
    link.setAttribute("data-route-link", path);
  });
}

function navigateTo(target, options = {}) {
  const { replace = false, scroll = "auto" } = options;
  const path = normalizeRouteTarget(target);
  const current = getCurrentRoutePath();

  if (replace || current !== path || location.hash) {
    history[replace ? "replaceState" : "pushState"]({}, "", path);
  }

  closeAuthModal();
  closeAccountUi();
  route();

  if (scroll !== false) {
    window.scrollTo({ top: 0, left: 0, behavior: scroll });
    const contentEl = document.querySelector(".content");
    if (contentEl) {
      contentEl.scrollTop = 0;
    }
  }
}

function setView(html) {
  rulesRoot.innerHTML = html;
  const el = rulesRoot.firstElementChild;
  if (el) {
    el.classList.add("view");
    requestAnimationFrame(() => el.classList.add("view--in"));
  }
  rewriteInternalLinks(rulesRoot);
}

function setSearchVisible(visible) {
  if (!searchWrap) return;
  searchWrap.style.display = visible ? "block" : "none";
  if (!visible) {
    currentQuery = "";
    if (searchInput) searchInput.value = "";
  }
}

function getData() {
  return window.RULES_DATA;
}

function excerpt(text, max = 180) {
  const s = (text ?? "").toString().trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function renderTags(tags) {
  if (!tags || !tags.length) return "";
  const chips = tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  return `<div class="rule__tags">${chips}</div>`;
}

function buildBreadcrumb(items) {
  const parts = items
    .map((it, idx) => {
      const label = escapeHtml(it.label);
      if (!it.href || idx === items.length - 1) return `<span class="breadcrumb__current">${label}</span>`;
      return `<a class="breadcrumb__link" href="${it.href}">${label}</a>`;
    })
    .join('<span class="breadcrumb__sep">/</span>');
  return `<div class="breadcrumb">${parts}</div>`;
}

function renderHeader(title, breadcrumbItems, options = {}) {
  const {
    showBadge = true,
    badgeLabel = "SGCNR"
  } = options;
  const bc = breadcrumbItems?.length ? buildBreadcrumb(breadcrumbItems) : "";
  return `
    <div class="page-hero">
      ${bc}
      <div class="page-hero__row">
        <h1 class="page-title">${escapeHtml(title)}</h1>
        ${showBadge ? `<div class="page-hero__badge">${escapeHtml(badgeLabel)}</div>` : ""}
      </div>
    </div>
  `;
}

function renderRulesDisclaimer() {
  return `
    <div class="rules-legal" role="note" aria-label="Legal notice">
      Grand Theft Auto (R) is a registered trademark of Take-Two Interactive. No trademark infringement intended.
      SGCNR is not approved, sponsored, or endorsed by Rockstar Games™.
    </div>
  `;
}

function startLocalClock() {
  if (!localTimeEl) return;

  const fmt = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

  const fullFmt = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "long"
  });

  const update = () => {
    const now = new Date();
    localTimeEl.textContent = fmt.format(now);
    localTimeEl.title = `Your local time: ${fullFmt.format(now)}`;
  };

  update();
  window.setInterval(update, 1000);
}

function readAccounts() {
  try {
    const raw = localStorage.getItem(AUTH_ACCOUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return {};

    return Object.entries(parsed).reduce((acc, [key, value]) => {
      const account = normaliseAccountRecord(key, value);
      if (!account) return acc;
      acc[account.username] = account;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

function sanitisePhoneNumber(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.replace(/(?!^\+)[^\d]/g, "");
}

function getPhoneLookupKey(value) {
  return sanitisePhoneNumber(value).replace(/\D/g, "");
}

function normaliseDiscordHandle(value) {
  return String(value || "").trim().replace(/^@+/, "");
}

function normaliseAccountRecord(key, record) {
  const username = String(record?.username || key || "").trim();
  if (!username) return null;

  if (typeof record === "string") {
    return {
      username,
      displayName: username,
      websiteDisplayName: username,
      verifiedIdentity: "",
      email: "",
      phone: "",
      discord: "",
      discordId: "",
      discordUsername: "",
      discordDisplayName: "",
      guildNickname: "",
      discordAvatarHash: "",
      discordAvatarUrl: "",
      bio: "",
      region: SERVER_CONFIG.region || "EU",
      password: record,
      verificationStatus: "",
      verificationSource: "",
      fivemName: "",
      fivemLicense: "",
      fivemId: "",
      steamId: "",
      rockstarId: "",
      discordIdent: "",
      linkedAt: "",
      verifiedAt: "",
      trackingOptIn: false,
      emailUpdates: false,
      createdAt: "",
      updatedAt: "",
      lastLoginAt: "",
      discordLinked: false,
      discordRoles: [],
      discordStaffRoles: []
    };
  }

  return {
    username,
    displayName: String(record?.displayName || username).trim(),
    websiteDisplayName: String(record?.websiteDisplayName || record?.displayName || username).trim(),
    verifiedIdentity: String(record?.verifiedIdentity || "").trim(),
    email: String(record?.email || "").trim().toLowerCase(),
    phone: sanitisePhoneNumber(record?.phone || ""),
    discord: normaliseDiscordHandle(record?.discord || ""),
    discordId: String(record?.discordId || "").trim(),
    discordUsername: String(record?.discordUsername || "").trim(),
    discordDisplayName: String(record?.discordDisplayName || "").trim(),
    guildNickname: String(record?.guildNickname || "").trim(),
    discordAvatarHash: String(record?.discordAvatarHash || record?.avatarHash || "").trim(),
    discordAvatarUrl: String(record?.discordAvatarUrl || record?.avatarUrl || "").trim(),
    bio: String(record?.bio || "").trim(),
    region: String(record?.region || SERVER_CONFIG.region || "EU").trim(),
    password: String(record?.password || ""),
    verificationStatus: String(record?.verificationStatus || "").trim().toLowerCase(),
    verificationSource: String(record?.verificationSource || "").trim(),
    fivemName: String(record?.fivemName || "").trim(),
    fivemLicense: String(record?.fivemLicense || "").trim(),
    fivemId: String(record?.fivemId || "").trim(),
    steamId: String(record?.steamId || "").trim(),
    rockstarId: String(record?.rockstarId || "").trim(),
    discordIdent: String(record?.discordIdent || "").trim(),
    linkedAt: String(record?.linkedAt || "").trim(),
    verifiedAt: String(record?.verifiedAt || "").trim(),
    trackingOptIn: Boolean(record?.trackingOptIn),
    emailUpdates: Boolean(record?.emailUpdates),
    createdAt: String(record?.createdAt || ""),
    updatedAt: String(record?.updatedAt || ""),
    lastLoginAt: String(record?.lastLoginAt || ""),
    discordLinked: Boolean(record?.discordLinked),
    discordRoles: Array.isArray(record?.discordRoles)
      ? record.discordRoles
      : String(record?.discordRoles || "")
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean),
    discordStaffRoles: Array.isArray(record?.discordStaffRoles)
      ? record.discordStaffRoles
      : String(record?.discordStaffRoles || "")
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean)
  };
}

function writeAccounts(accounts) {
  try {
    localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts || {}));
  } catch {
    // ignore
  }
}

function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.username) return null;
    return parsed;
  } catch {
    return null;
  }
}

function setSession(username) {
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ username }));
  } catch {
    // ignore
  }
}

function clearSession() {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch {
    // ignore
  }
}

function getCurrentAccount() {
  const session = getSession();
  if (!session?.username) return null;
  const accounts = readAccounts();
  const account = accounts[session.username] || null;
  if (!account) return null;
  if (!account.discordLinked) return null;
  return account;
}

function getDiscordRoleList(account) {
  const source = [
    ...(Array.isArray(account?.discordRoles)
      ? account.discordRoles
      : String(account?.discordRoles || "")
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean)),
    ...(Array.isArray(account?.discordStaffRoles)
      ? account.discordStaffRoles
      : String(account?.discordStaffRoles || "")
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean))
  ];

  if (!source.length) return [];

  return source
    .flatMap((role) => {
      if (role && typeof role === "object") {
        return [role.id, role.name].filter(Boolean);
      }
      return [role];
    })
    .map((role) => String(role || "").trim())
    .filter(Boolean);
}

function hasAdminAccess(account = getCurrentAccount()) {
  const requiredRoles = Array.isArray(SERVER_CONFIG.adminPanelRoles)
    ? SERVER_CONFIG.adminPanelRoles.map((role) => normalize(role)).filter(Boolean)
    : [];

  if (!account || !requiredRoles.length) return false;

  return getDiscordRoleList(account).some((role) => requiredRoles.includes(normalize(role)));
}

function updateAdminDockVisibility(account = getCurrentAccount()) {
  const adminDock = document.querySelector('.dock__item[data-dock="admin"]');
  if (!adminDock) return;
  adminDock.style.display = hasAdminAccess(account) ? "inline-flex" : "none";
}

function getAccountDisplayName(account) {
  return String(
    account?.discordDisplayName ||
    account?.guildNickname ||
    account?.discordUsername ||
    account?.verifiedIdentity ||
    account?.websiteDisplayName ||
    account?.displayName ||
    account?.username ||
    "Account"
  ).trim();
}

function getAccountAvatarUrl(account, size = 96) {
  if (account?.discordAvatarUrl) return String(account.discordAvatarUrl).trim();
  if (account?.discordId && account?.discordAvatarHash) {
    return `https://cdn.discordapp.com/avatars/${encodeURIComponent(account.discordId)}/${encodeURIComponent(account.discordAvatarHash)}.png?size=${size}`;
  }
  return "";
}

function findAccountByIdentifier(accounts, identifier) {
  const normalisedIdentifier = normalize(identifier);
  const phoneIdentifier = getPhoneLookupKey(identifier);
  const allAccounts = Object.values(accounts || {});

  return allAccounts.find((account) => {
    if (!account) return false;

    const directMatches = [
      normalize(account.username),
      normalize(account.displayName),
      normalize(account.email),
      normalize(account.discord)
    ].filter(Boolean);

    if (directMatches.includes(normalisedIdentifier)) return true;
    if (phoneIdentifier && phoneIdentifier === getPhoneLookupKey(account.phone)) return true;
    return false;
  }) || null;
}

function renderAuthModal(mode, values = {}, error = "") {
  const title = "Continue with Discord";
  const intro = "Discord is the only website login method. Your website identity, avatar, and visible name should come from Discord OAuth, backend verification, and your verified Discord / in-game identity sync.";

  return `
    <div class="auth-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
      <button class="auth-modal__backdrop" type="button" data-auth-close aria-label="Close"></button>
      <div class="auth-modal__panel">
        <button class="auth-modal__close" type="button" data-auth-close aria-label="Close">×</button>
        <div class="section__eyebrow">Discord account</div>
        <h2>${escapeHtml(title)}</h2>
        <p class="doc-p auth-modal__intro">${escapeHtml(intro)}</p>
        ${error ? `<div class="account-feedback account-feedback--error">${escapeHtml(error)}</div>` : ""}

        <div class="stack-list stack-list--compact">
          <div class="stack-list__item"><span class="stack-list__index">01</span><span>User selects <strong>Continue with Discord</strong> on the website.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">02</span><span>Discord OAuth returns the user identity to your backend.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">03</span><span>Your backend verifies the Discord token and checks guild roles safely.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">04</span><span>The website account uses the verified Discord identity and Discord avatar as the source of truth.</span></div>
        </div>

        <div class="auth-modal__actions">
          ${SERVER_CONFIG.discordOAuthUrl ? `<a class="auth__btn auth__btn--primary" href="${escapeHtml(SERVER_CONFIG.discordOAuthUrl)}">Continue with Discord</a>` : `<button class="auth__btn auth__btn--primary" type="button" disabled>Discord login not connected yet</button>`}
        </div>

        <div class="status-note">
          <strong>Backend note:</strong> Discord-only website auth is wired in. The visible name, avatar, and roles appear once the PHP auth session and Discord callback are configured correctly on the server.
        </div>
      </div>
    </div>
  `;
}

function closeAuthModal() {
  if (authModalRoot) authModalRoot.innerHTML = "";
  document.body.classList.remove("is-auth-open");
}

function openAuthModal(mode, values = {}, error = "") {
  if (!authModalRoot) return;
  authModalRoot.innerHTML = renderAuthModal(mode, values, error);
  document.body.classList.add("is-auth-open");
  bindAuthModalControls();
}

function getAccountUiRoot() {
  let root = document.getElementById("accountUiRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "accountUiRoot";
    document.body.appendChild(root);
  }
  return root;
}

function accountFeedbackMarkup(section) {
  const entry = accountUiState.feedback?.[section];
  if (!entry?.text) return "";
  return `<div class="account-feedback account-feedback--${escapeHtml(entry.tone || "success")}">${escapeHtml(entry.text)}</div>`;
}

function clearAccountUiFeedback() {
  accountUiState.feedback = {
    profile: { tone: "", text: "" },
    settings: { tone: "", text: "" },
    services: { tone: "", text: "" }
  };
}

function setAccountUiFeedback(section, tone, text) {
  if (!accountUiState.feedback[section]) {
    accountUiState.feedback[section] = { tone: "", text: "" };
  }
  accountUiState.feedback[section] = { tone, text };
}

function closeAccountUi() {
  accountUiState.menuOpen = false;
  accountUiState.panel = "";
  clearAccountUiFeedback();
  const root = document.getElementById("accountUiRoot");
  if (root) {
    root.innerHTML = "";
  }
  document.body.classList.remove("is-account-ui-open");
}

function buildAuthRedirectUrl(baseUrl) {
  try {
    const url = new URL(baseUrl, window.location.href);
    url.searchParams.set("return_to", window.location.href);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function performLogout() {
  clearSession();
  closeAccountUi();
  const logoutUrl = SERVER_CONFIG.authLogoutUrl || "./auth/logout.php";
  window.location.href = buildAuthRedirectUrl(logoutUrl);
}

function getLinkedServicesRows(account) {
  return [
    {
      label: "Discord account",
      value: account?.discordUsername ? `@${account.discordUsername}` : "Pending",
      meta: account?.discordLinked ? "Linked to website login" : "Not linked"
    },
    {
      label: "Guild nickname",
      value: account?.guildNickname || account?.discordDisplayName || "Pending",
      meta: account?.guildNickname ? "Taken from SGCNR Discord" : "No guild nickname synced"
    },
    {
      label: "Verified identity",
      value: account?.verifiedIdentity || "Pending sync",
      meta: account?.verificationStatus === "verified" ? "Game identity verified" : "Waiting for verification bridge"
    },
    {
      label: "FiveM record",
      value: account?.fivemId || account?.fivemLicense || "No record yet",
      meta: account?.fivemLicense ? "Bot database link found" : "No license synced yet"
    },
    {
      label: "Role sync",
      value: getDiscordRoleList(account).length ? `${getDiscordRoleList(account).length} role(s)` : "Pending",
      meta: SERVER_CONFIG.discordRoleSyncUrl ? "Website can read Discord role sync" : "Role sync endpoint missing"
    },
    {
      label: "Website session",
      value: account?.discordId ? "Active" : "Offline",
      meta: account?.discordId ? `Discord ID ${account.discordId}` : "No Discord session"
    }
  ];
}

function renderAccountPanelContent(account, panel) {
  if (panel === "profile") {
    return `
      <div class="account-sheet__eyebrow">Edit profile</div>
      <h2 class="account-sheet__title">Profile</h2>
      <p class="account-sheet__copy">Keep the website-side basics tidy. Your Discord identity still stays the main source of truth.</p>
      ${accountFeedbackMarkup("profile")}
      <form class="account-form account-sheet__form" data-account-sheet-form="profile" autocomplete="off">
        <div class="account-form__grid">
          <label class="account-field">
            <span class="account-field__label">Display name</span>
            <input class="account-field__input" name="displayName" value="${escapeHtml(account?.displayName || "")}" required />
          </label>
          <label class="account-field">
            <span class="account-field__label">Region</span>
            <input class="account-field__input" name="region" value="${escapeHtml(account?.region || SERVER_CONFIG.region || "EU")}" />
          </label>
          <label class="account-field account-field--wide">
            <span class="account-field__label">Bio</span>
            <textarea class="account-field__input account-field__input--textarea" name="bio" rows="4" placeholder="A short website bio if you want one.">${escapeHtml(account?.bio || "")}</textarea>
          </label>
        </div>
        <div class="auth-modal__actions">
          <button class="auth__btn auth__btn--primary" type="submit">Save profile</button>
        </div>
      </form>
    `;
  }

  if (panel === "settings") {
    return `
      <div class="account-sheet__eyebrow">Website settings</div>
      <h2 class="account-sheet__title">Settings</h2>
      <p class="account-sheet__copy">Control small website preferences without opening a full account page.</p>
      ${accountFeedbackMarkup("settings")}
      <form class="account-form account-sheet__form" data-account-sheet-form="settings" autocomplete="off">
        <label class="account-toggle">
          <input type="checkbox" name="trackingOptIn" ${account?.trackingOptIn ? "checked" : ""} />
          <span>Allow live website tracking once the in-game opt-in system is connected</span>
        </label>
        <label class="account-toggle">
          <input type="checkbox" name="emailUpdates" ${account?.emailUpdates ? "checked" : ""} />
          <span>Receive website-related updates by email if that flow is added later</span>
        </label>
        <div class="auth-modal__actions">
          <button class="auth__btn auth__btn--primary" type="submit">Save settings</button>
        </div>
      </form>
    `;
  }

  const services = getLinkedServicesRows(account);
  return `
    <div class="account-sheet__eyebrow">Linked services</div>
    <h2 class="account-sheet__title">Connected services</h2>
    <p class="account-sheet__copy">This is the live website view of what your Discord login and game sync are currently exposing.</p>
    ${accountFeedbackMarkup("services")}
    <div class="account-services">
      ${services.map((service) => `
        <article class="account-service">
          <div class="account-service__label">${escapeHtml(service.label)}</div>
          <div class="account-service__value">${escapeHtml(service.value)}</div>
          <div class="account-service__meta">${escapeHtml(service.meta)}</div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAccountUi() {
  const root = getAccountUiRoot();
  const account = getCurrentAccount();

  if (!account || (!accountUiState.menuOpen && !accountUiState.panel)) {
    root.innerHTML = "";
    document.body.classList.remove("is-account-ui-open");
    return;
  }

  const menuItems = [
    { action: "profile", label: "Edit Profile", meta: "Display name, region, bio" },
    { action: "settings", label: "Settings", meta: "Tracking and website preferences" },
    { action: "services", label: "Linked Services", meta: "Discord, verification, FiveM sync" },
    ...(hasAdminAccess(account) ? [{ action: "admin", label: "Admin Panel", meta: "Open the manager tools" }] : []),
    { action: "logout", label: "Sign Out", meta: "End the current website session" }
  ];

  const avatarUrl = getAccountAvatarUrl(account, 96);
  const displayName = getAccountDisplayName(account);
  const rootMarkup = `
    <div class="account-ui">
      ${accountUiState.panel ? `<button class="account-sheet__backdrop" type="button" data-account-action="close"></button>` : ""}
      ${accountUiState.menuOpen ? `
        <div class="account-menu" role="menu" aria-label="Profile menu">
          <div class="account-menu__head">
            ${avatarUrl
              ? `<img class="account-menu__avatar" src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(displayName)}" />`
              : `<div class="account-menu__avatar account-menu__avatar--fallback">${escapeHtml((displayName || "A").charAt(0).toUpperCase())}</div>`}
            <div class="account-menu__copy">
              <div class="account-menu__name">${escapeHtml(displayName)}</div>
              <div class="account-menu__meta">${escapeHtml(account?.discordUsername ? `@${account.discordUsername}` : "Discord linked")}</div>
            </div>
          </div>
          <div class="account-menu__list">
            ${menuItems.map((item) => `
              <button class="account-menu__item" type="button" data-account-action="${escapeHtml(item.action)}">
                <span class="account-menu__itemLabel">${escapeHtml(item.label)}</span>
                <span class="account-menu__itemMeta">${escapeHtml(item.meta)}</span>
              </button>
            `).join("")}
          </div>
        </div>
      ` : ""}
      ${accountUiState.panel ? `
        <aside class="account-sheet" aria-label="Account panel">
          <div class="account-sheet__top">
            <button class="account-sheet__back" type="button" data-account-action="menu">Back</button>
            <button class="account-sheet__close" type="button" data-account-action="close" aria-label="Close">×</button>
          </div>
          ${renderAccountPanelContent(account, accountUiState.panel)}
        </aside>
      ` : ""}
    </div>
  `;

  root.innerHTML = rootMarkup;
  document.body.classList.add("is-account-ui-open");
}

function openAccountPanel(panel) {
  accountUiState.menuOpen = false;
  accountUiState.panel = panel;
  renderAccountUi();
}

function toggleAccountMenu() {
  const account = getCurrentAccount();
  if (!account) {
    openAuthModal("login");
    return;
  }

  if (accountUiState.menuOpen && !accountUiState.panel) {
    closeAccountUi();
    return;
  }

  clearAccountUiFeedback();
  accountUiState.menuOpen = true;
  accountUiState.panel = "";
  renderAccountUi();
}

function saveAccountProfileChanges(account, values) {
  const accounts = readAccounts();
  const updatedAccount = normaliseAccountRecord(account.username, {
    ...account,
    displayName: values.displayName,
    region: values.region,
    bio: values.bio,
    updatedAt: new Date().toISOString()
  });

  accounts[account.username] = updatedAccount;
  writeAccounts(accounts);
  updateAuthUi();
  return updatedAccount;
}

function saveAccountSettingsChanges(account, values) {
  const accounts = readAccounts();
  const updatedAccount = normaliseAccountRecord(account.username, {
    ...account,
    trackingOptIn: values.trackingOptIn === "on" || values.trackingOptIn === true,
    emailUpdates: values.emailUpdates === "on" || values.emailUpdates === true,
    updatedAt: new Date().toISOString()
  });
  accounts[account.username] = updatedAccount;
  writeAccounts(accounts);
  updateAuthUi();
  return updatedAccount;
}

function saveAccountPasswordChanges(account, values) {
  const currentPassword = String(values.currentPassword || "");
  const newPassword = String(values.newPassword || "");
  const confirmPassword = String(values.confirmPassword || "");

  if (currentPassword !== account.password) {
    throw new Error("Current password does not match.");
  }
  if (newPassword.length < 6) {
    throw new Error("Use a password with at least 6 characters.");
  }
  if (newPassword !== confirmPassword) {
    throw new Error("The new password confirmation does not match.");
  }

  const accounts = readAccounts();
  const updatedAccount = normaliseAccountRecord(account.username, {
    ...account,
    password: newPassword,
    updatedAt: new Date().toISOString()
  });
  accounts[account.username] = updatedAccount;
  writeAccounts(accounts);
  updateAuthUi();
  return updatedAccount;
}

function handleRegister(values) {
  const accounts = readAccounts();
  const username = String(values.username || "").trim();
  const displayName = String(values.displayName || "").trim();
  const email = String(values.email || "").trim().toLowerCase();
  const phone = sanitisePhoneNumber(values.phone || "");
  const discord = normaliseDiscordHandle(values.discord || "");
  const region = String(values.region || SERVER_CONFIG.region || "EU").trim();
  const password = String(values.password || "");
  const confirmPassword = String(values.confirmPassword || "");

  if (username.length < 3) {
    openAuthModal("register", values, "Choose a username with at least 3 characters.");
    return;
  }
  if (displayName.length < 2) {
    openAuthModal("register", values, "Choose a display name with at least 2 characters.");
    return;
  }
  if (!email && !phone && !discord) {
    openAuthModal("register", values, "Add at least one login method: email, phone number, or Discord handle.");
    return;
  }
  if (email && !email.includes("@")) {
    openAuthModal("register", values, "Enter a valid email address or leave it blank.");
    return;
  }
  if (password.length < 6) {
    openAuthModal("register", values, "Use a password with at least 6 characters.");
    return;
  }
  if (password !== confirmPassword) {
    openAuthModal("register", values, "The password confirmation does not match.");
    return;
  }

  const duplicate = Object.values(accounts).find((account) => {
    if (!account) return false;
    if (normalize(account.username) === normalize(username)) return true;
    if (account.email && normalize(account.email) === normalize(email)) return true;
    if (phone && getPhoneLookupKey(account.phone) === getPhoneLookupKey(phone)) return true;
    if (discord && normalize(account.discord) === normalize(discord)) return true;
    return false;
  });

  if (duplicate) {
    openAuthModal("register", values, "That username, email, phone number, or Discord handle is already in use.");
    return;
  }

  const now = new Date().toISOString();
  accounts[username] = normaliseAccountRecord(username, {
    username,
    displayName,
    email,
    phone,
    discord,
    region,
    password,
    trackingOptIn: false,
    emailUpdates: true,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
    discordLinked: false
  });

  writeAccounts(accounts);
  setSession(username);
  updateAuthUi();
  closeAuthModal();
  navigateTo("/account");
}

function handleLogin(values) {
  const identifier = String(values.identifier || "").trim();
  const password = String(values.password || "");
  const accounts = readAccounts();
  const account = findAccountByIdentifier(accounts, identifier);

  if (!identifier || !password) {
    openAuthModal("login", values, "Enter your login and password.");
    return;
  }

  if (!account || account.password !== password) {
    openAuthModal("login", values, "Invalid login details.");
    return;
  }

  const updatedAccount = {
    ...account,
    lastLoginAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  accounts[updatedAccount.username] = updatedAccount;
  writeAccounts(accounts);
  setSession(updatedAccount.username);
  updateAuthUi();
  closeAuthModal();
  navigateTo("/account");
}

function bindAuthModalControls() {
  const modal = authModalRoot?.querySelector(".auth-modal");
  if (!modal) return;

  modal.querySelectorAll("[data-auth-close]").forEach((button) => {
    button.addEventListener("click", () => closeAuthModal());
  });

  modal.querySelectorAll("[data-auth-switch]").forEach((button) => {
    button.addEventListener("click", () => {
      openAuthModal(button.getAttribute("data-auth-switch") || "login");
    });
  });

  const form = modal.querySelector("#authForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const values = Object.fromEntries(formData.entries());
      const mode = form.getAttribute("data-auth-mode");
      if (mode === "register") {
        handleRegister(values);
        return;
      }
      handleLogin(values);
    });
  }
}

function updateAuthUi() {
  const session = getSession();
  const account = getCurrentAccount();
  const isIn = Boolean(session && account);

  if (loginBtn) {
    loginBtn.style.display = isIn ? "none" : "inline-flex";
    loginBtn.textContent = "Discord Login";
  }
    if (registerBtn) registerBtn.style.display = "none";
    if (accountBtn) {
      accountBtn.style.display = isIn ? "inline-flex" : "none";
      accountBtn.classList.toggle("auth__btn--account", isIn);
      if (isIn) {
        const displayName = getAccountDisplayName(account);
        const avatarUrl = getAccountAvatarUrl(account, 64);
        const fallbackChar = escapeHtml((displayName || "A").charAt(0).toUpperCase());
      accountBtn.innerHTML = `
        ${avatarUrl
          ? `<img class="auth__avatar" src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(displayName)}" />`
          : `<span class="auth__avatar auth__avatar--fallback">${fallbackChar}</span>`}
        <span class="auth__accountName">${escapeHtml(displayName)}</span>
      `;
    } else {
      accountBtn.textContent = "Account";
    }
    accountBtn.title = isIn ? `Signed in as ${getAccountDisplayName(account)}` : "Account";
  }
  if (logoutBtn) logoutBtn.style.display = "none";
  if (authArea) authArea.title = isIn ? `Signed in as ${getAccountDisplayName(account)}` : "Account";
  updateAdminDockVisibility(account);
  if (!isIn) {
    adminOverviewState = {
      loading: false,
      loaded: false,
      error: "",
      data: null
    };
    closeAccountUi();
  } else {
    renderAccountUi();
  }
}

function initAuth() {
  updateAuthUi();

  if (loginBtn) {
    loginBtn.addEventListener("click", () => openAuthModal("login"));
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", () => openAuthModal("register"));
  }

  if (accountBtn) {
    accountBtn.addEventListener("click", () => {
      toggleAccountMenu();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      performLogout();
    });
  }
}

function brandAccentIconSvg(kind) {
  if (kind === "police") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l7 3v5c0 5.2-2.7 9.2-7 12-4.3-2.8-7-6.8-7-12V5l7-3z" fill="currentColor"></path>
        <path d="M12 7.1l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z" fill="rgba(11,15,20,.94)"></path>
      </svg>
    `;
  }

  if (kind === "mask") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3c4.8 0 8.5 3.7 8.5 8.7 0 6.1-4.1 9.4-8.5 9.4S3.5 17.8 3.5 11.7C3.5 6.7 7.2 3 12 3Z" fill="currentColor"></path>
        <path d="M8.1 10.2c1.5-1.4 2.9-1.9 3.9-1.9s2.4.5 3.9 1.9l-1.6 2.1c-.8-.8-1.6-1.2-2.3-1.2s-1.5.4-2.3 1.2l-1.6-2.1Z" fill="rgba(11,15,20,.94)"></path>
        <path d="M9.4 15.4h5.2l-.8 1.8h-3.6z" fill="rgba(11,15,20,.94)"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.5 4.5h7l3 3v2.5c0 3.2-1 5.5-2.8 7.5L12 21l-3.7-3.5C6.5 15.5 5.5 13.2 5.5 10V7.5l3-3Z" fill="currentColor"></path>
      <path d="M10.3 4.5c0-1 .8-1.8 1.7-1.8s1.7.8 1.7 1.8-.8 1.7-1.7 1.7-1.7-.7-1.7-1.7Z" fill="rgba(11,15,20,.94)"></path>
      <path d="M12 8.3c-1.5 0-2.7 1.2-2.7 2.7S10.5 13.7 12 13.7s2.7-1.2 2.7-2.7S13.5 8.3 12 8.3Zm.7 4.4h-1.4v-.9h-.9v-1.3h.9V9.6h1.4v.9h.9v1.3h-.9v.9Z" fill="rgba(11,15,20,.94)"></path>
    </svg>
  `;
}

function renderLandingBranding() {
  return `
    <div class="landing-brand" aria-label="SGCNR brand showcase">
      <div class="landing-brand__main">
        <div class="landing-brand__banner">
          <img
            class="landing-brand__bannerLogo"
            src="${escapeHtml(BRAND_LOGO_BANNER_URL)}"
            alt="SG Cops and Robbers logo"
            loading="eager"
            onload="this.classList.add('is-ready'); if (this.nextElementSibling) this.nextElementSibling.hidden = true;"
            onerror="this.remove();"
          />
          <div class="landing-brand__bannerFallback">SG Cops &amp; Robbers</div>
        </div>
        <div class="landing-brand__support">
          <div class="landing-brand__chips">
            <div class="landing-brand__chip landing-brand__chip--police">
              <span class="landing-brand__chipIcon" aria-hidden="true">${brandAccentIconSvg("police")}</span>
              <span>Police</span>
            </div>
            <div class="landing-brand__chip landing-brand__chip--crime">
              <span class="landing-brand__chipIcon" aria-hidden="true">${brandAccentIconSvg("mask")}</span>
              <span>Robbers</span>
            </div>
          </div>
          <div class="landing-brand__title landing-brand__title--wide">Los Santos Cops &amp; Robbers</div>
          <div class="landing-brand__tag">One place for rules, live status, service locations, and quick access to the server.</div>
        </div>
      </div>
      <div class="landing-brand__badge" aria-label="SGCNR logo">
        <img
          class="landing-brand__badgeLogo"
          src="${escapeHtml(BRAND_LOGO_BADGE_URL)}"
          alt="SGCNR badge"
          loading="eager"
          onload="this.classList.add('is-ready'); if (this.nextElementSibling) this.nextElementSibling.hidden = true;"
          onerror="this.remove();"
        />
        <div class="landing-brand__badgeFallback">SGCNR</div>
      </div>
    </div>
  `;
}

function renderLanding() {
  setView(`
    <div class="landing landing--cloud">
      <div class="landing-shell">
        <section class="landing-hero" aria-label="Welcome">
          <div class="landing-hero__copy">
            <div class="landing__coming">Los Santos hub</div>
            ${renderLandingBranding()}
            <div class="landing-hero__title">Rules, support, and map tools in one place.</div>
            <div class="landing-hero__text">A cleaner way for players to navigate the server, find answers fast, and jump straight into the essentials.</div>
            <div class="landing-hero__actions">
              <a class="auth__btn auth__btn--primary" href="${escapeHtml(DISCORD_INVITE_URL)}" target="_blank" rel="noopener noreferrer">Open Discord</a>
            </div>
          </div>
          <div class="landing-panel">
            <div class="landing-panel__eyebrow">Quick access</div>
            <div class="landing-panel__grid">
              <a class="quickstart__btn" href="#/start">
                <span class="quickstart__icon" aria-hidden="true">▶</span>
                <span class="quickstart__label">Start Here</span>
              </a>
              <a class="quickstart__btn" href="#/rules">
                <span class="quickstart__icon" aria-hidden="true">📖</span>
                <span class="quickstart__label">Rules</span>
              </a>
              <a class="quickstart__btn" href="#/map">
                <span class="quickstart__icon" aria-hidden="true">🗺️</span>
                <span class="quickstart__label">Map</span>
              </a>
              <a class="quickstart__btn" href="#/status">
                <span class="quickstart__icon" aria-hidden="true">📡</span>
                <span class="quickstart__label">Live Status</span>
              </a>
            </div>
            <div class="landing-stats">
              <div class="landing-stat">
                <div class="landing-stat__label">Access</div>
                <div class="landing-stat__value">Fast</div>
              </div>
              <div class="landing-stat">
                <div class="landing-stat__label">Support</div>
                <div class="landing-stat__value">Discord</div>
              </div>
              <div class="landing-stat">
                <div class="landing-stat__label">Server</div>
                <div class="landing-stat__value">Live Ready</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `);
}

function renderLandingHome() {
  setView(`
    <div class="landing-reboot">
      <div class="landing-reboot__noise" aria-hidden="true"></div>
      <div class="landing-reboot__glow landing-reboot__glow--blue" aria-hidden="true"></div>
      <div class="landing-reboot__glow landing-reboot__glow--red" aria-hidden="true"></div>

      <section class="landing-reboot__hero" aria-label="Welcome">
        <div class="landing-reboot__lead">
          <div class="landing-reboot__intro">
            <div class="landing-reboot__kicker">Official Server Portal</div>
            <div class="landing-reboot__line" aria-hidden="true"></div>
            <h1 class="landing-reboot__title">Step into SGCNR.</h1>
            <p class="landing-reboot__text">Fast entry for joining the server and getting into the city without extra clutter.</p>
          </div>

          <div class="landing-reboot__actions">
            <a class="landing-reboot__action landing-reboot__action--primary" href="${escapeHtml(DISCORD_INVITE_URL)}" target="_blank" rel="noopener noreferrer">Open Discord</a>
          </div>
        </div>
      </section>
    </div>
  `);

  bindLandingHomeControls();
}

function renderStart() {
  const quickLinks = [
    { label: "Read the rules", href: "#/rules" },
    { label: "View the map", href: "#/map" },
    { label: "Check live status", href: "#/live" }
  ];

  setView(`
    <div>
      ${renderHeader("Start Here", [{ label: "Start" }], { showBadge: false })}
      <div class="content-grid content-grid--sidebar">
        <section class="section section--hero start-panel">
          <div class="section__eyebrow">New player entry</div>
          <h2>Join in four clean steps</h2>
          <div class="doc-p">
            Start here if you are new. This page keeps the join flow, support route, and core links together without the extra clutter from before.
          </div>
          <div class="start-flow">
            <article class="start-flow__item">
              <div class="start-flow__index">01</div>
              <div class="start-flow__copy">
                <strong>Open FiveM</strong>
                <span>Search for <strong>SGCNR</strong> in FiveM to find the server.</span>
              </div>
            </article>
            <article class="start-flow__item">
              <div class="start-flow__index">02</div>
              <div class="start-flow__copy">
                <strong>Read the basics first</strong>
                <span>Use the Rules page before you jump into the city.</span>
              </div>
            </article>
            <article class="start-flow__item">
              <div class="start-flow__index">03</div>
              <div class="start-flow__copy">
                <strong>Use Discord tickets for staff help</strong>
                <span>Ticket creation should go through the direct Discord ticket channel so staff can track it properly.</span>
              </div>
            </article>
            <article class="start-flow__item">
              <div class="start-flow__index">04</div>
              <div class="start-flow__copy">
                <strong>Keep Live and Map nearby</strong>
                <span>The Live and Map tabs stay on the dock whenever you need current info or locations.</span>
              </div>
            </article>
          </div>
          <div class="start-panel__actions">
            <a class="auth__btn auth__btn--primary" href="${escapeHtml(DISCORD_TICKET_CHANNEL_URL)}" target="_blank" rel="noopener noreferrer">Open Discord tickets</a>
          </div>
        </section>

        <aside class="section section--stack start-sidecard">
          <div class="section__eyebrow">Useful links</div>
          <h2>Quick access</h2>
          <div class="start-linklist">
            ${quickLinks.map((item) => `
              <a class="start-linklist__item" href="${escapeHtml(item.href)}">
                <span>${escapeHtml(item.label)}</span>
                <span aria-hidden="true">+</span>
              </a>
            `).join("")}
          </div>
          <div class="start-ticket-panel">
            <div class="start-ticket-panel__label">Support route</div>
            <div class="start-ticket-panel__title">Ticket creation lives in Discord</div>
            <div class="start-ticket-panel__text">If someone needs help, a ban-history request, or application prep, send them to the ticket channel directly.</div>
            <a class="info-link" href="${escapeHtml(DISCORD_TICKET_CHANNEL_URL)}" target="_blank" rel="noopener noreferrer">Open ticket channel</a>
          </div>
        </aside>
      </div>

      <section class="section section--timeline">
        <div class="section__eyebrow">Essentials</div>
        <h2>New player checklist</h2>
        <div class="stack-list">
          <div class="stack-list__item"><span class="stack-list__index">01</span><span>Read the Rules and follow the category that applies to what you're doing.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">02</span><span>Check Help for common questions, punishments, appeals, and support guidance.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">03</span><span>Use the Discord ticket channel when you need staff help or ban-history access.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">04</span><span>Be respectful and keep it fair — staff decisions are based on evidence.</span></div>
        </div>
      </section>
    </div>
  `);
}

function renderHelp() {
  const ticketLink = `<a class="info-link" href="${escapeHtml(DISCORD_TICKET_CHANNEL_URL)}" target="_blank" rel="noopener noreferrer">open a Discord ticket</a>`;
  setView(`
      <div>
      ${renderHeader("Help", [{ label: "Help" }])}
        <div class="content-grid content-grid--sidebar">
          <section class="section section--hero">
            <div class="section__eyebrow">Frequently asked</div>
            <h2>Quick answers</h2>
          <div class="info-faq">
            <div class="info-faq__item">
              <div class="info-faq__q">Do I need a microphone?</div>
              <div class="info-faq__a">Recommended for support and roleplay. You can still play, but talking helps.</div>
            </div>
            <div class="info-faq__item">
              <div class="info-faq__q">Where do I report a player or get support?</div>
              <div class="info-faq__a">Join Discord and ${ticketLink}. Include video/screenshot evidence when possible.</div>
            </div>
            <div class="info-faq__item">
              <div class="info-faq__q">How do I appeal a punishment?</div>
              <div class="info-faq__a">Use ${ticketLink}. Provide context, your ID, and any evidence.</div>
            </div>
            <div class="info-faq__item">
              <div class="info-faq__q">What should I do if I'm not sure about a rule?</div>
              <div class="info-faq__a">Ask staff in Discord before doing it — it's better than getting punished later.</div>
            </div>
          </div>
        </section>

          <aside class="section section--stack">
            <div class="section__eyebrow">Best practice</div>
            <h2>Need help faster?</h2>
            <div class="stack-list stack-list--compact">
              <div class="stack-list__item"><span class="stack-list__index">01</span><span>Use the direct Discord ticket channel.</span></div>
              <div class="stack-list__item"><span class="stack-list__index">02</span><span>Include your ID and screenshots.</span></div>
              <div class="stack-list__item"><span class="stack-list__index">03</span><span>Explain the issue clearly.</span></div>
            </div>
          </aside>
        </div>

        <div class="content-grid content-grid--sidebar">
          <section class="section">
            <div class="section__eyebrow">Discord integration</div>
            <h2>Website and bot connection</h2>
            <div class="info-faq">
              <div class="info-faq__item">
                <div class="info-faq__q">Does the website already have a real database?</div>
                <div class="info-faq__a">The website is now prepared for Discord-only account access. Real synced accounts across devices, ticket sync, punishments, and Discord role rewards still need a backend API and database behind it.</div>
              </div>
              <div class="info-faq__item">
                <div class="info-faq__q">Can the website be connected to a Discord bot later?</div>
                <div class="info-faq__a">Yes. The site is now prepared for Discord guild stats, bot status, account linking, support queues, announcement feeds, and role-based sync once those endpoints are connected.</div>
              </div>
              <div class="info-faq__item">
                <div class="info-faq__q">What is needed for real Discord linking?</div>
                <div class="info-faq__a">You will need Discord OAuth on the website, a backend service that verifies the Discord login token, a database for linked accounts, and bot or Discord API access so roles can be confirmed safely.</div>
              </div>
              <div class="info-faq__item">
                <div class="info-faq__q">How would Discord role sync actually work?</div>
                <div class="info-faq__a">The user starts with a Discord OAuth login button on the website. After login, the backend verifies the returned Discord token, checks the player's roles in your SGCNR Discord, and stores that link in the database so the verified Discord identity or guild nickname can become the website and in-game reference safely.</div>
              </div>
            </div>
          </section>

          <aside class="section section--stack">
            <div class="section__eyebrow">Good features</div>
            <h2>What Discord can unlock</h2>
            <div class="stack-list stack-list--compact">
              <div class="stack-list__item"><span class="stack-list__index">01</span><span>Linked website accounts with Discord roles and verification.</span></div>
              <div class="stack-list__item"><span class="stack-list__index">02</span><span>Live Discord bot status, guild member counts, and support queue panels.</span></div>
              <div class="stack-list__item"><span class="stack-list__index">03</span><span>Application, appeal, and report dashboards shared between website and Discord.</span></div>
              <div class="stack-list__item"><span class="stack-list__index">04</span><span>Automated server restart alerts, event posts, and leaderboard highlights.</span></div>
              <div class="stack-list__item"><span class="stack-list__index">05</span><span>Claimable rewards or perks after Discord verification or supporter role checks.</span></div>
              <div class="stack-list__item"><span class="stack-list__index">06</span><span>Role-locked website features that only open after backend verification confirms Discord membership.</span></div>
            </div>
          </aside>
        </div>
      </div>
    `);
  }

function renderApply() {
  setView(`
    <div>
      ${renderHeader("Apply", [{ label: "Apply" }])}
      <div class="content-grid content-grid--sidebar">
        <section class="section section--hero account-hero">
          <div class="section__eyebrow">Staff applications</div>
          <h2>Application form</h2>
          <p class="doc-p">Use this form to prepare a staff application for SGCNR. It is intentionally read-only for now, so nothing gets sent until the real backend intake is connected.</p>
          <form class="account-form" autocomplete="off">
            <div class="account-form__grid">
              <label class="account-field">
                <span class="account-field__label">Discord username</span>
                <input class="account-field__input" type="text" placeholder="Your Discord username" />
              </label>
              <label class="account-field">
                <span class="account-field__label">In-game name</span>
                <input class="account-field__input" type="text" placeholder="Your in-game name" />
              </label>
              <label class="account-field">
                <span class="account-field__label">In-game level</span>
                <input class="account-field__input" type="number" min="1" placeholder="Your current level" />
              </label>
              <label class="account-field">
                <span class="account-field__label">Playtime (hours)</span>
                <input class="account-field__input" type="number" min="0" placeholder="Your total playtime" />
              </label>
              <label class="account-field">
                <span class="account-field__label">Timezone</span>
                <input class="account-field__input" type="text" placeholder="Example: CET / EST" />
              </label>
              <label class="account-field">
                <span class="account-field__label">What role are you applying for?</span>
                <input class="account-field__input" type="text" placeholder="Moderator, Tester, Helper, etc." />
              </label>
              <label class="account-field account-field--wide">
                <span class="account-field__label">Availability</span>
                <textarea class="account-field__input account-field__input--textarea" rows="3" placeholder="When are you usually online?"></textarea>
              </label>
              <label class="account-field account-field--wide">
                <span class="account-field__label">Full ban history</span>
                <textarea class="account-field__input account-field__input--textarea" rows="4" placeholder="Paste your full ban history here after requesting it in the SGCNR Discord ticket system."></textarea>
              </label>
              <label class="account-field account-field--wide">
                <span class="account-field__label">Moderation experience</span>
                <textarea class="account-field__input account-field__input--textarea" rows="4" placeholder="Tell us about any moderation experience you have."></textarea>
              </label>
              <label class="account-field account-field--wide">
                <span class="account-field__label">Testing experience</span>
                <textarea class="account-field__input account-field__input--textarea" rows="4" placeholder="Tell us about any QA, bug-reporting, or testing experience you have."></textarea>
              </label>
              <label class="account-field account-field--wide">
                <span class="account-field__label">Why should we accept you?</span>
                <textarea class="account-field__input account-field__input--textarea" rows="5" placeholder="Explain why you would be a good fit for staff."></textarea>
              </label>
            </div>
            <div class="auth-modal__actions">
              <button class="auth__btn auth__btn--primary" type="button" disabled>Send application</button>
            </div>
            <div class="status-note">
              <strong>Current state:</strong> this form is live as a clean layout only. Submission is blocked until the real application backend is connected. Applicants should request their full ban history in the SGCNR Discord by opening a ticket and choosing <code>Ban history</code>.
            </div>
          </form>
        </section>

        <aside class="section section--stack">
          <div class="section__eyebrow">What to include</div>
          <h2>Before you apply</h2>
          <div class="stack-list stack-list--compact">
            <div class="stack-list__item"><span class="stack-list__index">01</span><span>Use your real Discord username and in-game name.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">02</span><span>Be honest about your level, playtime, and availability.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">03</span><span>Open a ticket in the SGCNR Discord and choose <strong>Ban history</strong> to get your full ban history first.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">04</span><span>Include any moderation or testing experience you already have.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">05</span><span>Take your time with the final answer about why you want to join staff.</span></div>
          </div>
        </aside>
      </div>
    </div>
  `);
}

function setAccountFeedback(element, tone, text) {
  if (!element) return;
  if (!text) {
    element.hidden = true;
    element.textContent = "";
    element.className = "account-feedback";
    return;
  }

  element.hidden = false;
  element.textContent = text;
  element.className = `account-feedback account-feedback--${tone}`;
}

function renderAccountLoginMethods(account) {
  const verificationStatus = account?.verificationStatus === "verified"
    ? "Verified"
    : account?.verificationStatus === "linked"
      ? "Linked"
      : "Pending";
  const verificationSource = account?.verificationSource === "bot_database"
    ? "Discord bot database"
    : account?.verificationSource || "Pending bridge";
  const methods = [
    ["Website Name", getAccountDisplayName(account)],
    ["Discord Name", account?.guildNickname || account?.discordDisplayName || account?.discordUsername || (account?.discord ? `@${account.discord}` : "Pending sync")],
    ["Discord ID", account?.discordId || "Pending OAuth"],
    ["Discord OAuth", SERVER_CONFIG.discordOAuthUrl ? (account?.discordLinked ? "Linked" : "Ready to connect") : "Backend required"],
    ["Backend Verification", SERVER_CONFIG.discordRoleVerifyUrl ? "Prepared" : "Pending backend"],
    ["Role Sync", SERVER_CONFIG.discordRoleSyncUrl ? "Prepared" : "Pending bot/backend"],
    ["FiveM Identity", account?.verifiedIdentity || "Pending game sync"],
    ["Verification Status", verificationStatus],
    ["Verification Source", verificationSource],
    ["FiveM Record", account?.fivemId || account?.fivemLicense || "No bot record yet"]
  ];

  return `
    <div class="stack-list stack-list--compact">
      ${methods.map(([label, value], index) => `
        <div class="stack-list__item">
          <span class="stack-list__index">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
          <span><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderAccountGuest() {
  return `
    <div>
      ${renderHeader("Account", [{ label: "Account" }])}
      <section class="section section--hero account-hero account-hero--compact">
        <div class="section__eyebrow">Discord account</div>
        <h2>Sign in with Discord</h2>
        <p class="doc-p">Use your Discord identity to unlock linked services, applications, and synced community access on the website.</p>
        <div class="status-actions">
          ${SERVER_CONFIG.discordOAuthUrl ? `<a class="auth__btn auth__btn--primary" href="${escapeHtml(SERVER_CONFIG.discordOAuthUrl)}">Continue with Discord</a>` : `<button class="auth__btn auth__btn--primary" id="accountLoginCta" type="button">Discord login setup</button>`}
        </div>
      </section>
    </div>
  `;
}

function renderAccountDashboard(account) {
  const createdLabel = account?.createdAt ? formatServerTimestamp(account.createdAt) : "Not recorded";
  const lastLoginLabel = account?.lastLoginAt ? formatServerTimestamp(account.lastLoginAt) : "No login yet";
  const linkedAtLabel = account?.linkedAt ? formatServerTimestamp(account.linkedAt) : "Not recorded";
  const verifiedAtLabel = account?.verifiedAt ? formatServerTimestamp(account.verifiedAt) : "Not verified";
  const avatarUrl = getAccountAvatarUrl(account, 128);
  const discordName = account?.guildNickname || account?.discordDisplayName || account?.discordUsername || (account?.discord ? `@${account.discord}` : "Not linked");
  const verifiedIdentity = account?.verifiedIdentity || "Pending FiveM sync";
  const verificationStatus = account?.verificationStatus === "verified"
    ? "Verified"
    : account?.verificationStatus === "linked"
      ? "Linked"
      : "Pending";
  const verificationSource = account?.verificationSource === "bot_database"
    ? "Bot bridge"
    : account?.verificationSource || "Pending";
  const fivemRecord = account?.fivemId || "No FiveM ID";
  const fivemLicense = account?.fivemLicense || "No license synced";

  return `
    <div>
      ${renderHeader("Account", [{ label: "Account" }])}

      <section class="section section--hero account-hero">
        <div class="section__eyebrow">Website profile</div>
        <div class="account-identity">
          ${avatarUrl
            ? `<img class="account-identity__avatar" src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(getAccountDisplayName(account))}" />`
            : `<div class="account-identity__avatar account-identity__avatar--fallback">${escapeHtml((getAccountDisplayName(account) || "A").charAt(0).toUpperCase())}</div>`}
          <div class="account-identity__copy">
            <div class="account-identity__label">Discord identity</div>
            <div class="account-identity__name">${escapeHtml(getAccountDisplayName(account))}</div>
            <div class="account-identity__meta">${escapeHtml(discordName)} · ${escapeHtml(verifiedIdentity)}</div>
          </div>
        </div>
        <h2>${escapeHtml(getAccountDisplayName(account))}</h2>
        <p class="doc-p">Manage your Discord-linked website identity, privacy settings, and synced FiveM details from one place. The website can now pull linked game identity data from the Discord bot database when that bridge is configured.</p>

        <div class="status-grid account-summary">
          <div class="status-card">
            <div class="status-card__label">Website Name</div>
            <div class="status-card__value">${escapeHtml(getAccountDisplayName(account))}</div>
            <div class="status-card__meta">Current website identity</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Discord Name</div>
            <div class="status-card__value">${escapeHtml(discordName)}</div>
            <div class="status-card__meta">Taken from Discord / guild sync</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Ingame Identity</div>
            <div class="status-card__value">${escapeHtml(verifiedIdentity)}</div>
            <div class="status-card__meta">${escapeHtml(verifiedAtLabel)}</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Discord ID</div>
            <div class="status-card__value">${escapeHtml(account.discordId || "Pending OAuth")}</div>
            <div class="status-card__meta">${escapeHtml(account.discordLinked ? "Linked and verified" : "Waiting for Discord auth")}</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Verification Status</div>
            <div class="status-card__value">${escapeHtml(verificationStatus)}</div>
            <div class="status-card__meta">${escapeHtml(verificationSource)}</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">FiveM Record</div>
            <div class="status-card__value">${escapeHtml(fivemRecord)}</div>
            <div class="status-card__meta">${escapeHtml(fivemLicense)}</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Created</div>
            <div class="status-card__value">${escapeHtml(createdLabel)}</div>
            <div class="status-card__meta">${escapeHtml(account.region || SERVER_CONFIG.region || "EU")}</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Last Login</div>
            <div class="status-card__value">${escapeHtml(lastLoginLabel)}</div>
            <div class="status-card__meta">${escapeHtml(account.trackingOptIn ? "Live tracking opt-in enabled" : "Live tracking opt-in disabled")}</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Linked Since</div>
            <div class="status-card__value">${escapeHtml(linkedAtLabel)}</div>
            <div class="status-card__meta">${escapeHtml(account?.discordIdent || "No Discord identifier stored")}</div>
          </div>
        </div>
      </section>

      <div class="content-grid content-grid--sidebar">
        <section class="section">
          <div class="section__eyebrow">Profile</div>
          <h2>Edit details</h2>
          <form class="account-form" id="accountProfileForm">
            <div class="account-form__grid">
              <label class="account-field">
                <span class="account-field__label">Display name</span>
                <input class="account-field__input" name="displayName" value="${escapeHtml(account.displayName || "")}" required />
              </label>
              <label class="account-field">
                <span class="account-field__label">Email</span>
                <input class="account-field__input" type="email" name="email" value="${escapeHtml(account.email || "")}" placeholder="Optional if phone or Discord is used" />
              </label>
              <label class="account-field">
                <span class="account-field__label">Phone</span>
                <input class="account-field__input" name="phone" value="${escapeHtml(account.phone || "")}" />
              </label>
              <label class="account-field">
                <span class="account-field__label">Discord</span>
                <input class="account-field__input" name="discord" value="${escapeHtml(account.discord || "")}" />
              </label>
              <label class="account-field">
                <span class="account-field__label">Region</span>
                <input class="account-field__input" name="region" value="${escapeHtml(account.region || SERVER_CONFIG.region || "EU")}" />
              </label>
              <label class="account-field account-field--wide">
                <span class="account-field__label">Bio</span>
                <textarea class="account-field__input account-field__input--textarea" name="bio" rows="4">${escapeHtml(account.bio || "")}</textarea>
              </label>
            </div>
            <div class="auth-modal__actions">
              <button class="auth__btn auth__btn--primary" type="submit">Save profile</button>
            </div>
            <div class="account-feedback" id="accountProfileFeedback" hidden></div>
          </form>
        </section>

        <aside class="section section--stack">
          <div class="section__eyebrow">Access</div>
          <h2>Connected methods</h2>
          ${renderAccountLoginMethods(account)}
          <div class="status-note">
            <strong>Discord linking:</strong> the website now supports reading linked FiveM identity data from the bot database when <code>bot_mysql_*</code> is configured. Discord OAuth still controls the website session, while the bot tables can fill in verified game identity, ticket counts, and linked-account data.
          </div>
        </aside>
      </div>

      <div class="content-grid content-grid--sidebar">
        <section class="section">
          <div class="section__eyebrow">Privacy</div>
          <h2>Website settings</h2>
          <form class="account-form" id="accountSettingsForm">
            <label class="account-toggle">
              <input type="checkbox" name="trackingOptIn" ${account.trackingOptIn ? "checked" : ""} />
              <span>Allow live website tracking once the in-game opt-in system is connected</span>
            </label>
            <label class="account-toggle">
              <input type="checkbox" name="emailUpdates" ${account.emailUpdates ? "checked" : ""} />
              <span>Receive future website-related account updates by email</span>
            </label>
            <div class="auth-modal__actions">
              <button class="auth__btn auth__btn--primary" type="submit">Save settings</button>
            </div>
            <div class="account-feedback" id="accountSettingsFeedback" hidden></div>
          </form>
        </section>

        <section class="section">
          <div class="section__eyebrow">Security</div>
          <h2>Change password</h2>
          <form class="account-form" id="accountPasswordForm">
            <label class="account-field">
              <span class="account-field__label">Current password</span>
              <input class="account-field__input" type="password" name="currentPassword" autocomplete="current-password" required />
            </label>
            <label class="account-field">
              <span class="account-field__label">New password</span>
              <input class="account-field__input" type="password" name="newPassword" autocomplete="new-password" required />
            </label>
            <label class="account-field">
              <span class="account-field__label">Confirm new password</span>
              <input class="account-field__input" type="password" name="confirmPassword" autocomplete="new-password" required />
            </label>
            <div class="auth-modal__actions">
              <button class="auth__btn auth__btn--primary" type="submit">Update password</button>
            </div>
            <div class="account-feedback" id="accountPasswordFeedback" hidden></div>
          </form>
        </section>
      </div>
    </div>
  `;
}

function renderAdminLockedPage() {
  const label = SERVER_CONFIG.adminPanelLabel || "Manager";
  return `
    <div>
      ${renderHeader(`${label} Mode`, [{ label: label }])}
      <section class="section section--hero">
        <div class="section__eyebrow">Restricted access</div>
        <h2>${escapeHtml(label)} role required</h2>
        <p class="doc-p">This tab is reserved for Discord accounts with one of the configured manager/admin role IDs. Once your manager role is listed in <code>adminPanelRoles</code>, the website will unlock this tab automatically for that Discord account.</p>
        <div class="status-note">
          <strong>Next step:</strong> add the real Discord manager role ID to <code>server-config.js</code> so the website can match your synced Discord roles against the admin access rule.
        </div>
      </section>
    </div>
  `;
}

function renderAdminDashboard(account) {
  const label = SERVER_CONFIG.adminPanelLabel || "Manager";
  const roleMarkup = getDiscordRoleList(account).length
    ? getDiscordRoleList(account).map((role) => `<span class="leaderboard-badge">${escapeHtml(role)}</span>`).join("")
    : `<span class="leaderboard-badge">No synced roles</span>`;

  setView(`
    <div class="admin-page">
      ${renderHeader(`${label} Mode`, [{ label: label }])}

      <section class="section section--hero">
        <div class="section__eyebrow">Discord synced access</div>
        <h2>${escapeHtml(label)} control panel</h2>
        <p class="doc-p">This area is ideal for staff-side website control, live server coordination, and private community operations. It is unlocked only for Discord accounts that match the configured manager/admin roles.</p>

        <div class="status-grid">
          <div class="status-card">
            <div class="status-card__label">Access source</div>
            <div class="status-card__value">Discord role sync</div>
            <div class="status-card__meta">Protected by the synced Discord role list</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Website identity</div>
            <div class="status-card__value">${escapeHtml(getAccountDisplayName(account))}</div>
            <div class="status-card__meta">Current signed-in manager account</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Verified identity</div>
            <div class="status-card__value">${escapeHtml(account?.verifiedIdentity || "Pending game sync")}</div>
            <div class="status-card__meta">Trusted display for staff-side tools</div>
          </div>
          <div class="status-card">
            <div class="status-card__label">Role gate</div>
            <div class="status-card__value">${escapeHtml(label)}</div>
            <div class="status-card__meta">Configured in <code>server-config.js</code></div>
          </div>
        </div>
      </section>

      <div class="content-grid content-grid--sidebar">
        <section class="section">
          <div class="section__eyebrow">Suggested tools</div>
          <h2>What should live here</h2>
          <div class="stack-list stack-list--compact">
            <div class="stack-list__item"><span class="stack-list__index">01</span><span><strong>Announcements:</strong> homepage alerts, restart banners, maintenance notices, and event callouts.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">02</span><span><strong>Applications & appeals:</strong> review queues for staff applications, ban appeals, and player reports.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">03</span><span><strong>Live ops controls:</strong> toggle active events, hottest zones, and manager-side notices shown on the Live page.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">04</span><span><strong>Account oversight:</strong> inspect Discord-linked accounts, verification status, and identity mismatches.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">05</span><span><strong>Support overview:</strong> pending reports, pending reviews, website health, and backend sync checks.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">06</span><span><strong>Private notes:</strong> internal rollout reminders, changelog notes, and staff-only operational tasks.</span></div>
          </div>
        </section>

        <aside class="section section--stack">
          <div class="section__eyebrow">Current Discord roles</div>
          <h2>Role check</h2>
          <div class="admin-role-list">
            ${roleMarkup}
          </div>
          <div class="status-note">
            <strong>Setup note:</strong> the tab only appears when your synced Discord role list contains a role ID from <code>adminPanelRoles</code> in <code>server-config.js</code>.
          </div>
        </aside>
      </div>
    </div>
  `);
}

function renderAdminDashboard(account) {
  const label = SERVER_CONFIG.adminPanelLabel || "Manager";
  const payload = adminOverviewState.data || {};
  const recentLogins = Array.isArray(payload?.recentLogins?.items) ? payload.recentLogins.items : [];
  const applicationCounts = payload?.applications?.counts || {};
  const recentApplications = Array.isArray(payload?.applications?.recent) ? payload.applications.recent : [];
  const loading = adminOverviewState.loading && !adminOverviewState.loaded;

  if (!adminOverviewState.loading && !adminOverviewState.loaded) {
    loadAdminOverview();
  }

  const metricCards = [
    {
      label: "Recent website logins",
      value: payload?.recentLogins?.available ? String(recentLogins.length) : "—",
      meta: "Latest Discord-authenticated sessions"
    },
    {
      label: "Open applications",
      value: payload?.applications?.available ? String(applicationCounts.open || 0) : "—",
      meta: "Submitted, review, info, interview"
    },
    {
      label: "Pending review",
      value: payload?.applications?.available ? String((applicationCounts.in_review || 0) + (applicationCounts.needs_info || 0)) : "—",
      meta: "Needs staff attention"
    },
    {
      label: "Signed in as",
      value: getAccountDisplayName(account),
      meta: account?.verifiedIdentity || "Discord linked"
    }
  ];

  setView(`
    <div class="admin-page">
      ${renderHeader(`${label} Mode`, [{ label: label }])}

      <section class="section section--hero admin-hero">
        <div class="section__eyebrow">Website control</div>
        <h2>${escapeHtml(label)} dashboard</h2>
        <p class="doc-p">Keep an eye on website Discord logins, applications, and the main shortcuts staff actually needs instead of digging through a placeholder page.</p>
        <div class="status-grid admin-metrics">
          ${metricCards.map((card) => `
            <div class="status-card">
              <div class="status-card__label">${escapeHtml(card.label)}</div>
              <div class="status-card__value">${escapeHtml(card.value)}</div>
              <div class="status-card__meta">${escapeHtml(card.meta)}</div>
            </div>
          `).join("")}
        </div>
        <div class="status-actions">
          <a class="auth__btn auth__btn--primary" href="#/apply">Applications</a>
          <a class="auth__btn" href="#/live">Live page</a>
          <a class="auth__btn" href="${escapeHtml(SERVER_CONFIG.discordTicketChannelUrl || SERVER_CONFIG.discordUrl || "#")}" target="_blank" rel="noopener noreferrer">Discord tickets</a>
        </div>
        ${loading ? `<div class="status-note">Loading the admin overview…</div>` : ""}
        ${adminOverviewState.error ? `<div class="status-note"><strong>Admin overview:</strong> ${escapeHtml(adminOverviewState.error)}</div>` : ""}
      </section>

      <div class="content-grid content-grid--sidebar">
        <section class="section section--stack">
          <div class="section__eyebrow">Who signed in</div>
          <h2>Recent Discord logins</h2>
          ${payload?.recentLogins?.available
            ? recentLogins.length
              ? `<div class="admin-list">
                  ${recentLogins.map((entry) => `
                    <article class="admin-list__item">
                      <div class="admin-list__title">${escapeHtml(entry.username || entry.discordId || "Unknown account")}</div>
                      <div class="admin-list__meta">${escapeHtml(entry.discordId || "No Discord ID")} · ${escapeHtml(formatServerTimestamp(entry.lastSeen || "") || "Recently")}</div>
                    </article>
                  `).join("")}
                </div>`
              : `<div class="empty">No Discord website logins have been recorded yet.</div>`
            : `<div class="empty">Website login history will appear here once the backend writes sessions into the database.</div>`}
        </section>

        <aside class="section section--stack">
          <div class="section__eyebrow">Application review</div>
          <h2>Application activity</h2>
          ${payload?.applications?.available
            ? `
              <div class="admin-counts">
                <div class="admin-counts__item"><strong>${escapeHtml(String(applicationCounts.submitted || 0))}</strong><span>Submitted</span></div>
                <div class="admin-counts__item"><strong>${escapeHtml(String(applicationCounts.in_review || 0))}</strong><span>In review</span></div>
                <div class="admin-counts__item"><strong>${escapeHtml(String(applicationCounts.needs_info || 0))}</strong><span>Needs info</span></div>
                <div class="admin-counts__item"><strong>${escapeHtml(String(applicationCounts.interview || 0))}</strong><span>Interview</span></div>
              </div>
              ${recentApplications.length
                ? `<div class="admin-list">
                    ${recentApplications.map((entry) => `
                      <article class="admin-list__item">
                        <div class="admin-list__title">${escapeHtml(entry.publicId || "Application")} · ${escapeHtml(entry.roleRequested || "Role")}</div>
                        <div class="admin-list__meta">${escapeHtml(entry.applicantName || "Unknown applicant")} · ${escapeHtml(APPLICATION_STATUS_LABELS[entry.status] || entry.status || "Open")}</div>
                      </article>
                    `).join("")}
                  </div>`
                : `<div class="empty">No applications are stored yet.</div>`}
            `
            : `<div class="empty">The applications backend is not connected yet. Once it is live, this panel will show live intake and review counts here.</div>`}
        </aside>
      </div>
    </div>
  `);
}

function bindAccountPageControls() {
  const loginCta = document.getElementById("accountLoginCta");
  if (loginCta) {
    loginCta.addEventListener("click", () => openAuthModal("login"));
  }

  const registerCta = document.getElementById("accountRegisterCta");
  if (registerCta) {
    registerCta.addEventListener("click", () => openAuthModal("register"));
  }

  const profileForm = document.getElementById("accountProfileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const account = getCurrentAccount();
      if (!account) return;

      const accounts = readAccounts();
      const formData = new FormData(profileForm);
      const updatedAccount = normaliseAccountRecord(account.username, {
        ...account,
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        discord: formData.get("discord"),
        region: formData.get("region"),
        bio: formData.get("bio"),
        updatedAt: new Date().toISOString()
      });
      const feedback = document.getElementById("accountProfileFeedback");

      if (!updatedAccount.email && !updatedAccount.phone && !updatedAccount.discord) {
        setAccountFeedback(feedback, "error", "Keep at least one login method saved: email, phone number, or Discord handle.");
        return;
      }

      if (updatedAccount.email && !updatedAccount.email.includes("@")) {
        setAccountFeedback(feedback, "error", "Enter a valid email address or leave it blank.");
        return;
      }

      const duplicate = Object.values(accounts).find((entry) => {
        if (!entry || entry.username === account.username) return false;
        if (updatedAccount.email && normalize(entry.email) === normalize(updatedAccount.email)) return true;
        if (updatedAccount.phone && getPhoneLookupKey(entry.phone) === getPhoneLookupKey(updatedAccount.phone)) return true;
        if (updatedAccount.discord && normalize(entry.discord) === normalize(updatedAccount.discord)) return true;
        return false;
      });

      if (duplicate) {
        setAccountFeedback(feedback, "error", "That email, phone number, or Discord handle is already used by another account.");
        return;
      }

      accounts[account.username] = updatedAccount;
      writeAccounts(accounts);
      updateAuthUi();
      route();
      window.requestAnimationFrame(() => {
        setAccountFeedback(document.getElementById("accountProfileFeedback"), "success", "Profile updated.");
      });
    });
  }

  const settingsForm = document.getElementById("accountSettingsForm");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const account = getCurrentAccount();
      if (!account) return;

      const accounts = readAccounts();
      const formData = new FormData(settingsForm);
      accounts[account.username] = normaliseAccountRecord(account.username, {
        ...account,
        trackingOptIn: formData.get("trackingOptIn") === "on",
        emailUpdates: formData.get("emailUpdates") === "on",
        updatedAt: new Date().toISOString()
      });
      writeAccounts(accounts);
      route();
      window.requestAnimationFrame(() => {
        setAccountFeedback(document.getElementById("accountSettingsFeedback"), "success", "Settings updated.");
      });
    });
  }

  const passwordForm = document.getElementById("accountPasswordForm");
  if (passwordForm) {
    passwordForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const account = getCurrentAccount();
      if (!account) return;

      const formData = new FormData(passwordForm);
      const currentPassword = String(formData.get("currentPassword") || "");
      const newPassword = String(formData.get("newPassword") || "");
      const confirmPassword = String(formData.get("confirmPassword") || "");
      const feedback = document.getElementById("accountPasswordFeedback");

      if (currentPassword !== account.password) {
        setAccountFeedback(feedback, "error", "Current password does not match.");
        return;
      }
      if (newPassword.length < 6) {
        setAccountFeedback(feedback, "error", "Use a password with at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setAccountFeedback(feedback, "error", "The new password confirmation does not match.");
        return;
      }

      const accounts = readAccounts();
      accounts[account.username] = normaliseAccountRecord(account.username, {
        ...account,
        password: newPassword,
        updatedAt: new Date().toISOString()
      });
      writeAccounts(accounts);
      passwordForm.reset();
      setAccountFeedback(feedback, "success", "Password updated.");
    });
  }
}

function renderAccount() {
  const account = getCurrentAccount();
  if (!account) {
    setView(renderAccountGuest());
    bindAccountPageControls();
    return;
  }

  setView(`
    <div>
      ${renderHeader("Account", [{ label: "Account" }])}
      <section class="section section--hero account-hero account-hero--compact">
        <div class="section__eyebrow">Website account</div>
        <h2>${escapeHtml(getAccountDisplayName(account))}</h2>
        <p class="doc-p">Your account tools now live behind the profile button in the top bar. Use it for profile edits, settings, linked services, and admin tools if your Discord role allows them.</p>
        <div class="status-actions">
          <button class="auth__btn auth__btn--primary" type="button" data-account-action="profile">Edit profile</button>
          <button class="auth__btn" type="button" data-account-action="settings">Settings</button>
          <button class="auth__btn" type="button" data-account-action="services">Linked services</button>
        </div>
      </section>
    </div>
  `);
  bindAccountPageControls();
}

function getLeaderboardMetricConfig(metricKey) {
  return LEADERBOARD_METRICS.find((metric) => metric.key === normalize(metricKey)) || LEADERBOARD_METRICS[0];
}

function getLeaderboardSortedRows(rows, metricKey) {
  const metric = getLeaderboardMetricConfig(metricKey);
  return [...rows]
    .sort((left, right) => (Number(right[metric.valueKey]) || 0) - (Number(left[metric.valueKey]) || 0))
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function renderLeaderboard(metricKey) {
  const metric = getLeaderboardMetricConfig(metricKey);
  const loadingText = SERVER_CONFIG.leaderboardUrl
    ? "Loading live leaderboard data..."
    : "Leaderboard endpoint not connected yet. Showing a live-ready layout with real online roster only.";

  setView(`
    <div>
      ${renderHeader("Leaderboard", [{ label: "Leaderboard" }])}
      <div class="content-grid content-grid--sidebar leaderboard-shell">
        <section class="section section--hero leaderboard-main">
          <div class="section__eyebrow">City rankings</div>
          <div class="leaderboard-head">
            <div class="leaderboard-head__copy">
              <h2>${escapeHtml(metric.label)} leaderboard</h2>
              <p class="doc-p leaderboard-intro">${escapeHtml(metric.description)} Only real tracked data is shown here. Placeholder players stay hidden until the stat feed is connected.</p>
            </div>
            <div class="leaderboard-badge">Live-ready</div>
          </div>

          <div class="leaderboard-metrics">
            ${LEADERBOARD_METRICS.map((entry) => `
              <a class="leaderboard-metric${entry.key === metric.key ? " is-active" : ""}" href="#/leaderboard/${escapeHtml(entry.key)}">
                <span class="leaderboard-metric__label">${escapeHtml(entry.label)}</span>
              </a>
            `).join("")}
          </div>

          <div class="leaderboard-summary" id="leaderboardSummaryHost">
            <div class="leaderboard-stat">
              <span class="leaderboard-stat__label">Feed</span>
              <strong class="leaderboard-stat__value">Checking</strong>
            </div>
            <div class="leaderboard-stat">
              <span class="leaderboard-stat__label">Selected metric</span>
              <strong class="leaderboard-stat__value">${escapeHtml(metric.label)}</strong>
            </div>
            <div class="leaderboard-stat">
              <span class="leaderboard-stat__label">Status</span>
              <strong class="leaderboard-stat__value">Pending</strong>
            </div>
          </div>

          <div class="leaderboard-bodyHost" id="leaderboardBodyHost">
            <div class="leaderboard-empty">
              <div class="leaderboard-empty__eyebrow">Preparing board</div>
              <h3>Leaderboard feed</h3>
              <p>${escapeHtml(loadingText)}</p>
            </div>
          </div>
        </section>

        <aside class="section section--stack leaderboard-side" id="leaderboardSideHost">
          <div class="section__eyebrow">Live snapshot</div>
          <h2>Roster check</h2>
          <div class="leaderboard-note">
            <div class="leaderboard-note__title">Loading</div>
            <div class="leaderboard-note__text">Reading online players and leaderboard availability.</div>
          </div>
        </aside>
      </div>
    </div>
  `);

  void hydrateLeaderboard(metric.key);
}

function normaliseLeaderboardRows(payload) {
  const rowsSource = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.rows)
      ? payload.rows
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.players)
          ? payload.players
          : Array.isArray(payload?.leaderboard)
            ? payload.leaderboard
            : [];

  return rowsSource.map((row, index) => {
    const name = pickFirstDefined(row, ["name", "playerName", "username", "displayName"]);
    if (!name) return null;

    return {
      id: pickFirstDefined(row, ["id", "playerId"]) ?? index + 1,
      name,
      role: pickFirstDefined(row, ["role", "job", "faction", "type"]) || "Unknown",
      crew: pickFirstDefined(row, ["crew", "group", "department", "unit"]) || "No crew set",
      kd: toFiniteNumber(pickFirstDefined(row, ["kd", "kdr", "killDeathRatio"])) ?? 0,
      netWorth: toFiniteNumber(pickFirstDefined(row, ["netWorth", "wealth", "money", "value"])) ?? 0,
      playtimeHours: toFiniteNumber(pickFirstDefined(row, ["playtimeHours", "hours", "playtime"])) ?? 0,
      kills: toFiniteNumber(pickFirstDefined(row, ["kills", "killCount"])) ?? 0,
      arrests: toFiniteNumber(pickFirstDefined(row, ["arrests", "arrestCount"])) ?? 0,
      robberies: toFiniteNumber(pickFirstDefined(row, ["robberies", "robberyCount", "heists"])) ?? 0,
      revives: toFiniteNumber(pickFirstDefined(row, ["revives", "reviveCount"])) ?? 0,
      exports: toFiniteNumber(pickFirstDefined(row, ["exports", "exportCount"])) ?? 0,
      isOnline: Boolean(pickFirstDefined(row, ["isOnline", "online", "connected"])),
      lastSeenAt: parseSnapshotDate(pickFirstDefined(row, ["lastSeenAt", "updatedAt", "timestamp", "refreshedAt"]))
    };
  }).filter(Boolean);
}

function renderLeaderboardRoster(players) {
  if (!players.length) {
    return `
      <div class="leaderboard-note">
        <div class="leaderboard-note__title">Online now</div>
        <div class="leaderboard-note__text">No public roster is available right now.</div>
      </div>
    `;
  }

  return `
    <div class="leaderboard-roster">
      <div class="leaderboard-note__title">Online now</div>
      <div class="leaderboard-roster__list">
        ${players.slice(0, 8).map((player) => `
          <div class="leaderboard-roster__item">
            <div class="leaderboard-roster__name">${escapeHtml(player.name)}</div>
            <div class="leaderboard-roster__meta">ID ${escapeHtml(String(player.id))}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderLeaderboardSummary(metric, rows, snapshot) {
  if (!rows.length) {
    return `
      <div class="leaderboard-stat">
        <span class="leaderboard-stat__label">Feed</span>
        <strong class="leaderboard-stat__value">${snapshot.feedConfigured ? "Waiting" : "Offline"}</strong>
      </div>
      <div class="leaderboard-stat">
        <span class="leaderboard-stat__label">Online now</span>
        <strong class="leaderboard-stat__value">${escapeHtml(String(snapshot.onlinePlayers.length))}</strong>
      </div>
      <div class="leaderboard-stat">
        <span class="leaderboard-stat__label">Selected metric</span>
        <strong class="leaderboard-stat__value">${escapeHtml(metric.label)}</strong>
      </div>
    `;
  }

  const leader = rows[0];
  return `
    <div class="leaderboard-stat">
      <span class="leaderboard-stat__label">Top ${escapeHtml(metric.label)}</span>
      <strong class="leaderboard-stat__value">${escapeHtml(metric.format(leader[metric.valueKey]))}</strong>
    </div>
    <div class="leaderboard-stat">
      <span class="leaderboard-stat__label">Tracked players</span>
      <strong class="leaderboard-stat__value">${escapeHtml(String(rows.length))}</strong>
    </div>
    <div class="leaderboard-stat">
      <span class="leaderboard-stat__label">Online now</span>
      <strong class="leaderboard-stat__value">${escapeHtml(String(snapshot.onlinePlayers.length))}</strong>
    </div>
  `;
}

function renderLeaderboardEmpty(metric, snapshot) {
  const sourceText = snapshot.feedConfigured
    ? "The website is waiting for real ranked data from your leaderboard feed."
    : "Connect a leaderboard endpoint in server-config.js and real ranked entries will appear here.";

  return `
    <div class="leaderboard-empty">
      <div class="leaderboard-empty__eyebrow">No placeholder players</div>
      <h3>${escapeHtml(metric.label)} rankings are not live yet</h3>
      <p>${escapeHtml(sourceText)} Until then, this page only keeps the real online roster visible on the side.</p>
    </div>
  `;
}

function renderLeaderboardPodium(metric, rows) {
  const podium = rows.slice(0, 3);
  if (!podium.length) return "";

  return `
    <div class="leaderboard-podium">
      ${podium.map((row) => `
        <div class="leaderboard-podium__card leaderboard-podium__card--rank${escapeHtml(String(row.rank))}">
          <div class="leaderboard-podium__rank">#${escapeHtml(String(row.rank))}</div>
          <div class="leaderboard-podium__name">${escapeHtml(row.name)}</div>
          <div class="leaderboard-podium__value">${escapeHtml(metric.format(row[metric.valueKey]))}</div>
          <div class="leaderboard-podium__meta">${escapeHtml(`${row.role} / ${row.crew}`)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderLeaderboardTable(metric, rows) {
  return `
    ${renderLeaderboardPodium(metric, rows)}
    <div class="leaderboard-tableWrap">
      <div class="leaderboard-table">
        <div class="leaderboard-row leaderboard-row--head">
          <div>Rank</div>
          <div>Player</div>
          <div>Role</div>
          <div>${escapeHtml(metric.label)}</div>
          <div>Playtime</div>
        </div>
        ${rows.map((row) => `
          <div class="leaderboard-row${row.rank <= 3 ? " leaderboard-row--top" : ""}">
            <div class="leaderboard-rank">${escapeHtml(String(row.rank).padStart(2, "0"))}</div>
            <div class="leaderboard-player">
              <strong>${escapeHtml(row.name)}</strong>
              <span>${escapeHtml(row.crew)}</span>
            </div>
            <div class="leaderboard-role">${escapeHtml(row.role)}</div>
            <div class="leaderboard-value">${escapeHtml(metric.format(row[metric.valueKey]))}</div>
            <div class="leaderboard-sub">${escapeHtml(`${Math.round(Number(row.playtimeHours) || 0)}h`)}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderLeaderboardSidebar(metric, rows, snapshot) {
  const updatedLabel = snapshot.updatedAt ? formatServerTimestamp(snapshot.updatedAt) : "Pending";

  if (!rows.length) {
    return `
      <div class="section__eyebrow">Live snapshot</div>
      <h2>Roster check</h2>
      <div class="leaderboard-note">
        <div class="leaderboard-note__title">Feed status</div>
        <div class="leaderboard-note__text">${snapshot.feedConfigured ? "Leaderboard feed detected, but no ranked rows were returned yet." : "Leaderboard feed not connected yet. The page is ready for live stats."}</div>
      </div>
      <div class="leaderboard-stats">
        <div class="leaderboard-stat">
          <span class="leaderboard-stat__label">Selected metric</span>
          <strong class="leaderboard-stat__value">${escapeHtml(metric.label)}</strong>
        </div>
        <div class="leaderboard-stat">
          <span class="leaderboard-stat__label">Last checked</span>
          <strong class="leaderboard-stat__value">${escapeHtml(updatedLabel)}</strong>
        </div>
      </div>
      ${renderLeaderboardRoster(snapshot.onlinePlayers)}
    `;
  }

  const leader = rows[0];
  const totalPlaytime = rows.reduce((sum, row) => sum + (Number(row.playtimeHours) || 0), 0);
  const totalNetWorth = rows.reduce((sum, row) => sum + (Number(row.netWorth) || 0), 0);

  return `
    <div class="section__eyebrow">Live snapshot</div>
    <h2>Current leaders</h2>
    <div class="leaderboard-highlight">
      <div class="leaderboard-highlight__label">Top ${escapeHtml(metric.label)}</div>
      <div class="leaderboard-highlight__name">${escapeHtml(leader.name)}</div>
      <div class="leaderboard-highlight__value">${escapeHtml(metric.format(leader[metric.valueKey]))}</div>
      <div class="leaderboard-highlight__meta">${escapeHtml(`${leader.role} / ${leader.crew}`)}</div>
    </div>

    <div class="leaderboard-stats">
      <div class="leaderboard-stat">
        <span class="leaderboard-stat__label">Combined playtime</span>
        <strong class="leaderboard-stat__value">${escapeHtml(formatLeaderboardInteger(totalPlaytime))}h</strong>
      </div>
      <div class="leaderboard-stat">
        <span class="leaderboard-stat__label">Combined net worth</span>
        <strong class="leaderboard-stat__value">${escapeHtml(formatMoneyCompact(totalNetWorth))}</strong>
      </div>
      <div class="leaderboard-stat">
        <span class="leaderboard-stat__label">Last checked</span>
        <strong class="leaderboard-stat__value">${escapeHtml(updatedLabel)}</strong>
      </div>
    </div>

    ${renderLeaderboardRoster(snapshot.onlinePlayers)}
  `;
}

function renderLiveLeaderboardSection(metricKey, leaderboard, onlinePlayers) {
  const metric = getLeaderboardMetricConfig(metricKey);
  const rows = getLeaderboardSortedRows(Array.isArray(leaderboard?.rows) ? leaderboard.rows : [], metric.key);
  const snapshot = {
    feedConfigured: Boolean(leaderboard?.configured),
    updatedAt: leaderboard?.updatedAt || null,
    onlinePlayers: Array.isArray(onlinePlayers) ? onlinePlayers : []
  };

  return `
    <div class="content-grid content-grid--sidebar leaderboard-shell">
      <section class="section section--hero leaderboard-main">
        <div class="section__eyebrow">Live rankings</div>
        <div class="leaderboard-head">
          <div class="leaderboard-head__copy">
            <h2>${escapeHtml(metric.label)} board</h2>
            <p class="doc-p leaderboard-intro">${escapeHtml(metric.description)} This live board only shows real tracked data once a leaderboard feed is connected.</p>
          </div>
          <div class="leaderboard-badge">${leaderboard?.configured ? "Live-ready" : "Waiting"}</div>
        </div>

        <div class="leaderboard-metrics">
          ${LEADERBOARD_METRICS.map((entry) => `
            <a class="leaderboard-metric${entry.key === metric.key ? " is-active" : ""}" href="#/live/${escapeHtml(entry.key)}">
              <span class="leaderboard-metric__label">${escapeHtml(entry.label)}</span>
            </a>
          `).join("")}
        </div>

        <div class="leaderboard-summary">
          ${renderLeaderboardSummary(metric, rows, snapshot)}
        </div>

        <div class="leaderboard-bodyHost">
          ${rows.length ? renderLeaderboardTable(metric, rows) : renderLeaderboardEmpty(metric, snapshot)}
        </div>
      </section>

      <aside class="section section--stack leaderboard-side">
        ${renderLeaderboardSidebar(metric, rows, snapshot)}
      </aside>
    </div>
  `;
}

async function loadLeaderboardSnapshot() {
  const [leaderboardResult, combinedResult, serverSnapshot] = await Promise.all([
    fetchOptionalServerJson(SERVER_CONFIG.leaderboardUrl),
    fetchOptionalServerJson(SERVER_CONFIG.liveOpsUrl),
    loadServerSnapshot()
  ]);

  const combined = combinedResult.data && typeof combinedResult.data === "object" ? combinedResult.data : {};
  const leaderboardPayload =
    leaderboardResult.data ||
    combined.leaderboard ||
    combined.leaderboards ||
    combined.rankings ||
    null;

  const rows = getLeaderboardSortedRows(
    normaliseLeaderboardRows(leaderboardPayload),
    getLeaderboardMetricConfig(leaderboardPayload?.metric || leaderboardPayload?.selectedMetric || "").key
  );
  const updatedAt = parseSnapshotDate(pickFirstDefined(leaderboardPayload || {}, ["updatedAt", "timestamp", "refreshedAt"]));

  return {
    rows,
    updatedAt,
    feedConfigured: Boolean(SERVER_CONFIG.leaderboardUrl || leaderboardResult.configured || combined.leaderboard || combined.leaderboards || combined.rankings),
    onlinePlayers: Array.isArray(serverSnapshot?.players) ? serverSnapshot.players : []
  };
}

async function hydrateLeaderboard(metricKey) {
  const requestId = ++leaderboardPageState.requestId;
  const metric = getLeaderboardMetricConfig(metricKey);
  const summaryHost = document.getElementById("leaderboardSummaryHost");
  const bodyHost = document.getElementById("leaderboardBodyHost");
  const sideHost = document.getElementById("leaderboardSideHost");

  if (!summaryHost || !bodyHost || !sideHost) return;

  try {
    const snapshot = await loadLeaderboardSnapshot();
    if (requestId !== leaderboardPageState.requestId) return;

    const rows = getLeaderboardSortedRows(snapshot.rows, metric.key);
    summaryHost.innerHTML = renderLeaderboardSummary(metric, rows, snapshot);
    bodyHost.innerHTML = rows.length ? renderLeaderboardTable(metric, rows) : renderLeaderboardEmpty(metric, snapshot);
    sideHost.innerHTML = renderLeaderboardSidebar(metric, rows, snapshot);
  } catch (error) {
    if (requestId !== leaderboardPageState.requestId) return;

    const fallbackSnapshot = {
      rows: [],
      updatedAt: null,
      feedConfigured: Boolean(SERVER_CONFIG.leaderboardUrl),
      onlinePlayers: []
    };

    summaryHost.innerHTML = renderLeaderboardSummary(metric, [], fallbackSnapshot);
    bodyHost.innerHTML = `
      <div class="leaderboard-empty">
        <div class="leaderboard-empty__eyebrow">Leaderboard unavailable</div>
        <h3>Could not load rankings</h3>
        <p>${escapeHtml(error?.message || "The leaderboard feed did not respond.")}</p>
      </div>
    `;
    sideHost.innerHTML = renderLeaderboardSidebar(metric, [], fallbackSnapshot);
  }
}

function getMapTypeMeta(type) {
  return MAP_TYPE_META[type] ?? MAP_TYPE_META.underground;
}

function getMapTypeIcon(type) {
  if (type === "police") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l7 3v5c0 5.2-2.7 9.2-7 12-4.3-2.8-7-6.8-7-12V5l7-3z" fill="currentColor"></path>
        <path d="M12 7.1l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z" fill="rgba(11,15,20,.92)"></path>
      </svg>
    `;
  }

  if (type === "hospital") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 3h6a1 1 0 0 1 1 1v4h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4v4a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-4H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h4V4a1 1 0 0 1 1-1Z" fill="currentColor"></path>
      </svg>
    `;
  }

  if (type === "fire") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.3 2.6c.3 2-.3 3.4-1.5 4.9 1.5-.5 2.8-1.7 3.8-3.1 2.7 3.2 4.1 5.8 4.1 8.5A7.7 7.7 0 0 1 12 20.6 7.7 7.7 0 0 1 4.3 13c0-2.9 1.5-5.6 4.7-8.6.2 2 .9 3.6 2.3 4.8-.1-1.9.5-4.1 2-6.6Z" fill="currentColor"></path>
      </svg>
    `;
  }

  if (type === "carwash") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5.5h10a1 1 0 0 1 .9 1.4l-1 2.1H7.1l-1-2.1A1 1 0 0 1 7 5.5Zm-.7 5H18a1 1 0 0 1 1 1v3.2a3.3 3.3 0 0 1-3.3 3.3H8.3A3.3 3.3 0 0 1 5 14.7V11.5a1 1 0 0 1 1-1Zm3.2 1.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm5 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" fill="currentColor"></path>
        <path d="M8.4 3.2c.8 1 .9 1.8.4 2.5-.4.5-1 .8-1.8.8.9-.8 1-1.8 1.4-3.3Zm7.1 0c.8 1 .9 1.8.4 2.5-.4.5-1 .8-1.8.8.9-.8 1-1.8 1.4-3.3Z" fill="currentColor" opacity=".7"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.8 12 4l8 6.8v8.7a.5.5 0 0 1-.5.5h-4.9a.6.6 0 0 1-.6-.6v-4.1h-4v4.1a.6.6 0 0 1-.6.6H4.5a.5.5 0 0 1-.5-.5v-8.7Z" fill="currentColor"></path>
      <path d="M9.2 11.2h5.6v1.8H9.2z" fill="rgba(11,15,20,.92)"></path>
      <path d="M11.1 9.3h1.8v5.6h-1.8z" fill="rgba(11,15,20,.92)"></path>
    </svg>
  `;
}

function renderMapMarkerVisual(type) {
  return `
    <span class="service-marker__pin service-marker__pin--service service-marker__pin--${escapeHtml(type)}">
      <span class="service-marker__halo"></span>
      <span class="service-marker__core"></span>
      <span class="service-marker__icon" aria-hidden="true">${getMapTypeIcon(type)}</span>
      <span class="service-marker__tail" aria-hidden="true"></span>
    </span>
  `;
}

function getMapLocationDescription(location) {
  if (location.description) return location.description;

  if (location.type === "police") {
    return `${location.name} is included in the Police Station service layer on the Los Santos satellite map.`;
  }

  if (location.type === "hospital") {
    return `${location.name} is included in the Hospital service layer on the Los Santos satellite map.`;
  }

  if (location.type === "fire") {
    return `${location.name} is included in the Fire Station service layer on the Los Santos satellite map.`;
  }

  if (location.type === "carwash") {
    return `${location.name} is included in the Car Wash service layer on the Los Santos satellite map.`;
  }

  return "Lester's house in El Burro Heights, kept on the map as a separate custom contact point.";
}

function getMapLocationMeta(location) {
  return [location.region, location.address].filter(Boolean).join(" / ") || "Los Santos services layer";
}

function renderMapQuickLinks() {
  return Object.entries(MAP_TYPE_META).map(([type, meta]) => {
    const locations = MAP_LOCATIONS.filter((location) => location.type === type);
    if (!locations.length) return "";

    const items = locations.map((location) => {
      const quickMeta = location.region
        ? location.region
        : meta.label;

      return `
        <button
          class="map-quick__item"
          type="button"
          data-map-quick="${escapeHtml(location.id)}"
          data-map-type="${escapeHtml(location.type)}"
          style="--map-accent:${meta.color}; --map-glow:${meta.glow};"
        >
          <span class="map-quick__row">
            <span class="map-quick__icon" aria-hidden="true">${getMapTypeIcon(location.type)}</span>
            <span class="map-quick__copy">
              <span class="map-quick__name">${escapeHtml(location.name)}</span>
              <span class="map-quick__meta">${escapeHtml(quickMeta)}</span>
            </span>
          </span>
        </button>
      `;
    }).join("");

    return `
      <div class="map-quick__group" data-map-group="${escapeHtml(type)}">
        <div class="map-quick__heading">${escapeHtml(meta.groupLabel)}</div>
        ${items}
      </div>
    `;
  }).join("");
}

function renderMapLegend() {
  return Object.entries(MAP_TYPE_META).map(([type, meta]) => `
    <div class="map-legend__item" style="--map-accent:${meta.color}; --map-glow:${meta.glow};">
      <span class="map-legend__icon" aria-hidden="true">${getMapTypeIcon(type)}</span>
      <span>${escapeHtml(meta.label)}</span>
    </div>
  `).join("");
}

function renderMapFilters() {
  const filters = [
    { key: "all", label: "All", count: MAP_LOCATIONS.length }
  ].concat(
    Object.entries(MAP_TYPE_META).map(([type, meta]) => ({
      key: type,
      label: meta.groupLabel,
      count: MAP_LOCATIONS.filter((location) => location.type === type).length,
      color: meta.color,
      glow: meta.glow
    }))
  );

  return filters.map((filter) => `
    <button
      class="map-filter ${filter.key === "all" ? "is-active" : ""}"
      type="button"
      data-map-filter="${escapeHtml(filter.key)}"
      style="${filter.color ? `--map-accent:${filter.color}; --map-glow:${filter.glow};` : ""}"
    >
      <span>${escapeHtml(filter.label)}</span>
      <span class="map-filter__count">${escapeHtml(String(filter.count))}</span>
    </button>
  `).join("");
}

function renderMap() {
  const quickLinks = renderMapQuickLinks();
  const filters = renderMapFilters();
  const stageAside = renderMapStageAside();
  const policeCount = MAP_LOCATIONS.filter((location) => location.type === "police").length;
  const hospitalCount = MAP_LOCATIONS.filter((location) => location.type === "hospital").length;
  const fireCount = MAP_LOCATIONS.filter((location) => location.type === "fire").length;
  const carWashCount = MAP_LOCATIONS.filter((location) => location.type === "carwash").length;
  const stats = [
    { label: "Police", value: policeCount },
    { label: "Hospitals", value: hospitalCount },
    { label: "Fire", value: fireCount },
    { label: "Car Wash", value: carWashCount },
    { label: "Lester", value: 1 }
  ].map((item) => `
    <div class="map-stat">
      <span class="map-stat__label">${escapeHtml(item.label)}</span>
      <span class="map-stat__value">${escapeHtml(String(item.value))}</span>
    </div>
  `).join("");

  destroyCustomMap();

  setView(`
    <div class="map-page">
      <section class="section section--map">
        <div class="map-embed-container map-embed-container--custom">
          <div class="map-layout">
            <aside class="map-panel">
              <div class="map-panel__top">
                <div class="section__eyebrow">Los Santos services</div>
                <div class="map-panel__headline">Service map</div>
                <div class="map-panel__intro">Satellite-only access to police departments, hospitals, fire stations, car washes, and Lester's House.</div>
              </div>
              <div class="map-panel__stats">
                ${stats}
              </div>
              <div class="map-panel__title">Filter</div>
              <div class="map-filters">
                ${filters}
              </div>
              <div class="map-detail map-detail--panel" id="customMapInfo">${renderMapDetail()}</div>
              <div class="map-panel__title map-panel__title--spaced">Locations</div>
              <div class="map-quick">
                ${quickLinks}
              </div>
              <div class="map-panel__foot">
                <span class="map-panel__sourceLabel">Source</span>
                <a href="${MAP_SOURCE_URL}" target="_blank" rel="noopener noreferrer">gta-5-map.com services</a>
              </div>
            </aside>
            <div class="map-stage">
              <div class="service-map-shell">
                <div class="map-toolbar map-toolbar--overlay">
                  <div class="map-toolbar__group">
                    <button class="map-tool" id="mapZoomOutBtn" type="button" aria-label="Zoom out">-</button>
                    <span class="map-zoom-label" id="mapZoomLabel">100%</span>
                    <button class="map-tool" id="mapZoomInBtn" type="button" aria-label="Zoom in">+</button>
                    <button class="map-tool map-tool--ghost" id="mapResetBtn" type="button">Show all</button>
                    <span class="map-toolbar__badge">Satellite only</span>
                  </div>
                  <div class="map-toolbar__hint">Scroll or use +/- to zoom. Drag to move.</div>
                </div>
                <div class="service-map is-loading" id="serviceMap" aria-label="Satellite-only Los Santos services map" style="height:calc(100svh - 188px); min-height:500px;"></div>
                <aside class="map-stage__aside" id="mapStageAside">${stageAside}</aside>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `);

  window.setTimeout(() => {
    initCustomMap();
  }, 260);
}

function renderMapDetail(location) {
  if (!location) {
    const policeCount = MAP_LOCATIONS.filter((entry) => entry.type === "police").length;
    const hospitalCount = MAP_LOCATIONS.filter((entry) => entry.type === "hospital").length;
    const fireCount = MAP_LOCATIONS.filter((entry) => entry.type === "fire").length;
    const carWashCount = MAP_LOCATIONS.filter((entry) => entry.type === "carwash").length;
    const liveFeedReady = Boolean(SERVER_CONFIG.liveOpsUrl || SERVER_CONFIG.livePlayerMapUrl);
    const trackingMode = SERVER_CONFIG.liveTrackingRequiresOptIn ? "Opt-in only" : "Enabled";

    return `
      <div class="map-detail__eyebrow">Overview</div>
      <div class="map-detail__title">Los Santos Service Map</div>
      <div class="map-detail__meta">Satellite only / ${policeCount} police / ${hospitalCount} hospitals / ${fireCount} fire stations / ${carWashCount} car washes / ${escapeHtml(trackingMode)}</div>
      <div class="map-detail__body">Markers on this page are pulled from the Services layer on gta-5-map.com, with Lester's House kept as a separate custom point. Live player overlays are ${liveFeedReady ? "ready to read your server feed." : "ready once you connect a live player endpoint."} Only players who enable website tracking in-game should appear on the live map.</div>
    `;
  }

  const meta = getMapTypeMeta(location.type);

  return `
    <div class="map-detail__eyebrow">${escapeHtml(meta.label)}</div>
    <div class="map-detail__title">${escapeHtml(location.name)}</div>
    <div class="map-detail__meta">${escapeHtml(getMapLocationMeta(location))}</div>
    <div class="map-detail__body">${escapeHtml(getMapLocationDescription(location))}</div>
  `;
}

function renderMapStageAside(location) {
  const legend = renderMapLegend();
  const liveConfigured = Boolean(SERVER_CONFIG.liveOpsUrl || SERVER_CONFIG.livePlayerMapUrl);
  const livePlayerCount = customMapState?.liveData?.visiblePlayers ?? customMapState?.liveData?.players?.length ?? 0;
  const hiddenPlayerCount = customMapState?.liveData?.hiddenPlayers ?? 0;
  const liveUpdatedAt = customMapState?.liveData?.updatedAt ? formatServerTimestamp(customMapState.liveData.updatedAt) : "Pending";
  const hotZones = customMapState?.liveOps?.hotZones?.items?.slice(0, 3) || [];
  const activeEvents = customMapState?.liveOps?.events?.items?.slice(0, 2) || [];
  const trackingLabel = customMapState?.liveData?.settingLabel || "Website Live Tracking";
  const optInText = customMapState?.liveData?.requiresOptIn
    ? `${hiddenPlayerCount} hidden until players enable ${trackingLabel} in-game.`
    : "Live map feed is not restricted by opt-in.";
  const liveCard = `
    <div class="map-stage-card">
      <div class="map-stage-card__eyebrow">Live tracking</div>
      <div class="map-stage-card__title">${liveConfigured ? `${livePlayerCount} tracked players` : "Endpoint ready"}</div>
      <div class="map-stage-card__body">${liveConfigured ? `Map overlay feed checked ${liveUpdatedAt}. ${optInText}` : "Add a live map endpoint in server-config.js to show player positions directly on the Los Santos map."}</div>
    </div>
  `;
  const hotZonesCard = `
    <div class="map-stage-card">
      <div class="map-stage-card__eyebrow">Hot zones</div>
      <div class="map-stage-card__legend">
        ${hotZones.length ? hotZones.map((zone) => `
          <div class="map-legend__item map-legend__item--text">
            <span>${escapeHtml(zone.name)}</span>
            <strong>${escapeHtml(String(zone.heat))}</strong>
          </div>
        `).join("") : `<div class="map-stage-card__body">Connect a hot-zones feed to surface the busiest areas here.</div>`}
      </div>
    </div>
  `;
  const eventsCard = `
    <div class="map-stage-card">
      <div class="map-stage-card__eyebrow">Events</div>
      <div class="map-stage-card__legend">
        ${activeEvents.length ? activeEvents.map((event) => `
          <div class="map-legend__item map-legend__item--text">
            <span>${escapeHtml(event.title)}</span>
            <strong>${escapeHtml(event.location)}</strong>
          </div>
        `).join("") : `<div class="map-stage-card__body">Active city events will show here once the endpoint is connected.</div>`}
      </div>
    </div>
  `;

  if (!location) {
    return `
      <div class="map-stage-card">
        <div class="map-stage-card__eyebrow">Map Focus</div>
        <div class="map-stage-card__title">Los Santos Services</div>
        <div class="map-stage-card__body">Use the location list, click a marker, or zoom in to inspect police departments, hospitals, fire stations, car washes, and Lester's House.</div>
      </div>
      <div class="map-stage-card map-stage-card--legend">
        <div class="map-stage-card__eyebrow">Legend</div>
        <div class="map-stage-card__legend">
          ${legend}
        </div>
      </div>
      ${liveCard}
      ${hotZonesCard}
      ${eventsCard}
    `;
  }

  const meta = getMapTypeMeta(location.type);

  return `
    <div class="map-stage-card map-stage-card--focus" style="--map-accent:${meta.color}; --map-glow:${meta.glow};">
      <div class="map-stage-card__eyebrow">${escapeHtml(meta.label)}</div>
      <div class="map-stage-card__row">
        <span class="map-stage-card__icon" aria-hidden="true">${getMapTypeIcon(location.type)}</span>
        <div class="map-stage-card__copy">
          <div class="map-stage-card__title">${escapeHtml(location.name)}</div>
          <div class="map-stage-card__meta">${escapeHtml(getMapLocationMeta(location))}</div>
        </div>
      </div>
      <div class="map-stage-card__body">${escapeHtml(getMapLocationDescription(location))}</div>
    </div>
    <div class="map-stage-card map-stage-card--legend">
      <div class="map-stage-card__eyebrow">Legend</div>
      <div class="map-stage-card__legend">
        ${legend}
      </div>
    </div>
    ${liveCard}
    ${hotZonesCard}
    ${eventsCard}
  `;
}

function findMapLocation(locationId) {
  return MAP_LOCATIONS.find((location) => location.id === locationId) ?? null;
}

function getMapPositionPercent(location) {
  const tileWorldSize = 2 ** MAP_TILE_GRID.zoom * MAP_TILE_GRID.tileSize;
  const latRad = location.lat * (Math.PI / 180);
  const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const worldX = ((location.lng + 180) / 360) * tileWorldSize;
  const worldY = (tileWorldSize / 2) - (tileWorldSize * mercatorY / (2 * Math.PI));

  const minX = MAP_TILE_GRID.minX * MAP_TILE_GRID.tileSize;
  const maxX = (MAP_TILE_GRID.maxX + 1) * MAP_TILE_GRID.tileSize;
  const minY = MAP_TILE_GRID.minY * MAP_TILE_GRID.tileSize;
  const maxY = (MAP_TILE_GRID.maxY + 1) * MAP_TILE_GRID.tileSize;

  const x = ((worldX - minX) / (maxX - minX)) * 100;
  const y = ((worldY - minY) / (maxY - minY)) * 100;

  return {
    x: Math.max(1.6, Math.min(98.4, x)),
    y: Math.max(1.6, Math.min(98.4, y))
  };
}

function destroyCustomMap() {
  if (customMapState?.liveRefreshTimer) {
    window.clearTimeout(customMapState.liveRefreshTimer);
  }
  if (customMapState?.resizeHandler) {
    window.removeEventListener("resize", customMapState.resizeHandler);
  }

  customMapState = null;
}

function clampMapScale(scale) {
  return Math.max(MAP_VIEW_MIN_SCALE, Math.min(MAP_VIEW_MAX_SCALE, scale));
}

function clampMapOffset(offsetX, offsetY, scale = customMapState?.scale ?? MAP_VIEW_MIN_SCALE) {
  if (!customMapState?.viewportEl || !customMapState?.stageEl) {
    return { x: offsetX, y: offsetY };
  }

  const viewportWidth = customMapState.viewportEl.clientWidth;
  const viewportHeight = customMapState.viewportEl.clientHeight;
  const stageWidth = customMapState.stageEl.offsetWidth * scale;
  const stageHeight = customMapState.stageEl.offsetHeight * scale;
  const maxOffsetX = Math.max(0, (stageWidth - viewportWidth) / 2);
  const maxOffsetY = Math.max(0, (stageHeight - viewportHeight) / 2);

  return {
    x: Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX)),
    y: Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY))
  };
}

function updateMapViewport() {
  if (!customMapState?.stageEl) return;

  const clamped = clampMapOffset(customMapState.offsetX, customMapState.offsetY, customMapState.scale);
  customMapState.offsetX = clamped.x;
  customMapState.offsetY = clamped.y;

  customMapState.stageEl.style.transform = `translate(${customMapState.offsetX}px, ${customMapState.offsetY}px) scale(${customMapState.scale})`;

  if (customMapState.zoomLabelEl) {
    customMapState.zoomLabelEl.textContent = `${Math.round(customMapState.scale * 100)}%`;
  }

  if (customMapState.zoomInBtn) {
    customMapState.zoomInBtn.disabled = customMapState.scale >= MAP_VIEW_MAX_SCALE;
  }

  if (customMapState.zoomOutBtn) {
    customMapState.zoomOutBtn.disabled = customMapState.scale <= MAP_VIEW_MIN_SCALE;
  }
}

function setMapZoom(nextScale, options = {}) {
  if (!customMapState?.viewportEl || !customMapState?.stageEl) return;

  const previousScale = customMapState.scale;
  const targetScale = clampMapScale(nextScale);
  if (Math.abs(targetScale - previousScale) < 0.001) return;

  const viewportRect = customMapState.viewportEl.getBoundingClientRect();
  const anchorX = typeof options.anchorX === "number" ? options.anchorX : viewportRect.width / 2;
  const anchorY = typeof options.anchorY === "number" ? options.anchorY : viewportRect.height / 2;

  const stagePointX = (anchorX - viewportRect.width / 2 - customMapState.offsetX) / previousScale;
  const stagePointY = (anchorY - viewportRect.height / 2 - customMapState.offsetY) / previousScale;

  customMapState.scale = targetScale;
  customMapState.offsetX = anchorX - viewportRect.width / 2 - (stagePointX * targetScale);
  customMapState.offsetY = anchorY - viewportRect.height / 2 - (stagePointY * targetScale);

  updateMapViewport();
}

function centerMapOnLocation(location) {
  if (!location || !customMapState?.stageEl) return;

  const position = getMapPositionPercent(location);
  const stageWidth = customMapState.stageEl.offsetWidth;
  const stageHeight = customMapState.stageEl.offsetHeight;
  const markerX = (position.x / 100) * stageWidth;
  const markerY = (position.y / 100) * stageHeight;

  customMapState.offsetX = (stageWidth / 2 - markerX) * customMapState.scale;
  customMapState.offsetY = (stageHeight / 2 - markerY) * customMapState.scale;
  updateMapViewport();
}

function syncMapMarkerStates() {
  if (!customMapState) return;

  customMapState.markerButtons.forEach((button, markerId) => {
    button.classList.toggle("is-active", markerId === customMapState.activeId);
  });
}

function updateMapSelection(locationId) {
  if (!customMapState) return;

  customMapState.activeId = locationId ?? null;
  const location = customMapState.activeId ? findMapLocation(customMapState.activeId) : null;

  if (customMapState.infoEl) {
    customMapState.infoEl.innerHTML = renderMapDetail(location);
    customMapState.infoEl.classList.remove("is-updated");
    if (customMapState.detailFlashTimer) {
      window.clearTimeout(customMapState.detailFlashTimer);
    }
    if (location) {
      window.requestAnimationFrame(() => {
        customMapState?.infoEl?.classList.add("is-updated");
      });
      customMapState.detailFlashTimer = window.setTimeout(() => {
        customMapState?.infoEl?.classList.remove("is-updated");
      }, 900);
    }
  }

  if (customMapState.asideEl) {
    customMapState.asideEl.innerHTML = renderMapStageAside(location);
  }

  let activeQuickButton = null;
  customMapState.quickButtons.forEach((button) => {
    const isActive = button.dataset.mapQuick === customMapState.activeId;
    button.classList.toggle("is-active", isActive);
    if (isActive) {
      activeQuickButton = button;
    }
  });

  if (activeQuickButton) {
    activeQuickButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  window.requestAnimationFrame(syncMapMarkerStates);
}

function getVisibleMapLocations() {
  if (!customMapState || customMapState.filter === "all") {
    return MAP_LOCATIONS;
  }

  return MAP_LOCATIONS.filter((location) => location.type === customMapState.filter);
}

function getMapRouteActive() {
  return parseRoute().name === "map";
}

function fitMapToLocations() {
  return;
}

function applyMapFilter(filterKey) {
  if (!customMapState) return;

  const nextFilter = filterKey && MAP_TYPE_META[filterKey] ? filterKey : "all";
  customMapState.filter = nextFilter;

  customMapState.filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mapFilter === nextFilter);
  });

  customMapState.quickButtons.forEach((button) => {
    const location = findMapLocation(button.dataset.mapQuick);
    const isVisible = !!location && (nextFilter === "all" || location.type === nextFilter);
    button.classList.toggle("is-hidden", !isVisible);
  });

  customMapState.quickGroups.forEach((group) => {
    const hasVisibleItems = Array.from(group.querySelectorAll("[data-map-quick]")).some((button) => !button.classList.contains("is-hidden"));
    group.classList.toggle("is-hidden", !hasVisibleItems);
  });

  customMapState.markerButtons.forEach((button, markerId) => {
    const location = findMapLocation(markerId);
    const isVisible = !!location && (nextFilter === "all" || location.type === nextFilter);
    button.classList.toggle("is-hidden", !isVisible);
  });

  if (customMapState.activeId) {
    const activeLocation = findMapLocation(customMapState.activeId);
    if (!activeLocation || (nextFilter !== "all" && activeLocation.type !== nextFilter)) {
      updateMapSelection(null);
    }
  }

  window.requestAnimationFrame(syncMapMarkerStates);
}

function focusMapLocation(locationId) {
  const location = findMapLocation(locationId);
  if (!location || !customMapState) return;

  updateMapSelection(location.id);
  centerMapOnLocation(location);

  const markerButton = customMapState.markerButtons.get(location.id);
  if (markerButton) {
    markerButton.classList.add("is-jumped");
    window.setTimeout(() => markerButton.classList.remove("is-jumped"), 420);
  }
}

function resetCustomMapView() {
  if (customMapState) {
    customMapState.scale = MAP_VIEW_MIN_SCALE;
    customMapState.offsetX = 0;
    customMapState.offsetY = 0;
    updateMapViewport();
  }

  updateMapSelection(null);
}

function renderLiveMapMarkers(players) {
  return players.map((player) => `
    <button
      class="service-map__marker service-map__marker--live"
      type="button"
      title="${escapeHtml(player.name)}${player.role ? ` (${escapeHtml(player.role)})` : ""}"
      aria-label="${escapeHtml(player.name)}"
      style="left:${player.position.x}%; top:${player.position.y}%; --map-accent:#f0b767; --map-glow:rgba(240, 183, 103, .24);"
    >
      <span class="service-marker__halo"></span>
      <span class="service-marker__pin service-marker__pin--live">
        <span class="service-marker__core"></span>
        <span class="service-marker__icon" aria-hidden="true">•</span>
      </span>
    </button>
  `).join("");
}

function updateCustomMapLiveLayer(liveMap) {
  if (!customMapState?.liveLayerEl) return;

  customMapState.liveData = liveMap || { players: [], updatedAt: null };
  customMapState.liveLayerEl.innerHTML = renderLiveMapMarkers(customMapState.liveData.players || []);

  if (customMapState.asideEl) {
    customMapState.asideEl.innerHTML = renderMapStageAside(findMapLocation(customMapState.activeId));
  }
}

function scheduleCustomMapLiveRefresh() {
  if (!customMapState || !getMapRouteActive()) return;
  if (!(SERVER_CONFIG.liveOpsUrl || SERVER_CONFIG.livePlayerMapUrl)) return;

  customMapState.liveRefreshTimer = window.setTimeout(() => {
    refreshCustomMapLiveFeed();
  }, SERVER_CONFIG.statusRefreshMs);
}

async function refreshCustomMapLiveFeed() {
  if (!customMapState || !getMapRouteActive()) return;

  const liveOps = await loadLiveOpsSnapshot();
  if (!customMapState || !getMapRouteActive()) return;

  customMapState.liveOps = liveOps;
  updateCustomMapLiveLayer(liveOps.liveMap);
  scheduleCustomMapLiveRefresh();
}

function initCustomMap() {
  const mapEl = document.getElementById("serviceMap");
  const infoEl = document.getElementById("customMapInfo");
  const asideEl = document.getElementById("mapStageAside");
  const resetBtn = document.getElementById("mapResetBtn");
  const zoomInBtn = document.getElementById("mapZoomInBtn");
  const zoomOutBtn = document.getElementById("mapZoomOutBtn");
  const zoomLabelEl = document.getElementById("mapZoomLabel");

  if (!mapEl || !infoEl) return;

  const markersMarkup = MAP_LOCATIONS.map((location) => {
    const meta = getMapTypeMeta(location.type);
    const position = getMapPositionPercent(location);

    return `
      <button
        class="service-map__marker"
        type="button"
        title="${escapeHtml(location.name)}"
        data-map-marker="${escapeHtml(location.id)}"
        data-map-type="${escapeHtml(location.type)}"
        style="left:${position.x}%; top:${position.y}%; --map-accent:${meta.color}; --map-glow:${meta.glow};"
      >
        ${renderMapMarkerVisual(location.type)}
      </button>
    `;
  }).join("");

  mapEl.innerHTML = `
    <div class="service-map__canvas">
      <div class="service-map__stage">
        <img class="service-map__image" src="${escapeHtml(MAP_IMAGE_URL)}" alt="Los Santos satellite map" loading="eager" decoding="async" fetchpriority="high" />
        <div class="service-map__layer">
          ${markersMarkup}
        </div>
        <div class="service-map__layer service-map__layer--live"></div>
      </div>
    </div>
  `;

  const imageEl = mapEl.querySelector(".service-map__image");
  const mapImageQueue = [MAP_IMAGE_URL, MAP_IMAGE_FALLBACK_URL, MAP_IMAGE_LEGACY_URL];

  if (imageEl) {
    const handleMapImageLoad = () => {
      mapEl.classList.remove("is-loading", "is-map-error");
      mapEl.classList.add("is-ready");
      window.requestAnimationFrame(() => {
        updateMapViewport();
      });
      window.setTimeout(() => {
        updateMapViewport();
      }, 140);
    };

    const handleMapImageError = () => {
      const currentIndex = Number(imageEl.dataset.assetIndex || "0");
      const nextIndex = currentIndex + 1;
      if (nextIndex < mapImageQueue.length) {
        imageEl.dataset.assetIndex = String(nextIndex);
        imageEl.src = mapImageQueue[nextIndex];
        return;
      }

      mapEl.classList.remove("is-loading", "is-ready");
      mapEl.classList.add("is-map-error");
    };

    imageEl.dataset.assetIndex = "0";
    imageEl.addEventListener("load", handleMapImageLoad);
    imageEl.addEventListener("error", handleMapImageError);

    if (imageEl.complete && imageEl.naturalWidth > 0) {
      handleMapImageLoad();
    }
  }

  customMapState = {
    activeId: null,
    asideEl,
    detailFlashTimer: null,
    dragPointerId: null,
    filter: "all",
    filterButtons: Array.from(document.querySelectorAll("[data-map-filter]")),
    infoEl,
    liveData: {
      players: [],
      updatedAt: null
    },
    liveLayerEl: mapEl.querySelector(".service-map__layer--live"),
    liveOps: {
      events: { items: [] },
      hotZones: { items: [] }
    },
    liveRefreshTimer: null,
    markerButtons: new Map(),
    mapEl,
    offsetX: 0,
    offsetY: 0,
    quickGroups: Array.from(document.querySelectorAll("[data-map-group]")),
    quickButtons: Array.from(document.querySelectorAll("[data-map-quick]")),
    resetBtn,
    resizeHandler: null,
    scale: MAP_VIEW_MIN_SCALE,
    stageEl: mapEl.querySelector(".service-map__stage"),
    viewportEl: mapEl.querySelector(".service-map__canvas"),
    zoomInBtn,
    zoomLabelEl,
    zoomOutBtn
  };

  Array.from(mapEl.querySelectorAll("[data-map-marker]")).forEach((button) => {
    customMapState.markerButtons.set(button.dataset.mapMarker, button);
    button.addEventListener("click", () => {
      focusMapLocation(button.dataset.mapMarker);
    });
  });

  customMapState.quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      focusMapLocation(button.dataset.mapQuick);
    });
  });

  customMapState.filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyMapFilter(button.dataset.mapFilter);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", resetCustomMapView);
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      const rect = customMapState.viewportEl?.getBoundingClientRect();
      setMapZoom(customMapState.scale + MAP_VIEW_ZOOM_STEP, {
        anchorX: rect ? rect.width / 2 : undefined,
        anchorY: rect ? rect.height / 2 : undefined
      });
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      const rect = customMapState.viewportEl?.getBoundingClientRect();
      setMapZoom(customMapState.scale - MAP_VIEW_ZOOM_STEP, {
        anchorX: rect ? rect.width / 2 : undefined,
        anchorY: rect ? rect.height / 2 : undefined
      });
    });
  }

  if (customMapState.viewportEl) {
    customMapState.viewportEl.addEventListener("wheel", (event) => {
      event.preventDefault();
      const rect = customMapState.viewportEl.getBoundingClientRect();
      setMapZoom(
        customMapState.scale + (event.deltaY < 0 ? MAP_VIEW_ZOOM_STEP : -MAP_VIEW_ZOOM_STEP),
        {
          anchorX: event.clientX - rect.left,
          anchorY: event.clientY - rect.top
        }
      );
    }, { passive: false });

    customMapState.viewportEl.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("[data-map-marker]")) return;
      customMapState.dragPointerId = event.pointerId;
      customMapState.dragStartX = event.clientX;
      customMapState.dragStartY = event.clientY;
      customMapState.dragOriginX = customMapState.offsetX;
      customMapState.dragOriginY = customMapState.offsetY;
      customMapState.viewportEl.classList.add("is-dragging");
      customMapState.viewportEl.setPointerCapture(event.pointerId);
    });

    customMapState.viewportEl.addEventListener("pointermove", (event) => {
      if (customMapState.dragPointerId !== event.pointerId) return;
      customMapState.offsetX = customMapState.dragOriginX + (event.clientX - customMapState.dragStartX);
      customMapState.offsetY = customMapState.dragOriginY + (event.clientY - customMapState.dragStartY);
      updateMapViewport();
    });

    const endDrag = (event) => {
      if (customMapState?.dragPointerId !== event.pointerId) return;
      customMapState.dragPointerId = null;
      customMapState.viewportEl.classList.remove("is-dragging");
      if (customMapState.viewportEl.hasPointerCapture(event.pointerId)) {
        customMapState.viewportEl.releasePointerCapture(event.pointerId);
      }
    };

    customMapState.viewportEl.addEventListener("pointerup", endDrag);
    customMapState.viewportEl.addEventListener("pointercancel", endDrag);
  }

  customMapState.resizeHandler = () => {
    updateMapViewport();
  };
  window.addEventListener("resize", customMapState.resizeHandler);

  updateMapSelection(null);
  applyMapFilter("all");
  updateMapViewport();
  refreshCustomMapLiveFeed();
  window.requestAnimationFrame(() => {
    updateMapViewport();
  });
  window.setTimeout(() => {
    updateMapViewport();
  }, 160);
}

function readCart() {
  try {
    const raw = localStorage.getItem(STORE_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(STORE_CART_KEY, JSON.stringify(Array.isArray(items) ? items : []));
  } catch {}
}

function addToCart(productId) {
  const cart = readCart();
  cart.push({ id: productId, at: Date.now() });
  writeCart(cart);
}

function getCartCount() {
  return readCart().length;
}

function removeFromCart(index) {
  const cart = readCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    writeCart(cart);
  }
}

function clearCart() {
  writeCart([]);
}

function getCartTotal() {
  const cart = readCart();
  let total = 0;
  for (const item of cart) {
    const product = findStoreProduct(item.id);
    if (product) {
      const priceStr = product.price.replace(/[£$,]/g, '');
      const price = parseFloat(priceStr);
      if (!isNaN(price)) total += price;
    }
  }
  return total.toFixed(2);
}

function renderStoreBasket() {
  const cart = readCart();
  const total = getCartTotal();
  
  let cartContent = '';
  if (cart.length === 0) {
    cartContent = `<div class="empty">Your basket is empty. <a href="#/store/memberships">Browse products</a></div>`;
  } else {
    const items = cart.map((item, index) => {
      const product = findStoreProduct(item.id);
      if (!product) return '';
      return `
        <div class="basket-item">
          <div class="basket-item__icon">${storeIconSvg(product.icon)}</div>
          <div class="basket-item__details">
            <div class="basket-item__title">${escapeHtml(product.title)}</div>
            <div class="basket-item__price">${escapeHtml(product.price)}</div>
          </div>
          <button class="auth__btn" type="button" data-cart-remove="${index}">Remove</button>
        </div>
      `;
    }).join('');
    
    cartContent = `
      <div class="basket-items">${items}</div>
      <div class="basket-summary">
        <div class="basket-summary__row">
          <span class="basket-summary__label">Subtotal:</span>
          <span class="basket-summary__value">$${total}</span>
        </div>
        <div class="basket-summary__row basket-summary__row--total">
          <span class="basket-summary__label">Total:</span>
          <span class="basket-summary__value">$${total}</span>
        </div>
        <div class="basket-summary__actions">
          <button class="auth__btn auth__btn--primary" type="button" onclick="alert('Demo checkout - Please open a Discord ticket to complete your purchase!')">Checkout</button>
          <button class="auth__btn" type="button" data-cart-clear="true">Clear Basket</button>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="store-headline">
      <div class="store-headline__title">Shopping Basket</div>
      <div class="store-headline__meta">${cart.length} item${cart.length !== 1 ? 's' : ''}</div>
    </div>
    ${cartContent}
  `;
}

const STORE_PRODUCTS = [
  {
    id: "silver_30",
    title: "Silver Membership (30 days)",
    price: "£20.99",
    icon: "silver",
    category: "memberships",
    perks: [
      "1 x Vehicle Liveries slots",
      "1 x Gun liveries slots",
      "1 x clothing outfits",
      "1 x name change token",
      "Priority queue level 2",
      "have early access to new features on the development server",
      "have Silver Subscriber role on discord"
    ]
  },
  {
    id: "gold_30",
    title: "Gold Membership (30 days)",
    price: "£60.99",
    icon: "gold",
    category: "memberships",
    perks: [
      "inherits silver perks",
      "2 x Vehicle Liveries slots",
      "2 x Gun liveries slots",
      "2 x clothing outfits",
      "2 x name change token",
      "Priority queue level 1",
      "have early access to new features on the development server",
      "have Gold Subscriber role on discord"
    ]
  },
  {
    id: "edit_clothing",
    title: "Edit (Clothing Piece)",
    price: "$11.99",
    icon: "pencil",
    category: "clothing",
    perks: [
      "Edit one clothing piece",
      "Change color, texture, or style",
      "Instant delivery"
    ]
  },
  {
    id: "edit_outfit_livery",
    title: "Edit (Outfit or Livery)",
    price: "$35.99",
    icon: "pencil",
    category: "clothing",
    perks: [
      "Edit full outfit or vehicle livery",
      "Complete customization",
      "Professional support"
    ]
  },
  {
    id: "outfit_classb_crew",
    title: "M+F Outfit + Class B Livery (Crew) - BEST VALUE!",
    price: "$199.99",
    icon: "suit",
    category: "clothing",
    perks: [
      "Male and Female outfit",
      "Class B vehicle livery",
      "Crew-wide access",
      "Best value package"
    ]
  },
  {
    id: "outfit_crew",
    title: "Outfit (Crew) - Best Value",
    price: "$114.99",
    icon: "suit",
    category: "clothing",
    perks: [
      "Custom crew outfit",
      "All crew members can use",
      "Professional design"
    ]
  },
  {
    id: "outfit_mf_crew",
    title: "Outfit (Male+Female) (Crew Only)",
    price: "$179.99",
    icon: "suit",
    category: "clothing",
    perks: [
      "Male and Female versions",
      "Crew-wide access",
      "Complete outfit set"
    ]
  },
  {
    id: "outfit_personal",
    title: "Outfit (Personal)",
    price: "$69.99",
    icon: "suit",
    category: "clothing",
    perks: [
      "Personal custom outfit",
      "Your character only",
      "Unique design"
    ]
  },
  {
    id: "outfit_classb_personal",
    title: "Outfit + Class B Livery (Personal)",
    price: "$99.99",
    icon: "suit",
    category: "clothing",
    perks: [
      "Personal outfit",
      "Class B vehicle livery",
      "Complete package"
    ]
  },
  {
    id: "permission_outfit_livery",
    title: "Permission (Outfit or Livery)",
    price: "$35.99",
    icon: "badge",
    category: "clothing",
    perks: [
      "Permission to use outfit or livery",
      "Instant activation",
      "Permanent access"
    ]
  },
  {
    id: "permission_clothing",
    title: "Permission (Piece of Clothing)",
    price: "$11.99",
    icon: "badge",
    category: "clothing",
    perks: [
      "Permission for clothing piece",
      "Instant activation",
      "Permanent access"
    ]
  },
  {
    id: "clothing_crew",
    title: "Piece of Clothing (Crew)",
    price: "$39.99",
    icon: "hat",
    category: "clothing",
    perks: [
      "Custom clothing piece",
      "Crew-wide access",
      "Professional quality"
    ]
  },
  {
    id: "clothing_personal",
    title: "Piece of Clothing (Personal)",
    price: "$19.99",
    icon: "hat",
    category: "clothing",
    perks: [
      "Custom clothing piece",
      "Personal use only",
      "Unique item"
    ]
  },
  {
    id: "livery_classa_crew",
    title: "Vehicle Livery - Class A - (Crew)",
    price: "$99.99",
    icon: "car",
    category: "liveries",
    perks: [
      "Class A vehicle livery",
      "Crew-wide access",
      "Premium design"
    ]
  },
  {
    id: "livery_classa_personal",
    title: "Vehicle Livery - Class A - (Personal)",
    price: "$69.99",
    icon: "car",
    category: "liveries",
    perks: [
      "Class A vehicle livery",
      "Personal use only",
      "Custom design"
    ]
  },
  {
    id: "livery_classb_crew",
    title: "Vehicle Livery - Class B - (Crew)",
    price: "$59.99",
    icon: "car",
    category: "liveries",
    perks: [
      "Class B vehicle livery",
      "Crew-wide access",
      "Quality design"
    ]
  },
  {
    id: "livery_classb_personal",
    title: "Vehicle Livery - Class B - (Personal)",
    price: "$39.99",
    icon: "car",
    category: "liveries",
    perks: [
      "Class B vehicle livery",
      "Personal use only",
      "Custom design"
    ]
  }
];

function findStoreProduct(id) {
  return STORE_PRODUCTS.find(p => p.id === id) || null;
}

function storeIconSvg(kind) {
  if (kind === "silver" || kind === "gold") {
    const fill = kind === "gold" ? "#ffd36c" : "#b8c5cf";
    const dark = kind === "gold" ? "#d4a942" : "#8a9fb5";
    const shine = kind === "gold" ? "#fff9e6" : "#e8f0f8";
    return `
      <svg class="store-icon" viewBox="0 0 140 100" role="img" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="diamond-left-${kind}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${fill};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${dark};stop-opacity:0.9" />
          </linearGradient>
          <linearGradient id="diamond-right-${kind}" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${fill};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${dark};stop-opacity:0.9" />
          </linearGradient>
          <linearGradient id="diamond-top-${kind}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${shine};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${fill};stop-opacity:1" />
          </linearGradient>
          <radialGradient id="diamond-shine-${kind}">
            <stop offset="0%" style="stop-color:${shine};stop-opacity:0.9" />
            <stop offset="100%" style="stop-color:${shine};stop-opacity:0" />
          </radialGradient>
        </defs>
        <g>
          <polygon points="70,35 40,35 70,85" fill="url(#diamond-left-${kind})" opacity="0.95" />
          <polygon points="70,35 100,35 70,85" fill="url(#diamond-right-${kind})" opacity="0.95" />
          <polygon points="70,15 40,35 70,35" fill="url(#diamond-top-${kind})" opacity="0.95" />
          <polygon points="70,15 100,35 70,35" fill="${fill}" opacity="0.85" />
          <polygon points="70,15 30,35 40,35" fill="${dark}" opacity="0.7" />
          <polygon points="70,15 110,35 100,35" fill="${fill}" opacity="0.75" />
          <ellipse cx="70" cy="30" rx="15" ry="10" fill="url(#diamond-shine-${kind})" />
          <line x1="70" y1="15" x2="70" y2="85" stroke="${dark}" stroke-width="1" opacity="0.3" />
          <line x1="40" y1="35" x2="100" y2="35" stroke="${dark}" stroke-width="1" opacity="0.25" />
          <line x1="30" y1="35" x2="70" y2="85" stroke="${dark}" stroke-width="0.8" opacity="0.2" />
          <line x1="110" y1="35" x2="70" y2="85" stroke="${dark}" stroke-width="0.8" opacity="0.2" />
          <polygon points="70,15 75,25 70,30 65,25" fill="${shine}" opacity="0.6" />
        </g>
      </svg>
    `;
  }
  
  if (kind === "pencil") {
    return `<svg class="store-icon" viewBox="0 0 100 100" fill="none"><path d="M75 15l10 10-50 50-15 5 5-15z" fill="#d4a942" opacity="0.9"/><path d="M75 15l10 10-5 5-10-10z" fill="#ffd36c"/><rect x="20" y="65" width="15" height="15" fill="#8a6d3b" opacity="0.7"/></svg>`;
  }
  
  if (kind === "suit") {
    return `<svg class="store-icon" viewBox="0 0 100 100" fill="none"><rect x="30" y="35" width="40" height="50" rx="3" fill="#4a5a6a" opacity="0.9"/><rect x="35" y="40" width="30" height="40" fill="#5a6a7a"/><path d="M45 40v20h10v-20" fill="#c84a4a"/><circle cx="50" cy="48" r="2" fill="#fff" opacity="0.8"/><circle cx="50" cy="54" r="2" fill="#fff" opacity="0.8"/></svg>`;
  }
  
  if (kind === "badge") {
    return `<svg class="store-icon" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="25" fill="#6fb56f" opacity="0.9"/><path d="M50 30l5 15h16l-13 10 5 15-13-10-13 10 5-15-13-10h16z" fill="#8fd68f"/><circle cx="50" cy="50" r="20" stroke="#5a9f5a" stroke-width="2" fill="none"/></svg>`;
  }
  
  if (kind === "hat") {
    return `<svg class="store-icon" viewBox="0 0 100 100" fill="none"><ellipse cx="50" cy="70" rx="35" ry="8" fill="#8a6d3b" opacity="0.7"/><path d="M30 50c0-15 10-25 20-25s20 10 20 25v20H30z" fill="#a0826d"/><rect x="25" y="65" width="50" height="8" rx="2" fill="#8a6d3b"/></svg>`;
  }
  
  if (kind === "car") {
    return `<svg class="store-icon" viewBox="0 0 100 100" fill="none"><rect x="20" y="45" width="60" height="25" rx="4" fill="#5a9fc8" opacity="0.9"/><rect x="25" y="35" width="50" height="15" rx="3" fill="#6fb5d8"/><circle cx="32" cy="70" r="6" fill="#2a2a2a"/><circle cx="68" cy="70" r="6" fill="#2a2a2a"/><rect x="30" y="40" width="15" height="10" fill="#4a8ab8" opacity="0.6"/><rect x="55" y="40" width="15" height="10" fill="#4a8ab8" opacity="0.6"/></svg>`;
  }
  
  return `<svg class="store-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#999"/></svg>`;
}

function openStoreModal(productId) {
  const product = findStoreProduct(productId);
  if (!product) return;
  const modalRoot = document.getElementById("storeModal");
  if (!modalRoot) return;

  const perkLines = product.perks.map(p => `<div class="store-modal__perk">${escapeHtml(p)}</div>`).join("");
  const note = "Please open a support ticket in our discord server along side with the tbx transaction ID to get the perks in-game";

  modalRoot.innerHTML = `
    <div class="store-modal__backdrop" data-store-close="true" aria-hidden="true"></div>
    <div class="store-modal__dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(product.title)}">
      <button class="store-modal__close" type="button" data-store-close="true" aria-label="Close">×</button>
      <div class="store-modal__title">${escapeHtml(product.title)}</div>
      <div class="store-modal__hero">${storeIconSvg(product.icon)}</div>
      <div class="store-modal__perks">${perkLines}</div>
      <div class="store-modal__note">${escapeHtml(note)}</div>
      <div class="store-modal__footer">
        <div class="store-modal__price">${escapeHtml(product.price)}</div>
        <button class="auth__btn auth__btn--primary store-modal__buy" type="button" data-store-add="${escapeHtml(product.id)}">Add to Basket</button>
      </div>
    </div>
  `;
  modalRoot.classList.add("is-open");
}

function closeStoreModal() {
  const modalRoot = document.getElementById("storeModal");
  if (!modalRoot) return;
  modalRoot.classList.remove("is-open");
  modalRoot.innerHTML = "";
}

function bindStoreHandlersOnce() {
  if (storeHandlersBound) return;
  storeHandlersBound = true;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeStoreModal();
  });

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!t || typeof t.getAttribute !== "function") return;

    const close = t.getAttribute("data-store-close");
    if (close) {
      e.preventDefault();
      closeStoreModal();
      return;
    }

    const openId = t.getAttribute("data-store-open");
    if (openId) {
      e.preventDefault();
      openStoreModal(openId);
      return;
    }

    const addId = t.getAttribute("data-store-add");
    if (addId) {
      e.preventDefault();
      addToCart(addId);
      const countEl = document.getElementById("storeCartCount");
      if (countEl) countEl.textContent = `${getCartCount()}`;
      closeStoreModal();
      return;
    }

    const removeIdx = t.getAttribute("data-cart-remove");
    if (removeIdx !== null && removeIdx !== undefined) {
      e.preventDefault();
      removeFromCart(parseInt(removeIdx));
      renderStore("basket");
      return;
    }

    const clearBasket = t.getAttribute("data-cart-clear");
    if (clearBasket) {
      e.preventDefault();
      clearCart();
      renderStore("basket");
    }
  });
}

function renderStoreAbout() {
  return `
    <div class="store-doc">
      <div class="store-doc__title">About</div>
      <div class="store-doc__title">About SGCNR</div>
      <p class="doc-p">
        SGCNR is more than just a server; it's a dedicated community built by players, for players. Our mission is to provide a high-quality, immersive environment where your story takes center stage. We believe in balancing competitive gameplay with a fair, engaging atmosphere that rewards creativity and commitment.
      </p>
      <p class="doc-p">
        From the very beginning, we've focused on stability, innovation, and listening to our community. Every update we push and every feature we add is designed to enhance your experience and ensure that SGCNR remains the premier destination for your digital adventures.
      </p>
      <div class="store-doc__title">Why Support Us?</div>
      <p class="doc-p">
        Running a high-performance server requires significant resources—from hardware and DDoS protection to custom development and asset creation.
      </p>
      <p class="doc-p">
        By purchasing from our store, you aren't just getting perks; you are directly fueling the engine that keeps this world alive. Every contribution goes toward:
      </p>
      <ul class="doc-list">
        <li><strong>Infrastructure:</strong> Maintaining 24/7 uptime and low-latency performance.</li>
        <li><strong>Custom Content:</strong> Funding unique scripts, clothing, and maps you won't find anywhere else.</li>
        <li><strong>Staffing & Support:</strong> Ensuring we have the tools to provide fair moderation and fast support.</li>
      </ul>
      <p class="doc-p">
        We are incredibly grateful to those who choose to support us. You are the reason we can continue to push the boundaries of what this server can be.
      </p>
      <div class="store-doc__title">Our Promise</div>
      <p class="doc-p">
        We are committed to transparency and community growth. We strive to maintain a "community-first" approach, ensuring that our supporters are rewarded while keeping the core experience fun and accessible for everyone.
      </p>
      <p class="doc-p"><strong>Thank you for being part of the SGCNR legacy!</strong></p>
    </div>
  `;
}

function renderStoreServerStore(category) {
  const filtered = category ? STORE_PRODUCTS.filter(p => p.category === category) : STORE_PRODUCTS;
  
  if (filtered.length === 0) {
    return `
      <div class="store-headline">
        <div class="store-headline__title">No Products Found</div>
      </div>
      <div class="empty">No products available in this category.</div>
    `;
  }
  
  const cards = filtered.map(p => {
    const preview = p.perks.slice(0, 3).map(x => `<div class="store-product__perk">${escapeHtml(x)}</div>`).join("");
    return `
      <div class="store-product">
        <div class="store-product__top">
          <div class="store-product__title">${escapeHtml(p.title)}</div>
          <div class="store-product__price">${escapeHtml(p.price)}</div>
        </div>
        <div class="store-product__iconWrap">${storeIconSvg(p.icon)}</div>
        <div class="store-product__preview">${preview}</div>
        <div class="store-product__actions">
          <button class="auth__btn" type="button" data-store-open="${escapeHtml(p.id)}">View</button>
          <button class="auth__btn auth__btn--primary" type="button" data-store-add="${escapeHtml(p.id)}">Add</button>
        </div>
      </div>
    `;
  }).join("");

  const categoryTitles = {
    memberships: "Memberships",
    clothing: "Clothing & Outfits",
    liveries: "Vehicle Liveries"
  };
  
  const title = category ? categoryTitles[category] || "Products" : "All Products";

  return `
    <div class="store-headline">
      <div class="store-headline__title">${title}</div>
      <div class="store-headline__meta">Basket <kbd id="storeCartCount">${getCartCount()}</kbd></div>
    </div>
    <div class="store-products">${cards}</div>
  `;
}

function renderStoreMerchStore() {
  return `<div class="empty">Merch store coming soon.</div>`;
}

function renderStoreOrderStatus() {
  return `
    <div class="store-headline">
      <div class="store-headline__title">🕒 Order Status</div>
      <div class="store-headline__meta">Track updates with your order number</div>
    </div>
    <div class="order-status-layout">
      <div class="order-status-panel">
        <div class="order-status-hero">
          <div class="order-status-hero__content">
            <div class="order-status-hero__eyebrow">Fast order lookup</div>
            <div class="store-doc__title order-status-hero__title">Track your order in seconds</div>
            <p class="doc-p order-status-hero__text">
              Enter your order number below to see the latest website status. Example format: <strong>SGC-1024</strong>.
            </p>
          </div>
          <div class="order-status-hero__badge">
            <div class="order-status-hero__icon">🕒</div>
            <div class="order-status-hero__label">Live page updates</div>
          </div>
        </div>
        <div class="order-status-highlights">
          <div class="order-status-highlight">
            <div class="order-status-highlight__label">Lookup</div>
            <div class="order-status-highlight__value">Order ID</div>
          </div>
          <div class="order-status-highlight">
            <div class="order-status-highlight__label">Support</div>
            <div class="order-status-highlight__value">Discord Ready</div>
          </div>
          <div class="order-status-highlight">
            <div class="order-status-highlight__label">Status Flow</div>
            <div class="order-status-highlight__value">Pending to Done</div>
          </div>
        </div>
        <form class="order-status-form" id="orderStatusForm">
          <label class="order-status-form__label" for="orderStatusInput">Order Number</label>
          <div class="order-status-form__row">
            <input class="order-status-form__input" id="orderStatusInput" name="orderNumber" type="text" placeholder="Enter order number" autocomplete="off" />
            <button class="auth__btn auth__btn--primary" type="submit">Check Status</button>
          </div>
        </form>
        <div id="orderStatusResult">${renderOrderStatusResult("")}</div>
      </div>
      <div class="order-status-side">
        <div class="store-sidebar__block order-status-sidecard order-status-sidecard--support">
          <div class="order-status-sidecard__icon">💬</div>
          <div class="store-sidecard__title">Need a manual update?</div>
          <div class="store-sidecard__text">
            If your order does not appear here, open a Discord ticket and include your order number, product, and payment proof.
          </div>
          <div class="order-status-side__actions">
            <a class="auth__btn auth__btn--primary" href="${DISCORD_INVITE_URL}" target="_blank" rel="noopener noreferrer">Open Discord</a>
          </div>
        </div>
        <div class="store-sidebar__block order-status-sidecard">
          <div class="order-status-sidecard__icon">🤖</div>
          <div class="store-sidecard__title">Bot / live chat</div>
          <div class="store-sidecard__text">
            Live Discord bot replies are not available from this static site alone. To make that work, you'll need a backend endpoint or bot integration that this form can send requests to.
          </div>
        </div>
        <div class="store-sidebar__block order-status-sidecard">
          <div class="order-status-sidecard__icon">✨</div>
          <div class="store-sidecard__title">What to include</div>
          <div class="store-sidecard__list">
            <div class="order-status-sidecard__listItem">Order number</div>
            <div class="order-status-sidecard__listItem">Purchased package</div>
            <div class="order-status-sidecard__listItem">Payment confirmation</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStore(page) {
  const active = (page || "memberships").toString();
  const navItem = (key, label, href) => {
    const cls = key === active ? "store-nav__item is-active" : "store-nav__item";
    return `<a class="${cls}" href="${href}">${escapeHtml(label)}</a>`;
  };

  let main;
  if (active === "about") {
    main = renderStoreAbout();
  } else if (active === "merch") {
    main = renderStoreMerchStore();
  } else if (active === "order-status") {
    main = renderStoreOrderStatus();
  } else if (active === "basket") {
    main = renderStoreBasket();
  } else if (active === "memberships" || active === "clothing" || active === "liveries") {
    main = renderStoreServerStore(active);
  } else {
    main = renderStoreServerStore("memberships");
  }

  setView(`
    <div>
      ${renderHeader("Store", [{ label: "Store" }])}
      <div class="store-layout">
        <aside class="store-sidebar" aria-label="Store sidebar">
          <div class="store-sidebar__block">
            <div class="store-nav">
              ${navItem("home", "Home", "#/")}
              ${navItem("memberships", "Memberships", "#/store/memberships")}
              ${navItem("clothing", "Clothing & Outfits", "#/store/clothing")}
              ${navItem("liveries", "Vehicle Liveries", "#/store/liveries")}
              ${navItem("order-status", "🕒 Order Status", "#/store/order-status")}
              ${navItem("basket", "Basket", "#/store/basket")}
              ${navItem("about", "About", "#/store/about")}
            </div>
          </div>

          <div class="store-sidebar__block">
            <div class="store-sidecard__title">Cart Summary</div>
            <div class="store-sidecard__text">Items in basket: <strong>${getCartCount()}</strong></div>
          </div>

          <div class="store-sidebar__block">
            <div class="store-sidecard__title">Top Customer</div>
            <div class="store-sidecard__text">No recent top purchaser to display.</div>
          </div>

          <div class="store-sidebar__block">
            <div class="store-sidecard__title">Recent Payments</div>
            <div class="store-sidecard__text">No recent payments to display.</div>
          </div>
        </aside>

        <section class="store-main" aria-label="Store content">
          ${main}
        </section>
      </div>

      <div class="store-modal" id="storeModal" aria-label="Store modal"></div>
    </div>
  `);

  bindStoreHandlersOnce();
  if (active === "order-status") setupOrderStatusPage();
}

function setupOrderStatusPage() {
  waitForEl("orderStatusForm", (form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("orderStatusInput");
      const value = input ? input.value.trim().toUpperCase() : "";
      setHtml("orderStatusResult", renderOrderStatusResult(value));
    });
  });
}

function renderOrderStatusResult(orderNumber) {
  const key = normalize(orderNumber).toUpperCase();
  const match = ORDER_STATUS_DEMO[key];

  if (!key) {
    return `
      <div class="order-status-card order-status-card--idle">
        <div class="order-status-card__title">Check your order</div>
        <div class="order-status-card__text">Enter your order number to view the latest update.</div>
        <div class="order-status-card__steps">
          <div class="order-status-step"><span class="order-status-step__dot"></span><span>Enter your order ID</span></div>
          <div class="order-status-step"><span class="order-status-step__dot"></span><span>Review the latest status</span></div>
          <div class="order-status-step"><span class="order-status-step__dot"></span><span>Open Discord if you need help</span></div>
        </div>
      </div>
    `;
  }

  if (!match) {
    return `
      <div class="order-status-card order-status-card--warning">
        <div class="order-status-card__top">
          <div>
            <div class="order-status-card__label">Order number</div>
            <div class="order-status-card__value">${escapeHtml(key)}</div>
          </div>
          <span class="order-status-pill order-status-pill--warning">Not found</span>
        </div>
        <div class="order-status-card__text">We couldn't find that order in the website lookup.</div>
        <div class="order-status-card__hint">Open a Discord support ticket and include the exact order number so staff can check it manually.</div>
      </div>
    `;
  }

  return `
    <div class="order-status-card order-status-card--${match.tone}">
      <div class="order-status-card__top">
        <div>
          <div class="order-status-card__label">Order number</div>
          <div class="order-status-card__value">${escapeHtml(key)}</div>
        </div>
        <span class="order-status-pill order-status-pill--${match.tone}">${escapeHtml(match.state)}</span>
      </div>
      <div class="order-status-card__meta">Last updated: ${escapeHtml(match.updated)}</div>
      <div class="order-status-card__text">${escapeHtml(match.details)}</div>
      <div class="order-status-card__hint">${escapeHtml(match.nextStep)}</div>
    </div>
  `;
}

function clearServerStatusPageState() {
  if (serverStatusPageState.timer) {
    window.clearTimeout(serverStatusPageState.timer);
    serverStatusPageState.timer = null;
  }
  if (serverStatusPageState.controller) {
    serverStatusPageState.controller.abort();
    serverStatusPageState.controller = null;
  }
}

function getServerStatusRouteActive() {
  return parseRoute().name === "live";
}

function formatServerTimestamp(value) {
  if (!value) return "Just now";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short"
  }).format(date);
}

function formatRefreshInterval(ms) {
  const seconds = Math.max(1, Math.round(ms / 1000));
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}m`;
}

function readServerVar(vars, keys) {
  for (const key of keys) {
    if (vars && vars[key] != null && vars[key] !== "") return vars[key];
  }
  return "";
}

function normaliseServerPlayers(players) {
  if (!Array.isArray(players)) return [];
  return players
    .map((player, index) => ({
      id: player?.id ?? index + 1,
      name: player?.name || `Player ${index + 1}`,
      ping: Number.isFinite(Number(player?.ping)) ? Number(player.ping) : null
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function pickFirstDefined(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (value != null && value !== "") return value;
  }
  return null;
}

function toFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseSnapshotDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDurationCompact(totalSeconds) {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  if (!seconds) return "Pending";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)}m`;
}

function formatLeaderboardInteger(value) {
  return new Intl.NumberFormat().format(Math.round(Number(value) || 0));
}

function formatMoneyCompact(value) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(Number(value) || 0);
}

function formatRestartCountdown(dateValue) {
  const date = parseSnapshotDate(dateValue);
  if (!date) return "Pending";

  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Now";
  return `In ${formatDurationCompact(Math.round(diff / 1000))}`;
}

function fetchOptionalServerJson(url, timeoutMs = 10000) {
  if (!url) {
    return Promise.resolve({
      configured: false,
      data: null,
      error: ""
    });
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, {
    headers: { accept: "application/json" },
    signal: controller.signal
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Status request failed (${response.status})`);
    }

    return {
      configured: true,
      data: await response.json(),
      error: ""
    };
  }).catch((error) => ({
    configured: true,
    data: null,
    error: error?.message || "Request failed"
  })).finally(() => {
    window.clearTimeout(timeout);
  });
}

function normaliseHealthPayload(payload, fallbackLabel) {
  if (!payload || typeof payload !== "object") {
    return {
      configured: false,
      status: "pending",
      label: fallbackLabel,
      message: "Endpoint not connected yet.",
      latencyMs: null,
      checkedAt: null
    };
  }

  const statusRaw = normalize(pickFirstDefined(payload, ["status", "state", "health"]) || "pending");
  const latencyMs = toFiniteNumber(pickFirstDefined(payload, ["latencyMs", "latency", "responseMs", "ping"]));
  const checkedAt = parseSnapshotDate(pickFirstDefined(payload, ["checkedAt", "updatedAt", "timestamp", "refreshedAt"]));

  return {
    configured: true,
    status: ["online", "healthy", "ok", "up"].includes(statusRaw)
      ? "online"
      : ["offline", "down", "error", "critical"].includes(statusRaw)
        ? "offline"
        : "pending",
    label: pickFirstDefined(payload, ["label", "name"]) || fallbackLabel,
    message: pickFirstDefined(payload, ["message", "detail", "summary"]) || "No extra health note provided.",
    latencyMs,
    checkedAt
  };
}

function normaliseUptimePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      configured: false,
      startedAt: null,
      uptimeSeconds: null
    };
  }

  const startedAt = parseSnapshotDate(pickFirstDefined(payload, ["startedAt", "bootedAt", "onlineSince", "since"]));
  const uptimeSeconds = toFiniteNumber(pickFirstDefined(payload, ["uptimeSeconds", "uptime", "uptimeSec"]));

  return {
    configured: true,
    startedAt,
    uptimeSeconds: uptimeSeconds ?? (startedAt ? Math.max(0, Math.round((Date.now() - startedAt.getTime()) / 1000)) : null)
  };
}

function normaliseRestartPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      configured: false,
      nextRestartAt: null,
      label: SERVER_CONFIG.nextRestartLabel || "Scheduled restart"
    };
  }

  return {
    configured: true,
    nextRestartAt: parseSnapshotDate(pickFirstDefined(payload, ["nextRestartAt", "restartAt", "scheduledAt", "next"])),
    label: pickFirstDefined(payload, ["label", "name", "title"]) || SERVER_CONFIG.nextRestartLabel || "Scheduled restart"
  };
}

function normaliseQueuePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      configured: false,
      count: null,
      estimatedWaitMinutes: null
    };
  }

  return {
    configured: true,
    count: toFiniteNumber(pickFirstDefined(payload, ["count", "queueCount", "playersQueued"])),
    estimatedWaitMinutes: toFiniteNumber(pickFirstDefined(payload, ["estimatedWaitMinutes", "waitMinutes", "etaMinutes"]))
  };
}

function normaliseCountsPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      configured: false,
      cops: null,
      ems: null,
      civs: null,
      gangs: null,
      mechanics: null
    };
  }

  return {
    configured: true,
    cops: toFiniteNumber(pickFirstDefined(payload, ["cops", "police", "leo"])),
    ems: toFiniteNumber(pickFirstDefined(payload, ["ems", "medics", "ambulance"])),
    civs: toFiniteNumber(pickFirstDefined(payload, ["civs", "civilians"])),
    gangs: toFiniteNumber(pickFirstDefined(payload, ["gangs", "criminals"])),
    mechanics: toFiniteNumber(pickFirstDefined(payload, ["mechanics", "mechs"]))
  };
}

function normaliseEventsPayload(payload) {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.events)
      ? payload.events
      : [];

  return {
    configured: Boolean(payload),
    items: source.map((event, index) => ({
      id: pickFirstDefined(event, ["id", "slug"]) || `event-${index + 1}`,
      title: pickFirstDefined(event, ["title", "name"]) || `Event ${index + 1}`,
      location: pickFirstDefined(event, ["location", "zone", "area"]) || "Unknown zone",
      status: pickFirstDefined(event, ["status", "state"]) || "Active",
      detail: pickFirstDefined(event, ["detail", "description", "summary"]) || ""
    }))
  };
}

function normaliseHistoryPayload(payload) {
  const uptimeSource = Array.isArray(payload?.uptime) ? payload.uptime : [];
  const outageSource = Array.isArray(payload?.outages) ? payload.outages : [];

  return {
    configured: Boolean(payload && typeof payload === "object"),
    uptime: uptimeSource.map((entry, index) => ({
      label: pickFirstDefined(entry, ["label", "name"]) || `Window ${index + 1}`,
      uptimeSeconds: toFiniteNumber(pickFirstDefined(entry, ["uptimeSeconds", "uptime"]))
    })),
    outages: outageSource.map((entry, index) => ({
      label: pickFirstDefined(entry, ["label", "name"]) || `Outage ${index + 1}`,
      startedAt: parseSnapshotDate(pickFirstDefined(entry, ["startedAt", "timestamp"])),
      durationMinutes: toFiniteNumber(pickFirstDefined(entry, ["durationMinutes", "minutes", "duration"]))
    }))
  };
}

function normaliseHotZonesPayload(payload) {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.zones)
      ? payload.zones
      : [];

  return {
    configured: Boolean(payload),
    items: source.map((zone, index) => ({
      id: pickFirstDefined(zone, ["id", "slug"]) || `zone-${index + 1}`,
      name: pickFirstDefined(zone, ["name", "label", "title"]) || `Zone ${index + 1}`,
      heat: toFiniteNumber(pickFirstDefined(zone, ["heat", "score", "activity"])) ?? 0,
      type: pickFirstDefined(zone, ["type", "category"]) || "activity"
      }))
    };
  }

function normaliseDiscordOpsPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      configured: false,
      botStatus: normaliseHealthPayload(null, "Discord Bot"),
      guildName: `${SERVER_CONFIG.name} Discord`,
      onlineMembers: null,
      totalMembers: null,
      verifiedMembers: null,
      openTickets: null,
      pendingReports: null,
      pendingApplications: null,
      linkedAccounts: null,
      syncRoles: false,
      linkingEnabled: Boolean(SERVER_CONFIG.discordOAuthUrl),
      lastPushAt: null,
      lastSource: "",
      oauthUrl: SERVER_CONFIG.discordOAuthUrl || "",
      supportUrl: DISCORD_TICKET_CHANNEL_URL,
      botInviteUrl: SERVER_CONFIG.discordBotInviteUrl || "",
      announcements: []
    };
  }

  const hasFlatDiscordKeys = [
    "bot_status",
    "bot_latency",
    "bot_message",
    "total_members",
    "online_members",
    "verified_members",
    "open_tickets",
    "pending_reports",
    "pending_applications",
    "linked_accounts",
    "sync_roles",
    "linking_enabled",
    "oauth_url",
    "support_url"
  ].some((key) => Object.prototype.hasOwnProperty.call(payload, key));

  const guild = payload.guild && typeof payload.guild === "object" ? payload.guild : payload;
  const support = payload.support && typeof payload.support === "object" ? payload.support : payload;
  const linking = payload.linking && typeof payload.linking === "object" ? payload.linking : payload;
  const meta = payload._meta && typeof payload._meta === "object" ? payload._meta : {};
  const announcementSource = Array.isArray(payload.announcements)
    ? payload.announcements
    : Array.isArray(payload.feed)
      ? payload.feed
      : Array.isArray(payload.updates)
        ? payload.updates
        : [];

  const syncRolesRaw = pickFirstDefined(linking, ["syncRoles", "roleSync", "rolesLinked", "sync_roles"]);
  const linkingEnabledRaw = pickFirstDefined(linking, ["enabled", "linkingEnabled", "oauthEnabled", "linking_enabled"]);
  const botStatusSource =
    payload.botStatus ||
    payload.bot ||
    payload.health ||
    (
      hasFlatDiscordKeys
        ? {
            status: pickFirstDefined(payload, ["bot_status", "status"]),
            latencyMs: pickFirstDefined(payload, ["bot_latency", "latency", "latencyMs"]),
            message: pickFirstDefined(payload, ["bot_message", "message"]),
            checkedAt: pickFirstDefined(meta, ["lastPushAt", "lastSyncAt"])
          }
        : null
    );
  const botStatus = normaliseHealthPayload(botStatusSource, "Discord Bot");

  return {
    configured: true,
    botStatus: {
      ...botStatus,
      label: "Discord Bot"
    },
    guildName: pickFirstDefined(guild, ["name", "guildName", "serverName", "guild_name"]) || `${SERVER_CONFIG.name} Discord`,
    onlineMembers: toFiniteNumber(pickFirstDefined(guild, ["onlineMembers", "membersOnline", "presenceCount", "online", "online_members"])),
    totalMembers: toFiniteNumber(pickFirstDefined(guild, ["totalMembers", "members", "memberCount", "total_members"])),
    verifiedMembers: toFiniteNumber(pickFirstDefined(guild, ["verifiedMembers", "linkedMembers", "whitelistedMembers", "verified_members"])),
    openTickets: toFiniteNumber(pickFirstDefined(support, ["openTickets", "open_tickets", "ticketsOpen", "tickets"])),
    pendingReports: toFiniteNumber(pickFirstDefined(support, ["pendingReports", "pending_reports", "reportsOpen", "reports"])),
    pendingApplications: toFiniteNumber(pickFirstDefined(support, ["pendingApplications", "applicationsOpen", "applications", "pending_applications"])),
    linkedAccounts: toFiniteNumber(pickFirstDefined(linking, ["linkedAccounts", "linkedUsers", "connections", "linked_accounts"])),
    syncRoles: syncRolesRaw == null ? false : Boolean(syncRolesRaw),
    linkingEnabled: linkingEnabledRaw == null ? Boolean(SERVER_CONFIG.discordOAuthUrl) : Boolean(linkingEnabledRaw),
    lastPushAt: parseSnapshotDate(pickFirstDefined(meta, ["lastPushAt", "lastSyncAt"])),
    lastSource: pickFirstDefined(meta, ["lastSource", "source"]) || "",
    oauthUrl: pickFirstDefined(linking, ["oauthUrl", "connectUrl", "linkUrl", "oauth_url"]) || SERVER_CONFIG.discordOAuthUrl || "",
    supportUrl: pickFirstDefined(support, ["supportUrl", "ticketUrl", "dashboardUrl", "support_url"]) || DISCORD_TICKET_CHANNEL_URL,
    botInviteUrl: pickFirstDefined(payload, ["botInviteUrl", "inviteUrl"]) || SERVER_CONFIG.discordBotInviteUrl || "",
    announcements: announcementSource.map((entry, index) => ({
      id: pickFirstDefined(entry, ["id", "slug"]) || `discord-announcement-${index + 1}`,
      title: pickFirstDefined(entry, ["title", "name"]) || `Discord update ${index + 1}`,
      channel: pickFirstDefined(entry, ["channel", "source", "area"]) || "Announcements",
      detail: pickFirstDefined(entry, ["detail", "description", "summary"]) || "",
      createdAt: parseSnapshotDate(pickFirstDefined(entry, ["createdAt", "timestamp", "updatedAt"]))
    }))
  };
}

function normaliseLiveMapPlayers(payload) {
  const playerSource = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.players)
      ? payload.players
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
  const requiresOptIn = Boolean(
    pickFirstDefined(payload, ["requiresOptIn", "optInOnly", "trackingOptIn"]) ??
    SERVER_CONFIG.liveTrackingRequiresOptIn
  );
  const settingLabel = pickFirstDefined(payload, ["settingLabel", "toggleLabel", "preferenceLabel"]) || "Website Live Tracking";

  const allPlayers = playerSource.map((player, index) => {
    const mapX = toFiniteNumber(pickFirstDefined(player, ["mapX", "xPercent", "percentX"]));
    const mapY = toFiniteNumber(pickFirstDefined(player, ["mapY", "yPercent", "percentY"]));
    const lat = toFiniteNumber(pickFirstDefined(player, ["lat", "latitude"]));
    const lng = toFiniteNumber(pickFirstDefined(player, ["lng", "lon", "longitude"]));
    const trackingEnabled = Boolean(
      pickFirstDefined(player, ["trackingEnabled", "optedIn", "websiteTracking", "shareLocation"]) ??
      !requiresOptIn
    );
    const position = mapX != null && mapY != null
      ? {
          x: clamp(mapX, 1.6, 98.4),
          y: clamp(mapY, 1.6, 98.4)
        }
      : lat != null && lng != null
        ? getMapPositionPercent({ lat, lng })
        : null;

    if (!position) return null;

    return {
      id: pickFirstDefined(player, ["id", "serverId"]) || `live-${index + 1}`,
      name: pickFirstDefined(player, ["name", "playerName"]) || `Player ${index + 1}`,
      role: pickFirstDefined(player, ["role", "job", "group"]) || "",
      ping: toFiniteNumber(pickFirstDefined(player, ["ping", "latency"])),
      heading: toFiniteNumber(pickFirstDefined(player, ["heading", "rotation"])),
      trackingEnabled,
      position
    };
  }).filter(Boolean);
  const visiblePlayers = allPlayers.filter((player) => !requiresOptIn || player.trackingEnabled);

  return {
    configured: Boolean(payload),
    requiresOptIn,
    settingLabel,
    totalPlayers: allPlayers.length,
    visiblePlayers: visiblePlayers.length,
    hiddenPlayers: Math.max(0, allPlayers.length - visiblePlayers.length),
    updatedAt: parseSnapshotDate(pickFirstDefined(payload, ["updatedAt", "timestamp", "refreshedAt"])),
    players: visiblePlayers
  };
}

async function loadLiveOpsSnapshot() {
  const [
    combinedResult,
    liveMapResult,
    leaderboardResult,
    uptimeResult,
    restartResult,
    discordResult,
    serverHealthResult,
    websiteHealthResult
  ] = await Promise.all([
    fetchOptionalServerJson(SERVER_CONFIG.liveOpsUrl),
    fetchOptionalServerJson(SERVER_CONFIG.livePlayerMapUrl),
    fetchOptionalServerJson(SERVER_CONFIG.leaderboardUrl),
    fetchOptionalServerJson(SERVER_CONFIG.uptimeStatusUrl),
    fetchOptionalServerJson(SERVER_CONFIG.restartInfoUrl),
    fetchOptionalServerJson(SERVER_CONFIG.discordStatusUrl),
    fetchOptionalServerJson(SERVER_CONFIG.serverHealthUrl),
    fetchOptionalServerJson(SERVER_CONFIG.websiteHealthUrl)
  ]);

  const combined = combinedResult.data && typeof combinedResult.data === "object" ? combinedResult.data : {};
  const liveMap = normaliseLiveMapPlayers(combined.liveMap || combined.map || liveMapResult.data);
  const leaderboardPayload =
    leaderboardResult.data ||
    combined.leaderboard ||
    combined.leaderboards ||
    combined.rankings ||
    null;
  const leaderboardMetric = getLeaderboardMetricConfig(
    pickFirstDefined(leaderboardPayload || {}, ["metric", "selectedMetric"]) || "kd"
  ).key;
  const leaderboardRows = getLeaderboardSortedRows(
    normaliseLeaderboardRows(leaderboardPayload),
    leaderboardMetric
  );
  const leaderboard = {
    configured: Boolean(
      SERVER_CONFIG.leaderboardUrl ||
      leaderboardResult.configured ||
      combined.leaderboard ||
      combined.leaderboards ||
      combined.rankings
    ),
    metric: leaderboardMetric,
    updatedAt: parseSnapshotDate(pickFirstDefined(leaderboardPayload || {}, ["updatedAt", "timestamp", "refreshedAt"])),
    rows: leaderboardRows
  };
  const uptime = normaliseUptimePayload(combined.uptime || combined.runtime || uptimeResult.data);
  const restart = normaliseRestartPayload(combined.restart || combined.restartInfo || restartResult.data);
  const queue = normaliseQueuePayload(combined.queue);
  const counts = normaliseCountsPayload(combined.counts || combined.roles || combined.factions);
  const events = normaliseEventsPayload(combined.events || combined.activeEvents);
  const history = normaliseHistoryPayload(combined.history);
  const hotZones = normaliseHotZonesPayload(combined.hotZones || combined.zones || combined.heatmap);
  const hasTopLevelDiscordKeys = [
    "bot_status",
    "bot_latency",
    "bot_message",
    "guild_name",
    "total_members",
    "online_members",
    "verified_members",
    "open_tickets",
    "pending_reports",
    "pending_applications",
    "linked_accounts",
    "sync_roles",
    "linking_enabled",
    "oauth_url",
    "support_url"
  ].some((key) => Object.prototype.hasOwnProperty.call(combined, key));
  const discord = normaliseDiscordOpsPayload(combined.discord || combined.community || (hasTopLevelDiscordKeys ? combined : null) || discordResult.data);
  const serverHealth = normaliseHealthPayload(combined.serverHealth || combined.server || serverHealthResult.data, "Game Server");
  const websiteHealth = normaliseHealthPayload(combined.websiteHealth || combined.website || websiteHealthResult.data, SERVER_CONFIG.websiteName || "Website");

  liveMap.configured = Boolean(liveMap.configured || combined.liveMap || combined.map || combinedResult.configured || liveMapResult.configured);
  uptime.configured = Boolean(uptime.configured || combined.uptime || combined.runtime || combinedResult.configured || uptimeResult.configured);
  restart.configured = Boolean(restart.configured || combined.restart || combined.restartInfo || combinedResult.configured || restartResult.configured);
  queue.configured = Boolean(queue.configured || combined.queue || combinedResult.configured);
  counts.configured = Boolean(counts.configured || combined.counts || combined.roles || combined.factions || combinedResult.configured);
  events.configured = Boolean(events.configured || combined.events || combined.activeEvents || combinedResult.configured);
  history.configured = Boolean(history.configured || combined.history || combinedResult.configured);
  hotZones.configured = Boolean(hotZones.configured || combined.hotZones || combined.zones || combined.heatmap || combinedResult.configured);
  discord.configured = Boolean(discord.configured || combined.discord || combined.community || combinedResult.configured || discordResult.configured);
  serverHealth.configured = Boolean(serverHealth.configured || combined.serverHealth || combined.server || combinedResult.configured || serverHealthResult.configured);
  websiteHealth.configured = Boolean(websiteHealth.configured || combined.websiteHealth || combined.website || combinedResult.configured || websiteHealthResult.configured);

  return {
    configured: Boolean(
      SERVER_CONFIG.liveOpsUrl ||
        SERVER_CONFIG.livePlayerMapUrl ||
        SERVER_CONFIG.leaderboardUrl ||
        SERVER_CONFIG.uptimeStatusUrl ||
        SERVER_CONFIG.restartInfoUrl ||
        SERVER_CONFIG.discordStatusUrl ||
        SERVER_CONFIG.serverHealthUrl ||
        SERVER_CONFIG.websiteHealthUrl
      ),
    source: SERVER_CONFIG.liveOpsUrl ? "Custom live ops API" : "Per-feature endpoints",
    publicStatusUrl: SERVER_CONFIG.publicStatusUrl || pickFirstDefined(combined, ["publicStatusUrl", "statusPageUrl", "statusUrl"]) || "",
    liveMap,
    leaderboard,
    uptime,
    restart,
    queue,
    counts,
      events,
      history,
      hotZones,
      discord,
      serverHealth,
      websiteHealth,
      errors: [
        combinedResult.error && `Live ops: ${combinedResult.error}`,
        liveMapResult.error && `Live map: ${liveMapResult.error}`,
        leaderboardResult.error && `Leaderboard: ${leaderboardResult.error}`,
        uptimeResult.error && `Uptime: ${uptimeResult.error}`,
        restartResult.error && `Restart: ${restartResult.error}`,
        discordResult.error && `Discord: ${discordResult.error}`,
        serverHealthResult.error && `Server health: ${serverHealthResult.error}`,
        websiteHealthResult.error && `Website health: ${websiteHealthResult.error}`
      ].filter(Boolean)
    };
  }

function fetchServerJson(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  serverStatusPageState.controller = controller;

  return fetch(url, {
    headers: { accept: "application/json" },
    signal: controller.signal
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Status request failed (${response.status})`);
    }
    return response.json();
  }).finally(() => {
    window.clearTimeout(timeout);
    if (serverStatusPageState.controller === controller) {
      serverStatusPageState.controller = null;
    }
  });
}

async function loadServerSnapshot() {
  const liveOps = await loadLiveOpsSnapshot();
  if (!SERVER_SINGLE_API_URL) {
    return {
      online: false,
      name: SERVER_CONFIG.name,
      description: "Public FiveM server data is not connected yet.",
      clients: 0,
      maxClients: 0,
      endpoint: "",
      joinCode: SERVER_JOIN_CODE,
      joinUrl: SERVER_JOIN_URL,
      mapName: "Los Santos",
      gameType: "Cops & Robbers",
      locale: SERVER_CONFIG.region,
      onesync: "Unknown",
      tags: [],
      resources: null,
      players: [],
      source: "Website fallback",
      txAdminConfigured: Boolean(SERVER_CONFIG.txAdminStatusUrl || SERVER_CONFIG.txAdminPlayersUrl),
      liveOps,
      apiError: "Public FiveM server data is not connected yet.",
      refreshedAt: new Date()
    };
  }

  let payload;
  try {
    payload = await fetchServerJson(SERVER_SINGLE_API_URL);
  } catch (error) {
    return {
      online: false,
      name: SERVER_CONFIG.name,
      description: "The public FiveM API did not answer, but custom health and restart panels can still be used.",
      clients: 0,
      maxClients: 0,
      endpoint: "",
      joinCode: SERVER_JOIN_CODE,
      joinUrl: SERVER_JOIN_URL,
      mapName: "Los Santos",
      gameType: "Cops & Robbers",
      locale: SERVER_CONFIG.region,
      onesync: "Unknown",
      tags: [],
      resources: null,
      players: [],
      source: "Website fallback",
      txAdminConfigured: Boolean(SERVER_CONFIG.txAdminStatusUrl || SERVER_CONFIG.txAdminPlayersUrl),
      liveOps,
      apiError: error?.message || "The FiveM API did not respond.",
      refreshedAt: new Date()
    };
  }

  const data = payload?.Data ?? payload?.data ?? payload ?? {};
  const vars = data?.vars ?? {};
  const players = normaliseServerPlayers(data?.players);
  const maxClients = Number(data?.sv_maxclients ?? readServerVar(vars, ["sv_maxclients", "sv_maxClients"]) ?? 0) || 0;
  const endpoint = Array.isArray(data?.connectEndPoints) ? data.connectEndPoints[0] : "";
  const tags = Array.isArray(data?.tags)
    ? data.tags
    : typeof data?.tags === "string"
      ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

  return {
    online: true,
    name: data?.hostname || readServerVar(vars, ["sv_projectName", "sv_hostname"]) || SERVER_CONFIG.name,
    description: readServerVar(vars, ["sv_projectDesc", "sv_projectDescription"]),
    clients: Number(data?.clients ?? players.length ?? 0) || 0,
    maxClients,
    endpoint,
    joinCode: SERVER_JOIN_CODE,
    joinUrl: SERVER_JOIN_URL,
    mapName: data?.mapname || readServerVar(vars, ["mapname"]) || "Los Santos",
    gameType: data?.gametype || readServerVar(vars, ["gametype"]) || "Cops & Robbers",
    locale: readServerVar(vars, ["locale"]) || SERVER_CONFIG.region,
    onesync: readServerVar(vars, ["onesync_enabled", "onesync"]) || "Enabled",
    tags,
    resources: Array.isArray(data?.resources) ? data.resources.length : null,
    players,
    source: "FiveM Public API",
    txAdminConfigured: Boolean(SERVER_CONFIG.txAdminStatusUrl || SERVER_CONFIG.txAdminPlayersUrl),
    liveOps,
    apiError: "",
    refreshedAt: new Date()
  };
}

function renderServerStatusShell() {
  return `
    <div class="status-page">
      ${renderHeader("Live", [{ label: "Live" }])}
      <section class="section status-live status-live--hero">
        <div class="status-live__head">
          <div class="status-live__copy">
            <div class="section__eyebrow">Live operations hub</div>
            <h2>${escapeHtml(SERVER_CONFIG.name)}</h2>
            <p class="status-live__text">Track player count, queue, uptime, restarts, rankings, active events, Discord operations, and server health from one page. The map stays separate, but everything else live belongs here.</p>
          </div>
          <div class="status-live__actions">
            <button class="auth__btn" id="statusRefreshBtn" type="button">Refresh</button>
          </div>
        </div>
        <div class="status-live__highlights">
          <div class="status-live__highlight">
            <div class="status-live__label">Auto Refresh</div>
            <div class="status-live__value">${escapeHtml(formatRefreshInterval(SERVER_CONFIG.statusRefreshMs))}</div>
          </div>
          <div class="status-live__highlight">
            <div class="status-live__label">Live Source</div>
            <div class="status-live__value">FiveM + Ops</div>
          </div>
          <div class="status-live__highlight">
              <div class="status-live__label">Live Ops</div>
              <div class="status-live__value">${SERVER_CONFIG.liveOpsUrl || SERVER_CONFIG.livePlayerMapUrl || SERVER_CONFIG.leaderboardUrl || SERVER_CONFIG.uptimeStatusUrl || SERVER_CONFIG.restartInfoUrl || SERVER_CONFIG.discordStatusUrl || SERVER_CONFIG.serverHealthUrl || SERVER_CONFIG.websiteHealthUrl ? "Connected" : "Ready"}</div>
            </div>
          </div>
        </section>
        <div id="serverStatusMount">${renderServerStatusLoading()}</div>
    </div>
  `;
}

function renderServerStatusLoading() {
  return `
    <section class="section">
      <div class="status-empty">
        <div class="status-empty__title">Loading live server data</div>
        <div class="status-empty__text">Checking the server API and preparing the latest snapshot.</div>
      </div>
    </section>
  `;
}

function renderServerStatusError(message) {
  return `
    <section class="section">
        <div class="status-empty status-empty--warning">
        <div class="status-empty__title">Live status is not available right now</div>
        <div class="status-empty__text">${escapeHtml(message || "The server API could not be reached from the website at the moment.")}</div>
          <div class="status-note">
            <strong>Ready for live setup:</strong> edit <code>server-config.js</code> if your server uses a different Discord invite, txAdmin hooks, backend API, or Discord bot endpoints.
          </div>
        </div>
      </section>
  `;
}

function renderStatusPlayers(players) {
  if (!players.length) {
    return `<div class="status-empty__text">No public player list is available right now.</div>`;
  }

  const featured = players.slice(0, Math.max(1, SERVER_CONFIG.maxPlayerPreview || 12));
  return `
    <div class="status-players__searchWrap">
      <input class="status-players__search" id="statusPlayerSearch" type="search" placeholder="Filter live players..." />
    </div>
    <div class="players players--status" id="statusPlayersList">
      ${featured.map((player) => `
        <div class="player-card" data-player-name="${escapeHtml(normalize(player.name))}">
          <div class="player-card__top">
            <div class="player-card__name">${escapeHtml(player.name)}</div>
            <div class="player-card__badge">#${escapeHtml(String(player.id))}</div>
          </div>
          <div class="player-card__meta">${player.ping != null ? `${escapeHtml(String(player.ping))} ms ping` : "Ping unavailable"}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderStatusMetricCard(label, value, meta) {
  return `
    <div class="status-card">
      <div class="status-card__label">${escapeHtml(label)}</div>
      <div class="status-card__value">${escapeHtml(value)}</div>
      <div class="status-card__meta">${escapeHtml(meta)}</div>
    </div>
  `;
}

function renderHealthSummaryCard(label, health) {
  const stateLabel = health.status === "online"
    ? "Online"
    : health.status === "offline"
      ? "Offline"
      : "Pending";
  const meta = health.latencyMs != null
    ? `${health.latencyMs} ms response`
    : health.message;

  return `
    <div class="status-card">
      <div class="status-card__label">${escapeHtml(label)}</div>
      <div class="status-card__value">${escapeHtml(stateLabel)}</div>
      <div class="status-card__meta">${escapeHtml(meta || "No data yet")}</div>
    </div>
  `;
}

function renderOpsCounts(counts) {
  const items = [
    ["Cops", counts?.cops],
    ["EMS", counts?.ems],
    ["Civs", counts?.civs],
    ["Gangs", counts?.gangs],
    ["Mechanics", counts?.mechanics]
  ];

  return `
    <div class="status-miniGrid">
      ${items.map(([label, value]) => `
        <div class="status-miniStat">
          <div class="status-miniStat__label">${escapeHtml(label)}</div>
          <div class="status-miniStat__value">${escapeHtml(value != null ? String(value) : "—")}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEventsList(events) {
  const items = Array.isArray(events?.items) ? events.items : [];
  if (!items.length) {
    return `<div class="status-empty__text">No active events are connected right now.</div>`;
  }

  return `
    <div class="status-feed">
      ${items.slice(0, 5).map((event) => `
        <article class="status-feed__item">
          <div class="status-feed__top">
            <div class="status-feed__title">${escapeHtml(event.title)}</div>
            <div class="status-feed__pill">${escapeHtml(event.status)}</div>
          </div>
          <div class="status-feed__meta">${escapeHtml(event.location)}</div>
          ${event.detail ? `<div class="status-feed__text">${escapeHtml(event.detail)}</div>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function renderHistoryList(history) {
  const uptimeItems = Array.isArray(history?.uptime) ? history.uptime.slice(0, 3) : [];
  const outageItems = Array.isArray(history?.outages) ? history.outages.slice(0, 3) : [];

  return `
    <div class="status-history">
      <div class="status-history__group">
        <div class="status-history__title">Uptime history</div>
        ${uptimeItems.length ? uptimeItems.map((entry) => `
          <div class="status-history__item">
            <span>${escapeHtml(entry.label)}</span>
            <strong>${escapeHtml(entry.uptimeSeconds != null ? formatDurationCompact(entry.uptimeSeconds) : "Pending")}</strong>
          </div>
        `).join("") : `<div class="status-empty__text">No uptime history connected yet.</div>`}
      </div>
      <div class="status-history__group">
        <div class="status-history__title">Outage history</div>
        ${outageItems.length ? outageItems.map((entry) => `
          <div class="status-history__item">
            <span>${escapeHtml(entry.label)}</span>
            <strong>${escapeHtml(entry.durationMinutes != null ? `${entry.durationMinutes}m` : "Pending")}</strong>
          </div>
        `).join("") : `<div class="status-empty__text">No outage history connected yet.</div>`}
      </div>
    </div>
  `;
}

function renderHotZonesList(hotZones) {
  const items = Array.isArray(hotZones?.items) ? hotZones.items.slice(0, 4) : [];
  if (!items.length) {
    return `<div class="status-empty__text">No hot zones are connected right now.</div>`;
  }

  return `
    <div class="status-hotzones">
      ${items.map((zone) => `
        <div class="status-hotzones__item">
          <div class="status-hotzones__row">
            <span class="status-hotzones__name">${escapeHtml(zone.name)}</span>
            <span class="status-hotzones__score">${escapeHtml(String(zone.heat))}</span>
          </div>
          <div class="status-hotzones__bar">
            <span style="width:${escapeHtml(String(clamp(zone.heat, 0, 100)))}%"></span>
          </div>
          <div class="status-hotzones__meta">${escapeHtml(zone.type)}</div>
        </div>
      `).join("")}
      </div>
    `;
  }

function renderDiscordOpsGrid(discord) {
  const items = [
    ["Bot Status", discord?.botStatus?.status === "online" ? "Online" : discord?.botStatus?.status === "offline" ? "Offline" : "Pending"],
    ["Members Online", discord?.onlineMembers != null ? String(discord.onlineMembers) : "—"],
    ["Total Members", discord?.totalMembers != null ? String(discord.totalMembers) : "—"],
    ["Pending Reports", discord?.pendingReports != null ? String(discord.pendingReports) : "—"],
    ["Linked Accounts", discord?.linkedAccounts != null ? String(discord.linkedAccounts) : "—"],
    ["Role Sync", discord?.syncRoles ? "Enabled" : discord?.configured ? "Ready" : "Pending"]
  ];

  return `
    <div class="status-miniGrid">
      ${items.map(([label, value]) => `
        <div class="status-miniStat">
          <div class="status-miniStat__label">${escapeHtml(label)}</div>
          <div class="status-miniStat__value">${escapeHtml(value)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderDiscordAnnouncements(discord) {
  const items = Array.isArray(discord?.announcements) ? discord.announcements.slice(0, 4) : [];
  if (!items.length) {
    return `<div class="status-empty__text">No Discord announcement feed is connected right now.</div>`;
  }

  return `
    <div class="status-feed">
      ${items.map((item) => `
        <article class="status-feed__item">
          <div class="status-feed__top">
            <div class="status-feed__title">${escapeHtml(item.title)}</div>
            <div class="status-feed__pill">${escapeHtml(item.channel)}</div>
          </div>
          <div class="status-feed__meta">${escapeHtml(item.createdAt ? formatServerTimestamp(item.createdAt) : "Discord feed")}</div>
          ${item.detail ? `<div class="status-feed__text">${escapeHtml(item.detail)}</div>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function renderDiscordLinking(discord) {
  const supportUrl = discord?.supportUrl || DISCORD_INVITE_URL;
  const oauthUrl = discord?.oauthUrl || "";
  const inviteUrl = discord?.botInviteUrl || "";
  const syncNote = discord?.lastPushAt
    ? `Last bot sync ${formatServerTimestamp(discord.lastPushAt)}${discord?.lastSource ? ` via ${discord.lastSource}` : ""}.`
    : "The website is still waiting for the first Discord bot sync. If this stays pending, check the live ops bridge on the host.";

  return `
    <div class="stack-list stack-list--compact">
      <div class="stack-list__item"><span class="stack-list__index">01</span><span>Discord guild: ${escapeHtml(discord?.guildName || `${SERVER_CONFIG.name} Discord`)}</span></div>
      <div class="stack-list__item"><span class="stack-list__index">02</span><span>Account linking is ${discord?.linkingEnabled ? "enabled" : "prepared but not connected yet"}.</span></div>
      <div class="stack-list__item"><span class="stack-list__index">03</span><span>Role sync is ${discord?.syncRoles ? "enabled" : "ready for backend control"}.</span></div>
      <div class="stack-list__item"><span class="stack-list__index">04</span><span>Support queue: ${discord?.pendingReports != null ? `${discord.pendingReports} pending reports` : "waiting for report data"}.</span></div>
      <div class="stack-list__item"><span class="stack-list__index">05</span><span>Verified members: ${discord?.verifiedMembers != null ? String(discord.verifiedMembers) : "pending data feed"}.</span></div>
    </div>
    <div class="status-note">
      <strong>Live sync:</strong> ${escapeHtml(syncNote)}
    </div>
    <div class="status-note">
      <strong>Backend requirement:</strong> Discord account linking, role rewards, ticket sync, punishments, verification, and bot automation need a real backend API and database behind this website.
    </div>
    <div class="status-actions">
      <a class="info-link" href="${escapeHtml(supportUrl)}" target="_blank" rel="noopener noreferrer">Open Discord</a>
      ${oauthUrl ? `<a class="info-link" href="${escapeHtml(oauthUrl)}" target="_blank" rel="noopener noreferrer">Connect Discord</a>` : ""}
      ${inviteUrl ? `<a class="info-link" href="${escapeHtml(inviteUrl)}" target="_blank" rel="noopener noreferrer">Invite Bot</a>` : ""}
    </div>
  `;
}

function renderServerStatusContent(snapshot) {
  const onlineLabel = snapshot.online ? "Online" : "Offline";
  const playerValue = snapshot.maxClients
    ? `${snapshot.clients}/${snapshot.maxClients}`
    : `${snapshot.clients}`;
  const liveOps = snapshot.liveOps || {};
  const leaderboardMetric = parseRoute().metric || liveOps.leaderboard?.metric || "kd";
  const discordOps = liveOps.discord || normaliseDiscordOpsPayload(null);
  const uptimeValue = liveOps.uptime?.uptimeSeconds != null
    ? formatDurationCompact(liveOps.uptime.uptimeSeconds)
    : "Pending";
  const restartValue = liveOps.restart?.nextRestartAt
    ? formatRestartCountdown(liveOps.restart.nextRestartAt)
    : "Pending";
  const liveMapCount = liveOps.liveMap?.players?.length ?? 0;
  const queueValue = liveOps.queue?.count != null ? String(liveOps.queue.count) : "Pending";
  const restartBanner = `
    <section class="section status-banner">
      <div class="status-banner__kicker">${escapeHtml(liveOps.restart?.label || SERVER_CONFIG.nextRestartLabel || "Scheduled restart")}</div>
      <div class="status-banner__value">${escapeHtml(restartValue)}</div>
      <div class="status-banner__meta">${escapeHtml(liveOps.restart?.nextRestartAt ? `Target ${formatServerTimestamp(liveOps.restart.nextRestartAt)}` : "Connect a restart endpoint to show the next timed reboot.")}</div>
    </section>
  `;
  const tags = snapshot.tags?.length
    ? `<div class="status-tags">${snapshot.tags.slice(0, 6).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`
    : "";
  const liveOpsErrors = Array.isArray(liveOps.errors) && liveOps.errors.length
    ? `
      <div class="status-note">
        <strong>Live ops note:</strong> ${escapeHtml(liveOps.errors[0])}
      </div>
    `
    : "";
  const apiErrorNote = snapshot.apiError
    ? `
      <div class="status-note">
        <strong>FiveM API note:</strong> ${escapeHtml(snapshot.apiError)}
      </div>
    `
    : "";
  const statusLink = liveOps.publicStatusUrl
    ? `
      <div class="status-note">
        <strong>Public status page:</strong> <a class="info-link" href="${escapeHtml(liveOps.publicStatusUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(liveOps.publicStatusUrl)}</a>
      </div>
    `
    : "";

  return `
    ${restartBanner}
    <section class="section">
      <div class="status-head">
        <div class="status-head__left">
          <div class="section__eyebrow">Live snapshot</div>
          <h2>${escapeHtml(snapshot.name)}</h2>
          <div class="status-meta">${escapeHtml(snapshot.description || "Connected to the live FiveM server feed.")}</div>
        </div>
        <div class="status-pill status-pill--${snapshot.online ? "online" : "offline"}">${onlineLabel}</div>
      </div>
      ${tags}
      <div class="status-grid">
        <div class="status-card">
          <div class="status-card__label">Players</div>
          <div class="status-card__value">${escapeHtml(playerValue)}</div>
          <div class="status-card__meta">Live public count</div>
        </div>
        <div class="status-card">
          <div class="status-card__label">Uptime</div>
          <div class="status-card__value">${escapeHtml(uptimeValue)}</div>
          <div class="status-card__meta">${escapeHtml(liveOps.uptime?.startedAt ? `Since ${formatServerTimestamp(liveOps.uptime.startedAt)}` : "Add an uptime endpoint to show runtime.")}</div>
        </div>
        <div class="status-card">
          <div class="status-card__label">Next Restart</div>
          <div class="status-card__value">${escapeHtml(restartValue)}</div>
          <div class="status-card__meta">${escapeHtml(liveOps.restart?.label || SERVER_CONFIG.nextRestartLabel || "Scheduled restart")}</div>
        </div>
        <div class="status-card">
          <div class="status-card__label">Live Map Feed</div>
          <div class="status-card__value">${escapeHtml(String(liveMapCount))}</div>
          <div class="status-card__meta">${escapeHtml(liveOps.liveMap?.configured ? (liveOps.liveMap?.requiresOptIn ? `${liveOps.liveMap.hiddenPlayers || 0} hidden until opt-in is enabled in-game` : "Tracked players ready for map overlay") : "Add a live player map endpoint")}</div>
        </div>
        ${renderStatusMetricCard("Queue", queueValue, liveOps.queue?.estimatedWaitMinutes != null ? `About ${liveOps.queue.estimatedWaitMinutes} minutes wait` : "Queue feed ready for live numbers")}
        <div class="status-card">
          <div class="status-card__label">Game Mode</div>
          <div class="status-card__value">${escapeHtml(snapshot.gameType)}</div>
          <div class="status-card__meta">${escapeHtml(snapshot.mapName)}</div>
        </div>
        ${renderHealthSummaryCard("Server Status", liveOps.serverHealth || { status: "pending", message: "Pending" })}
        ${renderHealthSummaryCard("Website Status", liveOps.websiteHealth || { status: "pending", message: "Pending" })}
        <div class="status-card">
          <div class="status-card__label">Server Features</div>
          <div class="status-card__value">${escapeHtml(snapshot.onesync || "Unknown")}</div>
          <div class="status-card__meta">${escapeHtml(snapshot.resources != null ? `${snapshot.resources} resources loaded` : "Resource count unavailable")}</div>
        </div>
        <div class="status-card">
          <div class="status-card__label">Last Refresh</div>
          <div class="status-card__value">${escapeHtml(formatServerTimestamp(snapshot.refreshedAt))}</div>
          <div class="status-card__meta">${escapeHtml(snapshot.source)}</div>
        </div>
      </div>
      ${apiErrorNote}
      ${liveOpsErrors}
      ${statusLink}
    </section>

    <div class="content-grid content-grid--sidebar">
      <section class="section">
        <div class="section__eyebrow">Live players</div>
        <h2>Online player list</h2>
        ${renderStatusPlayers(snapshot.players)}
      </section>

      <aside class="section section--stack">
        <div class="section__eyebrow">Live setup</div>
        <h2>Integration readiness</h2>
        <div class="stack-list stack-list--compact">
          <div class="stack-list__item"><span class="stack-list__index">01</span><span>Public player count and server details are fetched automatically.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">02</span><span>txAdmin hooks are ${snapshot.txAdminConfigured ? "configured" : "ready to be added"} in <code>server-config.js</code>.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">03</span><span>Live map feed is ${liveOps.liveMap?.configured ? "connected" : "ready to be connected"} for player positions.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">04</span><span>Restart and uptime panels are ${liveOps.uptime?.configured || liveOps.restart?.configured ? "reading endpoint data" : "waiting for your server endpoints"}.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">05</span><span>Website and server health cards are ${liveOps.serverHealth?.configured || liveOps.websiteHealth?.configured ? "wired to live checks" : "ready for heartbeat or status endpoints"}.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">06</span><span>Live map visibility is ${liveOps.liveMap?.requiresOptIn ? `set to opt-in only via ${liveOps.liveMap.settingLabel || "the in-game setting"}` : "currently not restricted by an opt-in setting"}.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">07</span><span>Discord operations are ${discordOps.configured ? "connected to live data" : "prepared for bot, guild, and support endpoints"}.</span></div>
          </div>
          <div class="status-note">
            <strong>Next step for your live setup:</strong> replace the values in <code>server-config.js</code> with your real Discord invite and the live endpoints you want the website to use.
          </div>
        </aside>
    </div>

    <section class="section">
      <div class="section__eyebrow">Live rankings</div>
      <h2>Leaderboard</h2>
      ${renderLiveLeaderboardSection(leaderboardMetric, liveOps.leaderboard || { configured: false, rows: [] }, snapshot.players)}
    </section>

    <div class="content-grid content-grid--sidebar">
      <section class="section">
        <div class="section__eyebrow">Department counts</div>
        <h2>Ops breakdown</h2>
        ${renderOpsCounts(liveOps.counts)}
      </section>

      <section class="section">
        <div class="section__eyebrow">Active events</div>
        <h2>Current city activity</h2>
        ${renderEventsList(liveOps.events)}
      </section>
    </div>

    <div class="content-grid content-grid--sidebar">
      <section class="section">
        <div class="section__eyebrow">History</div>
        <h2>Uptime and outages</h2>
        ${renderHistoryList(liveOps.history)}
      </section>

        <section class="section">
          <div class="section__eyebrow">Heatmap</div>
          <h2>Hottest zones</h2>
          ${renderHotZonesList(liveOps.hotZones)}
        </section>
      </div>

      <div class="content-grid content-grid--sidebar">
        <section class="section">
          <div class="section__eyebrow">Discord operations</div>
          <h2>Guild and bot snapshot</h2>
          ${renderDiscordOpsGrid(discordOps)}
        </section>

        <section class="section">
          <div class="section__eyebrow">Discord feed</div>
          <h2>Announcements and updates</h2>
          ${renderDiscordAnnouncements(discordOps)}
        </section>
      </div>

      <div class="content-grid content-grid--sidebar">
        <section class="section">
          <div class="section__eyebrow">Account linking</div>
          <h2>Discord connection readiness</h2>
          ${renderDiscordLinking(discordOps)}
        </section>

        <section class="section section--stack">
          <div class="section__eyebrow">What this unlocks</div>
          <h2>Website to Discord features</h2>
          <div class="stack-list stack-list--compact">
            <div class="stack-list__item"><span class="stack-list__index">01</span><span>Discord account linking for website profiles, tickets, and role-based access.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">02</span><span>Live bot status, guild activity, ticket counts, and announcement sync.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">03</span><span>Role rewards and whitelisting that instantly sync between Discord and the website.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">04</span><span>Staff dashboards for reports, support queues, punishments, and application review.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">05</span><span>Automated event announcements, restart alerts, and leaderboard highlight posts.</span></div>
          </div>
        </section>
      </div>
    `;
  }

function filterStatusPlayers(query) {
  const list = document.getElementById("statusPlayersList");
  if (!list) return;
  const normalisedQuery = normalize(query);
  Array.from(list.querySelectorAll("[data-player-name]")).forEach((item) => {
    const isVisible = !normalisedQuery || item.dataset.playerName.includes(normalisedQuery);
    item.classList.toggle("is-hidden", !isVisible);
  });
}

function bindLandingHomeControls() {
}

function bindStatusPageControls() {
  const refreshBtn = document.getElementById("statusRefreshBtn");
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      refreshServerStatus({ silent: false });
    };
  }

  const search = document.getElementById("statusPlayerSearch");
  if (search) {
    search.oninput = (event) => {
      filterStatusPlayers(event.target.value);
    };
  }
}

function scheduleServerStatusRefresh() {
  if (!getServerStatusRouteActive()) return;
  serverStatusPageState.timer = window.setTimeout(() => {
    refreshServerStatus({ silent: true });
  }, SERVER_CONFIG.statusRefreshMs);
}

async function refreshServerStatus(options = {}) {
  if (!getServerStatusRouteActive()) return;

  const mount = document.getElementById("serverStatusMount");
  if (!mount) return;

  if (!options.silent || !serverStatusPageState.lastSnapshot) {
    mount.innerHTML = renderServerStatusLoading();
  }

  clearServerStatusPageState();

  try {
    const snapshot = await loadServerSnapshot();
    if (!getServerStatusRouteActive()) return;
    serverStatusPageState.lastSnapshot = snapshot;
    mount.innerHTML = renderServerStatusContent(snapshot);
    bindStatusPageControls();
    scheduleServerStatusRefresh();
  } catch (error) {
    if (!getServerStatusRouteActive()) return;
    mount.innerHTML = renderServerStatusError(error?.message || "The server API did not respond.");
    bindStatusPageControls();
    scheduleServerStatusRefresh();
  }
}

function renderStatus() {
  clearServerStatusPageState();
  setView(renderServerStatusShell());
  bindStatusPageControls();
  window.requestAnimationFrame(() => {
    refreshServerStatus({ silent: false });
  });
}

function getWikiDataset() {
  const wiki = window.WIKI_DATA;
  if (!wiki || typeof wiki !== "object") {
    return { categories: [], pages: {} };
  }
  return wiki;
}

function findWikiCategoryForPage(categories, slug) {
  return categories.find((category) => Array.isArray(category.pages) && category.pages.includes(slug)) || null;
}

function getWikiPageOrder(categories) {
  return categories.flatMap((category) => Array.isArray(category.pages) ? category.pages : []);
}

function renderWikiSidebar(categories, pages, currentSlug, updatedAt) {
  const totalPages = Object.keys(pages).length;
  const groups = categories.map((category) => {
    const links = (category.pages || []).map((slug) => {
      const page = pages[slug];
      if (!page) return "";
      const isActive = slug === currentSlug ? " is-active" : "";
      const label = page.navLabel || page.title;
      return `<a class="wiki-nav__item${isActive}" href="#/wiki/${escapeHtml(slug)}">${escapeHtml(label)}</a>`;
    }).join("");

    return `
      <div class="wiki-nav__group">
        <div class="wiki-nav__title">
          <span>${escapeHtml(category.title)}</span>
          <span class="wiki-nav__count">${escapeHtml(String((category.pages || []).length))}</span>
        </div>
        <div class="wiki-nav__list">${links}</div>
      </div>
    `;
  }).join("");

  return `
    <aside class="section section--stack wiki-sidebar">
      <div class="wiki-sidebar__meta">
        <div class="section__eyebrow">Navigation</div>
        <h2>Wiki pages</h2>
        <p class="doc-p">Browse the full SGCNR handbook by role, activity, and system.</p>
        <div class="wiki-sidebar__stats">
          <div class="wiki-sidebar__stat">
            <span class="wiki-sidebar__statLabel">Pages</span>
            <span class="wiki-sidebar__statValue">${escapeHtml(String(totalPages))}</span>
          </div>
          <div class="wiki-sidebar__stat">
            <span class="wiki-sidebar__statLabel">Groups</span>
            <span class="wiki-sidebar__statValue">${escapeHtml(String(categories.length))}</span>
          </div>
          <div class="wiki-sidebar__stat">
            <span class="wiki-sidebar__statLabel">Updated</span>
            <span class="wiki-sidebar__statValue">${escapeHtml(updatedAt || "2026-04-01")}</span>
          </div>
        </div>
      </div>
      <div class="wiki-nav">${groups}</div>
    </aside>
  `;
}

function renderWikiPager(categories, pages, currentSlug) {
  const order = getWikiPageOrder(categories).filter((slug) => pages[slug]);
  const currentIndex = order.indexOf(currentSlug);
  if (currentIndex === -1) return "";

  const previousSlug = order[currentIndex - 1] || null;
  const nextSlug = order[currentIndex + 1] || null;
  if (!previousSlug && !nextSlug) return "";

  const renderLink = (slug, direction) => {
    if (!slug || !pages[slug]) return `<div class="wiki-pager__card wiki-pager__card--empty"></div>`;
    const page = pages[slug];
    const label = direction === "prev" ? "Previous page" : "Next page";
    return `
      <a class="wiki-pager__card" href="#/wiki/${escapeHtml(slug)}">
        <div class="wiki-pager__eyebrow">${escapeHtml(label)}</div>
        <div class="wiki-pager__title">${escapeHtml(page.navLabel || page.title)}</div>
        <div class="wiki-pager__text">${escapeHtml(page.eyebrow || "Wiki page")}</div>
      </a>
    `;
  };

  return `
    <section class="wiki-pager">
      ${renderLink(previousSlug, "prev")}
      ${renderLink(nextSlug, "next")}
    </section>
  `;
}

function renderWikiFacts(page) {
  const facts = Array.isArray(page?.facts) ? page.facts : [];
  if (!facts.length) return "";

  return `
    <div class="wiki-facts">
      ${facts.map(([label, value]) => `
        <div class="wiki-fact">
          <div class="wiki-fact__label">${escapeHtml(label)}</div>
          <div class="wiki-fact__value">${escapeHtml(value)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderWikiSections(sections) {
  const entries = Array.isArray(sections) ? sections : [];
  return entries.map((section) => {
    const paragraphs = (section.paragraphs || []).map((paragraph) => `<p class="doc-p">${escapeHtml(paragraph)}</p>`).join("");
    const bullets = Array.isArray(section.bullets) && section.bullets.length
      ? `<ul class="doc-list">${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "";

    return `
      <section class="wiki-sectionBlock">
        <h3 class="wiki-sectionBlock__title">${escapeHtml(section.title)}</h3>
        ${paragraphs}
        ${bullets}
      </section>
    `;
  }).join("");
}

function renderWikiOverviewCards(cards) {
  const items = Array.isArray(cards) ? cards : [];
  if (!items.length) return "";
  return `
    <section class="wiki-sectionBlock">
      <h3 class="wiki-sectionBlock__title">Guide overview</h3>
      <div class="wiki-grid">
        ${items.map((card) => `
          <article class="wiki-card">
            <div class="wiki-card__title">${escapeHtml(card.title)}</div>
            <div class="wiki-card__text">${escapeHtml(card.text)}</div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderWikiUpdates(items) {
  const entries = Array.isArray(items) ? items : [];
  if (!entries.length) return "";
  return `
    <section class="wiki-sectionBlock">
      <h3 class="wiki-sectionBlock__title">Current direction</h3>
      <div class="stack-list stack-list--compact">
        ${entries.map((item, index) => `
          <div class="stack-list__item">
            <span class="stack-list__index">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
            <span>${escapeHtml(item)}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderWiki(pageSlug) {
  const wiki = getWikiDataset();
  const categories = Array.isArray(wiki.categories) ? wiki.categories : [];
  const pages = wiki.pages && typeof wiki.pages === "object" ? wiki.pages : {};
  const requestedSlug = (pageSlug || "introduction").toString().toLowerCase();
  const currentSlug = pages[requestedSlug] ? requestedSlug : "introduction";
  const page = pages[currentSlug];

  if (!page) {
    setView(`
      <div class="wiki-shell">
        ${renderHeader("Wiki", [{ label: "Wiki" }])}
        <section class="section">
          <div class="empty">Wiki data is missing right now.</div>
        </section>
      </div>
    `);
    return;
  }

  const category = findWikiCategoryForPage(categories, currentSlug);
  const heading = page.navLabel || page.title;
  const sidebar = renderWikiSidebar(categories, pages, currentSlug, wiki.updatedAt);
  const facts = renderWikiFacts(page);
  const overview = renderWikiOverviewCards(page.overviewCards);
  const updates = renderWikiUpdates(page.updates);
  const content = renderWikiSections(page.sections);
  const pager = renderWikiPager(categories, pages, currentSlug);

  setView(`
    <div class="wiki-shell">
      ${renderHeader("Wiki", [{ label: "Wiki" }, { label: heading }])}
      <div class="wiki-layout">
        ${sidebar}
        <section class="section wiki-article">
          <div class="wiki-hero">
            <div class="wiki-intro__eyebrow">${escapeHtml(page.eyebrow || "Wiki page")}</div>
            <h2>${escapeHtml(page.title)}</h2>
            <p class="doc-p">${escapeHtml(page.summary || "")}</p>
            <div class="wiki-hero__meta">
              <span class="tag">${escapeHtml(category?.title || "Wiki")}</span>
              <span class="tag">Updated ${escapeHtml(wiki.updatedAt || "2026-04-01")}</span>
            </div>
          </div>
          ${facts}
          ${overview}
          ${content}
          ${updates}
          ${pager}
        </section>
      </div>
    </div>
  `);
}

function findSectionById(sectionId) {
  const data = getData();
  const sections = Array.isArray(data?.sections) ? data.sections : [];
  return sections.find(s => s?.id === sectionId) || null;
}

function findRule(sectionId, ruleId) {
  const section = findSectionById(sectionId);
  const rules = Array.isArray(section?.rules) ? section.rules : [];
  const rule = rules.find(r => r?.id === ruleId) || null;
  return { section, rule };
}

function contentBlockToHtml(block) {
  if (!block) return "";
  if (block.type === "paragraph") {
    return `<p class="doc-p">${escapeHtml(block.text)}</p>`;
  }
  if (block.type === "list") {
    const items = (block.items || []).map(i => `<li>${escapeHtml(i)}</li>`).join("");
    return `<ul class="doc-list">${items}</ul>`;
  }
  if (block.type === "table") {
    const cols = (block.columns || []).map(c => `<th>${escapeHtml(c)}</th>`).join("");
    const rows = (block.rows || [])
      .map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
      .join("");
    return `<div class="doc-table"><table><thead><tr>${cols}</tr></thead><tbody>${rows}</tbody></table></div>`;
  }
  return "";
}

function renderContentBlocks(section) {
  const blocks = Array.isArray(section?.content) ? section.content : [];
  if (!blocks.length) return "";
  const html = blocks.map(contentBlockToHtml).join("");
  return `<div class="section__content">${html}</div>`;
}

function renderRulesHub(sections) {
  const title = renderHeader("Rules", [{ label: "Rules" }]);
  const cards = sections
    .map(s => {
      const ruleCount = Array.isArray(s?.rules) ? s.rules.length : 0;
      const hint = ruleCount ? `${ruleCount} rules` : "Reference";
      return `
        <a class="card" href="#/section/${escapeHtml(s.id)}">
          <div class="card__title">${escapeHtml(s.title)}</div>
          <div class="card__meta">${escapeHtml(hint)}</div>
        </a>
      `;
    })
    .join("");

  setView(`
    <div>
      ${title}
      <div class="cards">${cards}</div>
      ${renderRulesDisclaimer()}
    </div>
  `);
}

function renderDefinitions() {
  const section = findSectionById("definitions");
  const title = renderHeader("Definitions", [{ label: "Definitions" }]);
  const body = section ? renderContentBlocks(section) : "";
  setView(`
    <div>
      ${title}
      <section class="section">${body}</section>
    </div>
  `);
}

function renderSection(sectionId) {
  const section = findSectionById(sectionId);
  if (!section) {
    setView(`<div>${renderHeader("Not found", [{ label: "Home", href: "#/" }, { label: "Not found" }])}</div>`);
    return;
  }

  const q = normalize(currentQuery);
  const rules = Array.isArray(section.rules) ? section.rules : [];
  const filtered = rules.filter(r => {
    if (!q) return true;
    const hay = normalize(`${r.id} ${r.title} ${r.body} ${r.explanation || ""} ${(r.tags || []).join(" ")} ${section.title}`);
    return hay.includes(q);
  });

  const title = renderHeader(section.title, [
    { label: "Rules", href: "#/rules" },
    { label: section.title }
  ]);

  const content = renderContentBlocks(section);
  const list = filtered
    .map(r => {
      return `
        <a class="rule-card" href="#/rule/${escapeHtml(section.id)}/${escapeHtml(r.id)}">
          <div class="rule-card__top">
            <span class="rule__id">${escapeHtml(r.id)}</span>
            <span class="rule-card__title">${escapeHtml(r.title)}</span>
          </div>
          <div class="rule-card__body">${escapeHtml(excerpt(r.body))}</div>
        </a>
      `;
    })
    .join("");

  setView(`
    <div>
      ${title}
      <section class="section">
        ${content}
        <div class="rule-list">${list}</div>
      </section>
      ${renderRulesDisclaimer()}
    </div>
  `);
}

function renderRule(sectionId, ruleId) {
  const { section, rule } = findRule(sectionId, ruleId);
  if (!section || !rule) {
    setView(`<div>${renderHeader("Not found", [{ label: "Home", href: "#/" }, { label: "Not found" }])}</div>`);
    return;
  }

  const title = renderHeader(rule.title, [
    { label: "Rules", href: "#/rules" },
    { label: section.title, href: `#/section/${escapeHtml(section.id)}` },
    { label: `${rule.id}` }
  ]);

  const exp = rule.explanation ? `<div class="rule__explanation">${escapeHtml(rule.explanation)}</div>` : "";
  const tags = renderTags(rule.tags || []);

  setView(`
    <div>
      ${title}
      <section class="section">
        <div class="rule-detail">
          <div class="rule-detail__pill"><span class="rule__id">${escapeHtml(rule.id)}</span></div>
          <div class="rule__body">${escapeHtml(rule.body)}</div>
          ${exp}
          ${tags}
        </div>
      </section>
      ${renderRulesDisclaimer()}
    </div>
  `);
}

function renderSearch(sections) {
  const q = normalize(currentQuery);
  if (!q) {
    route();
    return;
  }

  const results = [];
  let totalRules = 0;
  for (const section of sections) {
    const rules = Array.isArray(section?.rules) ? section.rules : [];
    totalRules += rules.length;
    for (const r of rules) {
      const hay = normalize(`${r.id} ${r.title} ${r.body} ${r.explanation || ""} ${(r.tags || []).join(" ")} ${section.title}`);
      if (hay.includes(q)) results.push({ section, rule: r });
    }
  }

  const title = renderHeader("Search", [
    { label: "Rules", href: "#/rules" },
    { label: "Search" }
  ]);

  const list = results
    .map(({ section, rule }) => {
      return `
        <a class="rule-card" href="#/rule/${escapeHtml(section.id)}/${escapeHtml(rule.id)}">
          <div class="rule-card__top">
            <span class="rule__id">${escapeHtml(rule.id)}</span>
            <span class="rule-card__title">${escapeHtml(rule.title)}</span>
          </div>
          <div class="rule-card__body">${escapeHtml(excerpt(rule.body))}</div>
          <div class="rule-card__section">${escapeHtml(section.title)}</div>
        </a>
      `;
    })
    .join("");

  setView(`
    <div>
      ${title}
      <section class="section">
        <div class="rule-list">${list || `<div class="empty">No results found.</div>`}</div>
      </section>
      ${renderRulesDisclaimer()}
    </div>
  `);

  meta.innerHTML = `Updated: <kbd>${getData().updatedAt}</kbd> &middot; Matches <kbd>${results.length}</kbd> / <kbd>${totalRules}</kbd> rules`;
}

function parseRoute() {
  const clean = getCurrentRoutePath();
  const parts = clean.split("/").filter(Boolean);
  if (!parts.length) return { name: "home" };

  if (parts[0] === "start") return { name: "start" };
  if (parts[0] === "rules") return { name: "rules" };
  if (parts[0] === "apply" || parts[0] === "applications") return { name: "apply" };
  if (parts[0] === "faq" || parts[0] === "help") return { name: "help" };
  if (parts[0] === "account") return { name: "account" };
  if (parts[0] === "admin") return { name: "admin" };
  if (parts[0] === "leaderboard") return { name: "live", metric: parts[1] || "kd" };
  if (parts[0] === "wiki") return { name: "wiki", wikiPage: parts[1] || "" };
  if (parts[0] === "map") return { name: "map" };
  if (parts[0] === "status") return { name: "live", metric: parts[1] || "kd" };
  if (parts[0] === "live") return { name: "live", metric: parts[1] || "kd" };
  if (parts[0] === "info") return { name: "info" };
  if (parts[0] === "definitions") return { name: "definitions" };
  if (parts[0] === "section" && parts[1]) return { name: "section", sectionId: parts[1] };
  if (parts[0] === "rule" && parts[1] && parts[2]) return { name: "rule", sectionId: parts[1], ruleId: parts[2] };

  return { name: "home" };
}

function updateDockActive(routeName) {
  const items = document.querySelectorAll(".dock__item");
  for (const el of items) {
    el.classList.remove("is-active");
  }

  let key = routeName;
  if (routeName === "section" || routeName === "rule") key = "rules";
  if (routeName === "status" || routeName === "leaderboard" || routeName === "live") key = "live";
  if (routeName === "discord" || routeName === "account") return;

  const active = document.querySelector(`.dock__item[data-dock="${key}"]`);
  if (active) active.classList.add("is-active");
}

function route() {
  const data = getData();
  const sections = Array.isArray(data?.sections) ? data.sections : [];

  const r = parseRoute();
  if (r.name !== "live") {
    clearServerStatusPageState();
  }
  if (r.name !== "map") {
    destroyCustomMap();
  }
  updateDockActive(r.name);

  const isStandardPage = !["home", "map", "wiki", "apply"].includes(r.name);
  document.body.classList.toggle("is-landing", r.name === "home");
  document.body.classList.toggle("is-map", r.name === "map");
  document.body.classList.toggle("is-wiki", r.name === "wiki");
  document.body.classList.toggle("is-standard", isStandardPage);
  document.body.classList.toggle("is-apply", r.name === "apply");

  const inRulesFlow = r.name === "rules" || r.name === "section" || r.name === "rule";
  setSearchVisible(inRulesFlow);

  if (inRulesFlow && normalize(currentQuery)) {
    renderSearch(sections);
    return;
  }

  if (r.name === "start") {
    renderStart();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
    return;
  }
  if (r.name === "apply") {
    renderApply();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> &middot; Apply`;
    return;
  }
  if (r.name === "help") {
    renderHelp();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
    return;
  }
  if (r.name === "account") {
    renderAccount();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> &middot; Account`;
    return;
  }
  if (r.name === "admin") {
    if (hasAdminAccess()) {
      renderAdminDashboard(getCurrentAccount());
      meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> &middot; ${escapeHtml(SERVER_CONFIG.adminPanelLabel || "Manager")} mode`;
    } else {
      setView(renderAdminLockedPage());
      meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> &middot; Restricted`;
    }
    return;
  }
  if (r.name === "wiki") {
    renderWiki(r.wikiPage);
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
    return;
  }
  if (r.name === "map") {
    renderMap();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
    return;
  }
  if (r.name === "live") {
    renderStatus();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> &middot; Live`;
    return;
  }
  if (r.name === "definitions") {
    renderDefinitions();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> &middot; Reference`;
    return;
  }
  if (r.name === "info") {
    renderInfo();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
    return;
  }

  if (r.name === "rules") {
    renderRulesHub(sections.filter(s => s.id !== "definitions"));
    const totalRules = sections.reduce(
      (acc, s) => acc + (Array.isArray(s?.rules) ? s.rules.length : 0),
      0
    );
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> &middot; <kbd>${totalRules}</kbd> rules`;
    return;
  }
  if (r.name === "section") {
    renderSection(r.sectionId);
    const section = findSectionById(r.sectionId);
    const total = Array.isArray(section?.rules) ? section.rules.length : 0;
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> &middot; <kbd>${total}</kbd> rules`;
    return;
  }
  if (r.name === "rule") {
    renderRule(r.sectionId, r.ruleId);
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
    return;
  }

  renderLandingHome();
  meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
}

function resizePointerFxCanvas() {
  if (!siteFxState?.canvasEl || !siteFxState?.ctx) return;

  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = window.innerWidth;
  const height = window.innerHeight;

  siteFxState.dpr = dpr;
  siteFxState.width = width;
  siteFxState.height = height;
  siteFxState.canvasEl.width = Math.round(width * dpr);
  siteFxState.canvasEl.height = Math.round(height * dpr);
  siteFxState.canvasEl.style.width = `${width}px`;
  siteFxState.canvasEl.style.height = `${height}px`;
  siteFxState.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createPointerRipple(x, y, options = {}) {
  if (!siteFxState) return;

  siteFxState.ripples.push({
    x,
    y,
    radius: options.radius ?? 14,
    velocity: options.velocity ?? 88,
    alpha: options.alpha ?? 0.22,
    decay: options.decay ?? 0.18,
    lineWidth: options.lineWidth ?? 1.6,
    softness: options.softness ?? 0.12,
    delay: options.delay ?? 0,
    tint: options.tint ?? "blue"
  });

  if (siteFxState.ripples.length > 28) {
    siteFxState.ripples.splice(0, siteFxState.ripples.length - 28);
  }
}

function spawnPointerBurst(x, y) {
  createPointerRipple(x, y, { radius: 16, velocity: 112, alpha: 0.34, lineWidth: 2.4, decay: 0.18, tint: "gold" });
  createPointerRipple(x, y, { radius: 34, velocity: 134, alpha: 0.22, lineWidth: 1.8, decay: 0.15, delay: 0.08, tint: "gold" });
  createPointerRipple(x, y, { radius: 58, velocity: 154, alpha: 0.14, lineWidth: 1.2, decay: 0.12, delay: 0.16, tint: "red" });
}

function drawPointerFxFrame(now) {
  if (!siteFxState?.ctx) return;

  const state = siteFxState;
  const ctx = state.ctx;
  const dt = Math.min(0.032, Math.max(0.001, (now - (state.lastFrameAt || now)) / 1000));
  state.lastFrameAt = now;

  const ease = 0.14;
  state.x += (state.targetX - state.x) * ease;
  state.y += (state.targetY - state.y) * ease;

  if (state.pointerVisible) {
    const timeSinceTrail = now - state.lastTrailAt;
    const dx = state.x - state.lastTrailX;
    const dy = state.y - state.lastTrailY;
    const distance = Math.hypot(dx, dy);

    if (distance > 30 || timeSinceTrail > 118) {
      createPointerRipple(state.x, state.y, {
        radius: 10,
        velocity: 78,
        alpha: 0.10,
        lineWidth: 1.1,
        decay: 0.18,
        tint: distance > 40 ? "red" : "gold"
      });
      state.lastTrailAt = now;
      state.lastTrailX = state.x;
      state.lastTrailY = state.y;
    }
  }

  ctx.clearRect(0, 0, state.width, state.height);
  ctx.save();
  ctx.globalCompositeOperation = "screen";

  if (state.pointerVisible) {
    const glow = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, 220);
    glow.addColorStop(0, "rgba(255,232,196,0.075)");
    glow.addColorStop(0.2, "rgba(214,166,91,0.06)");
    glow.addColorStop(0.46, "rgba(186,140,84,0.045)");
    glow.addColorStop(0.7, "rgba(160,82,68,0.028)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(state.x, state.y, 220, 0, Math.PI * 2);
    ctx.fill();
  }

  state.ripples = state.ripples.filter((ripple) => {
    if (ripple.delay > 0) {
      ripple.delay -= dt;
      return true;
    }

    ripple.radius += ripple.velocity * dt;
    ripple.alpha -= ripple.decay * dt;
    if (ripple.alpha <= 0.01) return false;

    const strokeAlpha = Math.max(0, ripple.alpha);
    const innerAlpha = Math.max(0, ripple.alpha * 0.48);
    const strokeColor = ripple.tint === "red"
      ? `rgba(226,118,102,${strokeAlpha.toFixed(3)})`
      : `rgba(218,164,96,${strokeAlpha.toFixed(3)})`;
    const innerColor = ripple.tint === "red"
      ? `rgba(255,185,165,${innerAlpha.toFixed(3)})`
      : `rgba(255,229,188,${innerAlpha.toFixed(3)})`;

    ctx.lineWidth = ripple.lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.shadowBlur = 18;
    ctx.shadowColor = strokeColor;
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = Math.max(0.8, ripple.lineWidth * 0.45);
    ctx.strokeStyle = innerColor;
    ctx.shadowBlur = 8;
    ctx.shadowColor = innerColor;
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius * 0.72, 0, Math.PI * 2);
    ctx.stroke();

    return true;
  });

  ctx.restore();

  state.rafId = 0;
  const keepAlive = state.pointerVisible || state.ripples.length > 0 || now < state.activeUntil;
  if (keepAlive) {
    schedulePointerFxFrame();
  }
}

function schedulePointerFxFrame() {
  if (!siteFxState || siteFxState.rafId) return;
  siteFxState.rafId = window.requestAnimationFrame(drawPointerFxFrame);
}

function initPointerFx() {
  if (siteFxState || !document.body) return;

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia?.("(pointer: coarse)");
  if (prefersReducedMotion?.matches || coarsePointer?.matches) {
    return;
  }

  const rootEl = document.createElement("div");
  rootEl.className = "site-fx";
  rootEl.setAttribute("aria-hidden", "true");
  rootEl.innerHTML = `
    <canvas class="site-fx__canvas"></canvas>
  `;
  document.body.appendChild(rootEl);
  document.body.classList.add("has-pointer-fx");

  const canvasEl = rootEl.querySelector(".site-fx__canvas");
  const ctx = canvasEl?.getContext("2d");
  if (!canvasEl || !ctx) {
    rootEl.remove();
    return;
  }

  const state = {
    rootEl,
    canvasEl,
    ctx,
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.32,
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.32,
    lastTrailX: window.innerWidth * 0.5,
    lastTrailY: window.innerHeight * 0.32,
    lastTrailAt: performance.now(),
    lastFrameAt: 0,
    activeUntil: performance.now() + 700,
    pointerVisible: false,
    ripples: [],
    rafId: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: 1
  };

  const handlePointerMove = (event) => {
    state.targetX = event.clientX;
    state.targetY = event.clientY;
    state.pointerVisible = true;
    state.activeUntil = performance.now() + 1400;
    schedulePointerFxFrame();
  };

  const handlePointerLeave = () => {
    state.pointerVisible = false;
    state.activeUntil = performance.now() + 560;
  };

  const handlePointerOut = (event) => {
    if (!event.relatedTarget) {
      handlePointerLeave();
    }
  };

  const handlePointerDown = (event) => {
    if (typeof event.clientX !== "number" || typeof event.clientY !== "number") return;
    state.targetX = event.clientX;
    state.targetY = event.clientY;
    state.pointerVisible = true;
    state.activeUntil = performance.now() + 1900;
    schedulePointerFxFrame();
    spawnPointerBurst(event.clientX, event.clientY);
  };

  const handleResize = () => {
    resizePointerFxCanvas();
    schedulePointerFxFrame();
  };

  document.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.addEventListener("pointerdown", handlePointerDown, { passive: true });
  document.addEventListener("pointerout", handlePointerOut, { passive: true });
  window.addEventListener("blur", handlePointerLeave);
  window.addEventListener("resize", handleResize, { passive: true });

  siteFxState = state;
  resizePointerFxCanvas();
  createPointerRipple(state.x, state.y, { radius: 18, velocity: 74, alpha: 0.08, lineWidth: 1, decay: 0.16 });
  schedulePointerFxFrame();
}

function init() {
  const data = window.RULES_DATA;
  if (!data || !data.sections) {
    meta.textContent = "Rules data missing. Check rules.js";
    return;
  }

  initAuth();
  initPointerFx();
  startLocalClock();
  const legacyHashPath = location.hash && location.hash.startsWith("#/")
    ? normalizeRouteTarget(location.hash)
    : "";
  if (legacyHashPath) {
    history.replaceState({}, "", legacyHashPath);
  } else if ((location.pathname || "") === "/index.html") {
    history.replaceState({}, "", "/");
  }
  rewriteInternalLinks(document);
  route();
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentQuery = e.target.value;
    route();
  });
}

document.addEventListener("click", (e) => {
  const link = e.target && typeof e.target.closest === "function"
    ? e.target.closest("a[href]")
    : null;

  if (!link) return;
  if (link.target === "_blank" || link.hasAttribute("download")) return;

  const href = link.getAttribute("href") || "";
  if (!href) return;

  if (/^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return;
  }

  if (href.startsWith("/auth/") || href.startsWith("/api/")) {
    return;
  }

  if (href.startsWith("#/")) {
    e.preventDefault();
    navigateTo(href);
    return;
  }

  if (href.startsWith("/")) {
    e.preventDefault();
    navigateTo(href);
  }
});

document.addEventListener("click", (event) => {
  const actionButton = event.target && typeof event.target.closest === "function"
    ? event.target.closest("[data-account-action]")
    : null;

  if (actionButton) {
    event.preventDefault();
    const action = actionButton.dataset.accountAction || "";

    if (action === "close") {
      closeAccountUi();
      return;
    }

    if (action === "menu") {
      accountUiState.menuOpen = true;
      accountUiState.panel = "";
      renderAccountUi();
      return;
    }

    if (action === "profile" || action === "settings" || action === "services") {
      openAccountPanel(action);
      return;
    }

    if (action === "admin") {
      closeAccountUi();
      navigateTo("/admin");
      return;
    }

    if (action === "logout") {
      performLogout();
      return;
    }
  }

  const clickedInsideUi = event.target && typeof event.target.closest === "function"
    ? event.target.closest(".account-menu, .account-sheet, #accountBtn")
    : null;

  if (!clickedInsideUi && (accountUiState.menuOpen || accountUiState.panel)) {
    closeAccountUi();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target && typeof event.target.closest === "function"
    ? event.target.closest("[data-account-sheet-form]")
    : null;
  if (!form) return;

  event.preventDefault();
  const account = getCurrentAccount();
  if (!account) {
    closeAccountUi();
    openAuthModal("login");
    return;
  }

  const mode = form.dataset.accountSheetForm || "";
  const values = Object.fromEntries(new FormData(form).entries());

  try {
    if (mode === "profile") {
      saveAccountProfileChanges(account, values);
      setAccountUiFeedback("profile", "success", "Profile updated.");
    } else if (mode === "settings") {
      saveAccountSettingsChanges(account, values);
      setAccountUiFeedback("settings", "success", "Settings updated.");
    }
    renderAccountUi();
  } catch (error) {
    setAccountUiFeedback(mode, "error", error?.message || "That change could not be saved right now.");
    renderAccountUi();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && (accountUiState.menuOpen || accountUiState.panel)) {
    closeAccountUi();
  }
});

window.addEventListener("popstate", () => {
  closeAuthModal();
  closeAccountUi();
  route();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  const contentEl = document.querySelector(".content");
  if (contentEl) {
    contentEl.scrollTop = 0;
  }
});

window.addEventListener("hashchange", () => {
  if (location.hash && location.hash.startsWith("#/")) {
    navigateTo(location.hash, { replace: true, scroll: "auto" });
  }
});

init();
