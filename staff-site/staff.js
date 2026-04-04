const AUTH = {
  login: "https://sgcnr.net/auth/login.php",
  logout: "https://sgcnr.net/auth/logout.php",
  me: "https://sgcnr.net/auth/api.php",
  roles: "https://sgcnr.net/auth/roles.php",
};

const DEFAULT_ROUTE = "dashboard";
const shell = document.getElementById("staffShell");
const app = document.getElementById("staffApp");
const authActions = document.getElementById("staffAuthActions");
const updated = document.getElementById("staffUpdated");
const modeChip = document.getElementById("staffModeChip");

const teams = [
  {
    slug: "management",
    short: "MG",
    name: "Management Team",
    roleId: "1479411370331078799",
    eyebrow: "Executive command",
    summary: "Complete operational control, leadership approvals, cross-team visibility, and the top-level live surfaces once the server and bot integrations are online.",
    stats: [["Clearance", "Full", "Management sees every workspace and every prepared live surface."], ["Prepared live lanes", "6", "txAdmin, server telemetry, incident pressure, and cross-team approvals."], ["Command state", "Prime", "Leadership workspace is built to sit above every team."]],
    channels: [["Executive command", "Leadership-only control lane for final sign-off, staffing, and priority calls."], ["Cross-team escalations", "All urgent handoffs from Admin, Moderation, Security, and Development."], ["Broadcast approvals", "Final release for staff-wide notices, policy shifts, and rollout timing."], ["Live incident desk", "Single place for critical server, moderation, and access incidents."]],
    modules: [["Live txAdmin console", "Prepared command surface for runtime actions, restarts, player management, and server-state control.", "prepared"], ["Live server data bus", "Prepared dashboard cards for queue, player count, performance, restart state, and incident pressure.", "prepared"], ["Executive approvals matrix", "Approvals, sign-off lanes, and staffing decisions across the whole portal.", "ready"], ["Cross-team command view", "Aggregated overview of every staff workspace and its highest-priority signals.", "ready"]],
    feeds: [["Priority incident stream", "Prepared high-priority feed for future server and auth incidents.", "prepared"], ["Release and deploy watch", "Prepared launch board for site, API, and server rollout events.", "prepared"], ["Staff action firehose", "Prepared unified mirror of major staff actions from the Discord bot and future backend.", "prepared"], ["Command notes", "Leadership note stream for follow-up actions and policy decisions.", "ready"]],
  },
  {
    slug: "admin",
    short: "AD",
    name: "Admin Team",
    roleId: "1479481021383835771",
    eyebrow: "Operations control",
    summary: "High-level cases, linked identity review, appeal decisions, and staff-wide operational oversight with a stronger moderation mirror than any other non-management workspace.",
    stats: [["Ops coverage", "High", "Admin controls escalations, linked accounts, and staff-wide case review."], ["Prepared live feeds", "4", "Moderation mirror, account integrity, appeals, and bot-side action logs."], ["Decision pressure", "Active", "This workspace is tuned for heavy review and escalation flow."]],
    channels: [["Admin operations", "Main internal lane for difficult cases, escalations, and operational decisions."], ["Appeal and review", "Sensitive punishment reviews, appeals, and edge-case resolution."], ["Identity integrity", "Discord, FiveM, and account-link review for suspicious or broken states."], ["Moderation bridge", "Admin-side mirror of moderation escalation and bot-fed action logs."]],
    modules: [["Live moderation mirror", "Prepared log wall for punishments, warnings, role changes, and other bot-fed moderation signals.", "prepared"], ["Linked account review", "Review Discord-to-FiveM identity matches, suspicious links, and account anomalies.", "ready"], ["Appeal decision board", "Organized case review space for staff-wide decisions and resolution tracking.", "ready"], ["Admin action oversight", "Prepared internal history for major staff decisions, bans, and escalations.", "prepared"]],
    feeds: [["Case escalation queue", "Live-ready intake for reports and helper or moderator escalations.", "ready"], ["Bot moderation log", "Prepared Discord-bot mirror for major actions, reviewed from the admin level.", "prepared"], ["Identity exceptions", "Prepared alert lane for mismatched links and integrity issues.", "prepared"], ["Decision notes", "Internal admin notes and follow-up trail for sensitive cases.", "ready"]],
  },
  {
    slug: "moderation",
    short: "MOD",
    name: "Moderation Team",
    roleId: "1479481164371595406",
    eyebrow: "Case review",
    summary: "Fast report handling, evidence review, action tracking, and prepared live moderation streams from the Discord bot with a smaller surface than Admin.",
    stats: [["Case intake", "Focused", "Moderation centers around report speed, evidence quality, and action clarity."], ["Prepared feeds", "3", "Action stream, evidence queue, and escalation handoff."], ["Response mode", "Hot", "Built for quick intake and clean escalation."]],
    channels: [["Report intake", "First-look report queue with quick triage and ownership assignment."], ["Evidence wall", "Screens, clips, and proof review for active cases."], ["Action notes", "Case notes, warning history, and short moderation summaries."], ["Escalation handoff", "Structured path from Moderator to Admin or Security when a case grows."]],
    modules: [["Live action stream", "Prepared bot-fed panel for warnings, kicks, bans, and timed punishments.", "prepared"], ["Evidence review wall", "Working space for proof quality, timestamps, and case context.", "ready"], ["Case ownership board", "Assign, track, and escalate active moderation reports cleanly.", "ready"], ["Repeat-offender glance", "Prepared view for pattern tracking and repeat behavior review.", "prepared"]],
    feeds: [["Fresh report lane", "Newest reports waiting first moderation response.", "ready"], ["Action fire line", "Prepared live list of moderation actions once bot sync is expanded.", "prepared"], ["Escalation summary", "Compact queue of cases waiting admin or security attention.", "ready"], ["Policy reminders", "Shared moderation guidance and quick-reference policy notes.", "ready"]],
  },
  {
    slug: "development",
    short: "DEV",
    name: "Development Team",
    roleId: "1479481179198455818",
    eyebrow: "Build pipeline",
    summary: "Feature delivery, deployment readiness, technical issue intake, and prepared runtime surfaces for when the server and API are fully live.",
    stats: [["Release track", "Green", "This workspace is built around deploys, blockers, and system readiness."], ["Prepared live lanes", "4", "Service health, txAdmin read-outs, config drift, and runtime watch."], ["Build focus", "High", "Technical handoff and delivery remain at the center."]],
    channels: [["Deploy board", "Feature releases, patch planning, and launch approvals."], ["Issue bridge", "Incoming technical issues from staff teams and testers."], ["Config review", "Server config, API config, and environment change follow-up."], ["Health watch", "Prepared read-only ops lane for server and backend health."]],
    modules: [["Service health board", "Prepared dashboard for API state, auth bridge, and portal uptime once the backend matures.", "prepared"], ["Runtime watch", "Prepared txAdmin and server-performance read-outs for operational debugging.", "prepared"], ["Issue handoff desk", "GitHub and internal issue flow for incoming requests and blockers.", "ready"], ["Release cut tracker", "Track release slices, rollback notes, and staging readiness.", "ready"]],
    feeds: [["Build blocker queue", "Open blockers and unresolved technical risks.", "ready"], ["Deploy timeline", "Prepared event stream for releases, rollbacks, and hotfixes.", "prepared"], ["Service alerts", "Prepared incident lane for backend, auth, or runtime issues.", "prepared"], ["Cross-team tech asks", "Incoming technical tasks from Admin, Testing, and Management.", "ready"]],
  },
  {
    slug: "testing",
    short: "QA",
    name: "Testing Team",
    roleId: "1479481184470962349",
    eyebrow: "Validation deck",
    summary: "Regression checks, repro quality, release validation, and clear developer handoff with structured testing lanes.",
    stats: [["Validation load", "Stable", "QA is built to move from test plans into clean pass or fail results."], ["Prepared live lanes", "2", "Release candidate watch and patch validation pulse."], ["QA state", "Ready", "Structured for repeatable checks, not chaos."]],
    channels: [["Regression queue", "Assigned test plans and current validation runs."], ["Bug repro bank", "Clear reproduction steps, evidence, and notes for developers."], ["Patch validation", "Release-candidate checks and change review before sign-off."], ["Fail or pass board", "Simple resolution lane for approved, failed, or needs-rework states."]],
    modules: [["Validation matrix", "Track current test runs, blockers, and pass or fail states.", "ready"], ["Bug repro archive", "Keep reproducible issues clean and ready for dev handoff.", "ready"], ["Release candidate watch", "Prepared lane for monitoring release validation progress live.", "prepared"], ["Retest tracker", "Follow-up board for fixed issues that need confirmation.", "ready"]],
    feeds: [["Failure recap", "Issues that failed validation and need developer attention.", "ready"], ["Ready-to-ship queue", "Items that passed QA and can move forward.", "ready"], ["Live patch pulse", "Prepared signal lane for active validation windows.", "prepared"], ["Tester handoff", "Internal note flow between QA and development.", "ready"]],
  },
  {
    slug: "translation",
    short: "TR",
    name: "Translation Team",
    roleId: "1479481187692056626",
    eyebrow: "Locale desk",
    summary: "Localized copy review, glossary control, terminology consistency, and rollout planning for translated player-facing content.",
    stats: [["Locale load", "Balanced", "Translation focuses on consistency and rollout quality."], ["Prepared live lanes", "2", "Locale rollout watch and source-change monitoring."], ["Coverage state", "Strong", "Built to keep terms aligned across updates."]],
    channels: [["String queue", "Incoming phrases, text changes, and untranslated content."], ["Glossary desk", "Approved terms, phrasing standards, and consistency checks."], ["Source copy watch", "Review source changes before translation work starts."], ["Locale rollout", "Plan when language updates move into the public site or tools."]],
    modules: [["String review board", "Review pending strings and keep translation status visible.", "ready"], ["Glossary control", "Central term alignment for titles, commands, and onboarding copy.", "ready"], ["Locale rollout planner", "Prepared release lane for pushing language updates into production.", "prepared"], ["Source diff watch", "Prepared watch panel for spotting text changes that need localization.", "prepared"]],
    feeds: [["Pending localization", "Open text needing translation or revision.", "ready"], ["Terminology conflicts", "Terms that need alignment before release.", "ready"], ["Rollout pulse", "Prepared watch for active localization pushes.", "prepared"], ["Copy review notes", "Internal feedback and phrasing guidance.", "ready"]],
  },
  {
    slug: "helper",
    short: "HP",
    name: "Helper Team",
    roleId: "1479485844304953458",
    eyebrow: "Player support",
    summary: "First-response player support, onboarding help, FAQ gaps, and escalation handoff for issues that need more than a quick answer.",
    stats: [["Support flow", "Warm", "Helpers focus on clarity, speed, and clean escalation."], ["Prepared live lanes", "2", "Onboarding watch and escalation pulse."], ["Queue mood", "Steady", "Support work is structured for speed, not noise."]],
    channels: [["Player help queue", "Daily questions, onboarding issues, and first-response support."], ["FAQ gap desk", "Track what confuses players repeatedly and what needs guide updates."], ["Onboarding watch", "Spot weak points in the first player experience."], ["Escalation relay", "Pass account, moderation, or technical issues to the right staff team."]],
    modules: [["Help intake board", "Assign and resolve first-response support requests.", "ready"], ["FAQ gap tracker", "Highlight repeated confusion and missing support content.", "ready"], ["Onboarding watch", "Prepared pattern board for common first-time player blockers.", "prepared"], ["Escalation relay", "Structured handoff from Helper to Admin, Moderator, or Development.", "ready"]],
    feeds: [["Fresh help asks", "Newest questions and unresolved support issues.", "ready"], ["Escalation pulse", "Prepared queue of issues that need higher-level review.", "prepared"], ["Guide update requests", "Support-driven content improvements for the public site.", "ready"], ["Helper notes", "Short staff-only notes for repeated player confusion.", "ready"]],
  },
  {
    slug: "security",
    short: "SEC",
    name: "Security Team",
    roleId: "1479481204028866600",
    eyebrow: "Incident control",
    summary: "Incident review, access anomalies, abuse signals, and higher-risk staff-side investigations with prepared live feeds for future auth and server telemetry.",
    stats: [["Risk state", "Guarded", "Security work is built around incidents, access control, and suspicious patterns."], ["Prepared live lanes", "4", "Auth anomalies, incident pressure, access audits, and alert surfaces."], ["Response focus", "Sharp", "This workspace is tuned for sensitive review."]],
    channels: [["Incident desk", "Primary security incident and abuse investigation lane."], ["Access audit", "Review sensitive role use, auth issues, and internal access changes."], ["Suspicious activity", "Signals that need verification, pattern review, or escalation."], ["Security escalation", "High-risk handoff into Management or Admin when an issue grows."]],
    modules: [["Incident monitor", "Track active incidents, ownership, and resolution progress.", "ready"], ["Auth anomaly review", "Prepared panel for suspicious login or role-sync patterns once the backend exposes them.", "prepared"], ["Access audit trail", "Structured record of sensitive permission changes and access checks.", "ready"], ["Risk escalation lane", "Escalate major issues to Management fast and cleanly.", "ready"]],
    feeds: [["Security alert pulse", "Prepared high-priority incident feed for future server and auth events.", "prepared"], ["Access review stream", "Sensitive access checks and trust reviews.", "ready"], ["Abuse signal queue", "Incoming suspicious behavior or repeated anomaly pattern reports.", "ready"], ["Security notes", "Internal staff-only decisions and investigation updates.", "ready"]],
  },
  {
    slug: "creator",
    short: "CC",
    name: "Content Creator Team",
    roleId: "1479485986772877414",
    eyebrow: "Media studio",
    summary: "Creative asset planning, campaign production, review flow, and visual release prep for content that supports the project publicly.",
    stats: [["Studio pace", "Rolling", "Creator work is organized around campaigns, approvals, and production flow."], ["Prepared live lanes", "2", "Media drop timing and campaign release pulse."], ["Asset pressure", "Medium", "Designed to keep requests and approvals clean."]],
    channels: [["Campaign board", "Visual campaigns, release planning, and deliverables."], ["Asset approval", "Internal approval path for thumbnails, graphics, and promos."], ["Shot list", "Planned content shots, captures, and production notes."], ["Media release board", "Track which assets are ready to ship publicly."]],
    modules: [["Asset request board", "Intake, organize, and prioritize new visual asks.", "ready"], ["Approval canvas", "Review revisions and move assets into final approval.", "ready"], ["Campaign production map", "Track active campaigns and which assets they still need.", "ready"], ["Media drop planner", "Prepared timing lane for aligned releases with Social and Management.", "prepared"]],
    feeds: [["Creative queue", "New creative tasks waiting pickup or review.", "ready"], ["Approval stream", "Assets waiting sign-off or revision.", "ready"], ["Release pulse", "Prepared coordination lane for asset publication timing.", "prepared"], ["Content notes", "Internal notes for revisions, concepts, and campaign direction.", "ready"]],
  },
  {
    slug: "social",
    short: "SOC",
    name: "Social Team",
    roleId: "1479485995190583356",
    eyebrow: "Community pulse",
    summary: "Post scheduling, campaign timing, public communication planning, and prepared live engagement surfaces for future analytics and event pushes.",
    stats: [["Calendar state", "Loaded", "Social work lives around timing, coordination, and community visibility."], ["Prepared live lanes", "3", "Engagement pulse, campaign timing, and live announcement sync."], ["Platform focus", "Active", "Built for public-facing coordination and timing."]],
    channels: [["Post calendar", "Scheduling, platform timing, and post planning."], ["Campaign sync", "Cross-team alignment for releases, events, and promotions."], ["Announcement mirror", "Public announcement coordination with Management and Content Creator."], ["Community pulse", "Prepared view for engagement, reactions, and public momentum."]],
    modules: [["Content calendar", "Track upcoming posts, deadlines, and platform needs.", "ready"], ["Announcement sync", "Coordinate outgoing communication across teams and channels.", "ready"], ["Community pulse", "Prepared dashboard for reaction and engagement patterns.", "prepared"], ["Campaign analytics lane", "Prepared summary board for future post and campaign performance metrics.", "prepared"]],
    feeds: [["Scheduled post queue", "Upcoming posts and release timing.", "ready"], ["Announcement lane", "Active or pending public messaging items.", "ready"], ["Engagement watch", "Prepared future live reaction and momentum stream.", "prepared"], ["Community highlights", "Useful wins, moments, and content opportunities to amplify.", "ready"]],
  },
];

