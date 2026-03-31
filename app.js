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
const DISCORD_INVITE_URL = "https://discord.gg/Y8HNFPtxkE";

const SERVER_JOIN_CODE = "pbe6gy";
const SERVER_SINGLE_API_URL = `https://servers-frontend.fivem.net/api/servers/single/${SERVER_JOIN_CODE}`;
const APP_ASSET_BASE_URL = document.currentScript?.src
  ? new URL(".", document.currentScript.src).href
  : "./";
const MAP_IMAGE_URL = `${APP_ASSET_BASE_URL}map.jpg`;
const MAP_BASE_SIZE = 980;
const MAP_MIN_SCALE = 0.58;
const MAP_MAX_SCALE = 2.6;
const MAP_WORLD_TRANSFORM = {
  xScale: 0.00904271438150494,
  xOffset: 48.4322996315255,
  yScale: -0.00900772430620384,
  yOffset: 71.3195480253975
};
const MAP_TYPE_META = {
  hospital: {
    label: "Hospital",
    groupLabel: "Hospitals",
    color: "#54e0a6",
    glow: "rgba(84, 224, 166, .22)"
  },
  police: {
    label: "Police Station",
    groupLabel: "Police",
    color: "#63a7ff",
    glow: "rgba(99, 167, 255, .22)"
  },
  underground: {
    label: "Lester's House",
    groupLabel: "Lester",
    color: "#ff9b54",
    glow: "rgba(255, 155, 84, .24)"
  }
};
function roundMapPercent(value) {
  return Math.round(value * 100) / 100;
}

// GTALens exposes GTA world coordinates; this projects them onto the site's square map asset.
function mapWorldToPercent(gameX, gameY) {
  return {
    x: roundMapPercent(MAP_WORLD_TRANSFORM.xScale * gameX + MAP_WORLD_TRANSFORM.xOffset),
    y: roundMapPercent(MAP_WORLD_TRANSFORM.yScale * gameY + MAP_WORLD_TRANSFORM.yOffset)
  };
}

function mapLocation({ gameX, gameY, ...location }) {
  const projected = mapWorldToPercent(gameX, gameY);
  return {
    ...location,
    x: location.x ?? projected.x,
    y: location.y ?? projected.y
  };
}

