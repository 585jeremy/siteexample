const AUTH_ENDPOINTS = {
  login: "https://sgcnr.net/auth/login.php",
  logout: "https://sgcnr.net/auth/logout.php",
  profile: "https://sgcnr.net/auth/api.php",
  roles: "https://sgcnr.net/auth/roles.php"
};

const TEAM_WORKSPACES = [
  { slug: "management", name: "Management Team", eyebrow: "Executive Control", roleId: "1479411370331078799", overview: [{ label: "Priority lanes", value: "5", meta: "Leadership approvals and escalations." }, { label: "Live approvals", value: "12", meta: "Announcements, policy, and final sign-off." }, { label: "Ops health", value: "Stable", meta: "Quick read on workflow readiness." }], tools: [{ title: "Command Dashboard", summary: "Leadership view for live ops, approvals, and staffing pressure." }, { title: "Announcement Board", summary: "Approve website and Discord notices from one place." }, { title: "Decision Log", summary: "Store policy notes, rulings, and follow-up actions." }], modules: ["Cross-team approval flow", "Leadership-only notes", "Pinned server priorities", "Fast jump links into critical queues"], thread: [{ name: "Leadership handoff", body: "Security flagged a suspicious login chain for manager review.", time: "2m ago" }, { name: "Launch sync", body: "Testing marked the current patch ready for final sign-off.", time: "18m ago" }] },
  { slug: "admin", name: "Admin Team", eyebrow: "Operational Control", roleId: "1479481021383835771", overview: [{ label: "Linked accounts", value: "482", meta: "Discord-to-website identity pairs synced." }, { label: "Open actions", value: "9", meta: "Review tasks waiting for decision." }, { label: "Audit drift", value: "Low", meta: "Recent access changes look stable." }], tools: [{ title: "Account Lookup", summary: "Search Discord IDs, website accounts, and linked FiveM identities." }, { title: "Role Access Review", summary: "Inspect Discord-linked access and mismatched permissions." }, { title: "Audit Explorer", summary: "Review staff-side account and system actions." }], modules: ["Linked account tools", "Protected admin actions", "Manual verification queue", "Quick auth and sync health checks"], thread: [{ name: "Identity sync", body: "Nickname mismatch reported between Discord and website account.", time: "6m ago" }, { name: "Audit note", body: "Role change completed cleanly after re-check.", time: "31m ago" }] },
  { slug: "moderation", name: "Moderation Team", eyebrow: "Case Review", roleId: "1479481164371595406", overview: [{ label: "Report queue", value: "27", meta: "Pending review with evidence state." }, { label: "Evidence checks", value: "11", meta: "Cases that still need stronger proof." }, { label: "Appeals today", value: "4", meta: "Recent follow-ups waiting for response." }], tools: [{ title: "Reports Queue", summary: "Prioritized case board for major rule breaks." }, { title: "Evidence Review", summary: "Video-first review for context, initiation, and intent." }, { title: "Appeal Board", summary: "Handle player appeals with linked history." }], modules: ["Open and escalated case lanes", "Evidence-type filters", "Linked punishment history", "Escalation into Admin or Management"], thread: [{ name: "Case #R-182", body: "Video attached and waiting on a second review.", time: "4m ago" }, { name: "Appeal note", body: "User requested appeal review after evidence update.", time: "12m ago" }] },
  { slug: "development", name: "Development Team", eyebrow: "Build + Deploy", roleId: "1479481179198455818", overview: [{ label: "Deploy status", value: "Green", meta: "Website and auth endpoints healthy." }, { label: "Open issues", value: "16", meta: "Bugs and requests grouped by urgency." }, { label: "Staging links", value: "6", meta: "Fast access to repo, docs, and test builds." }], tools: [{ title: "Deploy Board", summary: "Track rollout state, failed jobs, and pending updates." }, { title: "Issue Triage", summary: "Sort bugs and assign owners across systems." }, { title: "API Health", summary: "Monitor auth, live ops, and Discord sync status." }], modules: ["GitHub release references", "Build status cards", "Environment quick-switch", "Patch checklist before rollout"], thread: [{ name: "Deploy watch", body: "Auth callback and roles endpoint both returned healthy.", time: "5m ago" }, { name: "Bug handoff", body: "Testing flagged a mobile dock overlap.", time: "23m ago" }] },
  { slug: "testing", name: "Testing Team", eyebrow: "QA Workflow", roleId: "1479481184470962349", overview: [{ label: "Test runs", value: "8", meta: "Current validation batches tracked." }, { label: "Bug intake", value: "14", meta: "Issues still waiting for labels." }, { label: "Release score", value: "82%", meta: "Current patch confidence." }], tools: [{ title: "Bug Intake", summary: "Structured bug reports with route, severity, and evidence." }, { title: "Validation Matrix", summary: "Mark features approved, failed, or needs rework." }, { title: "Regression Checklist", summary: "Reusable pre-release sweep for all key routes." }], modules: ["Named test sessions", "Evidence attachments", "Severity markers", "Fast escalation into Development"], thread: [{ name: "Regression pass", body: "Map dock looks fixed in desktop but needs mobile sweep.", time: "7m ago" }, { name: "Release note", body: "Leaderboard changes approved after visual pass.", time: "29m ago" }] },
  { slug: "translation", name: "Translation Team", eyebrow: "Locale Control", roleId: "1479481187692056626", overview: [{ label: "Locale packs", value: "4", meta: "Tracked language sets for future panels." }, { label: "Missing strings", value: "23", meta: "Labels still waiting for translation." }, { label: "Glossary drift", value: "Low", meta: "Terminology remains aligned." }], tools: [{ title: "Locale Board", summary: "Track each language pack and release readiness." }, { title: "Missing Strings", summary: "Prioritize untranslated labels blocking release." }, { title: "Glossary Manager", summary: "Keep official wording consistent." }], modules: ["String approval flow", "Term lock for official wording", "Change tracking per cycle", "Priority view for public pages"], thread: [{ name: "Locale sync", body: "Live page added three labels for translation review.", time: "14m ago" }, { name: "Glossary note", body: "Keep major support terms consistent across pages.", time: "43m ago" }] },
  { slug: "helper", name: "Helper Team", eyebrow: "Player Care", roleId: "1479485844304953458", overview: [{ label: "Open help cases", value: "19", meta: "Questions and onboarding issues." }, { label: "Escalations", value: "5", meta: "Cases forwarded to another team." }, { label: "FAQ quality", value: "Strong", meta: "Most repeated questions have templates." }], tools: [{ title: "Onboarding Queue", summary: "Track new-player questions and setup issues." }, { title: "FAQ Response Bank", summary: "Quick access to approved response templates." }, { title: "Escalation Handoff", summary: "Move complex issues to the right staff branch." }], modules: ["Simple support notes", "Fast reuse of approved replies", "Escalation reason tagging", "Feedback loop into Wiki and Help"], thread: [{ name: "Helper case", body: "New player still confused about Discord login flow.", time: "9m ago" }, { name: "Escalation", body: "Punishment-related question forwarded to Moderation.", time: "34m ago" }] },
  { slug: "security", name: "Security Team", eyebrow: "Risk + Incident", roleId: "1479481204028866600", overview: [{ label: "Risk alerts", value: "3", meta: "Suspicious sessions or protected-route warnings." }, { label: "Access checks", value: "7", meta: "Role or account reviews waiting for follow-up." }, { label: "Incident state", value: "Contained", meta: "No critical incident at the moment." }], tools: [{ title: "Incident Center", summary: "Track suspicious logins and auth anomalies." }, { title: "Access Review", summary: "Review staff permissions and panel access." }, { title: "Session Watch", summary: "Track stale sessions and auth issues." }], modules: ["Incident severity and owner assignment", "Restricted logs and notes", "Staff-access review snapshots", "Action history for every security-facing change"], thread: [{ name: "Security ping", body: "Repeated login attempts may need manager review.", time: "3m ago" }, { name: "Access review", body: "New role assignment pending double-check.", time: "21m ago" }] },
  { slug: "creator", name: "Content Creator Team", eyebrow: "Media Pipeline", roleId: "1479485986772877414", overview: [{ label: "Asset requests", value: "11", meta: "Pending banners, clips, or graphics." }, { label: "Campaign slots", value: "6", meta: "Upcoming promo windows." }, { label: "Approval state", value: "Flowing", meta: "Creative reviews are moving cleanly." }], tools: [{ title: "Asset Request Board", summary: "Track incoming requests for graphics and promo assets." }, { title: "Campaign Planner", summary: "Plan beats for updates, events, and launches." }, { title: "Media Approval Queue", summary: "Review draft assets and approve final creative." }], modules: ["Creative workflow with review status", "Internal asset delivery links", "Launch-window priorities", "Shared spotlight list for website and socials"], thread: [{ name: "Asset handoff", body: "Homepage intro slot reserved for the next cinematic.", time: "11m ago" }, { name: "Review request", body: "Weekend event art is waiting on approval.", time: "38m ago" }] },
  { slug: "social", name: "Social Team", eyebrow: "Community Push", roleId: "1479485995190583356", overview: [{ label: "Scheduled posts", value: "9", meta: "Upcoming content already queued." }, { label: "Live promos", value: "4", meta: "Event pushes currently active." }, { label: "Engagement pulse", value: "Strong", meta: "Recent campaign performance is above average." }], tools: [{ title: "Posting Calendar", summary: "Schedule announcements and event pushes." }, { title: "Drafts + Captions", summary: "Store approved copy blocks and channel variants." }, { title: "Campaign Tracking", summary: "Track what was posted and how it performed." }], modules: ["Per-channel campaign planning", "Reusable copy blocks", "Event push coordination", "Simple performance snapshot after each campaign"], thread: [{ name: "Promo sync", body: "Need final event timing before the next post wave.", time: "8m ago" }, { name: "Campaign note", body: "Website update announcement performed well.", time: "26m ago" }] }
];