const managementRoleId = teams[0].roleId;
const teamsBySlug = Object.fromEntries(teams.map((team) => [team.slug, team]));
const state = { status: "loading", user: null, roles: [], syncStatus: "loading", verifiedAt: "", error: "" };

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function stampNow() {
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

function loginHref() {
  const target = `${window.location.origin}${window.location.pathname}#/dashboard`;
  return `${AUTH.login}?return_to=${encodeURIComponent(target)}`;
}

function logoutHref() {
  const target = `${window.location.origin}${window.location.pathname}#/dashboard`;
  return `${AUTH.logout}?return_to=${encodeURIComponent(target)}`;
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

function isSignedIn() {
  return state.status === "signed_in" && !!state.user;
}

function hasManagementAccess() {
  return state.roles.includes(managementRoleId);
}

function accessSet() {
  const set = new Set();
  if (!isSignedIn()) return set;
  if (hasManagementAccess()) {
    teams.forEach((team) => set.add(team.slug));
    return set;
  }
  teams.forEach((team) => {
    if (state.roles.includes(team.roleId)) set.add(team.slug);
  });
  return set;
}

function hasTeamAccess(team) {
  return accessSet().has(team.slug);
}

function shellMode() {
  shell.classList.toggle("is-gated", !isSignedIn());
  modeChip.textContent = !isSignedIn() ? "Staff access gateway" : hasManagementAccess() ? "Management override active" : "Role dashboard ready";
}

function accountMarkup() {
  if (!state.user) return "";
  const name = state.user.verifiedIdentity || state.user.discordDisplayName || state.user.discordUsername || "Verified staff";
  const avatar = state.user.discordAvatarUrl
    ? `<img class="staff-account__avatar" src="${esc(state.user.discordAvatarUrl)}" alt="${esc(name)}" />`
    : `<span class="staff-account__avatar staff-account__avatar--fallback">${esc(name.slice(0, 2).toUpperCase())}</span>`;
  return `<div class="staff-account">${avatar}<div class="staff-account__copy"><strong class="staff-account__name">${esc(name)}</strong><span class="staff-account__meta">${esc(state.user.discordUsername || "discord account")}</span></div></div>`;
}

function renderTopbar() {
  shellMode();
  if (state.status === "loading") {
    authActions.innerHTML = `<button class="staff-action" type="button" disabled>Checking session</button><button class="staff-action staff-action--primary" type="button" disabled>Preparing gateway</button>`;
    return;
  }
  if (!isSignedIn()) {
    authActions.innerHTML = `<button class="staff-action" type="button" disabled>Discord-only verification</button><a class="staff-action staff-action--primary" href="${loginHref()}">Login to Staff Portal</a>`;
    return;
  }
  authActions.innerHTML = `${accountMarkup()}<button class="staff-action" type="button" data-action="refresh-auth">Refresh role check</button><a class="staff-action staff-action--primary" href="${logoutHref()}">Logout</a>`;
}

function statCards(items) {
  return items.map(([label, value, meta]) => `<section class="staff-overview__card"><span class="staff-overview__label">${esc(label)}</span><div class="staff-overview__value">${esc(value)}</div><p class="staff-overview__meta">${esc(meta)}</p></section>`).join("");
}

function statusBadge(label, variant) {
  return `<span class="staff-state-pill staff-state-pill--${variant}">${esc(label)}</span>`;
}

function rowStatus(stateName) {
  const label = stateName === "ready" ? "Ready" : stateName === "prepared" ? "Prepared" : "Restricted";
  return `<span class="workspace-row__status workspace-row__status--${stateName}">${esc(label)}</span>`;
}

function rowsMarkup(items, restricted = false) {
  return items.map(([title, body, status]) => `<li class="workspace-row"><div class="workspace-row__copy"><strong class="workspace-row__title">${esc(title)}</strong><span class="workspace-row__body">${esc(body)}</span></div>${rowStatus(restricted ? "restricted" : status)}</li>`).join("");
}

function gateView() {
  const gateState = state.status === "error" ? "Auth bridge unavailable" : state.status === "loading" ? "Checking Discord session" : "General staff login";
  const gateCopy = state.status === "error"
    ? state.error || "The staff site could not verify the live Discord endpoints yet."
    : "Use the general staff login first. After Discord verification, the front page becomes your staff dashboard and only the workspaces your verified roles unlock can be entered.";
  return `<section class="staff-page"><section class="staff-hero"><article class="staff-panel"><span class="staff-panel__eyebrow">SGCNR internal access</span><h1 class="staff-panel__title">Staff login<br />gateway</h1><p class="staff-panel__summary">${esc(gateCopy)}</p><div class="staff-panel__actions"><a class="staff-panel__button staff-panel__button--primary" href="${loginHref()}">Login with Discord</a><button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh session</button></div></article><aside class="staff-overview">${statCards([["Access mode", "Discord", "No manual staff usernames or passwords are used here."], ["After login", "Dashboard", "You land on the role dashboard first, not inside a team."], ["Gateway state", gateState, "Bottom navigation stays hidden until a valid staff session exists."]])}</aside></section><section class="dashboard-grid"><article class="staff-card"><span class="staff-card__eyebrow">How this works</span><h2 class="staff-card__title">One login, then role-based workspaces</h2><p class="staff-card__summary">Every staff member enters through the same secure gateway. Once Discord verification succeeds, the dashboard reveals the teams that this account is actually allowed to enter.</p><ul class="workspace-list">${rowsMarkup([["General staff login", "Single secure entry point for the whole staff portal.", "ready"], ["Role dashboard", "Shows every workspace unlocked for the verified Discord account.", "ready"], ["Management override", "Management Team unlocks every team workspace and every prepared live surface.", "ready"], ["Prepared live surfaces", "txAdmin, server telemetry, moderation streams, and bot-fed views are scaffolded for future live wiring.", "prepared"]])}</ul></article><article class="staff-card"><span class="staff-card__eyebrow">Protected by design</span><h2 class="staff-card__title">The first page stays clean</h2><p class="staff-card__summary">Before login you do not see the floating team bar or the internal workspaces. The entire first impression is just the staff access gate.</p><ul class="workspace-list">${rowsMarkup([["No bottom dock before login", "The team navigation stays disabled until the session is verified.", "ready"], ["No cross-team guessing", "Users cannot browse team tools before the gateway is passed.", "ready"], ["Role verification first", "The dashboard and team pages only open after Discord roles are checked.", "ready"], ["Shared background identity", "The full-site SGCNR art stays present across the whole portal, not only one section.", "ready"]])}</ul></article></section></section>`;
}

function teamTile(team, unlocked) {
  const preview = team.modules.slice(0, 3).map(([title]) => `<li>${esc(title)}</li>`).join("");
  const footer = unlocked
    ? `${statusBadge(hasManagementAccess() && !state.roles.includes(team.roleId) ? "Management override" : "Unlocked", "open")}<a class="staff-panel__button staff-panel__button--primary" href="#/${team.slug}">Enter workspace</a>`
    : `${statusBadge("Role required", "locked")}<button class="staff-panel__button" type="button" disabled>Locked</button>`;
  return `<article class="team-tile ${unlocked ? "team-tile--open" : "team-tile--locked"}"><div class="team-tile__top"><span class="team-tile__badge">${esc(team.short)}</span>${statusBadge(unlocked ? "Available" : "Locked", unlocked ? "open" : "locked")}</div><div><h2 class="team-tile__title">${esc(team.name)}</h2><p class="team-tile__summary">${esc(team.summary)}</p></div><ul class="team-tile__list">${preview}</ul><div class="team-tile__footer">${footer}</div></article>`;
}

function dashboardView() {
  const unlocked = teams.filter((team) => hasTeamAccess(team));
  const locked = teams.filter((team) => !hasTeamAccess(team));
  const identity = state.user.verifiedIdentity || state.user.discordDisplayName || state.user.discordUsername || "Verified staff";
  return `<section class="staff-page"><section class="staff-hero"><article class="staff-panel"><span class="staff-panel__eyebrow">${hasManagementAccess() ? "Management clearance" : "Verified staff dashboard"}</span><h1 class="staff-panel__title">${esc(identity)}<br />operations desk</h1><p class="staff-panel__summary">${hasManagementAccess() ? "Management clearance is active, so every staff workspace is open here, including the prepared live txAdmin, server data, moderation, and incident surfaces." : "This dashboard only opens the staff categories that match the verified Discord roles on this account. Pick a workspace below to enter the team tools that belong to you."}</p><div class="staff-panel__actions">${unlocked[0] ? `<a class="staff-panel__button staff-panel__button--primary" href="#/${unlocked[0].slug}">Open ${esc(unlocked[0].name)}</a>` : `<button class="staff-panel__button staff-panel__button--primary" type="button" data-action="refresh-auth">Refresh role check</button>`}<button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button><a class="staff-panel__button" href="${logoutHref()}">Logout</a></div></article><aside class="staff-overview">${statCards([["Unlocked teams", String(unlocked.length), "Workspaces available to this verified Discord account right now."], ["Prepared live surfaces", hasManagementAccess() ? "Full" : "Scoped", hasManagementAccess() ? "Management gets the full prepared live stack." : "Prepared live modules only appear inside the teams you can actually enter."], ["Role bridge", state.syncStatus || "ok", "Current Discord role check and session sync state."]])}</aside></section><section class="dashboard-grid"><article class="staff-card"><span class="staff-card__eyebrow">Available now</span><h2 class="staff-card__title">Unlocked staff workspaces</h2><p class="staff-card__summary">${unlocked.length ? "These are the teams this account can enter right now." : "This account is verified, but no matching staff team role is currently unlocked yet."}</p><div class="team-tile-grid">${unlocked.length ? unlocked.map((team) => teamTile(team, true)).join("") : teams.slice(0, 2).map((team) => teamTile(team, false)).join("")}</div></article>${locked.length ? `<article class="staff-card"><span class="staff-card__eyebrow">Still protected</span><h2 class="staff-card__title">Other staff categories</h2><p class="staff-card__summary">These workspaces stay locked until the exact Discord team role is assigned to this account.</p><div class="team-tile-grid">${locked.map((team) => teamTile(team, false)).join("")}</div></article>` : `<article class="staff-card"><span class="staff-card__eyebrow">Global clearance</span><h2 class="staff-card__title">Every team is open</h2><p class="staff-card__summary">Management access is overriding individual team locks, so the full staff structure is available from this dashboard.</p><ul class="workspace-list">${rowsMarkup([["Live txAdmin console", "Prepared management surface for runtime commands, sessions, and restart control.", "prepared"], ["Live moderation mirror", "Prepared feed combining bot-side moderation logs and action summaries.", "prepared"], ["Server data spine", "Prepared queue, player, health, and incident metrics view.", "prepared"], ["Cross-team command", "Leadership overview of every team and its current operational state.", "ready"]])}</ul></article>`}</section></section>`;
}

function workspaceCard(title, eyebrow, summary, items, restricted) {
  return `<article class="workspace-panel"><span class="workspace-panel__eyebrow">${esc(eyebrow)}</span><h2 class="workspace-panel__title">${esc(title)}</h2><p class="workspace-panel__summary">${esc(summary)}</p><ul class="workspace-list">${rowsMarkup(items, restricted)}</ul></article>`;
}

function teamView(team) {
  const unlocked = hasTeamAccess(team);
  const identity = state.user.verifiedIdentity || state.user.discordDisplayName || state.user.discordUsername || "Verified staff";
  const override = hasManagementAccess() && !state.roles.includes(team.roleId);
  const leadSummary = unlocked
    ? `${team.summary}${override ? " Management clearance is overriding the direct team role for this workspace." : ""}`
    : `This workspace is prepared, but it stays locked until the verified Discord account holds the exact ${team.name} role.`;
  return `<section class="staff-page"><section class="staff-hero"><article class="staff-panel"><span class="staff-panel__eyebrow">${esc(team.eyebrow)}</span><h1 class="staff-panel__title">${esc(team.name)}</h1><p class="staff-panel__summary">${esc(leadSummary)}</p><div class="staff-panel__actions">${unlocked ? `<span class="staff-state-pill staff-state-pill--open">${override ? "Management override" : "Workspace unlocked"}</span>` : `<span class="staff-state-pill staff-state-pill--locked">Role required</span>`}<a class="staff-panel__button staff-panel__button--primary" href="#/dashboard">Back to dashboard</a><button class="staff-panel__button" type="button" data-action="refresh-auth">Refresh role check</button></div></article><aside class="staff-overview">${statCards(team.stats)}</aside></section><section class="workspace-grid">${workspaceCard("Channels", `${team.name} channels`, unlocked ? "These are the key internal lanes this role uses on the portal." : "Preview of the internal lanes this team will use once the correct role is unlocked.", team.channels.map(([title, body]) => [title, body, unlocked ? "ready" : "restricted"]), !unlocked)}${workspaceCard("Functions", `${team.name} functions`, unlocked ? "Role-specific operational tools, prepared surfaces, and review controls for this team." : "Preview of the functions reserved for this team once access is granted.", team.modules, !unlocked)}${workspaceCard("Live surfaces", `${team.name} live feeds`, unlocked ? "Prepared live data, bot-driven streams, and operations feeds connected to this role." : "Preview of the live and prepared surfaces reserved for this team.", team.feeds, !unlocked)}${workspaceCard("Access state", "Verified role state", unlocked ? "This account can enter this workspace and use the prepared surfaces that belong to it." : "This account is signed in, but the required role has not unlocked this workspace yet.", [["Verified identity", identity, "ready"], ["Required role", `${team.name} (${team.roleId})`, unlocked ? "ready" : "restricted"], ["Role sync state", state.syncStatus || "pending", state.syncStatus === "ok" ? "ready" : "prepared"], ["Last verification", state.verifiedAt ? new Date(state.verifiedAt).toLocaleString("en-GB") : "Pending verification", unlocked ? "ready" : "prepared"]], false)}</section></section>`;
}

function render() {
  renderTopbar();
  const active = routeSlug();
  document.querySelectorAll(".staff-dock__item").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.team === active);
  });
  if (!isSignedIn()) {
    app.innerHTML = gateView();
    return;
  }
  const slug = routeSlug();
  app.innerHTML = slug === DEFAULT_ROUTE ? dashboardView() : teamView(teamsBySlug[slug] || teams[0]);
}