const MAP_LOCATIONS = [
  mapLocation({
    id: "bay-care-center",
    type: "hospital",
    name: "The Bay Care Center",
    region: "Paleto Bay",
    address: "Duluoz Avenue",
    gameX: -242.2981,
    gameY: 6325.2334,
    description: "Paleto Bay's hospital and one of the main northern medical respawn points in GTA Online."
  }),
  mapLocation({
    id: "mount-zonah-medical-center",
    type: "hospital",
    name: "Mount Zonah Medical Center",
    region: "Rockford Hills",
    address: "Dorset Drive & Dorset Place",
    gameX: -449.7836,
    gameY: -341.3995,
    description: "Major west-side hospital in Rockford Hills, useful for fast access to Burton, Vinewood, and Del Perro."
  }),
  mapLocation({
    id: "pillbox-hill-medical-center",
    type: "hospital",
    name: "Pillbox Hill Medical Center",
    region: "Pillbox Hill",
    address: "Elgin Avenue, Strawberry Avenue & Swiss Street",
    gameX: 360.7675,
    gameY: -583.4315,
    description: "The central downtown hospital and one of the easiest medical landmarks to call out inside Los Santos."
  }),
  mapLocation({
    id: "central-los-santos-medical-center",
    type: "hospital",
    name: "Central Los Santos Medical Center",
    region: "South Los Santos",
    address: "Crusade Road & Innocence Boulevard",
    gameX: 341.4144,
    gameY: -1396.291,
    description: "Large south-east city hospital near the river and industrial roads, good for East LS and Port callouts."
  }),
  mapLocation({
    id: "st-fiacre-hospital",
    type: "hospital",
    name: "St. Fiacre Hospital",
    region: "El Burro Heights",
    address: "Capital Boulevard",
    gameX: 1176.8209,
    gameY: -1522.9105,
    description: "East-side medical site in El Burro Heights, sitting above the industrial lanes and the port routes."
  }),
  mapLocation({
    id: "eclipse-medical-tower",
    type: "hospital",
    name: "Eclipse Medical Tower",
    region: "West Vinewood",
    address: "Eclipse Boulevard",
    gameX: -656.6413,
    gameY: 309.4868,
    description: "A west-side medical tower above central Los Santos, close to the Vinewood and Burton routes."
  }),
  mapLocation({
    id: "portola-trinity-medical-center",
    type: "hospital",
    name: "Portola Trinity Medical Center",
    region: "Rockford Hills",
    address: "Dorset Drive & Marathon Avenue",
    gameX: -875.4126,
    gameY: -308.313,
    description: "Medical facility between Rockford Hills and Burton, just east of Mount Zonah."
  }),
  mapLocation({
    id: "sandy-shores-medical-center",
    type: "hospital",
    name: "Sandy Shores Medical Center",
    region: "Sandy Shores",
    address: "Mountain View Drive",
    gameX: 1838.4948,
    gameY: 3672.2222,
    description: "Main Blaine County desert hospital, sharing the Sandy Shores building with the local sheriff station."
  }),
  mapLocation({
    id: "mission-row-police-station",
    type: "police",
    name: "Mission Row Police Station",
    region: "Mission Row",
    address: "Vespucci Boulevard, Little Bighorn Avenue, Atlee Street & Sinner Street",
    gameX: 479.6391,
    gameY: -976.6794,
    description: "The main Los Santos police station and the best known central LSPD location in GTA Online."
  }),
  mapLocation({
    id: "la-mesa-police-station",
    type: "police",
    name: "La Mesa Police Station",
    region: "La Mesa",
    address: "Popular Street",
    gameX: 824.992004,
    gameY: -1289.266846,
    description: "East-side LSPD station close to La Mesa, the river roads, and the industrial part of the city."
  }),
  mapLocation({
    id: "vinewood-police-station",
    type: "police",
    name: "Vinewood Police Station",
    region: "Downtown Vinewood",
    address: "Vinewood Boulevard & Elgin Avenue",
    gameX: 639.1819,
    gameY: 1.765,
    description: "North-central city station covering the Vinewood strip and upper urban blocks."
  }),
  mapLocation({
    id: "vespucci-police-station",
    type: "police",
    name: "Vespucci Police Station",
    region: "Vespucci",
    address: "South Rockford Drive, Vespucci Boulevard & San Andreas Avenue",
    gameX: -1093.89,
    gameY: -807.0834,
    description: "Large west-city LSPD station serving the Vespucci side of Los Santos."
  }),
  mapLocation({
    id: "vespucci-beach-police-station",
    type: "police",
    name: "Vespucci Beach Police Station",
    region: "Vespucci Beach",
    address: "Vespucci Beach",
    gameX: -1326.0114,
    gameY: -1502.1876,
    description: "Small beachside police station along the Vespucci coastline."
  }),
  mapLocation({
    id: "beaver-bush-ranger-station",
    type: "police",
    name: "Beaver Bush Ranger Station",
    region: "Vinewood Hills",
    address: "Baytree Canyon Road & Marlow Drive",
    gameX: 382.2473,
    gameY: 796.637,
    description: "Ranger outpost in the hills above the city, useful for the park and canyon roads."
  }),
  mapLocation({
    id: "del-perro-police-station",
    type: "police",
    name: "Del Perro Police Station",
    region: "Del Perro",
    address: "Del Perro Pier",
    gameX: -1634.0186,
    gameY: -1021.051,
    description: "Pier-side police station on the west coast, just off the Del Perro beachfront."
  }),
  mapLocation({
    id: "davis-sheriffs-station",
    type: "police",
    name: "Davis Sheriff's Station",
    region: "Davis",
    address: "Innocence Boulevard",
    gameX: 360.8818,
    gameY: -1581.6075,
    description: "South-city sheriff station in Davis, close to Grove Street, Strawberry, and the industrial lanes."
  }),
  mapLocation({
    id: "rockford-hills-police-station",
    type: "police",
    name: "Rockford Hills Police Station",
    region: "Rockford Hills",
    address: "Eastbourne Way & Abe Milton Parkway",
    gameX: -560.755,
    gameY: -133.9789,
    description: "Upscale west-city police station linked to Rockford Hills City Hall."
  }),
  mapLocation({
    id: "sandy-shores-sheriffs-station",
    type: "police",
    name: "Sandy Shores Sheriff's Station",
    region: "Sandy Shores",
    address: "Alhambra Drive",
    gameX: 1856.3516,
    gameY: 3682.0608,
    description: "Blaine County sheriff station in Sandy Shores, sharing its building with the local medical center."
  }),
  mapLocation({
    id: "paleto-bay-sheriffs-office",
    type: "police",
    name: "Paleto Bay Sheriff's Office",
    region: "Paleto Bay",
    address: "Route 1 & Paleto Boulevard",
    gameX: -440.7429,
    gameY: 6019.8892,
    description: "Northern sheriff office at the main Paleto Bay junction."
  }),
  mapLocation({
    id: "hacking-device-store",
    type: "underground",
    name: "Lester's House",
    region: "El Burro Heights",
    address: "Amarillo Vista, El Burro Heights",
    gameX: 1273.9,
    gameY: -1719.305,
    x: 56.8,
    y: 87.8,
    description: "Lester's house in El Burro Heights, used here as the hacking contact location."
  })
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

function renderLanding() {
  setView(`
    <div class="landing landing--cloud">
      <div class="landing-shell">
        <section class="landing-hero" aria-label="Welcome">
          <div class="landing-hero__copy">
            <div class="landing__coming">Los Santos hub</div>
            <div class="landing__logo" aria-label="SGCNR">
              <div class="landing__logoTop">SGCNR</div>
              <div class="landing__logoBottom">SGCNR</div>
            </div>
            <div class="landing-hero__title">Rules, support, and map tools in one place.</div>
            <div class="landing-hero__text">A cleaner way for players to navigate the server, find answers fast, and jump straight into the essentials.</div>
            <div class="landing-hero__actions">
              <a class="auth__btn auth__btn--primary" href="https://cfx.re/join/pbe6gy" target="_blank" rel="noopener noreferrer">Join Server</a>
              <a class="auth__btn" href="https://discord.gg/Y8HNFPtxkE" target="_blank" rel="noopener noreferrer">Open Discord</a>
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
              <a class="quickstart__btn" href="#/faq">
                <span class="quickstart__icon" aria-hidden="true">?</span>
                <span class="quickstart__label">FAQ</span>
              </a>
              <a class="quickstart__btn" href="#/map">
                <span class="quickstart__icon" aria-hidden="true">🗺️</span>
                <span class="quickstart__label">Map</span>
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
                <div class="landing-stat__label">Maps</div>
                <div class="landing-stat__value">Interactive</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `);
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
            <a class="info-link" href="https://cfx.re/join/pbe6gy" target="_blank" rel="noopener noreferrer">cfx.re/join/pbe6gy</a>
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
            <a class="info-link" href="#/faq">FAQ</a>
            <a class="info-link" href="#/status">Server Status</a>
            <a class="info-link" href="https://discord.gg/Y8HNFPtxkE" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </aside>
      </div>

      <section class="section section--timeline">
        <div class="section__eyebrow">Essentials</div>
        <h2>New player checklist</h2>
        <div class="stack-list">
          <div class="stack-list__item"><span class="stack-list__index">01</span><span>Read the Rules and follow the category that applies to what you're doing.</span></div>
          <div class="stack-list__item"><span class="stack-list__index">02</span><span>Check FAQ for common questions and support.</span></div>
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
              <div class="feature-card__value">Use map + FAQ</div>
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

function renderFaq() {
  setView(`
    <div>
      ${renderHeader("FAQ", [{ label: "FAQ" }])}
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
  if (type === "hospital") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" fill="currentColor"></path>
      </svg>
    `;
  }

  if (type === "police") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2l7 3v5c0 5.2-2.7 9.2-7 12-4.3-2.8-7-6.8-7-12V5l7-3z" fill="currentColor"></path>
        <path d="M12 7.1l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z" fill="rgba(11,15,20,.92)"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="3" fill="currentColor"></rect>
      <rect x="8" y="3" width="2" height="4" rx="1" fill="currentColor"></rect>
      <rect x="14" y="3" width="2" height="4" rx="1" fill="currentColor"></rect>
      <rect x="7" y="9" width="10" height="2" rx="1" fill="rgba(11,15,20,.92)"></rect>
      <rect x="7" y="13" width="5" height="2" rx="1" fill="rgba(11,15,20,.92)"></rect>
      <rect x="14" y="13" width="3" height="2" rx="1" fill="rgba(11,15,20,.92)"></rect>
    </svg>
  `;
}

function renderMapQuickLinks() {
  return Object.entries(MAP_TYPE_META).map(([type, meta]) => {
    const locations = MAP_LOCATIONS.filter((location) => location.type === type);
    if (!locations.length) return "";

    const items = locations.map((location) => `
      <button
        class="map-quick__item"
        type="button"
        data-map-quick="${escapeHtml(location.id)}"
        data-map-type="${escapeHtml(location.type)}"
        style="--map-accent:${meta.color}; --map-glow:${meta.glow};"
      >
        <span class="map-quick__icon" aria-hidden="true">${getMapTypeIcon(location.type)}</span>
        <span class="map-quick__meta">${escapeHtml(meta.label)} / ${escapeHtml(location.region)}</span>
        <span class="map-quick__name">${escapeHtml(location.name)}</span>
      </button>
    `).join("");

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
  const legend = renderMapLegend();
  const filters = renderMapFilters();

  const markers = MAP_LOCATIONS.map((location) => {
    const meta = getMapTypeMeta(location.type);
    const glyph = `<span class="custom-map__glyph" aria-hidden="true">${getMapTypeIcon(location.type)}</span>`;
    return `
      <button
        class="custom-map__marker custom-map__marker--${escapeHtml(location.type)}"
        type="button"
        style="left:${location.x}%; top:${location.y}%; --map-accent:${meta.color}; --map-glow:${meta.glow};"
        data-map-location="${escapeHtml(location.id)}"
        data-map-type="${escapeHtml(location.type)}"
        aria-label="Focus ${escapeHtml(location.name)}"
        title="${escapeHtml(location.name)}"
      >
        <span class="custom-map__pulse"></span>
        <span class="custom-map__dot"></span>
        ${glyph}
      </button>
    `;
  }).join("");

  if (customMapState?.resizeHandler) {
    window.removeEventListener("resize", customMapState.resizeHandler);
  }
  customMapState = null;

  setView(`
    <div class="map-page">
      <section class="section section--map">
        <div class="map-embed-container map-embed-container--custom">
          <div class="map-layout">
            <aside class="map-panel">
              <div class="section__eyebrow">Los Santos map</div>
              <div class="map-panel__headline">Los Santos operations map</div>
              <div class="map-panel__intro">Filter the map first, then jump from the location list or click directly on a marker for details.</div>
              <div class="map-legend map-legend--panel">
                ${legend}
              </div>
              <div class="map-panel__title">Filter locations</div>
              <div class="map-filters">
                ${filters}
              </div>
              <div class="map-detail map-detail--panel" id="customMapInfo">${renderMapDetail()}</div>
              <div class="map-panel__title map-panel__title--spaced">Location list</div>
              <div class="map-quick">
                ${quickLinks}
              </div>
            </aside>
            <div class="map-stage">
              <div class="map-toolbar">
                <div class="map-toolbar__group">
                  <button class="map-tool" id="mapZoomOut" type="button" aria-label="Zoom out">-</button>
                  <div class="map-zoom-label" id="mapZoomLabel">100%</div>
                  <button class="map-tool" id="mapZoomIn" type="button" aria-label="Zoom in">+</button>
                  <button class="map-tool map-tool--ghost" id="mapResetBtn" type="button">Reset View</button>
                </div>
                <div class="map-toolbar__hint">Drag to pan, scroll to zoom, and click a marker or list item to focus it.</div>
              </div>
              <div class="custom-map-viewport" id="customMapViewport" aria-label="Los Santos map viewer">
                <div class="custom-map-surface" id="customMapSurface">
                  <img
                    src="${MAP_IMAGE_URL}"
                    alt="GTA Online operations map of Los Santos"
                    class="custom-map__image"
                    id="customMapImage"
                    draggable="false"
                  >
                  ${markers}
                </div>
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
    return `
      <div class="map-detail__eyebrow">Overview</div>
      <div class="map-detail__title">Los Santos Operations Map</div>
      <div class="map-detail__meta">Hospitals, police stations, and Lester's house</div>
      <div class="map-detail__body">Use the filters to show one category at a time, then click a marker or a location card to focus it on the map.</div>
    `;
  }

  const meta = getMapTypeMeta(location.type);
  const detailMeta = [location.region, location.address].filter(Boolean).join(" / ");

  return `
    <div class="map-detail__eyebrow">${escapeHtml(meta.label)}</div>
    <div class="map-detail__title">${escapeHtml(location.name)}</div>
    <div class="map-detail__meta">${escapeHtml(detailMeta)}</div>
    <div class="map-detail__body">${escapeHtml(location.description)}</div>
  `;
}

function findMapLocation(locationId) {
  return MAP_LOCATIONS.find((location) => location.id === locationId) ?? null;
}

function updateMapSelection(locationId) {
  if (!customMapState) return;

  customMapState.activeId = locationId ?? null;
  const location = customMapState.activeId ? findMapLocation(customMapState.activeId) : null;

  if (customMapState.infoEl) {
    customMapState.infoEl.innerHTML = renderMapDetail(location);
  }

  customMapState.markerButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mapLocation === customMapState.activeId);
  });

  customMapState.quickButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mapQuick === customMapState.activeId);
  });
}