const state = { profile: null, roleSync: null, loading: true, error: "" };
const appRoot = document.getElementById("staffApp");
const updatedEl = document.getElementById("staffUpdated");
const authActionsEl = document.getElementById("staffAuthActions");

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function getTeamBySlug(slug) {
  return TEAM_WORKSPACES.find((team) => team.slug === slug) || TEAM_WORKSPACES[0];
}

function getRouteSlug() {
  const raw = String(window.location.hash || "#/management").replace(/^#\/?/, "");
  return getTeamBySlug(raw).slug;
}

function authUser() {
  return state.profile && state.profile.authenticated ? state.profile.user || null : null;
}

function authRoles() {
  if (state.roleSync && Array.isArray(state.roleSync.roles)) return state.roleSync.roles.map(String);
  const user = authUser();
  return user && Array.isArray(user.roles) ? user.roles.map(String) : [];
}

function currentStaffUrl(slug = getRouteSlug()) {
  return `${window.location.origin}${window.location.pathname}#/${slug}`;
}

function buildLoginUrl(slug = getRouteSlug()) {
  return `${AUTH_ENDPOINTS.login}?return_to=${encodeURIComponent(currentStaffUrl(slug))}`;
}

function buildLogoutUrl(slug = getRouteSlug()) {
  return `${AUTH_ENDPOINTS.logout}?return_to=${encodeURIComponent(currentStaffUrl(slug))}`;
}

function formatDateTime(value) {
  if (!value) return "Pending verification";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
}

function displayIdentity() {
  const user = authUser();
  return user ? user.verifiedIdentity || user.guildNickname || user.discordDisplayName || user.discordUsername || "Discord User" : "";
}

function teamAccess(team) {
  if (state.loading) return { kind: "loading", title: `Checking ${team.name} verification`, summary: "The staff portal is checking your Discord login and role verification before opening this workspace.", badge: "Checking Discord session", badgeClass: "", canAccess: false };
  if (state.error) return { kind: "error", title: `${team.name} auth bridge unavailable`, summary: "The staff site could not reach the live Discord verification endpoints. This usually means the live auth config still needs to allow staff.sgcnr.net.", badge: "Auth check failed", badgeClass: "staff-access__state--warn", canAccess: false };
  if (!authUser()) return { kind: "login", title: `Login to ${team.name}`, summary: `Use the Discord account verified for ${team.name}. Without that exact role this workspace stays locked.`, badge: "Discord login required", badgeClass: "staff-access__state--warn", canAccess: false };
  if (authRoles().includes(team.roleId)) return { kind: "granted", title: `${team.name} unlocked`, summary: `Your Discord account passed the role check for ${team.name}. This workspace is open on this session.`, badge: "Role verified", badgeClass: "staff-access__state--ok", canAccess: true };
  return { kind: "denied", title: `${team.name} locked`, summary: `You are signed in as ${displayIdentity()}, but this Discord account does not carry the ${team.name} role. Another staff member cannot open this area without that exact verified role.`, badge: "Access denied", badgeClass: "staff-access__state--warn", canAccess: false };
}

function renderOverviewCard(card) {
  return `<article class="staff-overview__card"><div class="staff-overview__label">${escapeHtml(card.label)}</div><div class="staff-overview__value">${escapeHtml(card.value)}</div><div class="staff-overview__meta">${escapeHtml(card.meta)}</div></article>`;
}

function renderToolCard(tool) {
  return `<article class="staff-mini"><span class="staff-mini__eyebrow">Workspace</span><h3 class="staff-mini__title">${escapeHtml(tool.title)}</h3><p class="staff-mini__summary">${escapeHtml(tool.summary)}</p></article>`;
}

function renderRoleCard(team, access) {
  const otherTeams = TEAM_WORKSPACES.filter((entry) => authRoles().includes(entry.roleId) && entry.slug !== team.slug).map((entry) => entry.name);
  const otherSummary = otherTeams.length ? otherTeams.join(", ") : "No other team spaces are unlocked on this Discord account yet.";
  const loginAction = access.canAccess ? `<button class="staff-panel__button staff-panel__button--primary" type="button" disabled>Verified for ${escapeHtml(team.name)}</button>` : `<a class="staff-panel__button staff-panel__button--primary" href="${escapeHtml(buildLoginUrl(team.slug))}">Login to ${escapeHtml(team.name)}</a>`;
  const secondaryAction = access.canAccess
    ? `<a class="staff-panel__button" href="${escapeHtml(buildLogoutUrl(team.slug))}">Logout</a>`
    : `<button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button>`;

  return `
    <article class="staff-card">
      <span class="staff-card__eyebrow">${escapeHtml(team.name)} login</span>
      <h2 class="staff-card__title">${escapeHtml(access.title)}</h2>
      <p class="staff-card__summary">${escapeHtml(access.summary)}</p>
      <div class="staff-access">
        <div class="staff-access__state ${escapeHtml(access.badgeClass)}">${escapeHtml(access.badge)}</div>
        <div class="staff-access__summary"><strong>Verified identity</strong><span>${escapeHtml(displayIdentity() || "No verified Discord session")}</span></div>
        <div class="staff-access__summary"><strong>Required role</strong><span>${escapeHtml(team.name)} (${escapeHtml(team.roleId)})</span></div>
        <div class="staff-access__summary"><strong>Role sync status</strong><span>${escapeHtml((state.roleSync && state.roleSync.syncStatus) || "pending")}</span></div>
        <div class="staff-access__meta">Last Discord verification: ${escapeHtml(formatDateTime(state.roleSync && state.roleSync.verifiedAt))}</div>
        <div class="staff-access__buttons">${loginAction}${secondaryAction}</div>
        <div class="staff-access__summary"><strong>Other unlocked teams</strong><span>${escapeHtml(otherSummary)}</span></div>
      </div>
    </article>
  `;
}

function renderUnlocked(team) {
  return `
    <article class="staff-card">
      <span class="staff-card__eyebrow">Toolset</span>
      <h2 class="staff-card__title">${escapeHtml(team.name)} tools</h2>
      <p class="staff-card__summary">This page groups the tools this team can use on staff.sgcnr.net instead of burying them in one large Discord channel.</p>
      <div class="staff-team-tools">${team.tools.map(renderToolCard).join("")}</div>
    </article>
    <article class="staff-card">
      <span class="staff-card__eyebrow">Suggested workflow</span>
      <h2 class="staff-card__title">How this team uses the portal</h2>
      <ul class="staff-card__list">${team.modules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function renderLocked(team) {
  return `
    <article class="staff-card">
      <span class="staff-card__eyebrow">Workspace locked</span>
      <h2 class="staff-card__title">${escapeHtml(team.name)} unlocks only after Discord role verification</h2>
      <p class="staff-card__summary">The full workspace stays hidden until the signed-in Discord account matches the exact ${escapeHtml(team.name)} role.</p>
      <ul class="staff-card__list">${team.tools.map((tool) => `<li>${escapeHtml(tool.title)} unlocks after verification.</li>`).join("")}</ul>
    </article>
    <article class="staff-card">
      <span class="staff-card__eyebrow">What opens next</span>
      <h2 class="staff-card__title">${escapeHtml(team.name)} workflow modules</h2>
      <ul class="staff-card__list">${team.modules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function renderSidebar(team, access) {
  const common = `${renderRoleCard(team, access)}<article class="staff-card"><span class="staff-card__eyebrow">Role visibility</span><h2 class="staff-card__title">Verified role check</h2><ul class="staff-role-list"><li><div><strong>${escapeHtml(team.name)}</strong><span>Required Discord role for this workspace.</span></div><span class="staff-thread__time">${escapeHtml(team.roleId)}</span></li></ul></article>`;
  if (!access.canAccess) {
    return `${common}<article class="staff-card"><span class="staff-card__eyebrow">Ready-made next step</span><h2 class="staff-card__title">What opens after verification</h2><ul class="staff-kpi-list"><li><strong>Team workspace</strong><span>Every tool card, workflow block, and handoff lane for ${escapeHtml(team.name)}.</span></li><li><strong>Discord identity lock</strong><span>The route stays tied to the verified Discord account and role.</span></li><li><strong>Live staff data</strong><span>Future audit feeds and actions can plug into this team route directly.</span></li></ul></article>`;
  }
  return `${common}<article class="staff-card"><span class="staff-card__eyebrow">Ready-made live modules</span><h2 class="staff-card__title">What can be wired in next</h2><ul class="staff-kpi-list"><li><strong>Discord sync</strong><span>Show linked identity, nickname, roles, and last verification.</span></li><li><strong>Threaded updates</strong><span>Per-team internal threads instead of one large Discord channel.</span></li><li><strong>API status</strong><span>Expose auth, live ops, and internal workflow health.</span></li><li><strong>Audit feed</strong><span>Attach actions and changes directly to each team workspace.</span></li></ul></article><article class="staff-thread"><span class="staff-thread__eyebrow">Team thread concept</span><h2 class="staff-card__title">Internal handoff lane</h2><ul class="staff-thread__list">${team.thread.map((item) => `<li class="staff-thread__item"><div><span class="staff-thread__name">${escapeHtml(item.name)}</span><div class="staff-thread__body">${escapeHtml(item.body)}</div></div><span class="staff-thread__time">${escapeHtml(item.time)}</span></li>`).join("")}</ul></article>`;
}

function renderTeam(team) {
  if (!appRoot) return;
  const access = teamAccess(team);
  const panelSummary = `${team.name} workspace for role-verified internal tools, workflow, and handoff lanes.`;
  const heroButtons = access.canAccess
    ? `<button class="staff-panel__button staff-panel__button--primary" type="button" disabled>Verified for ${escapeHtml(team.name)}</button><button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button><a class="staff-panel__button" href="${escapeHtml(buildLogoutUrl(team.slug))}">Logout</a>`
    : `<a class="staff-panel__button staff-panel__button--primary" href="${escapeHtml(buildLoginUrl(team.slug))}">Login to ${escapeHtml(team.name)}</a><button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button><button class="staff-panel__button" type="button" disabled>Workspace locked</button>`;

  appRoot.innerHTML = `
    <section class="staff-page">
      <div class="staff-hero">
        <article class="staff-panel">
          <span class="staff-panel__eyebrow">${escapeHtml(team.eyebrow)}</span>
          <h1 class="staff-panel__title">${escapeHtml(team.name)}</h1>
          <p class="staff-panel__summary">${escapeHtml(team.summary || panelSummary)}</p>
          <div class="staff-panel__actions">${heroButtons}</div>
        </article>
        <aside class="staff-overview">${team.overview.map(renderOverviewCard).join("")}</aside>
      </div>
      <div class="staff-grid">
        <section class="staff-section">${access.canAccess ? renderUnlocked(team) : renderLocked(team)}</section>
        <aside class="staff-sidebar">${renderSidebar(team, access)}</aside>
      </div>
    </section>
  `;
}

function renderAuthActions() {
  if (!authActionsEl) return;
  const team = getTeamBySlug(getRouteSlug());
  const unlockedTeams = TEAM_WORKSPACES.filter((entry) => authRoles().includes(entry.roleId));
  const unlockedLabel = unlockedTeams.length === 1 ? "1 team space unlocked" : `${unlockedTeams.length} team spaces unlocked`;

  if (state.loading) {
    authActionsEl.innerHTML = `<div class="staff-chip staff-chip--soft">Checking Discord session</div><button class="staff-action staff-action--primary" type="button" data-action="refresh-auth">Refresh</button>`;
    return;
  }

  if (!authUser()) {
    authActionsEl.innerHTML = `<div class="staff-chip staff-chip--soft">Discord verification required</div><a class="staff-action staff-action--primary" href="${escapeHtml(buildLoginUrl(team.slug))}">Login to ${escapeHtml(team.name)}</a>`;
    return;
  }

  const avatarUrl = authUser().discordAvatarUrl || "";
  const fallback = escapeHtml((displayIdentity().trim().charAt(0) || "S").toUpperCase());
  const avatar = avatarUrl
    ? `<img class="staff-account__avatar" src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(displayIdentity())}" />`
    : `<span class="staff-account__avatar staff-account__avatar--fallback">${fallback}</span>`;

  authActionsEl.innerHTML = `<div class="staff-account">${avatar}<div class="staff-account__copy"><strong class="staff-account__name">${escapeHtml(displayIdentity())}</strong><span class="staff-account__meta">${escapeHtml(unlockedLabel)}</span></div></div><button class="staff-action" type="button" data-action="refresh-auth">Refresh roles</button><a class="staff-action staff-action--primary" href="${escapeHtml(buildLogoutUrl(team.slug))}">Logout</a>`;
}

async function fetchJson(url) {
  const response = await fetch(url, { method: "GET", credentials: "include", cache: "no-store", headers: { Accept: "application/json" } });
  const raw = await response.text();
  const parsed = raw ? JSON.parse(raw) : {};
  if (!response.ok) throw new Error((parsed && parsed.message) || `Auth request failed (${response.status})`);
  return parsed;
}

async function loadAuth() {
  state.loading = true;
  state.error = "";
  renderAuthActions();
  renderTeam(getTeamBySlug(getRouteSlug()));

  try {
    const [profile, roleSync] = await Promise.all([fetchJson(AUTH_ENDPOINTS.profile), fetchJson(AUTH_ENDPOINTS.roles)]);
    state.profile = profile;
    state.roleSync = roleSync;
  } catch (error) {
    state.profile = { authenticated: false };
    state.roleSync = { roles: [], syncStatus: "error", verifiedAt: null };
    state.error = error instanceof Error ? error.message : "Discord auth bridge unavailable";
  } finally {
    state.loading = false;
    route();
  }
}

function updateDock(slug) {
  document.querySelectorAll(".staff-dock__item").forEach((item) => item.classList.toggle("is-active", item.dataset.team === slug));
}

function updateTimestamp() {
  if (updatedEl) updatedEl.textContent = `Updated ${formatDateTime(new Date().toISOString())}`;
}

function route() {
  const team = getTeamBySlug(getRouteSlug());
  updateDock(team.slug);
  renderAuthActions();
  renderTeam(team);
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-action='refresh-auth']");
  if (!trigger) return;
  event.preventDefault();
  loadAuth();
});

window.addEventListener("hashchange", route);
updateTimestamp();
setInterval(updateTimestamp, 60000);
route();
loadAuth();
