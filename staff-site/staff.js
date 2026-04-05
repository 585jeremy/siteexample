const AUTH={login:"https://sgcnr.net/auth/login.php",me:"https://sgcnr.net/auth/api.php",roles:"https://sgcnr.net/auth/roles.php?scope=staff"};
const GATE=window.STAFF_GATE_CONFIG||{};
const GATE_KEY=GATE.storageKey||"sgcnr_staff_gate_v2";
const GATE_ACCOUNTS=Array.isArray(GATE.accounts)?GATE.accounts:[];
const GATE_API={
  me:"./staff-auth/me.php",
  login:"./staff-auth/login.php",
  changePassword:"./staff-auth/change-password.php",
  logout:"./staff-auth/logout.php"
};
const DEFAULT_ROUTE="dashboard";
const PASSWORD_ROUTE="change-password";
const shell=document.getElementById("staffShell");
const app=document.getElementById("staffApp");
const authActions=document.getElementById("staffAuthActions");

const teams=[
{slug:"management",short:"MG",name:"Management Team",roleId:"1479411370331078799",eyebrow:"Executive command",summary:"Full operational control, prepared txAdmin surfaces, server telemetry, incident command, and final approval lanes.",preview:["Cross-team command board","Prepared live txAdmin console","Live server and incident spine"],ch:[["Executive command","Leadership decisions, staffing calls, and high-level internal direction."],["Cross-team escalations","Priority handoffs from every other team."],["Policy approval lane","Final approval pass for rules, punishments, and notices."],["Critical incident desk","Highest-priority runtime, abuse, or access incidents."]],fn:[["Cross-team command board","Single overview for every staff department and blocker.","ready"],["Prepared live txAdmin console","Prepared runtime panel for restarts, player management, and server operations.","prepared"],["Prepared server data spine","Prepared cards for queue, player count, health, restart state, and incident pressure.","prepared"],["Decision and approval matrix","Leadership approval flow for releases, policy changes, and critical actions.","ready"]],live:[["Priority incident stream","Prepared live feed for major runtime, auth, moderation, or access incidents.","prepared"],["Deploy and release watch","Prepared timeline for site, API, and server deploy events.","prepared"],["Staff action firehose","Prepared unified mirror of major staff actions from bot and backend.","prepared"],["Leadership notes","Command notes, follow-up actions, and post-incident decisions.","ready"]]},
{slug:"admin",short:"AD",name:"Admin Team",roleId:"1479481021383835771",eyebrow:"Operations control",summary:"High-level moderation review, linked identity oversight, appeals, and prepared live moderation mirrors without Management's full command stack.",preview:["Prepared live moderation mirror","Appeal and review board","Identity integrity desk"],boards:[["Appeal queue","14","Open appeals and case reviews waiting for admin handling.","ready"],["Identity flags","6","Linked-account mismatches and trust flags needing a decision.","prepared"],["Punishment reviews","9","Higher-level punishment checks, reversals, and escalations.","ready"],["Live moderation feed","Prepared","Bot-driven wall for bans, warns, and role actions once connected.","prepared"]],ch:[["Admin operations","Sensitive cases, escalations, and difficult operational decisions."],["Appeal and review","Appeals, case summaries, and final review flow."],["Identity integrity","Discord, FiveM, and account-link review for suspicious states."],["Admin escalation bridge","Escalation route into Management or Security."],["Staff decision lane","Private decision notes for major admin outcomes and policy calls."]],fn:[["Punishment review console","Review, approve, reverse, or escalate major staff actions.","ready"],["Prepared live moderation mirror","Prepared bot-fed moderation wall for warnings, bans, and role changes.","prepared"],["Appeal decision board","Structured board for appeal triage, evidence, and resolution tracking.","ready"],["Linked account review","Review Discord-to-FiveM links and suspicious account states.","ready"],["Internal notice composer","Prepare staff notices, internal warnings, and admin-wide callouts.","ready"],["Admin oversight log","Prepared action history for major admin decisions.","prepared"]],live:[["Case escalation queue","Active admin queue for cases passed up from Moderation or Helper.","ready"],["Bot moderation log","Prepared Discord-bot mirror for higher-level staff actions.","prepared"],["Identity exception alerts","Prepared anomaly lane for mismatched or broken account links.","prepared"],["Role change watch","Prepared feed for staff promotions, removals, and permission changes.","prepared"],["Admin notes","Sensitive internal notes and resolution follow-ups.","ready"]]},
{slug:"moderation",short:"MOD",name:"Moderation Team",roleId:"1479481164371595406",eyebrow:"Case review",summary:"Fast report intake, evidence review, action flow, and a smaller prepared moderation surface than Admin.",preview:["Report intake queue","Evidence review wall","Prepared action stream"],ch:[["Report intake","First-look report queue with clean ownership and rapid triage."],["Evidence wall","Clips, screenshots, timestamps, and proof review for active cases."],["Action notes","Short moderation summaries, warning history, and follow-up."],["Escalation handoff","Moderator path into Admin or Security when needed."]],fn:[["Case ownership board","Assign cases, keep response flow clear, and avoid duplicated work.","ready"],["Evidence review wall","Work through proof, context, and timeline before action.","ready"],["Prepared live action stream","Prepared bot-fed list for punishments, warnings, and timed actions.","prepared"],["Repeat-offender glance","Prepared panel for repeated behavior review.","prepared"]],live:[["Fresh report lane","Newest reports waiting for first response.","ready"],["Prepared action fire line","Prepared live moderation mirror once bot sync expands.","prepared"],["Escalation summary","Quick view of cases waiting for Admin or Security attention.","ready"],["Policy quick notes","Short internal policy reminders and handling guidance.","ready"]]},
{slug:"development",short:"DEV",name:"Development Team",roleId:"1479481179198455818",eyebrow:"Build pipeline",summary:"Feature delivery, live-readiness, issue handoff, and prepared runtime surfaces for API and server systems.",preview:["Deploy board","Prepared runtime watch","Issue handoff desk"],ch:[["Deploy board","Release planning, patch slices, and launch readiness."],["Issue bridge","Incoming technical issues from staff teams, QA, and management."],["Config review","Server config, environment, and deployment change follow-up."],["Health watch","Prepared read-only lane for server and API health surfaces."]],fn:[["Issue handoff desk","Turn incoming reports into actionable development work.","ready"],["Release cut tracker","Track release slices, hotfixes, and rollback notes.","ready"],["Prepared service health board","Prepared panel for API, auth, and portal uptime once exposed.","prepared"],["Prepared runtime watch","Prepared txAdmin and server-performance readouts for debugging.","prepared"]],live:[["Build blocker queue","Current blockers and unresolved technical risk.","ready"],["Prepared deploy timeline","Prepared event stream for releases and rollback moments.","prepared"],["Prepared service alerts","Prepared incident lane for auth, API, or runtime issues.","prepared"],["Cross-team tech asks","Incoming requests from Admin, Testing, Management, and Security.","ready"]]},
{slug:"testing",short:"QA",name:"Testing Team",roleId:"1479481184470962349",eyebrow:"Validation deck",summary:"Regression checks, test plans, patch validation, and structured developer handoff.",preview:["Regression queue","Fail or pass board","Patch validation desk"],ch:[["Regression queue","Assigned test plans and active validation runs."],["Bug repro bank","Clear reproduction steps, proof, and notes for developers."],["Patch validation","Release-candidate checks and focused change review."],["Fail or pass board","Clear approved, failed, and needs-rework states."]],fn:[["Validation matrix","Track active test runs and pass or fail status cleanly.","ready"],["Bug repro archive","Keep reproducible issues tight and developer-ready.","ready"],["Retest tracker","Follow-up board for fixed issues that need confirmation.","ready"],["Prepared release pulse","Prepared panel for active validation windows once live data arrives.","prepared"]],live:[["Failure recap","Problems that failed validation and need dev attention.","ready"],["Ready-to-ship queue","Items that passed QA and can move forward.","ready"],["Prepared patch pulse","Prepared live signal lane for active validation sessions.","prepared"],["Tester handoff","Internal note flow between QA and Development.","ready"]]},
{slug:"translation",short:"TR",name:"Translation Team",roleId:"1479481187692056626",eyebrow:"Locale desk",summary:"Localized copy review, glossary control, and rollout planning for translated content.",preview:["String queue","Glossary desk","Locale rollout planner"],ch:[["String queue","Incoming phrases, updated copy, and untranslated content."],["Glossary desk","Approved terms, tone guidance, and consistency checks."],["Source copy watch","Track source copy changes before localization begins."],["Locale rollout","Plan when new language updates move into production."]],fn:[["String review board","Review pending strings and keep translation status visible.","ready"],["Glossary control","Central term alignment for titles, commands, and onboarding copy.","ready"],["Prepared locale rollout planner","Prepared release board for pushing language updates live.","prepared"],["Prepared source diff watch","Prepared watch panel for spotting copy changes needing localization.","prepared"]],live:[["Pending localization","Open text waiting for translation or revision.","ready"],["Terminology conflicts","Terms that still need alignment before release.","ready"],["Prepared rollout pulse","Prepared watch lane for active localization pushes.","prepared"],["Translation notes","Internal phrasing guidance and reviewer notes.","ready"]]},
{slug:"helper",short:"HP",name:"Helper Team",roleId:"1479485844304953458",eyebrow:"Player support",summary:"First-response support, onboarding help, FAQ gaps, and clean escalation handoff into higher staff layers.",preview:["Player help queue","FAQ gap tracker","Escalation relay"],ch:[["Player help queue","Daily questions, onboarding issues, and first-response support."],["FAQ gap desk","Track what confuses players repeatedly and what needs better guides."],["Onboarding watch","Spot weak points in the first player experience."],["Escalation relay","Hand account, moderation, or technical issues to the right team."]],fn:[["Help intake board","Assign and resolve first-response support requests.","ready"],["FAQ gap tracker","Highlight repeated confusion and missing support content.","ready"],["Escalation relay","Structured handoff from Helper to Admin, Moderation, or Development.","ready"],["Prepared onboarding watch","Prepared pattern board for common first-time player blockers.","prepared"]],live:[["Fresh help asks","Newest unresolved questions and support issues.","ready"],["Prepared escalation pulse","Prepared queue for items needing higher-level review.","prepared"],["Guide update requests","Support-driven improvements for public help content.","ready"],["Helper notes","Short internal notes for repeated player friction.","ready"]]},
{slug:"security",short:"SEC",name:"Security Team",roleId:"1479481204028866600",eyebrow:"Incident control",summary:"Incident review, access anomalies, abuse signals, and higher-risk investigations with prepared auth and security surfaces.",preview:["Incident desk","Access audit trail","Prepared anomaly review"],ch:[["Incident desk","Primary security incident and abuse investigation lane."],["Access audit","Review sensitive role use, auth issues, and internal access changes."],["Suspicious activity","Signals that need verification, pattern review, or escalation."],["Security escalation","High-risk handoff into Management or Admin when an issue grows."]],fn:[["Incident monitor","Track active incidents, ownership, and resolution progress.","ready"],["Access audit trail","Structured record of sensitive permission changes and access checks.","ready"],["Prepared auth anomaly review","Prepared panel for suspicious login or role-sync patterns once exposed.","prepared"],["Risk escalation lane","Escalate major issues to Management quickly and cleanly.","ready"]],live:[["Prepared security alert pulse","Prepared high-priority feed for future auth and server events.","prepared"],["Access review stream","Sensitive access checks and trust reviews.","ready"],["Abuse signal queue","Incoming suspicious behavior or repeated anomaly patterns.","ready"],["Security notes","Internal investigation notes and staff-only decisions.","ready"]]},
{slug:"creator",short:"CC",name:"Content Creator Team",roleId:"1479485986772877414",eyebrow:"Media studio",summary:"Creative asset planning, campaign production, approval flow, and release prep for outward-facing media.",preview:["Campaign board","Asset approval canvas","Media drop planner"],ch:[["Campaign board","Visual campaigns, release planning, and deliverables."],["Asset approval","Internal approval path for thumbnails, graphics, and promos."],["Shot list","Planned captures, concept notes, and production guidance."],["Media release board","Track which assets are ready to publish publicly."]],fn:[["Asset request board","Intake and prioritize new creative asks.","ready"],["Approval canvas","Review revisions and move assets into final approval.","ready"],["Campaign production map","Track active campaigns and their asset gaps.","ready"],["Prepared media drop planner","Prepared timing lane for aligned releases with Social and Management.","prepared"]],live:[["Creative queue","New creative tasks waiting pickup or review.","ready"],["Approval stream","Assets waiting sign-off or revision.","ready"],["Prepared release pulse","Prepared coordination lane for asset publication timing.","prepared"],["Creator notes","Concept notes, revision notes, and campaign direction.","ready"]]},
{slug:"social",short:"SOC",name:"Social Team",roleId:"1479485995190583356",eyebrow:"Community pulse",summary:"Post scheduling, public communication planning, and prepared engagement surfaces for future analytics.",preview:["Content calendar","Announcement sync","Prepared engagement watch"],ch:[["Post calendar","Scheduling, platform timing, and post planning."],["Campaign sync","Cross-team alignment for releases, events, and promotions."],["Announcement mirror","Public messaging coordination with Management and Content Creator."],["Community pulse","Prepared view for reaction, reach, and momentum signals."]],fn:[["Content calendar","Track upcoming posts, deadlines, and platform needs.","ready"],["Announcement sync","Coordinate outgoing communication across teams and channels.","ready"],["Prepared community pulse","Prepared dashboard for reaction and engagement patterns.","prepared"],["Prepared campaign analytics lane","Prepared summary board for future post and campaign metrics.","prepared"]],live:[["Scheduled post queue","Upcoming posts and release timing.","ready"],["Announcement lane","Active or pending public messaging items.","ready"],["Prepared engagement watch","Prepared future live reaction and momentum stream.","prepared"],["Community highlights","Wins, moments, and content opportunities worth amplifying.","ready"]]}
];

