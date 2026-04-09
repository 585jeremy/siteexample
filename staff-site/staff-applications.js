(() => {
  const originalStaffRender = render;
  const STAFF_APPLICATIONS_API = {
    list: "./staff-auth/applications-list.php",
    detail: "./staff-auth/applications-detail.php",
    update: "./staff-auth/applications-update.php",
    message: "./staff-auth/applications-message.php"
  };
  const STAFF_APPLICATION_STATUS_LABELS = {
    submitted: "Submitted",
    in_review: "In Review",
    needs_info: "Needs Info",
    interview: "Interview",
    accepted: "Accepted",
    denied: "Denied",
    closed: "Closed"
  };

  state.applicationsView = {
    loading: false,
    items: [],
    counts: {},
    activeId: "",
    detail: null,
    error: "",
    success: "",
    sending: false,
    updating: false,
    pollTimer: null
  };

  render = function renderWithApplications() {
    originalStaffRender();
    renderApplicationsWorkspace();
  };

  function applicationsRouteActive() {
    const slug = (window.location.hash || "").replace(/^#\/?/, "").split("/")[0].toLowerCase();
    return slug === "applications";
  }

  function clearApplicationsPoll() {
    if (state.applicationsView.pollTimer) {
      window.clearTimeout(state.applicationsView.pollTimer);
      state.applicationsView.pollTimer = null;
    }
  }

  function staffApplicationStatusLabel(status) {
    return STAFF_APPLICATION_STATUS_LABELS[status] || "Open";
  }

  function staffApplicationStatusTone(status) {
    if (status === "accepted") return "accepted";
    if (status === "denied" || status === "closed") return "closed";
    if (status === "needs_info") return "needs";
    if (status === "interview") return "interview";
    return "open";
  }

  function staffApplicationTimestamp(value) {
    if (!value) return "Just now";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Just now";
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short"
    }).format(date);
  }

  function normaliseStaffApplication(item) {
    if (!item || typeof item !== "object") return null;
    const publicId = String(item.publicId || item.id || "").trim();
    if (!publicId) return null;
    return {
      publicId,
      applicantName: String(item.applicantName || item.inGameName || "").trim(),
      discordDisplayName: String(item.discordDisplayName || "").trim(),
      discordUsername: String(item.discordUsername || "").trim(),
      roleRequested: String(item.roleRequested || "").trim(),
      status: String(item.status || "submitted").trim().toLowerCase(),
      assignedStaffId: String(item.assignedStaffId || "").trim(),
      assignedStaffName: String(item.assignedStaffName || "").trim(),
      timezone: String(item.timezone || "").trim(),
      playtimeHours: item.playtimeHours ?? "",
      inGameLevel: item.inGameLevel ?? "",
      availability: String(item.availability || "").trim(),
      banHistory: String(item.banHistory || "").trim(),
      moderationExperience: String(item.moderationExperience || "").trim(),
      testingExperience: String(item.testingExperience || "").trim(),
      fitReason: String(item.fitReason || "").trim(),
      createdAt: item.createdAt || "",
      updatedAt: item.updatedAt || "",
      lastMessageAt: item.lastMessageAt || "",
      lastStaffReplyAt: item.lastStaffReplyAt || ""
    };
  }

  function renderStaffApplicationStatus(status) {
    return `<span class="staff-application-status staff-application-status--${esc(staffApplicationStatusTone(status))}">${esc(staffApplicationStatusLabel(status))}</span>`;
  }

  function renderStaffApplicationsList(items, activeId) {
    if (!items.length) {
      return `<div class="staff-applications-empty">No applications have been submitted yet.</div>`;
    }

    return items.map((item) => `
      <article class="staff-application-card${item.publicId === activeId ? " is-active" : ""}">
        <div class="staff-application-card__top">
          <div>
            <div class="staff-application-card__eyebrow">${esc(item.publicId)}</div>
            <div class="staff-application-card__title">${esc(item.applicantName || item.discordDisplayName || item.discordUsername || "Applicant")}</div>
          </div>
          ${renderStaffApplicationStatus(item.status)}
        </div>
        <div class="staff-application-card__meta">${esc(item.roleRequested || "Staff application")}</div>
        <div class="staff-application-card__meta">${esc(item.assignedStaffName ? `Handled by ${item.assignedStaffName}` : "Unassigned")}</div>
        <div class="staff-application-card__meta">Updated ${esc(staffApplicationTimestamp(item.lastMessageAt || item.updatedAt || item.createdAt))}</div>
        <div class="staff-application-card__actions">
          <button class="staff-panel__button staff-panel__button--primary" type="button" data-staff-application-open="${esc(item.publicId)}">Open case</button>
          <button class="staff-panel__button" type="button" data-staff-application-chat="${esc(item.publicId)}">Live chat</button>
        </div>
      </article>
    `).join("");
  }

  function renderStaffApplicationMessages(detail) {
    if (!detail?.messages?.length) {
      return `<div class="staff-applications-empty">No chat messages yet.</div>`;
    }

    return detail.messages.map((message) => `
      <article class="staff-application-message staff-application-message--${esc(message.senderType || "system")}">
        <div class="staff-application-message__meta">
          <strong>${esc(message.senderName || "System")}</strong>
          <span>${esc(staffApplicationTimestamp(message.createdAt))}</span>
        </div>
        <div class="staff-application-message__body">${esc(message.message || "")}</div>
      </article>
    `).join("");
  }

  function scheduleApplicationsPoll() {
    clearApplicationsPoll();
    if (!applicationsRouteActive()) return;
    if (!state.gate.loggedIn || state.gate.passwordResetRequired) return;
    if (!state.applicationsView.items.length) return;

    state.applicationsView.pollTimer = window.setTimeout(() => {
      loadStaffApplications({ showLoading: false, keepSelection: true });
    }, 9000);
  }

  async function loadStaffApplicationDetail(publicId, options = {}) {
    if (!publicId) {
      state.applicationsView.detail = null;
      renderApplicationsWorkspace();
      return;
    }

    try {
      const payload = await fetchJson(`${STAFF_APPLICATIONS_API.detail}?applicationId=${encodeURIComponent(publicId)}`);
      state.applicationsView.detail = {
        application: normaliseStaffApplication(payload?.application),
        messages: Array.isArray(payload?.messages) ? payload.messages : []
      };
    } catch {
      state.applicationsView.detail = null;
      if (!options.silent) {
        state.applicationsView.error = "That application could not be opened right now.";
      }
    }

    renderApplicationsWorkspace();
    scheduleApplicationsPoll();
  }

  async function loadStaffApplications(options = {}) {
    clearApplicationsPoll();
    if (!state.gate.loggedIn || state.gate.passwordResetRequired) return;

    if (options.showLoading !== false) {
      state.applicationsView.loading = true;
    }
    renderApplicationsWorkspace();

    try {
      const payload = await fetchJson(STAFF_APPLICATIONS_API.list);
      state.applicationsView.items = Array.isArray(payload?.items) ? payload.items.map(normaliseStaffApplication).filter(Boolean) : [];
      state.applicationsView.counts = payload?.counts || {};
      state.applicationsView.loading = false;

      const keepSelection = options.keepSelection !== false
        && state.applicationsView.items.some((item) => item.publicId === state.applicationsView.activeId);
      state.applicationsView.activeId = options.selectedId || (keepSelection ? state.applicationsView.activeId : (state.applicationsView.items[0]?.publicId || ""));

      if (state.applicationsView.activeId) {
        await loadStaffApplicationDetail(state.applicationsView.activeId, { silent: true });
      } else {
        state.applicationsView.detail = null;
        renderApplicationsWorkspace();
        scheduleApplicationsPoll();
      }
    } catch {
      state.applicationsView.loading = false;
      state.applicationsView.items = [];
      state.applicationsView.detail = null;
      state.applicationsView.error = "Applications could not be loaded from the staff backend.";
      renderApplicationsWorkspace();
    }
  }

  function renderApplicationsWorkspace() {
    if (!applicationsRouteActive()) {
      clearApplicationsPoll();
      return;
    }

    if (!state.gate.loggedIn || state.gate.passwordResetRequired) {
      return;
    }

    shell.dataset.route = "applications";
    document.querySelectorAll(".staff-dock__item").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.team === "applications");
    });

    const view = state.applicationsView;
    const detail = view.detail?.application?.publicId === view.activeId ? view.detail : null;
    const summaryCards = `
      <div class="dashboard-hero__rail">
        ${statCard("New", String(view.counts.submitted || 0), "Fresh applications waiting for first review.")}
        ${statCard("Needs info", String(view.counts.needs_info || 0), "Applicants that still need follow-up or missing details.")}
        ${statCard("Resolved", String((view.counts.accepted || 0) + (view.counts.denied || 0)), "Accepted or denied applications already processed.")}
      </div>
    `;
    const detailMarkup = detail
      ? `
        <article class="workspace-panel staff-application-detail">
          <div class="staff-application-detail__header">
            <div>
              <span class="workspace-panel__eyebrow">Application detail</span>
              <h2 class="workspace-panel__title">${esc(detail.application.applicantName || detail.application.discordDisplayName || detail.application.discordUsername || detail.application.publicId)}</h2>
            </div>
            ${renderStaffApplicationStatus(detail.application.status)}
          </div>
          <div class="staff-application-detail__meta">
            <div><strong>Case:</strong> ${esc(detail.application.publicId)}</div>
            <div><strong>Role:</strong> ${esc(detail.application.roleRequested || "Staff application")}</div>
            <div><strong>Timezone:</strong> ${esc(detail.application.timezone || "Not provided")}</div>
            <div><strong>Playtime:</strong> ${esc(detail.application.playtimeHours !== "" && detail.application.playtimeHours != null ? `${detail.application.playtimeHours}h` : "Not provided")}</div>
            <div><strong>Level:</strong> ${esc(detail.application.inGameLevel !== "" && detail.application.inGameLevel != null ? String(detail.application.inGameLevel) : "Not provided")}</div>
            <div><strong>Assigned staff:</strong> ${esc(detail.application.assignedStaffName || "Unassigned")}</div>
          </div>
          <div class="staff-application-copyGrid">
            <article class="staff-application-copyCard"><h3>Availability</h3><p>${esc(detail.application.availability || "Not provided")}</p></article>
            <article class="staff-application-copyCard"><h3>Ban history</h3><p>${esc(detail.application.banHistory || "Not provided")}</p></article>
            <article class="staff-application-copyCard"><h3>Moderation experience</h3><p>${esc(detail.application.moderationExperience || "Not provided")}</p></article>
            <article class="staff-application-copyCard"><h3>Testing experience</h3><p>${esc(detail.application.testingExperience || "Not provided")}</p></article>
            <article class="staff-application-copyCard staff-application-copyCard--wide"><h3>Why should we accept them?</h3><p>${esc(detail.application.fitReason || "Not provided")}</p></article>
          </div>
          <form class="staff-application-toolbar" data-form="staff-application-status">
            <input type="hidden" name="applicationId" value="${esc(detail.application.publicId)}" />
            <label class="gate-form__field">
              <span>Status</span>
              <select class="gate-form__input" name="status">
                ${Object.entries(STAFF_APPLICATION_STATUS_LABELS).map(([value, label]) => `<option value="${esc(value)}"${detail.application.status === value ? " selected" : ""}>${esc(label)}</option>`).join("")}
              </select>
            </label>
            <div class="staff-application-toolbar__actions">
              <button class="staff-panel__button staff-panel__button--primary" type="submit" ${view.updating ? "disabled" : ""}>${view.updating ? "Saving..." : "Update status"}</button>
              <button class="staff-panel__button" type="button" data-staff-assign="${esc(detail.application.publicId)}">Assign to me</button>
            </div>
          </form>
          <div class="staff-application-chat" id="staffApplicationChat">
            <div class="staff-application-chat__feed">${renderStaffApplicationMessages(detail)}</div>
            <form class="staff-application-chat__composer" data-form="staff-application-message">
              <input type="hidden" name="applicationId" value="${esc(detail.application.publicId)}" />
              <label class="gate-form__field">
                <span>Live chat reply</span>
                <textarea class="gate-form__input staff-application-chat__input" name="message" placeholder="Write a reply for the applicant..." ${view.sending || detail.application.status === "closed" ? "disabled" : ""}></textarea>
              </label>
              <button class="staff-panel__button staff-panel__button--primary" type="submit" ${view.sending || detail.application.status === "closed" ? "disabled" : ""}>${view.sending ? "Sending..." : "Send reply"}</button>
            </form>
          </div>
        </article>
      `
      : `<article class="workspace-panel"><div class="staff-applications-empty">Select an application card to open the full case and live chat.</div></article>`;

    app.innerHTML = `
      <section class="staff-view workspace-view staff-applications-view">
        <section class="workspace-hero">
          <article class="staff-panel staff-panel--hero">
            <span class="gate-kicker">Application desk</span>
            <h1 class="staff-heading">Applications</h1>
            <p class="staff-copy">Review incoming applications, assign a handler, update status, and keep the live case chat in one place.</p>
            ${view.error ? `<p class="gate-form__error">${esc(view.error)}</p>` : view.success ? `<p class="gate-form__hint">${esc(view.success)}</p>` : ""}
            <div class="staff-panel__actions">
              <span class="staff-state-pill staff-state-pill--open">${esc(`${view.items.length} cases loaded`)}</span>
              <a class="staff-panel__button" href="#/dashboard">Back to dashboard</a>
            </div>
          </article>
          ${summaryCards}
        </section>
        <section class="workspace-columns staff-applications-grid">
          <article class="workspace-panel staff-applications-list">
            <span class="workspace-panel__eyebrow">Open queue</span>
            <h2 class="workspace-panel__title">Application list</h2>
            <p class="workspace-panel__summary">Each card opens the full case. The live chat button jumps directly to the private thread.</p>
            <div class="staff-applications-list__items">
              ${view.loading ? `<div class="staff-applications-empty">Loading applications...</div>` : renderStaffApplicationsList(view.items, view.activeId)}
            </div>
          </article>
          ${detailMarkup}
        </section>
      </section>
    `;
  }

  async function handleStatusUpdate(form, assignToSelf = false) {
    const values = Object.fromEntries(new FormData(form).entries());
    state.applicationsView.error = "";
    state.applicationsView.success = "";
    state.applicationsView.updating = true;
    renderApplicationsWorkspace();

    try {
      await postJson(STAFF_APPLICATIONS_API.update, {
        applicationId: values.applicationId,
        status: values.status,
        assignToSelf
      });
      state.applicationsView.updating = false;
      state.applicationsView.success = assignToSelf ? "Application assigned to your staff account." : "Application status updated.";
      await loadStaffApplications({ showLoading: false, keepSelection: true, selectedId: values.applicationId });
    } catch (error) {
      state.applicationsView.updating = false;
      state.applicationsView.error = error?.payload?.error === "invalid_status"
        ? "That status is not allowed."
        : "The application could not be updated right now.";
      renderApplicationsWorkspace();
    }
  }

  async function handleStaffMessage(form) {
    const values = Object.fromEntries(new FormData(form).entries());
    state.applicationsView.error = "";
    state.applicationsView.success = "";
    state.applicationsView.sending = true;
    renderApplicationsWorkspace();

    try {
      await postJson(STAFF_APPLICATIONS_API.message, {
        applicationId: values.applicationId,
        message: values.message
      });
      state.applicationsView.sending = false;
      state.applicationsView.success = "Reply sent to the applicant chat.";
      await loadStaffApplications({ showLoading: false, keepSelection: true, selectedId: values.applicationId });
    } catch (error) {
      state.applicationsView.sending = false;
      state.applicationsView.error = error?.payload?.error === "application_closed"
        ? "This application is already closed."
        : "The reply could not be sent right now.";
      renderApplicationsWorkspace();
    }
  }

  function selectStaffApplication(publicId, scrollToChat = false) {
    state.applicationsView.activeId = publicId;
    renderApplicationsWorkspace();
    loadStaffApplicationDetail(publicId, { silent: true });

    if (scrollToChat) {
      window.setTimeout(() => {
        const chat = document.getElementById("staffApplicationChat");
        if (chat) {
          chat.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    }
  }

  document.addEventListener("submit", (event) => {
    const statusForm = event.target.closest('[data-form="staff-application-status"]');
    if (statusForm) {
      event.preventDefault();
      handleStatusUpdate(statusForm);
      return;
    }

    const messageForm = event.target.closest('[data-form="staff-application-message"]');
    if (messageForm) {
      event.preventDefault();
      handleStaffMessage(messageForm);
    }
  });

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-staff-application-open]");
    if (openButton) {
      event.preventDefault();
      selectStaffApplication(openButton.dataset.staffApplicationOpen || "");
      return;
    }

    const chatButton = event.target.closest("[data-staff-application-chat]");
    if (chatButton) {
      event.preventDefault();
      selectStaffApplication(chatButton.dataset.staffApplicationChat || "", true);
      return;
    }

    const assignButton = event.target.closest("[data-staff-assign]");
    if (assignButton) {
      event.preventDefault();
      const toolbar = assignButton.closest(".staff-application-toolbar");
      if (toolbar) {
        handleStatusUpdate(toolbar, true);
      }
    }
  });

  window.addEventListener("hashchange", () => {
    if (applicationsRouteActive()) {
      renderApplicationsWorkspace();
      loadStaffApplications({ showLoading: !state.applicationsView.items.length, keepSelection: true });
    } else {
      clearApplicationsPoll();
    }
  });

  renderApplicationsWorkspace();
  if (applicationsRouteActive() && state.gate.loggedIn && !state.gate.passwordResetRequired) {
    loadStaffApplications({ showLoading: !state.applicationsView.items.length, keepSelection: true });
  }
})();