function applyMapFilter(filterKey) {
  if (!customMapState) return;

  const nextFilter = filterKey && MAP_TYPE_META[filterKey] ? filterKey : "all";
  customMapState.filter = nextFilter;

  customMapState.filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mapFilter === nextFilter);
  });

  customMapState.markerButtons.forEach((button) => {
    const isVisible = nextFilter === "all" || button.dataset.mapType === nextFilter;
    button.classList.toggle("is-hidden", !isVisible);
    button.disabled = !isVisible;
  });

  customMapState.quickButtons.forEach((button) => {
    const isVisible = nextFilter === "all" || button.dataset.mapType === nextFilter;
    button.classList.toggle("is-hidden", !isVisible);
  });

  customMapState.quickGroups.forEach((group) => {
    const hasVisibleItems = Array.from(group.querySelectorAll("[data-map-quick]")).some((button) => !button.classList.contains("is-hidden"));
    group.classList.toggle("is-hidden", !hasVisibleItems);
  });

  if (customMapState.activeId) {
    const activeLocation = findMapLocation(customMapState.activeId);
    if (activeLocation && nextFilter !== "all" && activeLocation.type !== nextFilter) {
      updateMapSelection(null);
    } else {
      updateMapSelection(customMapState.activeId);
    }
  }
}