const managementRoleId=teams[0].roleId;
const teamsBySlug=Object.fromEntries(teams.map((team)=>[team.slug,team]));
const state={gate:{loggedIn:false,account:null,error:"",mode:"legacy",passwordResetRequired:false,resetError:"",backendConfigured:false},discord:{status:"idle",user:null,roles:[],syncStatus:"",verifiedAt:"",error:""}};

function esc(value){return String(value??"").replace(/[&<>\"']/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));}
function normalize(value){return String(value??"").trim().toLowerCase();}
function routeSlug(){const slug=(window.location.hash||"").replace(/^#\/?/,"").split("/")[0].toLowerCase();return !slug?DEFAULT_ROUTE:slug===DEFAULT_ROUTE||slug===PASSWORD_ROUTE||teamsBySlug[slug]?slug:DEFAULT_ROUTE;}
function teamLoginHref(team){const target=`${window.location.origin}${window.location.pathname}#/${team.slug}`;return `${AUTH.login}?return_to=${encodeURIComponent(target)}`;}
function clearStaffSession(){sessionStorage.removeItem(GATE_KEY);}
function gateStoragePayload(account){return {username:account.username||account.staffId||"",displayName:account.displayName||account.name||account.username||account.staffId||"Staff Access",clearance:account.clearance||"General Staff",issuedBy:account.issuedBy||"Management Team",portalAccess:account.portalAccess||""};}
function saveStaffSession(account,options={}){const payload=gateStoragePayload(account);sessionStorage.setItem(GATE_KEY,JSON.stringify(payload));state.gate.loggedIn=true;state.gate.account=payload;state.gate.error="";state.gate.passwordResetRequired=!!options.passwordResetRequired;state.gate.mode=options.mode||state.gate.mode||"legacy";state.gate.backendConfigured=!!options.backendConfigured;}
function loadStaffSession(){try{const raw=sessionStorage.getItem(GATE_KEY);if(!raw)return;const parsed=JSON.parse(raw);if(parsed&&parsed.username){state.gate.loggedIn=true;state.gate.account=parsed;}}catch{clearStaffSession();}}
function fetchJson(url){return fetch(url,{method:"GET",cache:"no-store",credentials:"include",headers:{"X-Requested-With":"fetch"}}).then(async(response)=>{if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json();});}
function postJson(url,payload){return fetch(url,{method:"POST",cache:"no-store",credentials:"include",headers:{"Content-Type":"application/json","X-Requested-With":"fetch"},body:JSON.stringify(payload)}).then(async(response)=>{const text=await response.text();let data={};try{data=text?JSON.parse(text):{};}catch{data={};}if(!response.ok)throw Object.assign(new Error(data.error||`HTTP ${response.status}`),{payload:data,status:response.status});return data;});}
function hasDiscordSession(){return state.discord.status==="connected"&&!!state.discord.user;}
function hasGateManagementAccess(){const account=state.gate.account; if(!account)return false; const portalAccess=normalize(account.portalAccess); const clearance=normalize(account.clearance); return portalAccess==="all"||portalAccess==="management"||clearance==="management"||clearance==="manager";}
function hasManagementAccess(){return state.discord.roles.includes(managementRoleId);}
function hasFullManagementAccess(){return hasGateManagementAccess()||hasManagementAccess();}
function hasTeamAccess(team){return hasFullManagementAccess()||(hasDiscordSession()&&state.discord.roles.includes(team.roleId));}
function verifiedIdentity(){return !state.discord.user?"Discord account not verified yet":state.discord.user.verifiedIdentity||state.discord.user.discordDisplayName||state.discord.user.discordUsername||"Verified Discord staff";}
function shellMode(){shell.classList.toggle("is-gated",!state.gate.loggedIn||state.gate.passwordResetRequired);}
function statusBadge(label,variant){return `<span class="staff-state-pill staff-state-pill--${variant}">${esc(label)}</span>`;}
function rowStatus(stateName){const label=stateName==="ready"?"Ready":stateName==="prepared"?"Prepared":"Locked";return `<span class="workspace-row__status workspace-row__status--${stateName}">${esc(label)}</span>`;}
function rowsMarkup(items,locked=false){return items.map(([title,body,status])=>`<li class="workspace-row"><div class="workspace-row__copy"><strong class="workspace-row__title">${esc(title)}</strong><span class="workspace-row__body">${esc(body)}</span></div>${rowStatus(locked?"restricted":status)}</li>`).join("");}
function statCard(label,value,meta){return `<article class="summary-card"><span class="summary-card__label">${esc(label)}</span><strong class="summary-card__value">${esc(value)}</strong><p class="summary-card__meta">${esc(meta)}</p></article>`;}
function workspaceBoard(items){if(!Array.isArray(items)||!items.length)return "";return `<section class="workspace-board">${items.map(([label,value,meta,status])=>`<article class="summary-card workspace-summary workspace-summary--${status||"ready"}"><div class="workspace-summary__top"><span class="summary-card__label">${esc(label)}</span>${statusBadge(status==="prepared"?"Prepared":"Ready",status==="prepared"?"prepared":"open")}</div><strong class="summary-card__value">${esc(value)}</strong><p class="summary-card__meta">${esc(meta)}</p></article>`).join("")}</section>`;}
function syncGateFromBackend(payload){
  state.gate.backendConfigured=!!payload?.configured;
  state.gate.mode=payload?.mode||"database";
  state.gate.error="";
  state.gate.resetError="";
  state.gate.passwordResetRequired=!!payload?.passwordResetRequired;
  if(payload?.authenticated&&payload?.user){
    const account=gateStoragePayload(payload.user);
    state.gate.loggedIn=true;
    state.gate.account=account;
    sessionStorage.setItem(GATE_KEY,JSON.stringify(account));
    return;
  }
  state.gate.loggedIn=false;
  state.gate.account=null;
  clearStaffSession();
}
async function loadBackendGateState(){
  try{
    const payload=await fetchJson(GATE_API.me);
    syncGateFromBackend(payload);
    return !!payload?.configured;
  }catch{
    state.gate.backendConfigured=false;
    state.gate.mode="legacy";
    return false;
  }
}

function renderTopbar(){
  shellMode();
  if(!state.gate.loggedIn){authActions.innerHTML="";return;}
  const account=state.gate.account||{displayName:"Staff Access",clearance:"General Staff",issuedBy:"Management Team"};
  const discordStatus=state.gate.passwordResetRequired?`<span class="staff-mini-pill staff-mini-pill--warn">Password reset required</span>`:hasGateManagementAccess()?`<span class="staff-mini-pill staff-mini-pill--good">Management access active</span>`:hasDiscordSession()?`<span class="staff-mini-pill staff-mini-pill--good">Discord verified</span>`:state.discord.status==="error"?`<span class="staff-mini-pill staff-mini-pill--warn">Discord staff check needs setup</span>`:`<span class="staff-mini-pill">Discord team check pending</span>`;
  authActions.innerHTML=`<div class="staff-account"><span class="staff-account__eyebrow">General staff access</span><strong class="staff-account__name">${esc(account.displayName)}</strong><span class="staff-account__meta">${esc(account.clearance)} issued by ${esc(account.issuedBy)}</span></div>${discordStatus}<button class="staff-action staff-action--primary" type="button" data-action="logout-staff">Leave staff portal</button>`;
}

function teamStatus(team){
  if(!state.gate.loggedIn)return{label:"Staff gate",variant:"locked",actionLabel:"General login required",actionKind:"disabled"};
  if(hasGateManagementAccess())return{label:"Management",variant:"open",actionLabel:"Enter workspace",actionKind:"enter"};
  if(state.discord.status==="loading")return{label:"Checking",variant:"prepared",actionLabel:"Checking Discord session",actionKind:"disabled"};
  if(!hasDiscordSession())return{label:"Discord required",variant:"prepared",actionLabel:`Verify ${team.name}`,actionKind:"verify"};
  if(hasTeamAccess(team))return{label:hasManagementAccess()&&!state.discord.roles.includes(team.roleId)?"Management override":"Verified",variant:"open",actionLabel:"Enter workspace",actionKind:"enter"};
  return{label:"Role missing",variant:"locked",actionLabel:"Discord role does not match",actionKind:"disabled"};
}

function gateView(){
  const configured=state.gate.backendConfigured||GATE_ACCOUNTS.length>0;
  const hint=state.gate.backendConfigured
    ?"Use your manager-issued staff ID and password. If this is your first login, the portal will force you to set a new password before the dashboard opens."
    :configured
      ?"This preview gate opens the dashboard only. Team entry stays Discord role-locked until the staff database is connected."
      :"No staff credentials are configured yet. Add manager-issued accounts in staff-gate-config.js or finish the staff database setup.";
  return `<section class="staff-view staff-gate"><article class="staff-gate__card"><div class="staff-gate__layout"><div class="staff-gate__copy"><span class="gate-kicker">General staff access</span><h1 class="staff-heading">Staff access starts here.</h1><p class="staff-copy">Use the private staff credentials sent by management. This first step opens the internal dashboard. Entering an actual team workspace still needs the matching staff access level, and non-management teams can still be Discord role-locked where needed.</p></div><div class="staff-gate__panel"><span class="gate-kicker gate-kicker--soft">${state.gate.backendConfigured?"Database-backed staff login":"Manager-issued credentials"}</span><form class="gate-form" data-form="staff-gate" autocomplete="off"><label class="gate-form__field"><span>Staff ID</span><input class="gate-form__input" type="text" name="staffId" placeholder="Enter your staff ID" /></label><label class="gate-form__field"><span>Password</span><input class="gate-form__input" type="password" name="password" placeholder="Enter your staff password" /></label>${state.gate.error?`<p class="gate-form__error">${esc(state.gate.error)}</p>`:""}<p class="gate-form__hint">${esc(hint)}</p><button class="staff-panel__button staff-panel__button--primary gate-form__submit" type="submit" ${configured?"":"disabled"}>Enter staff dashboard</button></form></div></div></article></section>`;
}

function changePasswordView(){
  const account=state.gate.account||{displayName:"Staff Access"};
  return `<section class="staff-view staff-gate"><article class="staff-gate__card"><div class="staff-gate__layout"><div class="staff-gate__copy"><span class="gate-kicker">Password reset</span><h1 class="staff-heading">Create your new staff password.</h1><p class="staff-copy">${esc(account.displayName)}, your first login is valid, but the dashboard stays locked until you replace the temporary password issued during account creation.</p></div><div class="staff-gate__panel"><span class="gate-kicker gate-kicker--soft">Required before dashboard</span><form class="gate-form" data-form="staff-password-reset" autocomplete="off"><label class="gate-form__field"><span>New password</span><input class="gate-form__input" type="password" name="newPassword" placeholder="Choose a new password" /></label><label class="gate-form__field"><span>Confirm password</span><input class="gate-form__input" type="password" name="confirmPassword" placeholder="Repeat your new password" /></label>${state.gate.resetError?`<p class="gate-form__error">${esc(state.gate.resetError)}</p>`:""}<p class="gate-form__hint">Once you save the new password, the reset flag is cleared automatically and the staff dashboard opens.</p><button class="staff-panel__button staff-panel__button--primary gate-form__submit" type="submit">Save new password</button></form></div></div></article></section>`;
}

function teamCard(team){
  const status=teamStatus(team);
  const preview=team.preview.map((line)=>`<li>${esc(line)}</li>`).join("");
  let actionMarkup=`<button class="staff-panel__button" type="button" disabled>${esc(status.actionLabel)}</button>`;
  if(status.actionKind==="verify")actionMarkup=`<a class="staff-panel__button staff-panel__button--primary" href="${teamLoginHref(team)}">${esc(status.actionLabel)}</a>`;
  if(status.actionKind==="enter")actionMarkup=`<a class="staff-panel__button staff-panel__button--primary" href="#/${team.slug}">${esc(status.actionLabel)}</a>`;
  return `<article class="team-card team-card--${status.variant}"><div class="team-card__top"><span class="team-card__badge">${esc(team.short)}</span>${statusBadge(status.label,status.variant)}</div><div class="team-card__body"><span class="gate-kicker gate-kicker--soft">${esc(team.eyebrow)}</span><h2 class="team-card__title">${esc(team.name)}</h2><p class="team-card__summary">${esc(team.summary)}</p><ul class="team-card__list">${preview}</ul></div><div class="team-card__footer">${actionMarkup}</div></article>`;
}

function dashboardView(){
  const unlockedCount=teams.filter((team)=>hasTeamAccess(team)).length;
  const discordState=hasGateManagementAccess()?"Manager login unlocks every staff team without another team login.":hasDiscordSession()?verifiedIdentity():state.discord.status==="error"?"Discord verification currently unavailable":"No Discord team verification yet";
  const account=state.gate.account||{displayName:"Staff Access",clearance:"General Staff"};
  return `<section class="staff-view staff-dashboard"><section class="dashboard-hero"><article class="staff-panel staff-panel--hero"><span class="gate-kicker">General staff dashboard</span><h1 class="staff-heading">${esc(account.displayName)}, choose your team.</h1><p class="staff-copy">You are inside the general staff portal now. Every team is visible here, but the actual workspace only opens after the matching Discord role is verified. Management logins can move across every team immediately without another team login.</p><div class="staff-panel__actions">${hasFullManagementAccess()?`<span class="staff-state-pill staff-state-pill--open">Management access active</span>`:`<span class="staff-state-pill staff-state-pill--prepared">Choose a team below</span>`}</div></article><div class="dashboard-hero__rail">${statCard("Staff gate",account.clearance||"General Staff","The first layer is open with manager-issued credentials.")}${statCard("Discord state",hasGateManagementAccess()?"Management":"Verified",discordState)}${statCard("Unlocked teams",String(unlockedCount),hasFullManagementAccess()?"Management access unlocks every team.":"Unlocked count changes only after Discord role checks.")}</div></section><section class="team-grid">${teams.map((team)=>teamCard(team)).join("")}</section></section>`;
}

function verificationView(team){
  if(hasGateManagementAccess())return workspaceView(team);
  const bridgeMessage=state.discord.status==="error"?state.discord.error||"The live Discord bridge could not be reached from this staff portal yet.":"The staff dashboard is already open, but entering a real team workspace still needs Discord role verification.";
  return `<section class="staff-view workspace-view"><section class="workspace-hero"><article class="staff-panel staff-panel--hero"><span class="gate-kicker">${esc(team.eyebrow)}</span><h1 class="staff-heading">${esc(team.name)} needs Discord verification.</h1><p class="staff-copy">${esc(bridgeMessage)}</p><div class="staff-panel__actions"><a class="staff-panel__button staff-panel__button--primary" href="${teamLoginHref(team)}">Verify ${esc(team.name)} with Discord</a><a class="staff-panel__button" href="#/dashboard">Back to dashboard</a></div></article><div class="dashboard-hero__rail">${statCard("General gate","Open","Your manager-issued staff credentials already unlocked the main dashboard.")}${statCard("Required role",team.name,"This team only opens if the signed-in Discord account has the matching role.")}${statCard("Discord check",state.discord.status==="error"?"Needs setup":"Pending",state.discord.status==="error"?state.discord.error:"Use Discord only when entering the team you actually belong to.")}</div></section></section>`;
}

function lockedView(team){
  if(hasGateManagementAccess())return workspaceView(team);
  return `<section class="staff-view workspace-view"><section class="workspace-hero"><article class="staff-panel staff-panel--hero"><span class="gate-kicker">${esc(team.eyebrow)}</span><h1 class="staff-heading">${esc(team.name)} is still locked.</h1><p class="staff-copy">The current Discord account is verified as ${esc(verifiedIdentity())}, but it does not carry the exact ${esc(team.name)} role. That means this workspace stays closed even though the general staff dashboard is already open.</p><div class="staff-panel__actions"><span class="staff-state-pill staff-state-pill--locked">Role does not match</span><a class="staff-panel__button" href="#/dashboard">Back to dashboard</a></div></article><div class="dashboard-hero__rail">${statCard("Verified Discord",verifiedIdentity(),"This is the account currently used for team access checks.")}${statCard("Required role",team.name,`Role ID ${team.roleId}`)}${statCard("Management override",hasManagementAccess()?"Active":"Not active",hasManagementAccess()?"Management role would override this team lock.":"Only the team role or Management can unlock this workspace.")}</div></section></section>`;
}

function workspaceSection(title,eyebrow,summary,items){
  return `<article class="workspace-panel"><span class="workspace-panel__eyebrow">${esc(eyebrow)}</span><h2 class="workspace-panel__title">${esc(title)}</h2><p class="workspace-panel__summary">${esc(summary)}</p><ul class="workspace-list">${rowsMarkup(items)}</ul></article>`;
}

function workspaceView(team){
  const override=hasFullManagementAccess()&&!state.discord.roles.includes(team.roleId);
  const statusItems=[
    ["General staff gate",state.gate.account?.displayName||"Staff access active","ready"],
    ["Verified Discord",hasGateManagementAccess()?"Not required for this manager login":verifiedIdentity(),"ready"],
    ["Role state",override?"Management override active":`${team.name} verified`,"ready"],
    ["Last verification",hasGateManagementAccess()?"Manager session active":state.discord.verifiedAt?new Date(state.discord.verifiedAt).toLocaleString("en-GB"):"Verified this session","ready"],
  ];
  return `<section class="staff-view workspace-view"><section class="workspace-hero"><article class="staff-panel staff-panel--hero"><span class="gate-kicker">${esc(team.eyebrow)}</span><h1 class="staff-heading">${esc(team.name)}</h1><p class="staff-copy">${esc(team.summary)}${override?" Management access is opening this workspace automatically.":""}</p><div class="staff-panel__actions"><span class="staff-state-pill staff-state-pill--open">${override?"Management override":"Role verified"}</span><a class="staff-panel__button" href="#/dashboard">Back to dashboard</a></div></article><div class="dashboard-hero__rail">${statCard("Workspace state","Open",override?"Management clearance is unlocking this team.":"This team role is verified for the current session.")}${statCard("Access mode",hasGateManagementAccess()?"Manager gate override":verifiedIdentity(),hasGateManagementAccess()?"This manager login can move across every team without another login.":"Team access is tied to the live Discord session.")}${statCard("Live readiness",team.live.some((item)=>item[2]==="prepared")?"Prepared":"Ready","Prepared surfaces are already scaffolded for future server and bot data.")}</div></section>${workspaceBoard(team.boards)}<section class="workspace-columns">${workspaceSection("Channels",`${team.name} channels`,"Internal channels and working lanes for this role.",team.ch.map(([title,body])=>[title,body,"ready"]))}${workspaceSection("Functions",`${team.name} control surfaces`,"Role-specific tools, boards, and operational surfaces.",team.fn)}${workspaceSection("Prepared live surfaces",`${team.name} live`,"Prepared live data, bot-driven mirrors, and future operational feeds for this role.",team.live)}${workspaceSection("Access frame","Verification state","General staff credentials open the portal. Management logins can move across every team directly, while every other staff member still needs the matching Discord role.",statusItems)}</section></section>`;
}

function render(){
  renderTopbar();
  const current=routeSlug();
  document.querySelectorAll(".staff-dock__item").forEach((link)=>{link.classList.toggle("is-active",link.dataset.team===current);});
  if(!state.gate.loggedIn){app.innerHTML=gateView();return;}
  if(state.gate.passwordResetRequired){app.innerHTML=changePasswordView();return;}
  if(current===DEFAULT_ROUTE){app.innerHTML=dashboardView();return;}
  if(current===PASSWORD_ROUTE){app.innerHTML=changePasswordView();return;}
  const team=teamsBySlug[current]||teams[0];
  if(!hasDiscordSession()){app.innerHTML=verificationView(team);return;}
  if(!hasTeamAccess(team)){app.innerHTML=lockedView(team);return;}
  app.innerHTML=workspaceView(team);
}

async function loadDiscordState(){
  if(!state.gate.loggedIn||state.gate.passwordResetRequired)return;
  state.discord.status="loading";
  state.discord.error="";
  render();
  try{
    const [meResult,rolesResult]=await Promise.allSettled([fetchJson(AUTH.me),fetchJson(AUTH.roles)]);
    if(meResult.status==="rejected")throw meResult.reason;
    if(!meResult.value?.authenticated){
      state.discord.status="signed_out";
      state.discord.user=null;
      state.discord.roles=[];
      state.discord.syncStatus="signed_out";
      state.discord.verifiedAt="";
      state.discord.error="";
      render();
      return;
    }
    state.discord.user=meResult.value.user||null;
    if(rolesResult.status==="fulfilled"){
      state.discord.roles=Array.isArray(rolesResult.value.roles)?rolesResult.value.roles:[];
      state.discord.syncStatus=rolesResult.value.syncStatus||"ok";
      state.discord.verifiedAt=rolesResult.value.verifiedAt||"";
      if(state.discord.syncStatus==="staff_guild_not_configured"){
        state.discord.status="error";
        state.discord.error="The staff Discord server ID is not configured yet, so the portal is still checking the wrong guild for team roles.";
      }else if(state.discord.syncStatus==="staff_member_not_found"){
        state.discord.status="connected";
        state.discord.error="Your Discord account is signed in, but it is not being found inside the configured staff Discord server.";
      }else{
        state.discord.status="connected";
        state.discord.error="";
      }
    }else{
      state.discord.roles=Array.isArray(meResult.value.user?.roles)?meResult.value.user.roles:[];
      state.discord.syncStatus="error";
      state.discord.verifiedAt="";
      state.discord.status="error";
      state.discord.error="staff.sgcnr.net still needs to be allowed in the live auth config so team verification can read the staff Discord role bridge.";
    }
  }catch{
    state.discord.status="error";
    state.discord.user=null;
    state.discord.roles=[];
    state.discord.syncStatus="error";
    state.discord.verifiedAt="";
    state.discord.error="The staff portal could not reach the live Discord verification endpoints.";
  }
  render();
}

async function handleStaffGateSubmit(form){
  const formData=new FormData(form);
  const staffId=normalize(formData.get("staffId"));
  const password=String(formData.get("password")||"");
  state.gate.error="";
  state.gate.resetError="";
  if(state.gate.backendConfigured){
    try{
      const payload=await postJson(GATE_API.login,{staffId,password});
      syncGateFromBackend(payload);
      state.discord={status:"idle",user:null,roles:[],syncStatus:"",verifiedAt:"",error:""};
      window.location.hash=state.gate.passwordResetRequired?`#/${PASSWORD_ROUTE}`:"#/dashboard";
      render();
      if(!state.gate.passwordResetRequired)loadDiscordState();
      return;
    }catch(error){
      const reason=error?.payload?.error||"login_failed";
      state.gate.error=reason==="invalid_credentials"
        ?"That staff ID and password pair does not match the database records."
        :reason==="staff_auth_not_configured"
          ?"The staff database login is not configured yet."
          :reason==="missing_credentials"
            ?"Enter both your staff ID and password."
            :reason==="db_query_failed"
              ?"The live staff database query failed. Upload the latest staff-auth files and recheck the table mapping."
              :"The staff login could not be completed right now.";
      render();
      return;
    }
  }
  const matched=GATE_ACCOUNTS.find((account)=>normalize(account.username)===staffId&&String(account.password||"")===password);
  if(!matched){
    state.gate.error="That staff ID and password pair does not match the manager-issued access list.";
    render();
    return;
  }
  saveStaffSession(matched,{mode:"legacy",backendConfigured:false,passwordResetRequired:false});
  state.discord={status:"idle",user:null,roles:[],syncStatus:"",verifiedAt:"",error:""};
  window.location.hash="#/dashboard";
  render();
  loadDiscordState();
}

async function handlePasswordResetSubmit(form){
  const formData=new FormData(form);
  const newPassword=String(formData.get("newPassword")||"");
  const confirmPassword=String(formData.get("confirmPassword")||"");
  state.gate.resetError="";
  if(!state.gate.backendConfigured){
    state.gate.resetError="Password reset is only available after the staff database login is connected.";
    render();
    return;
  }
  try{
    const payload=await postJson(GATE_API.changePassword,{newPassword,confirmPassword});
    syncGateFromBackend(payload);
    window.location.hash="#/dashboard";
    render();
    loadDiscordState();
  }catch(error){
    const reason=error?.payload?.error||"password_update_failed";
    state.gate.resetError=reason==="password_mismatch"
      ?"The new password and confirmation do not match."
      :reason==="password_too_short"
        ?"Use a longer password. At least 8 characters are required."
        :reason==="not_authenticated"
          ?"Your staff session expired. Log in again."
          :"The new password could not be saved right now.";
    render();
  }
}

async function handleStaffLogout(){
  if(state.gate.backendConfigured){
    try{await postJson(GATE_API.logout,{});}catch{}
  }
  clearStaffSession();
  state.gate={loggedIn:false,account:null,error:"",mode:state.gate.backendConfigured?"database":"legacy",passwordResetRequired:false,resetError:"",backendConfigured:state.gate.backendConfigured};
  state.discord={status:"idle",user:null,roles:[],syncStatus:"",verifiedAt:"",error:""};
  window.location.hash="#/dashboard";
  render();
}

document.addEventListener("submit",(event)=>{
  const form=event.target.closest('[data-form="staff-gate"]');
  if(form){
    event.preventDefault();
    handleStaffGateSubmit(form);
    return;
  }
  const resetForm=event.target.closest('[data-form="staff-password-reset"]');
  if(!resetForm)return;
  event.preventDefault();
  handlePasswordResetSubmit(resetForm);
});

document.addEventListener("click",(event)=>{
  const action=event.target.closest("[data-action]");
  if(!action)return;
  if(action.dataset.action==="logout-staff"){
    handleStaffLogout();
  }
});

window.addEventListener("hashchange",render);
loadStaffSession();
render();
(async()=>{const backendConfigured=await loadBackendGateState();render();if(!backendConfigured&&state.gate.loggedIn)loadDiscordState();if(backendConfigured&&state.gate.loggedIn&&!state.gate.passwordResetRequired)loadDiscordState();})();
