const AUTH = {
  login: "https://sgcnr.net/auth/login.php",
  logout: "https://sgcnr.net/auth/logout.php",
  me: "https://sgcnr.net/auth/api.php",
  roles: "https://sgcnr.net/auth/roles.php",
};

const DEFAULT_ROUTE = "dashboard";
const app = document.getElementById("staffApp");
const authActions = document.getElementById("staffAuthActions");
const updated = document.getElementById("staffUpdated");

const teams = [
  { slug: "management", short: "MG", name: "Management Team", eyebrow: "Executive Control", roleId: "1479411370331078799", summary: "Leadership approvals, final sign-off, policy direction, and cross-team handoff control.", stats: [["Priority lanes", "5", "Leadership approvals and escalations."], ["Live approvals", "12", "Announcements, policy, and final sign-off."], ["Ops health", "Stable", "Quick read on workflow readiness."]], tools: [{ eyebrow: "Command Board", title: "Approvals and direction", summary: "High-impact calls, leadership notes, and final decisions.", items: ["Approve major internal changes", "Publish leadership notes", "Track escalations between teams"] }, { eyebrow: "Policy Desk", title: "Standards and staffing", summary: "Rules, staffing decisions, and operational direction.", items: ["Update internal standards", "Review staffing changes", "Coordinate cross-team priorities"] }], lanes: [["Leadership handoff", "Pending approvals, staffing changes, and policy updates.", "Live"], ["Executive follow-up", "Final checks before site-wide or staff-wide announcements.", "Queue"]] },
  { slug: "admin", short: "AD", name: "Admin Team", eyebrow: "Operations Control", roleId: "1479481021383835771", summary: "Operational oversight, complex player cases, internal reviews, and escalation control.", stats: [["Case queue", "18", "High-priority reviews and escalations."], ["Account checks", "34", "Identity lookups and staff-side verification."], ["Ops state", "Focused", "Admin queue is ready for action."]], tools: [{ eyebrow: "Case Desk", title: "High-level operations", summary: "Complex tickets, escalations, and admin-side follow-up.", items: ["Review escalated tickets", "Handle sensitive player cases", "Coordinate with management"] }, { eyebrow: "Identity Review", title: "Account and link checks", summary: "Discord, FiveM, and internal identity review.", items: ["Inspect linked identities", "Check unusual account states", "Verify staff-side player records"] }], lanes: [["Escalation board", "Waiting admin review from moderation or helpers.", "Now"], ["Internal review", "Admin-only notes and decision history.", "Live"]] },
  { slug: "moderation", short: "MOD", name: "Moderation Team", eyebrow: "Case Review", roleId: "1479481164371595406", summary: "Reports, evidence review, action tracking, and player-facing moderation workflow.", stats: [["Open reports", "27", "Fresh reports waiting first response."], ["Evidence lanes", "9", "Screens, clips, and logs in review."], ["Action state", "Active", "Moderation queue is moving."]], tools: [{ eyebrow: "Report Queue", title: "Reports and enforcement", summary: "Core moderation flow for incoming player cases.", items: ["Review fresh reports", "Track pending punishments", "Prepare escalation notes"] }, { eyebrow: "Evidence Desk", title: "Proof and case notes", summary: "Clips, screenshots, and internal moderation notes.", items: ["Inspect uploaded evidence", "Write staff-only notes", "Mark follow-up requirements"] }], lanes: [["Report thread", "Newest reports and mod-to-admin escalations.", "Live"], ["Evidence thread", "Shared proof review and case handoff.", "Queue"]] },
  { slug: "development", short: "DEV", name: "Development Team", eyebrow: "Build Pipeline", roleId: "1479481179198455818", summary: "Feature planning, deploy notes, issue tracking, and technical handoff across the project.", stats: [["Build items", "14", "Features, fixes, and blockers in motion."], ["Deploy notes", "6", "Pending rollout notes and checks."], ["Pipeline", "Green", "Core workflow is ready."]], tools: [{ eyebrow: "Release Board", title: "Builds and deploys", summary: "Release notes, blockers, and current technical priorities.", items: ["Track active feature work", "Prepare rollout notes", "Log blockers for staff visibility"] }, { eyebrow: "Issue Desk", title: "Technical follow-up", summary: "Bug handoff, internal requests, and cross-team support.", items: ["Review incoming staff issues", "Link GitHub tasks", "Coordinate with testers"] }], lanes: [["Build sync", "Active features, blockers, and release windows.", "Live"], ["Tech handoff", "Requests from staff teams waiting dev review.", "Queue"]] },
  { slug: "testing", short: "QA", name: "Testing Team", eyebrow: "Validation Deck", roleId: "1479481184470962349", summary: "Bug validation, repro notes, patch checks, and structured test handoff for releases.", stats: [["Runs queued", "11", "Patch checks and validation requests."], ["Bug repros", "8", "Open repro tasks and notes."], ["Release read", "Ready", "Testing lane is prepared."]], tools: [{ eyebrow: "Test Runs", title: "Validation and checks", summary: "Structured QA runs for updates and fixes.", items: ["Run assigned test plans", "Log pass or fail state", "Record repro details"] }, { eyebrow: "Bug Review", title: "Repro and handoff", summary: "Cleaner developer handoff for bug fixing.", items: ["Attach repro steps", "Mark needs rework", "Link dev-facing bug notes"] }], lanes: [["QA board", "Assigned runs, failed checks, and retest needs.", "Live"], ["Repro thread", "Detailed repro notes and verification updates.", "Queue"]] },
  { slug: "translation", short: "TR", name: "Translation Team", eyebrow: "Locale Desk", roleId: "1479481187692056626", summary: "Localization review, terminology consistency, and content rollout for translated player-facing copy.", stats: [["Locale tasks", "10", "Strings waiting review or update."], ["Terminology gaps", "4", "Terms needing alignment."], ["Coverage", "Strong", "Translation lane is stable."]], tools: [{ eyebrow: "String Review", title: "Localization backlog", summary: "Review new copy and keep translations aligned.", items: ["Review pending strings", "Mark missing translations", "Track locale updates"] }, { eyebrow: "Tone Guide", title: "Terminology and style", summary: "Shared wording consistency for the brand.", items: ["Keep glossary aligned", "Review phrasing quality", "Flag unclear source copy"] }], lanes: [["Locale queue", "Incoming strings and review status.", "Live"], ["Style sync", "Glossary and tone review follow-ups.", "Queue"]] },
  { slug: "helper", short: "HP", name: "Helper Team", eyebrow: "Player Support", roleId: "1479485844304953458", summary: "Player questions, onboarding help, FAQ gaps, and first-response workflow for everyday support.", stats: [["Open asks", "21", "Player questions waiting response."], ["Guide gaps", "7", "Missing or outdated help topics."], ["Support mood", "Warm", "Player help lane is healthy."]], tools: [{ eyebrow: "Help Queue", title: "First-response support", summary: "Daily player questions and helper-side follow-up.", items: ["Answer onboarding questions", "Escalate account or rule issues", "Track repeat confusion points"] }, { eyebrow: "Guide Desk", title: "Knowledge and FAQ", summary: "Spot weak help pages and support friction.", items: ["Log FAQ gaps", "Suggest guide updates", "Track recurring support patterns"] }], lanes: [["Support handoff", "Helper-to-admin or helper-to-moderation escalations.", "Live"], ["FAQ updates", "Repeated confusion and content follow-up.", "Queue"]] },
  { slug: "security", short: "SEC", name: "Security Team", eyebrow: "Incident Control", roleId: "1479481204028866600", summary: "Internal incident review, abuse tracking, access control checks, and security-side escalation handling.", stats: [["Alerts", "6", "Incidents and access concerns."], ["Reviews", "4", "Open internal investigations."], ["Security state", "Guarded", "Monitoring is active."]], tools: [{ eyebrow: "Incident Board", title: "Alerts and investigations", summary: "Sensitive incident tracking and security review.", items: ["Review abuse alerts", "Track internal investigations", "Escalate high-risk issues"] }, { eyebrow: "Access Desk", title: "Permissions and trust", summary: "Check internal access issues and unusual patterns.", items: ["Review access anomalies", "Audit sensitive permission use", "Track suspicious behavior"] }], lanes: [["Incident lane", "Open incident notes and urgent review items.", "Live"], ["Access review", "Permission checks and internal audit follow-up.", "Queue"]] },
  { slug: "creator", short: "CC", name: "Content Creator Team", eyebrow: "Media Studio", roleId: "1479485986772877414", summary: "Creative requests, campaign assets, visual rollout, and staff-side handoff for media production.", stats: [["Asset asks", "13", "Pending banners, art, and promo tasks."], ["Review queue", "5", "Waiting approval or revision."], ["Studio state", "Rolling", "Content lane is active."]], tools: [{ eyebrow: "Content Board", title: "Assets and campaigns", summary: "Visual requests, deadlines, and release planning.", items: ["Review incoming asset asks", "Track campaign deliverables", "Prepare release visuals"] }, { eyebrow: "Approval Desk", title: "Creative review", summary: "Feedback, revisions, and sign-off flow.", items: ["Collect internal feedback", "Log change requests", "Mark assets approved"] }], lanes: [["Creative handoff", "Requests from management, social, and development.", "Live"], ["Review thread", "Feedback notes and revision tracking.", "Queue"]] },
  { slug: "social", short: "SOC", name: "Social Team", eyebrow: "Community Pulse", roleId: "1479485995190583356", summary: "Post scheduling, platform coordination, event promotion, and community-facing campaign planning.", stats: [["Post queue", "16", "Scheduled and pending posts."], ["Campaigns", "7", "Active community pushes."], ["Pulse", "Up", "Social calendar is active."]], tools: [{ eyebrow: "Social Calendar", title: "Posts and timing", summary: "Plan, schedule, and track community content.", items: ["Prepare platform-specific posts", "Track event promotion", "Coordinate timing with creators"] }, { eyebrow: "Community Desk", title: "Engagement planning", summary: "Respond to trends and support public comms.", items: ["Review campaign impact", "Track upcoming events", "Prepare community highlights"] }], lanes: [["Posting lane", "Queued posts and timing updates.", "Live"], ["Campaign sync", "Cross-team promotion and community follow-up.", "Queue"]] },
];

