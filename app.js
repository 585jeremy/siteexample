const rulesRoot = document.getElementById("rules");
const meta = document.getElementById("meta");
const searchWrap = document.getElementById("searchWrap");
const searchInput = document.getElementById("searchInput");
const localTimeEl = document.getElementById("localTime");
const authArea = document.getElementById("authArea");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");

const AUTH_ACCOUNTS_KEY = "sgcnr_demo_accounts_v1";
const AUTH_SESSION_KEY = "sgcnr_demo_session_v1";
const STORE_CART_KEY = "sgcnr_store_cart_v1";
const DEFAULT_SERVER_CONFIG = {
  name: "SGCNR",
  joinCode: "pbe6gy",
  joinUrl: "",
  discordUrl: "https://discord.gg/Y8HNFPtxkE",
  statusRefreshMs: 60000,
  maxPlayerPreview: 12,
  region: "EU",
  txAdminStatusUrl: "",
  txAdminPlayersUrl: "",
  liveOpsUrl: "",
  livePlayerMapUrl: "",
  uptimeStatusUrl: "",
  restartInfoUrl: "",
  serverHealthUrl: "",
  websiteHealthUrl: "",
  publicStatusUrl: "",
  nextRestartLabel: "Scheduled restart",
  websiteName: "SGCNR Portal"
};
const SERVER_CONFIG = {
  ...DEFAULT_SERVER_CONFIG,
  ...(window.SGCNR_SERVER_CONFIG || {})
};
const DISCORD_INVITE_URL = SERVER_CONFIG.discordUrl;
const SERVER_JOIN_CODE = SERVER_CONFIG.joinCode;
const SERVER_JOIN_URL = SERVER_CONFIG.joinUrl || `https://cfx.re/join/${SERVER_JOIN_CODE}`;
const SERVER_SINGLE_API_URL = SERVER_JOIN_CODE
  ? `https://servers-frontend.fivem.net/api/servers/single/${SERVER_JOIN_CODE}`
  : "";
const SITE_ASSET_VERSION = "20260402b";
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