function centerMapOn(xRatio, yRatio) {
  if (!customMapState) return;

  const { viewport, surface } = customMapState;
  if (!viewport || !surface) return;

  const maxLeft = Math.max(0, surface.offsetWidth - viewport.clientWidth);
  const maxTop = Math.max(0, surface.offsetHeight - viewport.clientHeight);
  viewport.scrollLeft = clamp(surface.offsetWidth * xRatio - viewport.clientWidth / 2, 0, maxLeft);
  viewport.scrollTop = clamp(surface.offsetHeight * yRatio - viewport.clientHeight / 2, 0, maxTop);
}

function getMapFitScale(viewport = customMapState?.viewport) {
  if (!viewport) return 1;
  const safeWidth = Math.max(320, viewport.clientWidth - 24);
  return clamp(safeWidth / MAP_BASE_SIZE, MAP_MIN_SCALE, 1);
}

function refreshMapZoomUi() {
  if (!customMapState) return;

  const { zoomLabel, zoomInBtn, zoomOutBtn, scale } = customMapState;
  if (zoomLabel) {
    zoomLabel.textContent = `${Math.round(scale * 100)}%`;
  }
  if (zoomInBtn) {
    zoomInBtn.disabled = scale >= MAP_MAX_SCALE;
  }
  if (zoomOutBtn) {
    zoomOutBtn.disabled = scale <= MAP_MIN_SCALE + 0.001;
  }
}