const teamsBySlug = Object.fromEntries(teams.map((team) => [team.slug, team]));
const state = { status: "loading", user: null, roles: [], syncStatus: "loading", verifiedAt: "", error: "" };

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function initials(value) {
  const parts = String(value || "Staff").trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || "S") + (parts[1]?.[0] || "");
}

function stampNow() {
  if (!updated) return;
  const text = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  updated.textContent = `Updated ${text}`;
}

function routeSlug() {
  const slug = (window.location.hash || "").replace(/^#\/?/, "").split("/")[0].toLowerCase();
  if (!slug) return DEFAULT_ROUTE;
  return slug === DEFAULT_ROUTE || teamsBySlug[slug] ? slug : DEFAULT_ROUTE;
}

function routeTeam() {
  return teamsBySlug[routeSlug()] || null;
}

function currentReturnUrl(hashValue = window.location.hash || "#/dashboard") {
  const normalized = hashValue.startsWith("#/") ? hashValue : "#/dashboard";
  return `${window.location.origin}${window.location.pathname}${normalized}`;
}

function loginHref(hashValue) {
  return `${AUTH.login}?return_to=${encodeURIComponent(currentReturnUrl(hashValue))}`;
}

function logoutHref() {
  return `${AUTH.logout}?return_to=${encodeURIComponent(currentReturnUrl("#/dashboard"))}`;
}

function fetchJson(url) {
  return fetch(url, {
    method: "GET",
    cache: "no-store",
    credentials: "include",
    headers: { "X-Requested-With": "fetch" },
  }).then(async (response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
}

function unlockedTeams() {
  return teams.filter((team) => state.roles.includes(team.roleId));
}

function accessState(team) {
  if (state.status === "loading") {
    return { kind: "loading", label: "Checking access", summary: "Discord verification is being checked for this workspace." };
  }
  if (state.status === "error") {
    return { kind: "error", label: "Auth check failed", summary: state.error || "The live Discord verification endpoints could not be reached." };
  }
  if (state.status !== "signed_in") {
    return { kind: "login", label: "Discord verification required", summary: `Sign in with Discord to check whether this account unlocks ${team.name}.` };
  }
  if (state.roles.includes(team.roleId)) {
    return { kind: "granted", label: "Workspace unlocked", summary: `${team.name} is unlocked for this verified Discord account.` };
  }
  return { kind: "denied", label: "Workspace locked", summary: `${team.name} requires the exact verified Discord team role before the workspace opens.` };
}

function accountMarkup() {
  if (!state.user) return "";
  const avatar = state.user.discordAvatarUrl
    ? `<img class="staff-account__avatar" src="${esc(state.user.discordAvatarUrl)}" alt="${esc(state.user.verifiedIdentity || state.user.discordUsername || "Staff account")}" />`
    : `<span class="staff-account__avatar staff-account__avatar--fallback">${esc(initials(state.user.verifiedIdentity || state.user.discordUsername))}</span>`;
  return `<div class="staff-account">${avatar}<div class="staff-account__copy"><strong class="staff-account__name">${esc(state.user.verifiedIdentity || state.user.discordDisplayName || state.user.discordUsername)}</strong><span class="staff-account__meta">${esc(state.user.discordUsername || "Discord account")}</span></div></div>`;
}

function topbarActions() {
  const team = routeTeam();
  if (state.status === "signed_in" && state.user) {
    authActions.innerHTML = `${accountMarkup()}<button class="staff-action" type="button" data-action="refresh-auth">Refresh role check</button><a class="staff-action staff-action--primary" href="${logoutHref()}">Logout</a>`;
    return;
  }
  if (state.status === "loading") {
    authActions.innerHTML = `<button class="staff-action" type="button" disabled>Checking session</button><button class="staff-action staff-action--primary" type="button" disabled>Loading roles</button>`;
    return;
  }
  const label = team ? `Login to ${team.name}` : "Login to Staff Portal";
  authActions.innerHTML = `<button class="staff-action" type="button" disabled>Discord verification required</button><a class="staff-action staff-action--primary" href="${loginHref(team ? `#/${team.slug}` : "#/dashboard")}">${esc(label)}</a>`;
}

function statCards(items) {
  return items.map(([label, value, meta]) => `<section class="staff-overview__card"><span class="staff-overview__label">${esc(label)}</span><div class="staff-overview__value">${esc(value)}</div><p class="staff-overview__meta">${esc(meta)}</p></section>`).join("");
}

function accessPanel(team, access) {
  const mode = access.kind === "granted" ? "ok" : access.kind === "denied" || access.kind === "error" ? "warn" : "";
  const title = access.kind === "granted" ? "Role verified" : access.kind === "error" ? "Auth bridge unavailable" : `${team.name} login`;
  const targetHash = team.slug ? `#/${team.slug}` : "#/dashboard";
  const otherUnlocked = unlockedTeams().filter((entry) => !team.slug || entry.slug !== team.slug).map((entry) => entry.name).join(", ") || "No other team spaces are unlocked on this Discord account yet.";
  const buttons = access.kind === "granted"
    ? `<div class="staff-access__buttons"><a class="staff-panel__button staff-panel__button--primary" href="${targetHash}">Open ${esc(team.name)}</a><button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button></div>`
    : `<div class="staff-access__buttons"><a class="staff-panel__button staff-panel__button--primary" href="${loginHref(targetHash)}">Login to ${esc(team.name)}</a><button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button></div>`;
  return `<section class="staff-card"><span class="staff-card__eyebrow">${esc(team.name)} Login</span><h2 class="staff-card__title">${esc(title)}</h2><p class="staff-card__summary">${esc(access.summary)}</p><div class="staff-access"><div class="staff-access__state ${mode ? `staff-access__state--${mode}` : ""}">${esc(access.label)}</div>${buttons}<div class="staff-access__summary"><strong>Verified identity</strong><span>${esc(state.user?.verifiedIdentity || "No verified Discord session")}</span></div><div class="staff-access__meta"><strong>Required role</strong>${esc(`${team.name} (${team.roleId})`)}</div><div class="staff-access__meta"><strong>Role sync status</strong>${esc(state.syncStatus || "pending")}</div><div class="staff-access__meta"><strong>Last Discord verification</strong>${esc(state.verifiedAt ? new Date(state.verifiedAt).toLocaleString("en-GB") : "Pending verification")}</div><div class="staff-access__meta"><strong>Other unlocked teams</strong>${esc(otherUnlocked)}</div></div></section>`;
}

function teamTools(team) {
  return team.tools.map((tool) => `<article class="staff-card"><span class="staff-card__eyebrow">${esc(tool.eyebrow)}</span><h3 class="staff-card__title">${esc(tool.title)}</h3><p class="staff-card__summary">${esc(tool.summary)}</p><ul class="staff-card__list">${tool.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>`).join("");
}

function teamLanes(team) {
  return `<section class="staff-thread"><span class="staff-thread__eyebrow">${esc(team.name)} Lanes</span><ul class="staff-thread__list">${team.lanes.map(([name, body, time]) => `<li class="staff-thread__item"><div><strong class="staff-thread__name">${esc(name)}</strong><p class="staff-thread__body">${esc(body)}</p></div><span class="staff-thread__time">${esc(time)}</span></li>`).join("")}</ul></section>`;
}

function dashboardView() {
  const unlocked = unlockedTeams();
  if (state.status !== "signed_in" || !state.user) {
    return `<section class="staff-page"><section class="staff-hero"><article class="staff-panel"><span class="staff-panel__eyebrow">Discord-only staff access</span><h1 class="staff-panel__title">Staff Portal<br />Login</h1><p class="staff-panel__summary">Sign in with Discord first. After login, the front page becomes the role dashboard and only the team spaces that match your verified staff roles unlock.</p><div class="staff-panel__actions"><a class="staff-panel__button staff-panel__button--primary" href="${loginHref("#/dashboard")}">Login to Staff Portal</a><button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button></div></article><aside class="staff-overview">${statCards([["Team lanes", String(teams.length), "Management, moderation, development, testing, and more."], ["Auth mode", "Discord", "No manual staff login is used here."], ["Access type", "Role-gated", "Only verified staff roles unlock a workspace."]])}</aside></section><section class="staff-grid"><article class="staff-card"><span class="staff-card__eyebrow">What unlocks after login</span><h2 class="staff-card__title">Role-based dashboard</h2><p class="staff-card__summary">Once Discord verification succeeds, this page turns into the personal staff dashboard for that account.</p><ul class="staff-card__list"><li>Only the exact verified staff roles unlock their team spaces.</li><li>The dashboard shows which teams are currently open for this account.</li><li>Every team route still has its own dedicated login and role check state.</li></ul></article><article class="staff-card"><span class="staff-card__eyebrow">Protected access</span><h2 class="staff-card__title">No cross-team logins</h2><p class="staff-card__summary">Having staff access in one area does not unlock another one. Management, Admin, Moderation, Security, and the other teams all stay isolated behind their own Discord role.</p><ul class="staff-card__list"><li>Management only opens with the Management Team role.</li><li>Admin only opens with the Admin Team role.</li><li>Every other team follows the same rule.</li></ul></article></section></section>`;
  }
  const identity = state.user.verifiedIdentity || state.user.discordDisplayName || state.user.discordUsername;
  if (!unlocked.length) {
    return `<section class="staff-page"><section class="staff-hero"><article class="staff-panel"><span class="staff-panel__eyebrow">Verified staff dashboard</span><h1 class="staff-panel__title">No staff role<br />unlocked</h1><p class="staff-panel__summary">${esc(identity)} is signed in, but this Discord account does not currently hold any of the verified staff team roles used by the portal.</p><div class="staff-panel__actions"><button class="staff-panel__button staff-panel__button--primary" type="button" data-action="refresh-auth">Refresh role check</button><a class="staff-panel__button" href="${logoutHref()}">Logout</a></div></article><aside class="staff-overview">${statCards([["Unlocked teams", "0", "No staff workspaces are open for this account."], ["Sync status", state.syncStatus || "Pending", "Role verification is connected to Discord."], ["Verified identity", identity, "This is the current Discord identity."]])}</aside></section><section class="staff-grid"><article class="staff-card"><span class="staff-card__eyebrow">Next step</span><h2 class="staff-card__title">Role access is still required</h2><p class="staff-card__summary">If this account should have access, update the Discord staff role first and then run another role check from here.</p><ul class="staff-card__list"><li>Make sure the correct staff role is assigned in Discord.</li><li>Refresh the role check once the role is synced.</li><li>Then the dashboard will unlock the matching team space automatically.</li></ul></article>${accessPanel({ name: "Staff Portal", roleId: "Verified staff role" }, { kind: state.syncStatus === "error" ? "error" : "denied", label: state.syncStatus === "error" ? "Auth check failed" : "No team role unlocked", summary: state.error || "This account is verified, but no matching staff role is currently available for the portal." })}</section></section>`;
  }
  return `<section class="staff-page"><section class="staff-hero"><article class="staff-panel"><span class="staff-panel__eyebrow">Verified staff dashboard</span><h1 class="staff-panel__title">${esc(identity)}<br />dashboard</h1><p class="staff-panel__summary">This account is verified through Discord. The dashboard below shows every staff team that is currently unlocked for this role set.</p><div class="staff-panel__actions"><a class="staff-panel__button staff-panel__button--primary" href="#/${unlocked[0].slug}">Open ${esc(unlocked[0].name)}</a><button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button><a class="staff-panel__button" href="${logoutHref()}">Logout</a></div></article><aside class="staff-overview">${statCards([["Unlocked teams", String(unlocked.length), "Team spaces verified for this account."], ["Discord roles", String(state.roles.length), "Current verified role count from Discord."], ["Sync status", state.syncStatus || "ok", "Live role bridge and session state."]])}</aside></section><section class="staff-grid"><article class="staff-card"><span class="staff-card__eyebrow">Unlocked workspaces</span><h2 class="staff-card__title">Your team access</h2><p class="staff-card__summary">Open any role-matched workspace directly from here.</p><ul class="staff-role-list">${unlocked.map((team) => `<li><div><strong>${esc(team.name)}</strong><span>${esc(team.summary)}</span></div><a class="staff-panel__button" href="#/${team.slug}">Open</a></li>`).join("")}</ul></article><article class="staff-card"><span class="staff-card__eyebrow">Verified role check</span><h2 class="staff-card__title">Current account state</h2><p class="staff-card__summary">This dashboard is built from the live Discord session and role verification state.</p><ul class="staff-kpi-list"><li><div><strong>Verified identity</strong><span>${esc(identity)}</span></div><span>${esc(state.user.discordUsername || "Discord")}</span></li><li><div><strong>Last role check</strong><span>${esc(state.verifiedAt ? new Date(state.verifiedAt).toLocaleString("en-GB") : "Pending verification")}</span></div><span>${esc(state.syncStatus || "ok")}</span></li><li><div><strong>Unlocked teams</strong><span>${esc(unlocked.map((team) => team.short).join(" / "))}</span></div><span>${esc(unlocked.map((team) => team.name).join(", "))}</span></li></ul></article></section></section>`;
}

function teamView(team) {
  const access = accessState(team);
  const granted = access.kind === "granted";
  const primary = granted ? `<a class="staff-panel__button staff-panel__button--primary" href="#/${team.slug}">Workspace unlocked</a>` : `<a class="staff-panel__button staff-panel__button--primary" href="${loginHref(`#/${team.slug}`)}">Login to ${esc(team.name)}</a>`;
  const secondary = `<button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button>`;
  const tertiary = granted ? `<a class="staff-panel__button" href="${logoutHref()}">Logout</a>` : `<button class="staff-panel__button" type="button" disabled>Workspace locked</button>`;
  const lead = granted
    ? `<article class="staff-card"><span class="staff-card__eyebrow">Workspace ready</span><h2 class="staff-card__title">${esc(team.name)} is unlocked</h2><p class="staff-card__summary">This verified Discord account has the exact staff role needed for this workspace.</p><ul class="staff-card__list">${team.tools[0].items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>`
    : `<article class="staff-card"><span class="staff-card__eyebrow">Workspace locked</span><h2 class="staff-card__title">${esc(team.name)} unlocks only after Discord role verification</h2><p class="staff-card__summary">The full workspace stays hidden until the signed-in Discord account matches the exact ${esc(team.name)} role.</p><ul class="staff-card__list"><li>Command dashboard unlocks after verification.</li><li>Team tools and handoff lanes unlock after verification.</li><li>Wrong-role accounts stay blocked even after login.</li></ul></article>`;
  const tools = granted ? `<section class="staff-team-tools">${teamTools(team)}</section>${teamLanes(team)}` : "";
  return `<section class="staff-page"><section class="staff-hero"><article class="staff-panel"><span class="staff-panel__eyebrow">${esc(team.eyebrow)}</span><h1 class="staff-panel__title">${esc(team.name)}</h1><p class="staff-panel__summary">${esc(team.summary)}</p><div class="staff-panel__actions">${primary}${secondary}${tertiary}</div></article><aside class="staff-overview">${statCards(team.stats)}</aside></section><section class="staff-grid">${lead}${accessPanel(team, access)}</section>${tools}</section>`;
}

function setActiveDock() {
  const active = routeSlug();
  document.querySelectorAll(".staff-dock__item").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.team === active);
  });
}

