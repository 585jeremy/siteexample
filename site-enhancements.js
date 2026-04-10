(() => {
  const originalRoute = route;

  route = function enhancedRoute() {
    const currentRoute = parseRoute().name;
    if (currentRoute !== "apply") {
      clearApplicationCenterPoll();
    }
    const output = originalRoute();
    if (currentRoute === "apply" && getCurrentAccount()) {
      loadApplicationCenter({ showLoading: !applicationCenterState.items.length, keepSelection: true });
    }
    return output;
  };

  renderStart = function renderStartEnhanced() {
    const quickLinks = [
      { label: "Read the rules", href: "#/rules" },
      { label: "Open commands", href: "#/commands" },
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
                  <span>Search for <strong>SGCNR</strong> or use the direct connect link below.</span>
                </div>
              </article>
              <article class="start-flow__item">
                <div class="start-flow__index">02</div>
                <div class="start-flow__copy">
                  <strong>Read the basics first</strong>
                  <span>Use the Rules and Commands pages before you jump into the city.</span>
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
              <a class="auth__btn auth__btn--primary" href="${escapeHtml(SERVER_JOIN_URL)}" target="_blank" rel="noopener noreferrer">Direct connect</a>
              <a class="auth__btn" href="${escapeHtml(DISCORD_TICKET_CHANNEL_URL)}" target="_blank" rel="noopener noreferrer">Open Discord tickets</a>
            </div>
            <div class="status-note">
              <strong>Direct join:</strong>
              <a class="info-link" href="${escapeHtml(SERVER_JOIN_URL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(`cfx.re/join/${SERVER_JOIN_CODE}`)}</a>
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
            <div class="stack-list__item"><span class="stack-list__index">04</span><span>Be respectful and keep it fair. Staff decisions are based on evidence.</span></div>
          </div>
        </section>
      </div>
    `);
  };

  renderWikiSidebar = function renderWikiSidebarEnhanced(categories, pages, currentSlug, updatedAt) {
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
        <div class="wiki-sidebar__hint">Scroll the guide list to jump faster between pages.</div>
        <div class="wiki-sidebar__navWrap">
          <div class="wiki-nav">${groups}</div>
        </div>
      </aside>
    `;
  };

  const APPLICATION_ROLE_OPTIONS = [
    "Helper",
    "Moderation",
    "Admin",
    "Development",
    "Testing",
    "Translation",
    "Security",
    "Content Creator",
    "Social",
    "Management"
  ];

  function getApplicationStatusLabel(status) {
    return APPLICATION_STATUS_LABELS[status] || "Open";
  }

  function getApplicationStatusTone(status) {
    if (status === "accepted") return "accepted";
    if (status === "denied" || status === "closed") return "closed";
    if (status === "needs_info") return "needs";
    if (status === "interview") return "interview";
    return "open";
  }

  function isApplicationOpenStatus(status) {
    return APPLICATION_OPEN_STATUSES.includes(String(status || "").trim());
  }

  function clearApplicationCenterPoll() {
    if (applicationCenterState.pollTimer) {
      window.clearTimeout(applicationCenterState.pollTimer);
      applicationCenterState.pollTimer = null;
    }
  }

  function getApplicationRouteActive() {
    return parseRoute().name === "apply";
  }

  function normaliseApplicationItem(item) {
    if (!item || typeof item !== "object") return null;
    const publicId = String(item.publicId || item.id || "").trim();
    if (!publicId) return null;

    return {
      publicId,
      roleRequested: String(item.roleRequested || "").trim(),
      applicantName: String(item.applicantName || item.inGameName || "").trim(),
      status: String(item.status || "submitted").trim().toLowerCase(),
      assignedStaffName: String(item.assignedStaffName || "").trim(),
      createdAt: item.createdAt || "",
      updatedAt: item.updatedAt || "",
      lastMessageAt: item.lastMessageAt || "",
      lastStaffReplyAt: item.lastStaffReplyAt || ""
    };
  }

  function normaliseApplicationDetail(payload) {
    const application = normaliseApplicationItem(payload?.application || payload);
    if (!application) return null;

    return {
      application: {
        ...application,
        discordDisplayName: String(payload?.application?.discordDisplayName || "").trim(),
        discordUsername: String(payload?.application?.discordUsername || "").trim(),
        timezone: String(payload?.application?.timezone || "").trim(),
        playtimeHours: payload?.application?.playtimeHours ?? "",
        inGameLevel: payload?.application?.inGameLevel ?? "",
        availability: String(payload?.application?.availability || "").trim(),
        banHistory: String(payload?.application?.banHistory || "").trim(),
        moderationExperience: String(payload?.application?.moderationExperience || "").trim(),
        testingExperience: String(payload?.application?.testingExperience || "").trim(),
        fitReason: String(payload?.application?.fitReason || "").trim()
      },
      messages: Array.isArray(payload?.messages)
        ? payload.messages.map((message) => ({
            senderType: String(message?.senderType || "system").trim().toLowerCase(),
            senderName: String(message?.senderName || "System").trim() || "System",
            message: String(message?.message || "").trim(),
            createdAt: message?.createdAt || ""
          })).filter((message) => message.message)
        : []
    };
  }

  function renderApplicationStatusPill(status) {
    return `<span class="apply-status apply-status--${escapeHtml(getApplicationStatusTone(status))}">${escapeHtml(getApplicationStatusLabel(status))}</span>`;
  }

  function renderApplyFeedback() {
    if (!applicationCenterState.error && !applicationCenterState.success) return "";
    const tone = applicationCenterState.error ? "error" : "success";
    const text = applicationCenterState.error || applicationCenterState.success;
    return `<div class="account-feedback account-feedback--${tone}">${escapeHtml(text)}</div>`;
  }

  function renderApplicantApplicationCards(items, activeId) {
    if (!items.length) {
      return `<div class="apply-empty">No applications yet. Once you submit one, it will appear here with status updates and chat access.</div>`;
    }

    return items.map((item) => `
      <article class="apply-card${item.publicId === activeId ? " is-active" : ""}">
        <div class="apply-card__top">
          <div>
            <div class="apply-card__eyebrow">${escapeHtml(item.publicId)}</div>
            <div class="apply-card__title">${escapeHtml(item.roleRequested || "Staff application")}</div>
          </div>
          ${renderApplicationStatusPill(item.status)}
        </div>
        <div class="apply-card__meta">Submitted ${escapeHtml(formatServerTimestamp(item.createdAt))}</div>
        <div class="apply-card__meta">${escapeHtml(item.assignedStaffName ? `Handled by ${item.assignedStaffName}` : "Waiting for staff assignment")}</div>
        <div class="apply-card__actions">
          <button class="auth__btn auth__btn--primary" type="button" data-application-select="${escapeHtml(item.publicId)}">View case</button>
          <button class="auth__btn" type="button" data-application-chat="${escapeHtml(item.publicId)}">Open chat</button>
        </div>
      </article>
    `).join("");
  }

  function renderApplicantChat(detail) {
    if (!detail) {
      return `
        <section class="section apply-chat" data-application-thread>
          <div class="apply-empty">Select an application to open its live chat and status details.</div>
        </section>
      `;
    }

    const locked = detail.application.status === "closed";
    const intro = detail.messages.length
      ? detail.messages.map((message) => `
          <article class="apply-message apply-message--${escapeHtml(message.senderType)}">
            <div class="apply-message__meta">
              <strong>${escapeHtml(message.senderName)}</strong>
              <span>${escapeHtml(formatServerTimestamp(message.createdAt))}</span>
            </div>
            <div class="apply-message__body">${escapeHtml(message.message)}</div>
          </article>
        `).join("")
      : `<div class="apply-empty">No messages yet. Staff replies will show up here.</div>`;

    return `
      <section class="section apply-chat" data-application-thread>
        <div class="apply-chat__top">
          <div>
            <div class="section__eyebrow">Application chat</div>
            <h2>${escapeHtml(detail.application.publicId)} conversation</h2>
          </div>
          ${renderApplicationStatusPill(detail.application.status)}
        </div>
        <div class="apply-chat__summary">
          <div><strong>Role:</strong> ${escapeHtml(detail.application.roleRequested || "Staff application")}</div>
          <div><strong>Status:</strong> ${escapeHtml(getApplicationStatusLabel(detail.application.status))}</div>
          <div><strong>Assigned staff:</strong> ${escapeHtml(detail.application.assignedStaffName || "Waiting for assignment")}</div>
        </div>
        <div class="apply-chat__feed">${intro}</div>
        <form class="apply-chat__composer" data-form="application-message" autocomplete="off">
          <label class="account-field account-field--wide">
            <span class="account-field__label">Reply to staff</span>
            <textarea class="account-field__input account-field__input--textarea" name="message" rows="3" placeholder="${locked ? "Chat is closed for this application." : "Write your reply for the handling staff..."}" ${locked ? "disabled" : ""}></textarea>
          </label>
          <div class="auth-modal__actions">
            <button class="auth__btn auth__btn--primary" type="submit" ${locked || applicationCenterState.sending ? "disabled" : ""}>${applicationCenterState.sending ? "Sending..." : "Send reply"}</button>
          </div>
        </form>
      </section>
    `;
  }

  function scheduleApplicationCenterPoll() {
    clearApplicationCenterPoll();
    if (!getApplicationRouteActive()) return;
    if (!getCurrentAccount()) return;
    if (!applicationCenterState.items.length) return;

    applicationCenterState.pollTimer = window.setTimeout(() => {
      loadApplicationCenter({ showLoading: false, keepSelection: true });
    }, 9000);
  }

  async function loadApplicationDetail(publicId, options = {}) {
    if (!publicId) {
      applicationCenterState.detail = null;
      if (getApplicationRouteActive() && options.skipRender !== true) renderApply();
      return;
    }

    const requestId = options.requestId || applicationCenterState.requestId;

    try {
      const payload = await requestJson(`${APPLICATION_API.detail}?applicationId=${encodeURIComponent(publicId)}`);
      if (requestId !== applicationCenterState.requestId) return;
      applicationCenterState.detail = normaliseApplicationDetail(payload);
    } catch (error) {
      if (requestId !== applicationCenterState.requestId) return;
      applicationCenterState.detail = null;
      if (error?.payload?.error !== "not_authenticated") {
        applicationCenterState.error = getApplicationLoadErrorMessage(error, "The selected application could not be opened right now.");
      }
    }

    if (getApplicationRouteActive() && options.skipRender !== true) renderApply();
    scheduleApplicationCenterPoll();
  }

  async function loadApplicationCenter(options = {}) {
    clearApplicationCenterPoll();
    const account = getCurrentAccount();

    if (!account) {
      applicationCenterState.loading = false;
      applicationCenterState.items = [];
      applicationCenterState.activeId = "";
      applicationCenterState.detail = null;
      if (getApplicationRouteActive()) renderApply();
      return;
    }

    const requestId = ++applicationCenterState.requestId;
    if (options.showLoading !== false) {
      applicationCenterState.loading = true;
    }

    if (getApplicationRouteActive()) renderApply();

    try {
      const payload = await requestJson(APPLICATION_API.list);
      if (requestId !== applicationCenterState.requestId) return;

      const items = Array.isArray(payload?.items)
        ? payload.items.map(normaliseApplicationItem).filter(Boolean)
        : [];

      applicationCenterState.items = items;
      applicationCenterState.loading = false;

      const keepSelection = options.keepSelection !== false && items.some((item) => item.publicId === applicationCenterState.activeId);
      applicationCenterState.activeId = options.selectedId || (keepSelection ? applicationCenterState.activeId : (items[0]?.publicId || ""));

      if (!applicationCenterState.activeId) {
        applicationCenterState.detail = null;
        if (getApplicationRouteActive()) renderApply();
        scheduleApplicationCenterPoll();
        return;
      }

      await loadApplicationDetail(applicationCenterState.activeId, { requestId });
    } catch (error) {
      if (requestId !== applicationCenterState.requestId) return;
      applicationCenterState.loading = false;
      applicationCenterState.items = [];
      applicationCenterState.activeId = "";
      applicationCenterState.detail = null;
      if (error?.payload?.error !== "not_authenticated") {
        applicationCenterState.error = getApplicationLoadErrorMessage(error, "Application data could not be loaded right now.");
      }
      if (getApplicationRouteActive()) renderApply();
    }
  }

  function selectApplication(publicId, options = {}) {
    applicationCenterState.activeId = publicId;
    if (getApplicationRouteActive()) renderApply();
    loadApplicationDetail(publicId);

    if (options.scrollToChat) {
      window.setTimeout(() => {
        const chat = document.querySelector("[data-application-thread]");
        if (chat) {
          chat.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    }
  }

  function getApplicationSubmitErrorMessage(error) {
    const reason = error?.payload?.error || error?.message || "application_submit_failed";
    if (reason === "not_authenticated") return "Sign in with Discord before you apply.";
    if (reason === "active_application_exists") return "You already have an open application. Use the live chat below instead of sending a second one.";
    if (reason === "missing_fields") return "Please fill in all required application fields first.";
    if (reason === "applications_not_configured") return "The application backend is not connected yet.";
    return "Your application could not be sent right now.";
  }

  function getApplicationMessageErrorMessage(error) {
    const reason = error?.payload?.error || error?.message || "application_message_failed";
    if (reason === "not_authenticated") return "Sign in with Discord again before sending a reply.";
    if (reason === "application_closed") return "This application chat is already closed.";
    if (reason === "missing_message") return "Write a message before sending it.";
    return "Your reply could not be sent right now.";
  }

  function getApplicationLoadErrorMessage(error, fallbackMessage) {
    const reason = error?.payload?.error || error?.message || "application_load_failed";
    if (reason === "applications_not_configured") return "The application backend is not connected yet.";
    if (reason === "applications_query_failed") return "The application database could not be reached right now.";
    if (reason === "application_detail_failed") return "The selected application could not be opened right now.";
    return fallbackMessage;
  }

  async function handleApplicationSubmit(form) {
    if (!getCurrentAccount()) {
      openAuthModal("login");
      return;
    }

    const values = Object.fromEntries(new FormData(form).entries());
    applicationCenterState.formValues = values;
    applicationCenterState.error = "";
    applicationCenterState.success = "";
    applicationCenterState.submitting = true;
    renderApply();

    try {
      const payload = await requestJson(APPLICATION_API.submit, {
        method: "POST",
        body: values
      });

      applicationCenterState.success = "Application sent. Staff can now review it and answer in the live chat.";
      applicationCenterState.formValues = {};
      applicationCenterState.submitting = false;
      await loadApplicationCenter({
        showLoading: false,
        keepSelection: false,
        selectedId: payload?.application?.publicId || ""
      });
    } catch (error) {
      applicationCenterState.submitting = false;
      applicationCenterState.error = getApplicationSubmitErrorMessage(error);
      if (getApplicationRouteActive()) renderApply();
    }
  }

  async function handleApplicationMessageSubmit(form) {
    if (!applicationCenterState.activeId) return;

    const formData = new FormData(form);
    const message = String(formData.get("message") || "").trim();
    applicationCenterState.error = "";
    applicationCenterState.success = "";
    applicationCenterState.sending = true;
    renderApply();

    try {
      await requestJson(APPLICATION_API.message, {
        method: "POST",
        body: {
          applicationId: applicationCenterState.activeId,
          message
        }
      });

      applicationCenterState.sending = false;
      applicationCenterState.success = "Reply sent.";
      form.reset();
      await loadApplicationCenter({
        showLoading: false,
        keepSelection: true,
        selectedId: applicationCenterState.activeId
      });
    } catch (error) {
      applicationCenterState.sending = false;
      applicationCenterState.error = getApplicationMessageErrorMessage(error);
      if (getApplicationRouteActive()) renderApply();
    }
  }

  renderApply = function renderApplyEnhanced() {
    const account = getCurrentAccount();
    const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const formValues = applicationCenterState.formValues || {};
    const activeApplication = applicationCenterState.items.find((item) => item.publicId === applicationCenterState.activeId) || applicationCenterState.items[0] || null;
    const openApplication = applicationCenterState.items.find((item) => isApplicationOpenStatus(item.status)) || null;
    const hasApplicationHistory = applicationCenterState.loading || applicationCenterState.items.length > 0;
    const detail = applicationCenterState.detail?.application?.publicId === activeApplication?.publicId
      ? applicationCenterState.detail
      : null;
    const processMarkup = `
      <div class="apply-stage__steps">
        <article class="apply-stage__step">
          <span class="apply-stage__stepIndex">01</span>
          <div>
            <strong>Open a ban-history ticket</strong>
            <span>Get the full result first so your application is complete when staff opens it.</span>
          </div>
        </article>
        <article class="apply-stage__step">
          <span class="apply-stage__stepIndex">02</span>
          <div>
            <strong>Send one clear application</strong>
            <span>Fill the required fields, add optional background if it helps, then submit once.</span>
          </div>
        </article>
        <article class="apply-stage__step">
          <span class="apply-stage__stepIndex">03</span>
          <div>
            <strong>Track the case here</strong>
            <span>Staff updates the status and any follow-up stays inside your private case chat.</span>
          </div>
        </article>
      </div>
    `;

    if (!account) {
      setView(`
        <div class="apply-page">
          <section class="section section--hero apply-stage__hero apply-stage__hero--intro">
            <div class="section__eyebrow">Staff applications</div>
            <h2>Apply for staff</h2>
            <p class="doc-p">One clean form, one private case, one place to track the decision. Sign in with Discord first, then send your application only after your ban-history ticket is ready.</p>
            <div class="apply-stage__statusRow">
              <span class="apply-sidecard__pill">Discord sign-in required</span>
              <span class="apply-sidecard__pill">One open application max</span>
            </div>
            ${processMarkup}
            <div class="apply-stage__actions">
              ${SERVER_CONFIG.discordOAuthUrl ? `<a class="auth__btn auth__btn--primary" href="${escapeHtml(SERVER_CONFIG.discordOAuthUrl)}">Sign in with Discord</a>` : `<button class="auth__btn auth__btn--primary" type="button" disabled>Discord login not connected yet</button>`}
              <a class="auth__btn" href="${escapeHtml(DISCORD_TICKET_CHANNEL_URL)}" target="_blank" rel="noopener noreferrer">Open ticket</a>
            </div>
          </section>

          <section class="apply-layout apply-layout--guest">
            <aside class="section section--stack apply-sidecard">
              <div class="section__eyebrow">Staff applications</div>
              <h2>Before you start</h2>
              <div class="apply-sidecard__list">
                <div>Use the same Discord account you want tied to the application.</div>
                <div>Paste the full ban history from the ticket, not a short summary.</div>
                <div>Only send one application at a time. Follow-up happens in the case chat later.</div>
              </div>
            </aside>
            <section class="section section--stack apply-panel apply-panel--notes">
              <div class="section__eyebrow">What to write</div>
              <h2>Keep the form direct</h2>
              <div class="apply-sidecard__list">
                <div>State your real availability clearly so staff knows when you can actually help.</div>
                <div>Use the main answer to explain why you fit the role, not to repeat your ticket.</div>
                <div>Add optional background only if it gives staff useful context.</div>
              </div>
            </section>
          </section>
        </div>
      `);
      return;
    }

    const displayName = getAccountDisplayName(account);
    const formDisabled = Boolean(openApplication) || applicationCenterState.submitting;
    const queueMarkup = applicationCenterState.loading
      ? `<div class="apply-empty">Loading your applications...</div>`
      : renderApplicantApplicationCards(applicationCenterState.items, activeApplication?.publicId || "");
    const primaryPanelMarkup = openApplication
      ? `
        <section class="section apply-panel apply-panel--locked">
          <div class="section__eyebrow">Current application</div>
          <h2>${escapeHtml(openApplication.roleRequested || "Staff application")} is already in review</h2>
          <p class="doc-p">You already have ${escapeHtml(openApplication.publicId)} open. Track the status here and use the private case chat below if staff needs more from you.</p>
          <div class="apply-activeCase">
            ${renderApplicationStatusPill(openApplication.status)}
            <span class="apply-activeCase__meta">${escapeHtml(openApplication.assignedStaffName ? `Handled by ${openApplication.assignedStaffName}` : "Waiting for staff assignment")}</span>
          </div>
          <div class="apply-stage__actions">
            <button class="auth__btn auth__btn--primary" type="button" data-application-select="${escapeHtml(openApplication.publicId)}">View case</button>
            <button class="auth__btn" type="button" data-application-chat="${escapeHtml(openApplication.publicId)}">Jump to chat</button>
          </div>
        </section>
      `
      : `
        <section class="section apply-panel apply-panel--form">
          <div class="section__eyebrow">Application form</div>
          <h2>Send one clean application</h2>
          <p class="doc-p">Your Discord identity is attached automatically. Keep the required answers direct, then use the optional section only if it adds helpful background.</p>
          ${renderApplyFeedback()}
          <form class="account-form apply-form" data-form="application-submit" autocomplete="off">
            <div class="apply-form__group">
              <div class="account-form__grid">
                <label class="account-field">
                  <span class="account-field__label">Applying for *</span>
                  <select class="account-field__input" name="roleRequested" required ${formDisabled ? "disabled" : ""}>
                    <option value="" disabled${formValues.roleRequested ? "" : " selected"}>Select a role</option>
                    ${APPLICATION_ROLE_OPTIONS.map((role) => `<option value="${escapeHtml(role)}"${formValues.roleRequested === role ? " selected" : ""}>${escapeHtml(role)}</option>`).join("")}
                  </select>
                </label>
                <label class="account-field">
                  <span class="account-field__label">In-game name *</span>
                  <input class="account-field__input" type="text" name="inGameName" value="${escapeHtml(formValues.inGameName || "")}" placeholder="Your in-game name" required ${formDisabled ? "disabled" : ""} />
                </label>
                <label class="account-field">
                  <span class="account-field__label">Timezone</span>
                  <input class="account-field__input" type="text" name="timezone" value="${escapeHtml(formValues.timezone || defaultTimezone)}" placeholder="Example: Europe/Berlin" ${formDisabled ? "disabled" : ""} />
                </label>
                <label class="account-field account-field--wide">
                  <span class="account-field__label">Availability *</span>
                  <textarea class="account-field__input account-field__input--textarea" rows="3" name="availability" placeholder="When are you usually online, and how often can you be active?" required ${formDisabled ? "disabled" : ""}>${escapeHtml(formValues.availability || "")}</textarea>
                </label>
                <label class="account-field account-field--wide">
                  <span class="account-field__label">Full ban history *</span>
                  <textarea class="account-field__input account-field__input--textarea" rows="4" name="banHistory" placeholder="Paste the full ban history from your Discord ticket." required ${formDisabled ? "disabled" : ""}>${escapeHtml(formValues.banHistory || "")}</textarea>
                </label>
                <label class="account-field account-field--wide">
                  <span class="account-field__label">Why do you fit this role? *</span>
                  <textarea class="account-field__input account-field__input--textarea" rows="5" name="fitReason" placeholder="Keep it direct. Why are you a good fit for this role?" required ${formDisabled ? "disabled" : ""}>${escapeHtml(formValues.fitReason || "")}</textarea>
                </label>
              </div>
            </div>
            <details class="apply-optional">
              <summary>Add background if it helps</summary>
              <div class="apply-optional__content">
                <div class="account-form__grid">
                  <label class="account-field">
                    <span class="account-field__label">In-game level</span>
                    <input class="account-field__input" type="number" min="1" name="inGameLevel" value="${escapeHtml(formValues.inGameLevel || "")}" placeholder="Current level" ${formDisabled ? "disabled" : ""} />
                  </label>
                  <label class="account-field">
                    <span class="account-field__label">Playtime (hours)</span>
                    <input class="account-field__input" type="number" min="0" name="playtimeHours" value="${escapeHtml(formValues.playtimeHours || "")}" placeholder="Total playtime" ${formDisabled ? "disabled" : ""} />
                  </label>
                  <label class="account-field account-field--wide">
                    <span class="account-field__label">Past staff experience</span>
                    <textarea class="account-field__input account-field__input--textarea" rows="4" name="moderationExperience" placeholder="Any staff, moderation, or support experience you already have." ${formDisabled ? "disabled" : ""}>${escapeHtml(formValues.moderationExperience || "")}</textarea>
                  </label>
                  <label class="account-field account-field--wide">
                    <span class="account-field__label">Anything else staff should know</span>
                    <textarea class="account-field__input account-field__input--textarea" rows="4" name="testingExperience" placeholder="Add any extra context that helps staff review the application." ${formDisabled ? "disabled" : ""}>${escapeHtml(formValues.testingExperience || "")}</textarea>
                  </label>
                </div>
              </div>
            </details>
            <div class="apply-stage__actions">
              <button class="auth__btn auth__btn--primary" type="submit" ${formDisabled ? "disabled" : ""}>${applicationCenterState.submitting ? "Sending..." : "Send application"}</button>
              <a class="auth__btn" href="${escapeHtml(DISCORD_TICKET_CHANNEL_URL)}" target="_blank" rel="noopener noreferrer">Open ticket</a>
            </div>
          </form>
        </section>
      `;

    const sidePanelMarkup = hasApplicationHistory
      ? `
        <section class="section section--stack apply-panel apply-panel--queue">
          <div class="section__eyebrow">Your applications</div>
          <h2>Case tracker</h2>
          <p class="doc-p">Every application stays here with its latest status, handler, and case chat access.</p>
          ${queueMarkup}
        </section>
      `
      : `
        <section class="section section--stack apply-panel apply-panel--notes">
          <div class="section__eyebrow">After you send</div>
          <h2>What happens next</h2>
          <div class="apply-sidecard__list">
            <div>Staff reviews your written answers and the full result from the ticket.</div>
            <div>Your case status is updated here so you can see if it is under review, accepted, or rejected.</div>
            <div>If more information is needed, reply inside the private application chat on this page.</div>
          </div>
        </section>
      `;

    setView(`
      <div class="apply-page">
        <section class="apply-stage">
          <section class="section section--hero apply-stage__hero">
            <div class="section__eyebrow">Staff applications</div>
            <h2>Apply for staff</h2>
            <p class="doc-p">Send one clear application here. If staff needs anything else, they update the status and continue the conversation in your private case chat on this page.</p>
            <div class="apply-stage__statusRow">
              <span class="apply-sidecard__pill">Signed in</span>
              ${openApplication ? renderApplicationStatusPill(openApplication.status) : `<span class="apply-sidecard__pill">Ready to send</span>`}
            </div>
            ${processMarkup}
          </section>
          <aside class="section section--stack apply-sidecard">
            <div class="section__eyebrow">Signed in as</div>
            <h2>${escapeHtml(displayName)}</h2>
            <div class="apply-sidecard__account">${escapeHtml(account.discordUsername ? `@${account.discordUsername}` : displayName)}</div>
            <div class="apply-sidecard__list">
              <div>Use the ticket channel first if you still need your ban history.</div>
              <div>Only one open application is allowed at a time.</div>
              <div>When staff needs more from you, reply in the private case chat below.</div>
            </div>
            <div class="apply-stage__actions">
              <a class="auth__btn" href="${escapeHtml(DISCORD_TICKET_CHANNEL_URL)}" target="_blank" rel="noopener noreferrer">Open ticket</a>
            </div>
          </aside>
        </section>

        <section class="apply-layout">
          <div class="apply-main">
            ${primaryPanelMarkup}
            ${activeApplication ? renderApplicantChat(detail) : ""}
          </div>
          <aside class="apply-rail">
            ${sidePanelMarkup}
          </aside>
        </section>
      </div>
    `);
  };

  document.addEventListener("submit", (event) => {
    const submitForm = event.target.closest('[data-form="application-submit"]');
    if (submitForm) {
      event.preventDefault();
      handleApplicationSubmit(submitForm);
      return;
    }

    const messageForm = event.target.closest('[data-form="application-message"]');
    if (messageForm) {
      event.preventDefault();
      handleApplicationMessageSubmit(messageForm);
    }
  });

  document.addEventListener("click", (event) => {
    const selectButton = event.target.closest("[data-application-select]");
    if (selectButton) {
      event.preventDefault();
      selectApplication(selectButton.dataset.applicationSelect || "");
      return;
    }

    const chatButton = event.target.closest("[data-application-chat]");
    if (chatButton) {
      event.preventDefault();
      selectApplication(chatButton.dataset.applicationChat || "", { scrollToChat: true });
    }
  });

  route();
})();