function setCustomMapScale(nextScale, options = {}) {
  if (!customMapState) return;

  const { viewport, surface } = customMapState;
  if (!viewport || !surface) return;

  const currentWidth = Math.max(surface.offsetWidth, 1);
  const currentHeight = Math.max(surface.offsetHeight, 1);
  const focusX = clamp(options.focusX ?? ((viewport.scrollLeft + viewport.clientWidth / 2) / currentWidth), 0, 1);
  const focusY = clamp(options.focusY ?? ((viewport.scrollTop + viewport.clientHeight / 2) / currentHeight), 0, 1);

  customMapState.scale = clamp(nextScale, MAP_MIN_SCALE, MAP_MAX_SCALE);
  surface.style.width = `${Math.round(MAP_BASE_SIZE * customMapState.scale)}px`;
  refreshMapZoomUi();

  window.requestAnimationFrame(() => {
    centerMapOn(focusX, focusY);
  });
}

function focusMapLocation(locationId) {
  const location = findMapLocation(locationId);
  if (!location) return;

  updateMapSelection(location.id);
  const focusX = location.x / 100;
  const focusY = location.y / 100;
  const targetScale = customMapState ? Math.max(customMapState.scale, 1.08) : 1.08;
  setCustomMapScale(targetScale, { focusX, focusY });
}

