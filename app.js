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
const MAP_MIN_SCALE = 1;
const MAP_MAX_SCALE = 2.8;
const MAP_LOCATIONS = [
  {
    id: "paleto-bay",
    name: "Paleto Bay",
    region: "North Coast",
    x: 47,
    y: 9,
    description: "A quiet northern town with forest roads, highway access, and quick links into Blaine County."
  },
  {
    id: "mount-chiliad",
    name: "Mount Chiliad",
    region: "Wilderness",
    x: 47,
    y: 24,
    description: "The highest landmark on the map. Great for orientation, helicopter routes, and long-distance callouts."
  },
  {
    id: "grapeseed",
    name: "Grapeseed",
    region: "Farmland",
    x: 74,
    y: 29,
    description: "Rural roads, open fields, and a useful eastern anchor point for northern movement."
  },
  {
    id: "alamo-sea",
    name: "Alamo Sea",
    region: "Blaine County",
    x: 57,
    y: 39,
    description: "A central northern landmark that helps you orient around Sandy Shores, Harmony, and the desert."
  },
  {
    id: "sandy-shores",
    name: "Sandy Shores",
    region: "Desert",
    x: 67,
    y: 42,
    description: "A high-conflict desert zone with quick access to Route 68, airfield routes, and nearby open terrain."
  },
  {
    id: "fort-zancudo",
    name: "Fort Zancudo",
    region: "West Blaine",
    x: 18,
    y: 47,
    description: "A major western landmark useful for identifying military-side movement and coastal rotations."
  },
  {
    id: "chumash",
    name: "Chumash",
    region: "West Coast",
    x: 21,
    y: 66,
    description: "A strong coastal travel point between the north and Los Santos through the western highway."
  },
  {
    id: "vinewood",
    name: "Vinewood",
    region: "North Los Santos",
    x: 49,
    y: 72,
    description: "A key central city area that connects the hills, highway routes, and downtown access."
  },
  {
    id: "downtown-los-santos",
    name: "Downtown Los Santos",
    region: "Central City",
    x: 51,
    y: 81,
    description: "The urban center of the map with dense roads, major intersections, and fast access to surrounding districts."
  },
  {
    id: "port-of-los-santos",
    name: "Port of Los Santos",
    region: "South East",
    x: 53,
    y: 90,
    description: "Industrial docks and cargo routes in the south east, useful for exports, pursuits, and heavy vehicle movement."
  },
  {
    id: "lsia",
    name: "Los Santos International Airport",
    region: "South West",
    x: 40,
    y: 92,
    description: "The airport district with open lanes, runways, and quick access to southern city routes."
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
  bindStoreHandlersOnce();
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
            <div class="landing-hero__title">Rules, support, map tools, and store access in one place.</div>
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
                <div class="landing-stat__label">Store</div>
                <div class="landing-stat__value">Integrated</div>
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

function renderMap() {
  const quickLinks = MAP_LOCATIONS.map((location) => `
    <button class="map-quick__item" type="button" data-map-quick="${escapeHtml(location.id)}">
      <span class="map-quick__region">${escapeHtml(location.region)}</span>
      <span class="map-quick__name">${escapeHtml(location.name)}</span>
    </button>
  `).join("");

  const markers = MAP_LOCATIONS.map((location) => `
    <button
      class="custom-map__marker"
      type="button"
      style="left:${location.x}%; top:${location.y}%;"
      data-map-location="${escapeHtml(location.id)}"
      aria-label="Focus ${escapeHtml(location.name)}"
      title="${escapeHtml(location.name)}"
    >
      <span class="custom-map__pulse"></span>
      <span class="custom-map__dot"></span>
    </button>
  `).join("");

  customMapState = null;

  setView(`
    <div>
      ${renderHeader("Interactive Map", [{ label: "Map" }])}
      <section class="section section--map">
        <div class="map-embed-container map-embed-container--custom">
          <div class="map-embed-header">
            <div class="section__eyebrow">Los Santos navigation</div>
            <div class="map-embed-title">Explore San Andreas without the clutter</div>
            <div class="map-embed-subtitle">Jump to major zones, drag the map to move around, and use the controls to zoom in when you want city-level detail.</div>
          </div>
          <div class="map-layout">
            <aside class="map-panel">
              <div class="map-panel__title">Quick locations</div>
              <div class="map-quick">
                ${quickLinks}
              </div>
            </aside>
            <div class="map-stage">
              <div class="map-toolbar">
                <button class="map-tool" id="mapZoomOut" type="button" aria-label="Zoom out">-</button>
                <div class="map-zoom-label" id="mapZoomLabel">100%</div>
                <button class="map-tool" id="mapZoomIn" type="button" aria-label="Zoom in">+</button>
                <button class="map-tool map-tool--ghost" id="mapResetBtn" type="button">Reset View</button>
              </div>
              <div class="custom-map-viewport" id="customMapViewport" aria-label="San Andreas map viewer">
                <div class="custom-map-surface" id="customMapSurface">
                  <img
                    src="${MAP_IMAGE_URL}"
                    alt="GTA Online map of San Andreas"
                    class="custom-map__image"
                    id="customMapImage"
                    draggable="false"
                  >
                  ${markers}
                </div>
              </div>
              <div class="map-detail" id="customMapInfo">${renderMapDetail()}</div>
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
      <div class="map-detail__title">San Andreas Overview</div>
      <div class="map-detail__body">Use the quick list on the left or click a marker to jump around the map. Drag anywhere on the map to pan, and use the zoom controls when you want a closer read on the city or the north.</div>
    `;
  }

  return `
    <div class="map-detail__eyebrow">${escapeHtml(location.region)}</div>
    <div class="map-detail__title">${escapeHtml(location.name)}</div>
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

function centerMapOn(xRatio, yRatio) {
  if (!customMapState) return;

  const { viewport, surface } = customMapState;
  if (!viewport || !surface) return;

  const maxLeft = Math.max(0, surface.offsetWidth - viewport.clientWidth);
  const maxTop = Math.max(0, surface.offsetHeight - viewport.clientHeight);
  viewport.scrollLeft = clamp(surface.offsetWidth * xRatio - viewport.clientWidth / 2, 0, maxLeft);
  viewport.scrollTop = clamp(surface.offsetHeight * yRatio - viewport.clientHeight / 2, 0, maxTop);
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
    zoomOutBtn.disabled = scale <= MAP_MIN_SCALE;
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
  const targetScale = customMapState ? Math.max(customMapState.scale, 1.35) : 1.35;
  setCustomMapScale(targetScale, { focusX, focusY });
}

function resetCustomMapView() {
  updateMapSelection(null);
  setCustomMapScale(MAP_MIN_SCALE, { focusX: 0.5, focusY: 0.5 });
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
    infoEl,
    markerButtons: Array.from(document.querySelectorAll("[data-map-location]")),
    quickButtons: Array.from(document.querySelectorAll("[data-map-quick]")),
    resetBtn,
    scale: MAP_MIN_SCALE,
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

  const setInitialView = () => {
    centerMapOn(0.5, 0.5);
  };

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
  if (parts[0] === "store") return { name: "store", storePage: parts[1] || "server" };
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
  if (r.name === "store") {
    renderStore(r.storePage);
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