function setView(html) {
  const existing = rulesRoot.firstElementChild;
  if (existing && existing.classList.contains("view")) {
    existing.classList.remove("view--in");
    existing.classList.add("view--out");
    window.setTimeout(() => {
      rulesRoot.innerHTML = html;
      const el = rulesRoot.firstElementChild;
      if (el) {
        el.classList.add("view");
        requestAnimationFrame(() => el.classList.add("view--in"));
      }
    }, 220);
    return;
  }

  rulesRoot.innerHTML = html;
  const el = rulesRoot.firstElementChild;
  if (el) {
    el.classList.add("view");
    requestAnimationFrame(() => el.classList.add("view--in"));
  }
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

function renderHeader(title, breadcrumbItems) {
  const bc = breadcrumbItems?.length ? buildBreadcrumb(breadcrumbItems) : "";
  return `
    <div class="page-hero">
      ${bc}
      <div class="page-hero__row">
        <h1 class="page-title">${escapeHtml(title)}</h1>
        <div class="page-hero__badge">SGCNR Portal</div>
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
    return parsed;
  } catch {
    return {};
  }
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

function promptForCredentials(title) {
  const username = (window.prompt(`${title}\n\nUsername:`) || "").trim();
  if (!username) return null;
  const password = window.prompt(`${title}\n\nPassword:`) || "";
  if (!password) return null;
  return { username, password };
}

function updateAuthUi() {
  const session = getSession();
  const isIn = !!session;
  if (loginBtn) loginBtn.style.display = isIn ? "none" : "inline-flex";
  if (registerBtn) registerBtn.style.display = isIn ? "none" : "inline-flex";
  if (logoutBtn) logoutBtn.style.display = isIn ? "inline-flex" : "none";
  if (authArea) authArea.title = isIn ? `Signed in as ${session.username}` : "Account";
}

function initAuth() {
  updateAuthUi();

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const creds = promptForCredentials("Login");
      if (!creds) return;
      const accounts = readAccounts();
      if (!accounts[creds.username] || accounts[creds.username] !== creds.password) {
        window.alert("Invalid username or password.");
        return;
      }
      setSession(creds.username);
      updateAuthUi();
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      const creds = promptForCredentials("Register");
      if (!creds) return;
      const accounts = readAccounts();
      if (accounts[creds.username]) {
        window.alert("Username already exists.");
        return;
      }
      accounts[creds.username] = creds.password;
      writeAccounts(accounts);
      setSession(creds.username);
      updateAuthUi();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      updateAuthUi();
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
              <a class="auth__btn auth__btn--primary" href="${escapeHtml(SERVER_JOIN_URL)}" target="_blank" rel="noopener noreferrer">Join Server</a>
              <a class="auth__btn" href="${escapeHtml(DISCORD_INVITE_URL)}" target="_blank" rel="noopener noreferrer">Open Discord</a>
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
  const joinLinkLabel = "Coming soon";
  const discordLabel = escapeHtml(DISCORD_INVITE_URL.replace(/^https?:\/\//, ""));
  const regionLabel = escapeHtml(SERVER_CONFIG.region || "EU");

  setView(`
    <div class="landing-reboot">
      <div class="landing-reboot__noise" aria-hidden="true"></div>
      <div class="landing-reboot__glow landing-reboot__glow--blue" aria-hidden="true"></div>
      <div class="landing-reboot__glow landing-reboot__glow--red" aria-hidden="true"></div>

      <section class="landing-reboot__hero" aria-label="Welcome">
        <div class="landing-reboot__lead">
          <div class="landing-reboot__header">
            <div class="landing-reboot__intro">
              <div class="landing-reboot__kicker">Official Server Portal</div>
              <div class="landing-reboot__line" aria-hidden="true"></div>
              <h1 class="landing-reboot__title">Step into SGCNR.</h1>
              <p class="landing-reboot__text">Fast entry for joining the server, opening Discord, and getting to the core city tools without wasting space.</p>
            </div>

            <div class="landing-reboot__stack">
              <div class="landing-reboot__stackCard landing-reboot__stackCard--blue">
                <div class="landing-reboot__stackLabel">Mode</div>
                <div class="landing-reboot__stackValue">FiveM CnR</div>
              </div>
              <div class="landing-reboot__stackCard landing-reboot__stackCard--red">
                <div class="landing-reboot__stackLabel">City</div>
                <div class="landing-reboot__stackValue">Los Santos</div>
              </div>
              <div class="landing-reboot__stackCard">
                <div class="landing-reboot__stackLabel">Region</div>
                <div class="landing-reboot__stackValue">${regionLabel}</div>
              </div>
            </div>
          </div>

          <div class="landing-reboot__actions">
            <a class="landing-reboot__action landing-reboot__action--primary" href="${escapeHtml(SERVER_JOIN_URL)}" target="_blank" rel="noopener noreferrer">Join Server</a>
            <button class="landing-reboot__action" id="homeCopyJoinBtn" type="button">Copy Join Link</button>
            <a class="landing-reboot__action" href="${escapeHtml(DISCORD_INVITE_URL)}" target="_blank" rel="noopener noreferrer">Open Discord</a>
          </div>

          <div class="landing-reboot__miniGrid">
            <div class="landing-reboot__miniCard">
              <div class="landing-reboot__miniLabel">Portal</div>
              <div class="landing-reboot__miniTitle">Rules, map, status</div>
              <div class="landing-reboot__miniText">Everything important stays one click away in the floating bar.</div>
            </div>

            <div class="landing-reboot__miniCard">
              <div class="landing-reboot__miniLabel">Access</div>
              <div class="landing-reboot__miniTitle">Quick join flow</div>
              <div class="landing-reboot__miniText">Join fast, copy the link, or move straight into community support.</div>
            </div>

            <div class="landing-reboot__miniCard">
              <div class="landing-reboot__miniLabel">Community</div>
              <div class="landing-reboot__miniTitle">Discord ready</div>
              <div class="landing-reboot__miniText">Tickets, updates, announcements, and staff access live in one place.</div>
            </div>
          </div>
        </div>

        <aside class="landing-reboot__info">
          <div class="landing-reboot__card landing-reboot__card--link">
            <div class="landing-reboot__label">Direct Link</div>
            <div class="landing-reboot__value landing-reboot__value--small">${joinLinkLabel}</div>
          </div>

          <div class="landing-reboot__card landing-reboot__card--community">
            <div class="landing-reboot__label">Community</div>
            <div class="landing-reboot__value landing-reboot__value--small">${discordLabel}</div>
          </div>
        </aside>
      </section>

      <section class="landing-reboot__rail" aria-label="Portal shortcuts">
        <a class="landing-reboot__railCard" href="#/rules">
          <div class="landing-reboot__railLabel">Rules</div>
          <div class="landing-reboot__railTitle">Server standards</div>
          <div class="landing-reboot__railText">Core behavior, combat rules, zone rules, and staff guidance.</div>
        </a>

        <a class="landing-reboot__railCard" href="#/map">
          <div class="landing-reboot__railLabel">Map</div>
          <div class="landing-reboot__railTitle">City services</div>
          <div class="landing-reboot__railText">Los Santos service map with police, medical, and utility locations.</div>
        </a>

        <a class="landing-reboot__railCard" href="#/status">
          <div class="landing-reboot__railLabel">Status</div>
          <div class="landing-reboot__railTitle">Live server page</div>
          <div class="landing-reboot__railText">Connection state, live player info, and server-side status details.</div>
        </a>

        <a class="landing-reboot__railCard" href="#/wiki">
          <div class="landing-reboot__railLabel">Wiki</div>
          <div class="landing-reboot__railTitle">Player handbook</div>
          <div class="landing-reboot__railText">Jobs, mechanics, robberies, systems, and getting-started guidance.</div>
        </a>
      </section>
    </div>
  `);

  bindLandingHomeControls();
}

function renderStart() {
  setView(`
    <div>
      ${renderHeader("Start Here", [{ label: "Start" }])}
      <div class="content-grid content-grid--sidebar">
        <section class="section section--hero">
          <div class="section__eyebrow">New player entry</div>
          <h2>How to join</h2>
          <div class="doc-p">
            Open FiveM, search for <strong>SGCNR</strong> and connect.
            You can also use the direct join link:
            <a class="info-link" href="${escapeHtml(SERVER_JOIN_URL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(`cfx.re/join/${SERVER_JOIN_CODE}`)}</a>
          </div>
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-card__label">Server</div>
              <div class="feature-card__value">FiveM Ready</div>
            </div>
            <div class="feature-card">
              <div class="feature-card__label">Access</div>
              <div class="feature-card__value">Quick Join</div>
            </div>
            <div class="feature-card">
              <div class="feature-card__label">Support</div>
              <div class="feature-card__value">Discord Tickets</div>
            </div>
          </div>
        </section>

        <aside class="section section--stack">
          <div class="section__eyebrow">Useful links</div>
          <h2>Quick links</h2>
          <div class="info-links">
            <a class="info-link" href="#/rules">Rules</a>
            <a class="info-link" href="#/commands">Commands</a>
            <a class="info-link" href="#/help">Help</a>
            <a class="info-link" href="#/status">Server Status</a>
            <a class="info-link" href="${escapeHtml(DISCORD_INVITE_URL)}" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </aside>
      </div>

      <section class="section section--timeline">
        <div class="section__eyebrow">Essentials</div>
        <h2>New player checklist</h2>
        <div class="stack-list">
          <div class="stack-list__item"><span class="stack-list__index">01</span><span>Read the Rules and follow the category that applies to what you're doing.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">02</span><span>Check Help for common questions and support.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">03</span><span>Join Discord to open tickets and get announcements.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">04</span><span>Be respectful and keep it fair — staff decisions are based on evidence.</span></div>
        </div>
      </section>
    </div>
  `);
}

function renderCommands() {
  setView(`
    <div>
      ${renderHeader("Commands & Keybinds", [{ label: "Commands" }])}
      <div class="content-grid content-grid--sidebar">
        <section class="section section--hero">
          <div class="section__eyebrow">Most used</div>
          <h2>Common commands</h2>
          <div class="doc-table">
            <table>
              <thead>
                <tr>
                  <th>Command</th>
                  <th>What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>/help</code></td>
                  <td>Shows the most common help / basic info.</td>
                </tr>
                <tr>
                  <td><code>/discord</code></td>
                  <td>Shows the Discord link or server info.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <aside class="section section--stack">
          <div class="section__eyebrow">Quick reference</div>
          <h2>Starter tips</h2>
          <div class="feature-grid feature-grid--compact">
            <div class="feature-card">
              <div class="feature-card__label">Starter Tip</div>
              <div class="feature-card__value">Learn F1 & T first</div>
            </div>
            <div class="feature-card">
              <div class="feature-card__label">Navigation</div>
                <div class="feature-card__value">Use map + Help</div>
            </div>
          </div>
        </aside>
      </div>

      <section class="section section--timeline">
        <div class="section__eyebrow">Control guide</div>
        <h2>Keybinds (examples)</h2>
        <div class="stack-list">
          <div class="stack-list__item"><span class="stack-list__index">F1</span><span>Main menu (if your framework uses it)</span></div>
          <div class="stack-list__item"><span class="stack-list__index">F2</span><span>Phone (if enabled)</span></div>
          <div class="stack-list__item"><span class="stack-list__index">M</span><span>Map</span></div>
          <div class="stack-list__item"><span class="stack-list__index">T</span><span>Chat</span></div>
        </div>
      </section>
    </div>
  `);
}

function renderHelp() {
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
              <div class="info-faq__a">Join Discord and open a ticket. Include video/screenshot evidence when possible.</div>
            </div>
            <div class="info-faq__item">
              <div class="info-faq__q">How do I appeal a punishment?</div>
              <div class="info-faq__a">Use Discord tickets. Provide context, your ID, and any evidence.</div>
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
            <div class="stack-list__item"><span class="stack-list__index">01</span><span>Open a Discord ticket.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">02</span><span>Include your ID and screenshots.</span></div>
            <div class="stack-list__item"><span class="stack-list__index">03</span><span>Explain the issue clearly.</span></div>
          </div>
        </aside>
      </div>
    </div>
  `);
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
  const sprite = MAPGENIE_MARKER_SPRITES[type];
  if (sprite) {
    return `<span class="service-map__sprite service-map__sprite--${escapeHtml(type)}" aria-hidden="true"></span>`;
  }

  return `
    <span class="service-marker__pin service-marker__pin--${escapeHtml(type)}">
      <span class="service-marker__halo"></span>
      <span class="service-marker__core"></span>
      <span class="service-marker__icon" aria-hidden="true">${getMapTypeIcon(type)}</span>
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
                <div class="service-map is-loading" id="serviceMap" aria-label="Satellite-only Los Santos services map" style="height:calc(100svh - 136px); min-height:620px;"></div>
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

    return `
      <div class="map-detail__eyebrow">Overview</div>
      <div class="map-detail__title">Los Santos Service Map</div>
      <div class="map-detail__meta">Satellite only / ${policeCount} police / ${hospitalCount} hospitals / ${fireCount} fire stations / ${carWashCount} car washes</div>
      <div class="map-detail__body">Markers on this page are pulled from the Services layer on gta-5-map.com, with Lester's House kept as a separate custom point. Live player overlays are ${liveFeedReady ? "ready to read your server feed." : "ready once you connect a live player endpoint."}</div>
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
  const livePlayerCount = customMapState?.liveData?.players?.length ?? 0;
  const liveUpdatedAt = customMapState?.liveData?.updatedAt ? formatServerTimestamp(customMapState.liveData.updatedAt) : "Pending";
  const liveCard = `
    <div class="map-stage-card">
      <div class="map-stage-card__eyebrow">Live tracking</div>
      <div class="map-stage-card__title">${liveConfigured ? `${livePlayerCount} tracked players` : "Endpoint ready"}</div>
      <div class="map-stage-card__body">${liveConfigured ? `Map overlay feed checked ${liveUpdatedAt}. Player dots will appear here as soon as your live endpoint starts returning coordinates.` : "Add a live map endpoint in server-config.js to show player positions directly on the Los Santos map."}</div>
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
  return parseRoute().name === "status";
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

function normaliseLiveMapPlayers(payload) {
  const playerSource = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.players)
      ? payload.players
      : Array.isArray(payload?.items)
        ? payload.items
        : [];

  const players = playerSource.map((player, index) => {
    const mapX = toFiniteNumber(pickFirstDefined(player, ["mapX", "xPercent", "percentX"]));
    const mapY = toFiniteNumber(pickFirstDefined(player, ["mapY", "yPercent", "percentY"]));
    const lat = toFiniteNumber(pickFirstDefined(player, ["lat", "latitude"]));
    const lng = toFiniteNumber(pickFirstDefined(player, ["lng", "lon", "longitude"]));
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
      position
    };
  }).filter(Boolean);

  return {
    configured: Boolean(payload),
    updatedAt: parseSnapshotDate(pickFirstDefined(payload, ["updatedAt", "timestamp", "refreshedAt"])),
    players
  };
}

async function loadLiveOpsSnapshot() {
  const [
    combinedResult,
    liveMapResult,
    uptimeResult,
    restartResult,
    serverHealthResult,
    websiteHealthResult
  ] = await Promise.all([
    fetchOptionalServerJson(SERVER_CONFIG.liveOpsUrl),
    fetchOptionalServerJson(SERVER_CONFIG.livePlayerMapUrl),
    fetchOptionalServerJson(SERVER_CONFIG.uptimeStatusUrl),
    fetchOptionalServerJson(SERVER_CONFIG.restartInfoUrl),
    fetchOptionalServerJson(SERVER_CONFIG.serverHealthUrl),
    fetchOptionalServerJson(SERVER_CONFIG.websiteHealthUrl)
  ]);

  const combined = combinedResult.data && typeof combinedResult.data === "object" ? combinedResult.data : {};
  const liveMap = normaliseLiveMapPlayers(combined.liveMap || combined.map || liveMapResult.data);
  const uptime = normaliseUptimePayload(combined.uptime || combined.runtime || uptimeResult.data);
  const restart = normaliseRestartPayload(combined.restart || combined.restartInfo || restartResult.data);
  const serverHealth = normaliseHealthPayload(combined.serverHealth || combined.server || serverHealthResult.data, "Game Server");
  const websiteHealth = normaliseHealthPayload(combined.websiteHealth || combined.website || websiteHealthResult.data, SERVER_CONFIG.websiteName || "Website");

  liveMap.configured = Boolean(liveMap.configured || combined.liveMap || combined.map || combinedResult.configured || liveMapResult.configured);
  uptime.configured = Boolean(uptime.configured || combined.uptime || combined.runtime || combinedResult.configured || uptimeResult.configured);
  restart.configured = Boolean(restart.configured || combined.restart || combined.restartInfo || combinedResult.configured || restartResult.configured);
  serverHealth.configured = Boolean(serverHealth.configured || combined.serverHealth || combined.server || combinedResult.configured || serverHealthResult.configured);
  websiteHealth.configured = Boolean(websiteHealth.configured || combined.websiteHealth || combined.website || combinedResult.configured || websiteHealthResult.configured);

  return {
    configured: Boolean(
      SERVER_CONFIG.liveOpsUrl ||
      SERVER_CONFIG.livePlayerMapUrl ||
      SERVER_CONFIG.uptimeStatusUrl ||
      SERVER_CONFIG.restartInfoUrl ||
      SERVER_CONFIG.serverHealthUrl ||
      SERVER_CONFIG.websiteHealthUrl
    ),
    source: SERVER_CONFIG.liveOpsUrl ? "Custom live ops API" : "Per-feature endpoints",
    publicStatusUrl: SERVER_CONFIG.publicStatusUrl || pickFirstDefined(combined, ["publicStatusUrl", "statusPageUrl", "statusUrl"]) || "",
    liveMap,
    uptime,
    restart,
    serverHealth,
    websiteHealth,
    errors: [
      combinedResult.error && `Live ops: ${combinedResult.error}`,
      liveMapResult.error && `Live map: ${liveMapResult.error}`,
      uptimeResult.error && `Uptime: ${uptimeResult.error}`,
      restartResult.error && `Restart: ${restartResult.error}`,
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
      description: "Server join code is not configured yet.",
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
      apiError: "Server join code is not configured yet.",
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
      ${renderHeader("Server Status", [{ label: "Server Status" }])}
      <section class="section status-live status-live--hero">
        <div class="status-live__head">
          <div class="status-live__copy">
            <div class="section__eyebrow">Live server hub</div>
            <h2>${escapeHtml(SERVER_CONFIG.name)}</h2>
            <p class="status-live__text">Track player count, uptime, restarts, live map readiness, and health checks from one page. This status panel is prepared for your real bought server setup.</p>
          </div>
          <div class="status-live__actions">
            <a class="auth__btn auth__btn--primary" href="${escapeHtml(SERVER_JOIN_URL)}" target="_blank" rel="noopener noreferrer">Join Server</a>
            <button class="auth__btn" id="statusCopyJoinBtn" type="button">Copy Join Link</button>
            <button class="auth__btn" id="statusRefreshBtn" type="button">Refresh</button>
          </div>
        </div>
        <div class="status-live__highlights">
          <div class="status-live__highlight">
            <div class="status-live__label">Join Code</div>
            <div class="status-live__value">${escapeHtml(SERVER_JOIN_CODE || "Not set")}</div>
          </div>
          <div class="status-live__highlight">
            <div class="status-live__label">Auto Refresh</div>
            <div class="status-live__value">${escapeHtml(formatRefreshInterval(SERVER_CONFIG.statusRefreshMs))}</div>
          </div>
          <div class="status-live__highlight">
            <div class="status-live__label">Live Source</div>
            <div class="status-live__value">FiveM API</div>
          </div>
          <div class="status-live__highlight">
            <div class="status-live__label">Live Ops</div>
            <div class="status-live__value">${SERVER_CONFIG.liveOpsUrl || SERVER_CONFIG.livePlayerMapUrl || SERVER_CONFIG.uptimeStatusUrl || SERVER_CONFIG.restartInfoUrl || SERVER_CONFIG.serverHealthUrl || SERVER_CONFIG.websiteHealthUrl ? "Connected" : "Ready"}</div>
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
          <strong>Ready for live setup:</strong> edit <code>server-config.js</code> if your bought server uses a different join code, Discord invite, or txAdmin endpoints.
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

function renderServerStatusContent(snapshot) {
  const onlineLabel = snapshot.online ? "Online" : "Offline";
  const playerValue = snapshot.maxClients
    ? `${snapshot.clients}/${snapshot.maxClients}`
    : `${snapshot.clients}`;
  const liveOps = snapshot.liveOps || {};
  const uptimeValue = liveOps.uptime?.uptimeSeconds != null
    ? formatDurationCompact(liveOps.uptime.uptimeSeconds)
    : "Pending";
  const restartValue = liveOps.restart?.nextRestartAt
    ? formatRestartCountdown(liveOps.restart.nextRestartAt)
    : "Pending";
  const liveMapCount = liveOps.liveMap?.players?.length ?? 0;
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
          <div class="status-card__label">Join Code</div>
          <div class="status-card__value">${escapeHtml(snapshot.joinCode || "Not set")}</div>
          <div class="status-card__meta">Direct cfx.re connection</div>
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
          <div class="status-card__meta">${escapeHtml(liveOps.liveMap?.configured ? "Tracked players ready for map overlay" : "Add a live player map endpoint")}</div>
        </div>
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
          <div class="stack-list__item"><span class="stack-list__index">01</span><span>FiveM join code is wired into the website config.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">02</span><span>Public player count and server details are fetched automatically.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">03</span><span>txAdmin hooks are ${snapshot.txAdminConfigured ? "configured" : "ready to be added"} in <code>server-config.js</code>.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">04</span><span>Live map feed is ${liveOps.liveMap?.configured ? "connected" : "ready to be connected"} for player positions.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">05</span><span>Restart and uptime panels are ${liveOps.uptime?.configured || liveOps.restart?.configured ? "reading endpoint data" : "waiting for your server endpoints"}.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">06</span><span>Website and server health cards are ${liveOps.serverHealth?.configured || liveOps.websiteHealth?.configured ? "wired to live checks" : "ready for heartbeat or status endpoints"}.</span></div>
        </div>
        <div class="status-note">
          <strong>Next step for your bought server:</strong> replace the values in <code>server-config.js</code> with your real join code, Discord invite, and the live endpoints you want the website to use.
        </div>
      </aside>
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

function copyServerJoinLink() {
  const value = SERVER_JOIN_URL;
  if (!value) return;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value).catch(() => {
      window.prompt("Copy the join link:", value);
    });
    return;
  }

  window.prompt("Copy the join link:", value);
}

function bindLandingHomeControls() {
  const copyBtn = document.getElementById("homeCopyJoinBtn");
  if (copyBtn) {
    copyBtn.onclick = () => copyServerJoinLink();
  }
}

function bindStatusPageControls() {
  const copyBtn = document.getElementById("statusCopyJoinBtn");
  if (copyBtn) {
    copyBtn.onclick = () => copyServerJoinLink();
  }

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

  meta.innerHTML = `Updated: <kbd>${getData().updatedAt}</kbd> · Matches <kbd>${results.length}</kbd> / <kbd>${totalRules}</kbd> rules`;
}

function parseRoute() {
  const raw = (location.hash || "#/ ").replace(/^#/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const clean = path.replace(/\/+/, "/");
  const parts = clean.split("/").filter(Boolean);
  if (!parts.length) return { name: "home" };

  if (parts[0] === "start") return { name: "start" };
  if (parts[0] === "rules") return { name: "rules" };
  if (parts[0] === "commands") return { name: "commands" };
  if (parts[0] === "faq" || parts[0] === "help") return { name: "help" };
  if (parts[0] === "wiki") return { name: "wiki", wikiPage: parts[1] || "" };
  if (parts[0] === "map") return { name: "map" };
  if (parts[0] === "status") return { name: "status" };
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
  if (routeName === "discord") return;

  const active = document.querySelector(`.dock__item[data-dock="${key}"]`);
  if (active) active.classList.add("is-active");
}

function route() {
  const data = getData();
  const sections = Array.isArray(data?.sections) ? data.sections : [];

  const r = parseRoute();
  if (r.name !== "status") {
    clearServerStatusPageState();
  }
  if (r.name !== "map") {
    destroyCustomMap();
  }
  updateDockActive(r.name);

  const isStandardPage = !["home", "map", "wiki"].includes(r.name);
  document.body.classList.toggle("is-landing", r.name === "home");
  document.body.classList.toggle("is-map", r.name === "map");
  document.body.classList.toggle("is-wiki", r.name === "wiki");
  document.body.classList.toggle("is-standard", isStandardPage);

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
  if (r.name === "commands") {
    renderCommands();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
    return;
  }
  if (r.name === "help") {
    renderHelp();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
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
  if (r.name === "status") {
    renderStatus();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
    return;
  }
  if (r.name === "definitions") {
    renderDefinitions();
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> · Reference`;
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
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> · <kbd>${totalRules}</kbd> rules`;
    return;
  }
  if (r.name === "section") {
    renderSection(r.sectionId);
    const section = findSectionById(r.sectionId);
    const total = Array.isArray(section?.rules) ? section.rules.length : 0;
    meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd> · <kbd>${total}</kbd> rules`;
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
        tint: distance > 40 ? "red" : "blue"
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
    glow.addColorStop(0, "rgba(214,233,255,0.07)");
    glow.addColorStop(0.18, "rgba(120,178,255,0.06)");
    glow.addColorStop(0.44, "rgba(83,138,255,0.045)");
    glow.addColorStop(0.68, "rgba(255,108,108,0.028)");
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
  if (!location.hash) location.hash = "#/";
  route();
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentQuery = e.target.value;
    route();
  });
}

document.addEventListener("click", (e) => {
  const homeLink = e.target && typeof e.target.closest === "function"
    ? e.target.closest('.dock__item[data-dock="home"]')
    : null;

  if (!homeLink) return;
  e.preventDefault();

  if ((location.hash || "#/") !== "#/") {
    location.hash = "#/";
    return;
  }

  route();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("hashchange", () => {
  route();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  const contentEl = document.querySelector(".content");
  if (contentEl) {
    contentEl.scrollTop = 0;
  }
});

init();