function resetCustomMapView() {
  updateMapSelection(null);
  setCustomMapScale(getMapFitScale(), { focusX: 0.5, focusY: 0.5 });
}

function bindMapDragging(viewport) {
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  const stopDragging = () => {
    pointerId = null;
    viewport.classList.remove("is-dragging");
  };

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    if (event.button !== 0) return;
    if (event.target.closest("button, a")) return;

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = viewport.scrollLeft;
    startTop = viewport.scrollTop;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(pointerId);
    event.preventDefault();
  });

  viewport.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;

    viewport.scrollLeft = startLeft - (event.clientX - startX);
    viewport.scrollTop = startTop - (event.clientY - startY);
  });

  viewport.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointerId) return;
    stopDragging();
  });

  viewport.addEventListener("pointercancel", (event) => {
    if (event.pointerId !== pointerId) return;
    stopDragging();
  });

  viewport.addEventListener("lostpointercapture", stopDragging);
}

function initCustomMap() {
  const viewport = document.getElementById("customMapViewport");
  const surface = document.getElementById("customMapSurface");
  const infoEl = document.getElementById("customMapInfo");
  const zoomOutBtn = document.getElementById("mapZoomOut");
  const zoomInBtn = document.getElementById("mapZoomIn");
  const resetBtn = document.getElementById("mapResetBtn");
  const zoomLabel = document.getElementById("mapZoomLabel");
  const image = document.getElementById("customMapImage");

  if (!viewport || !surface || !infoEl) return;

  customMapState = {
    activeId: null,
    filter: "all",
    filterButtons: Array.from(document.querySelectorAll("[data-map-filter]")),
    infoEl,
    markerButtons: Array.from(document.querySelectorAll("[data-map-location]")),
    quickGroups: Array.from(document.querySelectorAll("[data-map-group]")),
    quickButtons: Array.from(document.querySelectorAll("[data-map-quick]")),
    resetBtn,
    scale: 1,
    surface,
    viewport,
    zoomInBtn,
    zoomLabel,
    zoomOutBtn
  };

  surface.style.width = `${MAP_BASE_SIZE}px`;

  customMapState.markerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      focusMapLocation(button.dataset.mapLocation);
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

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      setCustomMapScale(customMapState.scale + 0.2);
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      setCustomMapScale(customMapState.scale - 0.2);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetCustomMapView);
  }

  bindMapDragging(viewport);
  refreshMapZoomUi();
  updateMapSelection(null);
  applyMapFilter("all");

  const setInitialView = () => {
    resetCustomMapView();
  };

  const resizeHandler = () => {
    if (!customMapState) return;
    if (customMapState.activeId) return;
    resetCustomMapView();
  };

  customMapState.resizeHandler = resizeHandler;
  window.addEventListener("resize", resizeHandler);

  if (image && !image.complete) {
    image.addEventListener("load", setInitialView, { once: true });
  } else {
    window.requestAnimationFrame(setInitialView);
  }
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
  if (parts[0] === "faq") return { name: "faq" };
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
  updateDockActive(r.name);

  document.body.classList.toggle("is-landing", r.name === "home");
  document.body.classList.toggle("is-map", r.name === "map");

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
  if (r.name === "faq") {
    renderFaq();
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

  renderLanding();
  meta.innerHTML = `Updated: <kbd>${data.updatedAt}</kbd>`;
}

function init() {
  const data = window.RULES_DATA;
  if (!data || !data.sections) {
    meta.textContent = "Rules data missing. Check rules.js";
    return;
  }

  initAuth();
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
});

init();