function render() {
  topbarActions();
  setActiveDock();
  const slug = routeSlug();
  app.innerHTML = slug === DEFAULT_ROUTE ? dashboardView() : teamView(teamsBySlug[slug] || teams[0]);
}

async function loadAuth() {
  state.status = "loading";
  state.error = "";
  render();
  try {
    const [me, roles] = await Promise.allSettled([fetchJson(AUTH.me), fetchJson(AUTH.roles)]);
    if (me.status === "rejected") throw me.reason;
    if (!me.value?.authenticated) {
      state.status = "signed_out";
      state.user = null;
      state.roles = [];
      state.syncStatus = "not_authenticated";
      state.verifiedAt = "";
      render();
      return;
    }
    state.status = "signed_in";
    state.user = me.value.user || null;
    if (roles.status === "fulfilled") {
      state.roles = Array.isArray(roles.value.roles) ? roles.value.roles : [];
      state.syncStatus = roles.value.syncStatus || "ok";
      state.verifiedAt = roles.value.verifiedAt || "";
      state.error = "";
    } else {
      state.roles = Array.isArray(me.value.user?.roles) ? me.value.user.roles : [];
      state.syncStatus = "error";
      state.verifiedAt = "";
      state.error = "The staff site could not reach the live Discord verification endpoints. This usually means the live auth config still needs to allow staff.sgcnr.net.";
    }
  } catch (error) {
    state.status = "error";
    state.user = null;
    state.roles = [];
    state.syncStatus = "error";
    state.verifiedAt = "";
    state.error = "Auth check failed. The staff portal could not verify the live Discord session.";
  }
  render();
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]");
  if (!action) return;
  if (action.dataset.action === "refresh-auth") loadAuth();
});

window.addEventListener("hashchange", render);
stampNow();
render();
loadAuth();