async function loadAuth() {
  state.status = "loading";
  state.error = "";
  render();
  try {
    const [meResult, rolesResult] = await Promise.allSettled([fetchJson(AUTH.me), fetchJson(AUTH.roles)]);
    if (meResult.status === "rejected") throw meResult.reason;
    if (!meResult.value?.authenticated) {
      state.status = "signed_out";
      state.user = null;
      state.roles = [];
      state.syncStatus = "not_authenticated";
      state.verifiedAt = "";
      render();
      return;
    }
    state.status = "signed_in";
    state.user = meResult.value.user || null;
    if (rolesResult.status === "fulfilled") {
      state.roles = Array.isArray(rolesResult.value.roles) ? rolesResult.value.roles : [];
      state.syncStatus = rolesResult.value.syncStatus || "ok";
      state.verifiedAt = rolesResult.value.verifiedAt || "";
      state.error = "";
    } else {
      state.roles = Array.isArray(meResult.value.user?.roles) ? meResult.value.user.roles : [];
      state.syncStatus = "error";
      state.verifiedAt = "";
      state.error = "The staff site could not reach the live Discord verification endpoints. Make sure staff.sgcnr.net is listed in allowed_origins in the live auth config.";
    }
  } catch (error) {
    state.status = "error";
    state.user = null;
    state.roles = [];
    state.syncStatus = "error";
    state.verifiedAt = "";
    state.error = "The staff gateway could not verify the live Discord session.";
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
