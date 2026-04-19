(() => {
  const originalRoute = route;
  let revealObserver = null;

  function initEditorialMotion() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    }

    document.querySelectorAll("[data-reveal]").forEach((node, index) => {
      node.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 70}ms`);
      node.classList.remove("is-visible");
      revealObserver.observe(node);
    });
  }

  route = function enhancedRoute() {
    const currentRoute = parseRoute().name;
    if (currentRoute !== "apply") {
      clearApplicationCenterPoll();
    }
    const output = originalRoute();
    if (currentRoute === "apply" && getCurrentAccount()) {
      loadApplicationCenter({ showLoading: !applicationCenterState.items.length, keepSelection: true });
    }
    window.requestAnimationFrame(initEditorialMotion);
    return output;
  };

  renderStart = function renderStartEnhanced() {
    const quickLinks = [
      { label: "Rules", detail: "Learn the basics before you join.", href: "/rules" },
      { label: "Map", detail: "Keep the city layout nearby.", href: "/map" },
      { label: "Live", detail: "Check the server and bot state fast.", href: "/live" }
    ];

    setView(`
      <div>
        ${renderHeader("Start Here", [{ label: "Start" }], { showBadge: false })}
        <section class="section section--hero start-clean" data-reveal>
          <div class="section__eyebrow">New player entry</div>
          <h2>Get into the city without missing the basics.</h2>
          <p class="doc-p">This page is your fast lane: find the server, lock in the rules, and keep the right links ready before you start moving.</p>
          <div class="start-clean__flow">
            <article class="start-clean__step" data-reveal>
              <span class="start-clean__stepIndex">01</span>
              <div class="start-clean__stepCopy">
                <strong>Find SGCNR in FiveM</strong>
                <span>Search for the server in FiveM and join from there.</span>
              </div>
            </article>
            <article class="start-clean__step" data-reveal>
              <span class="start-clean__stepIndex">02</span>
              <div class="start-clean__stepCopy">
                <strong>Read the rules first</strong>
                <span>Use the Rules page before you jump into active situations in the city.</span>
              </div>
            </article>
            <article class="start-clean__step" data-reveal>
              <span class="start-clean__stepIndex">03</span>
              <div class="start-clean__stepCopy">
                <strong>Use Discord for support</strong>
                <span>Tickets, ban history, and staff help stay in Discord so everything is tracked properly.</span>
              </div>
            </article>
          </div>
        </section>

        <section class="start-clean__links" aria-label="Start shortcuts">
          ${quickLinks.map((item) => `
            <a class="start-clean__linkCard" href="${escapeHtml(item.href)}" data-reveal>
              <span class="start-clean__linkLabel">${escapeHtml(item.label)}</span>
              <strong class="start-clean__linkTitle">${escapeHtml(item.detail)}</strong>
            </a>
          `).join("")}
        </section>
      </div>
    `);
  };

  function getWikiSectionAnchor(index) {
    return `wiki-reboot-section-${index + 1}`;
  }

  function renderWikiRebootLibrary(categories, pages, currentSlug, updatedAt) {
    const totalPages = Object.keys(pages).length;
    const groups = categories.map((category) => {
      const entries = (category.pages || []).map((slug, index) => {
        const page = pages[slug];
        if (!page) return "";
        const isActive = slug === currentSlug ? " is-active" : "";
        const label = page.navLabel || page.title;
        return `
          <a class="wiki-reboot__libraryItem${isActive}" href="#/wiki/${escapeHtml(slug)}">
            <span class="wiki-reboot__libraryIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
            <span class="wiki-reboot__libraryLabel">${escapeHtml(label)}</span>
          </a>
        `;
      }).join("");

      return `
        <section class="wiki-reboot__libraryGroup">
          <div class="wiki-reboot__libraryHead">
            <span>${escapeHtml(category.title)}</span>
            <span class="wiki-reboot__libraryCount">${escapeHtml(String((category.pages || []).length))}</span>
          </div>
          <div class="wiki-reboot__libraryList">${entries}</div>
        </section>
      `;
    }).join("");

    return `
      <aside class="section section--stack wiki-reboot__rail">
        <div class="wiki-reboot__railIntro">
          <div class="section__eyebrow">Guide library</div>
          <h2>Wiki index</h2>
          <p class="doc-p">Move through systems, roles, and procedures from one cleaner library view.</p>
        </div>
        <div class="wiki-reboot__railStats">
          <article class="wiki-reboot__railStat">
            <span>Pages</span>
            <strong>${escapeHtml(String(totalPages))}</strong>
          </article>
          <article class="wiki-reboot__railStat">
            <span>Groups</span>
            <strong>${escapeHtml(String(categories.length))}</strong>
          </article>
          <article class="wiki-reboot__railStat">
            <span>Updated</span>
            <strong>${escapeHtml(updatedAt || "2026-04-01")}</strong>
          </article>
        </div>
        <div class="wiki-reboot__library">
          ${groups}
        </div>
      </aside>
    `;
  }

  function renderWikiRebootHero(page, category, updatedAt, currentIndex, totalPages) {
    const overview = Array.isArray(page?.overviewCards) ? page.overviewCards.slice(0, 3) : [];
    const chips = [
      category?.title || "Wiki",
      `Page ${currentIndex + 1} of ${totalPages}`,
      `Updated ${updatedAt || "2026-04-01"}`
    ];

    return `
      <section class="section section--hero wiki-reboot__hero">
        <div class="wiki-reboot__heroBody">
          <div class="wiki-reboot__heroIntro">
            <div class="section__eyebrow">${escapeHtml(page.eyebrow || "Wiki entry")}</div>
            <h2>${escapeHtml(page.title)}</h2>
            <p class="doc-p">${escapeHtml(page.summary || "")}</p>
            <div class="wiki-reboot__heroTags">
              ${chips.map((chip) => `<span class="wiki-reboot__heroTag">${escapeHtml(chip)}</span>`).join("")}
            </div>
          </div>
          <div class="wiki-reboot__heroPanels">
            ${(overview.length ? overview : [
              { title: "Scope", text: "This guide is structured for fast reading and section-by-section jumping." },
              { title: "Use", text: "Keep this page open while you handle the matching in-game or staff task." },
              { title: "Flow", text: "Read the summary first, then jump directly into the section you need." }
            ]).map((card) => `
              <article class="wiki-reboot__heroCard">
                <div class="wiki-reboot__heroCardTitle">${escapeHtml(card.title || "Guide note")}</div>
                <div class="wiki-reboot__heroCardText">${escapeHtml(card.text || "")}</div>
              </article>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderWikiRebootFacts(page) {
    const facts = Array.isArray(page?.facts) ? page.facts : [];
    if (!facts.length) return "";

    return `
      <section class="wiki-reboot__factStrip">
        ${facts.map(([label, value]) => `
          <article class="wiki-reboot__factTile">
            <span class="wiki-reboot__factLabel">${escapeHtml(label)}</span>
            <strong class="wiki-reboot__factValue">${escapeHtml(value)}</strong>
          </article>
        `).join("")}
      </section>
    `;
  }

  function renderWikiRebootJumpList(sections) {
    const items = Array.isArray(sections) ? sections : [];
    if (!items.length) return "";

    return `
      <section class="section section--stack wiki-reboot__jumpCard">
        <div class="section__eyebrow">On this page</div>
        <h2>Section jump</h2>
        <div class="wiki-reboot__jumpList">
          ${items.map((section, index) => `
            <button class="wiki-reboot__jumpBtn" type="button" data-wiki-jump="${escapeHtml(getWikiSectionAnchor(index))}">
              <span class="wiki-reboot__jumpIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
              <span class="wiki-reboot__jumpLabel">${escapeHtml(section.title || `Section ${index + 1}`)}</span>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderWikiRebootSections(sections) {
    const entries = Array.isArray(sections) ? sections : [];
    return entries.map((section, index) => {
      const paragraphs = (section.paragraphs || []).map((paragraph) => `<p class="doc-p">${escapeHtml(paragraph)}</p>`).join("");
      const bullets = Array.isArray(section.bullets) && section.bullets.length
        ? `
          <ul class="wiki-reboot__bulletList">
            ${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        `
        : "";

      return `
        <section class="wiki-reboot__sectionCard" id="${escapeHtml(getWikiSectionAnchor(index))}">
          <div class="wiki-reboot__sectionIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</div>
          <div class="wiki-reboot__sectionBody">
            <h3 class="wiki-reboot__sectionTitle">${escapeHtml(section.title)}</h3>
            ${paragraphs}
            ${bullets}
          </div>
        </section>
      `;
    }).join("");
  }

  function renderWikiRebootUpdates(items) {
    const entries = Array.isArray(items) ? items : [];
    if (!entries.length) return "";

    return `
      <section class="section section--stack wiki-reboot__updates">
        <div class="section__eyebrow">Current direction</div>
        <h2>Important notes</h2>
        <div class="wiki-reboot__updateList">
          ${entries.map((item, index) => `
            <article class="wiki-reboot__updateItem">
              <span class="wiki-reboot__updateIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
              <span>${escapeHtml(item)}</span>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderWikiRebootPager(categories, pages, currentSlug) {
    const order = getWikiPageOrder(categories).filter((slug) => pages[slug]);
    const currentIndex = order.indexOf(currentSlug);
    if (currentIndex === -1) return "";

    const previousSlug = order[currentIndex - 1] || null;
    const nextSlug = order[currentIndex + 1] || null;

    const renderLink = (slug, label, direction) => {
      if (!slug || !pages[slug]) {
        return `<div class="wiki-reboot__pagerCard wiki-reboot__pagerCard--ghost"></div>`;
      }

      const page = pages[slug];
      return `
        <a class="wiki-reboot__pagerCard" href="#/wiki/${escapeHtml(slug)}">
          <div class="wiki-reboot__pagerEyebrow">${escapeHtml(label)}</div>
          <div class="wiki-reboot__pagerTitle">${escapeHtml(page.navLabel || page.title)}</div>
          <div class="wiki-reboot__pagerArrow">${direction === "prev" ? "Previous guide" : "Next guide"}</div>
        </a>
      `;
    };

    return `
      <section class="wiki-reboot__pager">
        ${renderLink(previousSlug, "Back", "prev")}
        ${renderLink(nextSlug, "Continue", "next")}
      </section>
    `;
  }

  function bindWikiRebootControls() {
    document.querySelectorAll("[data-wiki-jump]").forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-wiki-jump");
        const target = targetId ? document.getElementById(targetId) : null;
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  renderWikiSidebar = function renderWikiSidebarEnhanced(categories, pages, currentSlug, updatedAt) {
    return renderWikiRebootLibrary(categories, pages, currentSlug, updatedAt);
  };

  renderWiki = function renderWikiEnhanced(pageSlug) {
    const wiki = getWikiDataset();
    const categories = Array.isArray(wiki.categories) ? wiki.categories : [];
    const pages = wiki.pages && typeof wiki.pages === "object" ? wiki.pages : {};
    const requestedSlug = (pageSlug || "introduction").toString().toLowerCase();
    const currentSlug = pages[requestedSlug] ? requestedSlug : "introduction";
    const page = pages[currentSlug];

    if (!page) {
      setView(`
        <div class="wiki-reboot">
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
    const order = getWikiPageOrder(categories).filter((slug) => pages[slug]);
    const currentIndex = Math.max(0, order.indexOf(currentSlug));
    const facts = renderWikiRebootFacts(page);
    const sectionJump = renderWikiRebootJumpList(page.sections);
    const content = renderWikiRebootSections(page.sections);
    const updates = renderWikiRebootUpdates(page.updates);
    const pager = renderWikiRebootPager(categories, pages, currentSlug);

    setView(`
      <div class="wiki-reboot">
        ${renderHeader("Wiki", [{ label: "Wiki" }, { label: heading }])}
        <div class="wiki-reboot__layout">
          ${renderWikiRebootLibrary(categories, pages, currentSlug, wiki.updatedAt)}
          <div class="wiki-reboot__content">
            ${renderWikiRebootHero(page, category, wiki.updatedAt, currentIndex, order.length || 1)}
            ${facts}
            <div class="wiki-reboot__articleGrid">
              <div class="wiki-reboot__articleColumn">
                ${content}
                ${updates}
                ${pager}
              </div>
              <aside class="wiki-reboot__sideColumn">
                ${sectionJump}
              </aside>
            </div>
          </div>
        </div>
      </div>
    `);

    bindWikiRebootControls();
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

  function getWikiAtlasAnchor(index) {
    return `wiki-atlas-chapter-${index + 1}`;
  }

  function renderWikiAtlasShelf(categories, pages, currentSlug) {
    return `
      <section class="wiki-atlas__shelf" aria-label="Wiki library">
        ${categories.map((category) => {
          const links = (category.pages || []).map((slug) => {
            const page = pages[slug];
            if (!page) return "";
            const active = slug === currentSlug ? " is-active" : "";
            return `
              <a class="wiki-atlas__link${active}" href="#/wiki/${escapeHtml(slug)}">
                <span class="wiki-atlas__linkLabel">${escapeHtml(page.navLabel || page.title)}</span>
              </a>
            `;
          }).join("");

          return `
            <article class="wiki-atlas__group">
              <div class="wiki-atlas__groupTop">
                <span class="wiki-atlas__groupTitle">${escapeHtml(category.title)}</span>
                <span class="wiki-atlas__groupCount">${escapeHtml(String((category.pages || []).length))}</span>
              </div>
              <div class="wiki-atlas__groupLinks">${links}</div>
            </article>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderWikiAtlasMasthead(page, category, updatedAt, currentIndex, totalPages) {
    const notes = Array.isArray(page?.overviewCards) && page.overviewCards.length
      ? page.overviewCards.slice(0, 3)
      : [
          { title: "Read order", text: "Start with the summary, then move through each chapter in order." },
          { title: "Fast lookup", text: "Use the chapter strip below to jump straight into the exact section you need." },
          { title: "Current page", text: "This page stays focused on one subject instead of mixing multiple systems together." }
        ];

    return `
      <section class="wiki-atlas__masthead">
        <div class="wiki-atlas__edition">
          <div class="wiki-atlas__editionLabel">SGCNR knowledgebase</div>
          <div class="wiki-atlas__editionValue">${escapeHtml(category?.title || "Wiki")}</div>
          <div class="wiki-atlas__editionMeta">Page ${escapeHtml(String(currentIndex + 1))} / ${escapeHtml(String(totalPages))}</div>
          <div class="wiki-atlas__editionMeta">Updated ${escapeHtml(updatedAt || "2026-04-01")}</div>
        </div>
        <div class="wiki-atlas__headline">
          <div class="wiki-atlas__eyebrow">${escapeHtml(page.eyebrow || "Knowledgebase entry")}</div>
          <h2>${escapeHtml(page.title)}</h2>
          <p>${escapeHtml(page.summary || "")}</p>
        </div>
        <div class="wiki-atlas__briefing">
          ${notes.map((card, index) => `
            <article class="wiki-atlas__briefCard">
              <div class="wiki-atlas__briefIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</div>
              <div class="wiki-atlas__briefBody">
                <strong>${escapeHtml(card.title || "Guide note")}</strong>
                <span>${escapeHtml(card.text || "")}</span>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderWikiAtlasFactRow(page) {
    const facts = Array.isArray(page?.facts) ? page.facts : [];
    if (!facts.length) return "";

    return `
      <section class="wiki-atlas__factRow">
        ${facts.map(([label, value]) => `
          <article class="wiki-atlas__factPill">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value)}</strong>
          </article>
        `).join("")}
      </section>
    `;
  }

  function renderWikiAtlasChapters(sections) {
    const entries = Array.isArray(sections) ? sections : [];
    if (!entries.length) return "";

    return `
      <section class="wiki-atlas__chapterBar">
        ${entries.map((section, index) => `
          <button class="wiki-atlas__chapterBtn" type="button" data-wiki-atlas-jump="${escapeHtml(getWikiAtlasAnchor(index))}">
            <span class="wiki-atlas__chapterBtnIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
            <span class="wiki-atlas__chapterBtnLabel">${escapeHtml(section.title || `Section ${index + 1}`)}</span>
          </button>
        `).join("")}
      </section>
    `;
  }

  function renderWikiAtlasSheets(sections) {
    const entries = Array.isArray(sections) ? sections : [];
    return entries.map((section, index) => {
      const paragraphs = (section.paragraphs || []).map((paragraph) => `<p class="wiki-atlas__sheetText">${escapeHtml(paragraph)}</p>`).join("");
      const bullets = Array.isArray(section.bullets) && section.bullets.length
        ? `
          <ul class="wiki-atlas__sheetList">
            ${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        `
        : "";

      return `
        <article class="wiki-atlas__sheet" id="${escapeHtml(getWikiAtlasAnchor(index))}">
          <div class="wiki-atlas__sheetTop">
            <div class="wiki-atlas__sheetNumber">${escapeHtml(String(index + 1).padStart(2, "0"))}</div>
            <div class="wiki-atlas__sheetTitleWrap">
              <div class="wiki-atlas__sheetLabel">Chapter</div>
              <h3 class="wiki-atlas__sheetTitle">${escapeHtml(section.title || `Section ${index + 1}`)}</h3>
            </div>
          </div>
          <div class="wiki-atlas__sheetBody">
            ${paragraphs}
            ${bullets}
          </div>
        </article>
      `;
    }).join("");
  }

  function renderWikiAtlasNotes(items) {
    const entries = Array.isArray(items) ? items : [];
    if (!entries.length) return "";

    return `
      <section class="wiki-atlas__notes">
        <div class="wiki-atlas__notesHead">
          <div class="wiki-atlas__eyebrow">Important notes</div>
          <h3>Current direction</h3>
        </div>
        <div class="wiki-atlas__notesList">
          ${entries.map((item, index) => `
            <article class="wiki-atlas__noteItem">
              <span class="wiki-atlas__noteIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
              <span>${escapeHtml(item)}</span>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderWikiAtlasPager(categories, pages, currentSlug) {
    const order = getWikiPageOrder(categories).filter((slug) => pages[slug]);
    const currentIndex = order.indexOf(currentSlug);
    if (currentIndex === -1) return "";

    const previousSlug = order[currentIndex - 1] || null;
    const nextSlug = order[currentIndex + 1] || null;
    const renderLink = (slug, label) => {
      if (!slug || !pages[slug]) {
        return `<div class="wiki-atlas__pagerItem wiki-atlas__pagerItem--ghost"></div>`;
      }

      const page = pages[slug];
      return `
        <a class="wiki-atlas__pagerItem" href="#/wiki/${escapeHtml(slug)}">
          <span class="wiki-atlas__pagerLabel">${escapeHtml(label)}</span>
          <strong class="wiki-atlas__pagerTitle">${escapeHtml(page.navLabel || page.title)}</strong>
        </a>
      `;
    };

    return `
      <section class="wiki-atlas__pager">
        ${renderLink(previousSlug, "Previous")}
        ${renderLink(nextSlug, "Next")}
      </section>
    `;
  }

  function bindWikiAtlasControls() {
    document.querySelectorAll("[data-wiki-atlas-jump]").forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-wiki-atlas-jump");
        const target = targetId ? document.getElementById(targetId) : null;
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  renderWiki = function renderWikiAtlas(pageSlug) {
    const wiki = getWikiDataset();
    const categories = Array.isArray(wiki.categories) ? wiki.categories : [];
    const pages = wiki.pages && typeof wiki.pages === "object" ? wiki.pages : {};
    const requestedSlug = (pageSlug || "introduction").toString().toLowerCase();
    const currentSlug = pages[requestedSlug] ? requestedSlug : "introduction";
    const page = pages[currentSlug];

    if (!page) {
      setView(`
        <div class="wiki-atlas">
          ${renderHeader("Wiki", [{ label: "Wiki" }])}
          <div class="section">
            <div class="empty">Wiki data is missing right now.</div>
          </div>
        </div>
      `);
      return;
    }

    const category = findWikiCategoryForPage(categories, currentSlug);
    const heading = page.navLabel || page.title;
    const order = getWikiPageOrder(categories).filter((slug) => pages[slug]);
    const currentIndex = Math.max(0, order.indexOf(currentSlug));

    setView(`
      <div class="wiki-atlas">
        ${renderHeader("Wiki", [{ label: "Wiki" }, { label: heading }])}
        ${renderWikiAtlasMasthead(page, category, wiki.updatedAt, currentIndex, order.length || 1)}
        ${renderWikiAtlasShelf(categories, pages, currentSlug)}
        ${renderWikiAtlasFactRow(page)}
        ${renderWikiAtlasChapters(page.sections)}
        <section class="wiki-atlas__body">
          ${renderWikiAtlasSheets(page.sections)}
          ${renderWikiAtlasNotes(page.updates)}
          ${renderWikiAtlasPager(categories, pages, currentSlug)}
        </section>
      </div>
    `);

    bindWikiAtlasControls();
  };

  function getWikiDossierAnchor(index) {
    return `wiki-dossier-part-${index + 1}`;
  }

  function renderWikiDossierCatalog(categories, pages, currentSlug) {
    return `
      <section class="wiki-dossier__catalog" aria-label="Wiki catalog">
        ${categories.map((category) => {
          const items = (category.pages || []).map((slug) => {
            const page = pages[slug];
            if (!page) return "";
            const active = slug === currentSlug ? " is-active" : "";
            return `
              <a class="wiki-dossier__catalogLink${active}" href="#/wiki/${escapeHtml(slug)}">
                ${escapeHtml(page.navLabel || page.title)}
              </a>
            `;
          }).join("");

          return `
            <article class="wiki-dossier__catalogGroup">
              <div class="wiki-dossier__catalogTop">
                <span class="wiki-dossier__catalogTitle">${escapeHtml(category.title)}</span>
                <span class="wiki-dossier__catalogCount">${escapeHtml(String((category.pages || []).length))}</span>
              </div>
              <div class="wiki-dossier__catalogLinks">${items}</div>
            </article>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderWikiDossierMasthead(page, category, updatedAt, currentIndex, totalPages) {
    const facts = Array.isArray(page?.facts) ? page.facts.slice(0, 3) : [];
    const summaryFacts = facts.length
      ? facts
      : [
          ["Category", category?.title || "Wiki"],
          ["Sections", String((page?.sections || []).length || 0)],
          ["Updated", updatedAt || "2026-04-01"]
        ];

    return `
      <section class="wiki-dossier__masthead">
        <div class="wiki-dossier__stamp">
          <span class="wiki-dossier__stampLabel">SGCNR dossier</span>
          <strong class="wiki-dossier__stampValue">${escapeHtml(category?.title || "Wiki")}</strong>
          <span class="wiki-dossier__stampMeta">File ${escapeHtml(String(currentIndex + 1).padStart(2, "0"))} / ${escapeHtml(String(totalPages))}</span>
        </div>
        <div class="wiki-dossier__headline">
          <div class="wiki-dossier__eyebrow">${escapeHtml(page.eyebrow || "Operational guide")}</div>
          <h2>${escapeHtml(page.title)}</h2>
          <p>${escapeHtml(page.summary || "")}</p>
        </div>
        <div class="wiki-dossier__summaryGrid">
          ${summaryFacts.map(([label, value]) => `
            <article class="wiki-dossier__summaryItem">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderWikiDossierNavigator(sections) {
    const entries = Array.isArray(sections) ? sections : [];
    if (!entries.length) return "";

    return `
      <aside class="wiki-dossier__navigator">
        <div class="wiki-dossier__navigatorTop">
          <div class="wiki-dossier__eyebrow">Page structure</div>
          <h3>Jump to section</h3>
        </div>
        <div class="wiki-dossier__navigatorList">
          ${entries.map((section, index) => `
            <button class="wiki-dossier__navigatorBtn" type="button" data-wiki-dossier-jump="${escapeHtml(getWikiDossierAnchor(index))}">
              <span class="wiki-dossier__navigatorIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
              <span class="wiki-dossier__navigatorLabel">${escapeHtml(section.title || `Section ${index + 1}`)}</span>
            </button>
          `).join("")}
        </div>
      </aside>
    `;
  }

  function renderWikiDossierFolios(sections) {
    const entries = Array.isArray(sections) ? sections : [];
    return entries.map((section, index) => {
      const paragraphs = (section.paragraphs || []).map((paragraph) => `
        <p class="wiki-dossier__folioText">${escapeHtml(paragraph)}</p>
      `).join("");
      const bullets = Array.isArray(section.bullets) && section.bullets.length
        ? `
          <ul class="wiki-dossier__folioList">
            ${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        `
        : "";

      return `
        <article class="wiki-dossier__folio" id="${escapeHtml(getWikiDossierAnchor(index))}">
          <div class="wiki-dossier__folioTop">
            <span class="wiki-dossier__folioNumber">Part ${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
            <span class="wiki-dossier__folioRule" aria-hidden="true"></span>
          </div>
          <h3 class="wiki-dossier__folioTitle">${escapeHtml(section.title || `Section ${index + 1}`)}</h3>
          <div class="wiki-dossier__folioBody">
            ${paragraphs}
            ${bullets}
          </div>
        </article>
      `;
    }).join("");
  }

  function renderWikiDossierNotes(items) {
    const entries = Array.isArray(items) ? items : [];
    if (!entries.length) return "";

    return `
      <section class="wiki-dossier__notes">
        <div class="wiki-dossier__notesTop">
          <div class="wiki-dossier__eyebrow">Revision notes</div>
          <h3>Keep in mind</h3>
        </div>
        <div class="wiki-dossier__notesList">
          ${entries.map((item, index) => `
            <article class="wiki-dossier__note">
              <span class="wiki-dossier__noteIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
              <span>${escapeHtml(item)}</span>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderWikiDossierPager(categories, pages, currentSlug) {
    const order = getWikiPageOrder(categories).filter((slug) => pages[slug]);
    const currentIndex = order.indexOf(currentSlug);
    if (currentIndex === -1) return "";

    const renderLink = (slug, label) => {
      if (!slug || !pages[slug]) {
        return `<div class="wiki-dossier__pagerItem wiki-dossier__pagerItem--ghost"></div>`;
      }

      const page = pages[slug];
      return `
        <a class="wiki-dossier__pagerItem" href="#/wiki/${escapeHtml(slug)}">
          <span class="wiki-dossier__pagerLabel">${escapeHtml(label)}</span>
          <strong class="wiki-dossier__pagerTitle">${escapeHtml(page.navLabel || page.title)}</strong>
        </a>
      `;
    };

    return `
      <section class="wiki-dossier__pager">
        ${renderLink(order[currentIndex - 1] || null, "Previous file")}
        ${renderLink(order[currentIndex + 1] || null, "Next file")}
      </section>
    `;
  }

  function bindWikiDossierControls() {
    document.querySelectorAll("[data-wiki-dossier-jump]").forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-wiki-dossier-jump");
        const target = targetId ? document.getElementById(targetId) : null;
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  renderWiki = function renderWikiDossier(pageSlug) {
    const wiki = getWikiDataset();
    const categories = Array.isArray(wiki.categories) ? wiki.categories : [];
    const pages = wiki.pages && typeof wiki.pages === "object" ? wiki.pages : {};
    const requestedSlug = (pageSlug || "introduction").toString().toLowerCase();
    const currentSlug = pages[requestedSlug] ? requestedSlug : "introduction";
    const page = pages[currentSlug];

    if (!page) {
      setView(`
        <div class="wiki-dossier">
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
    const order = getWikiPageOrder(categories).filter((slug) => pages[slug]);
    const currentIndex = Math.max(0, order.indexOf(currentSlug));

    setView(`
      <div class="wiki-dossier">
        ${renderHeader("Wiki", [{ label: "Wiki" }, { label: heading }])}
        ${renderWikiDossierMasthead(page, category, wiki.updatedAt, currentIndex, order.length || 1)}
        ${renderWikiDossierCatalog(categories, pages, currentSlug)}
        <section class="wiki-dossier__workspace">
          <div class="wiki-dossier__main">
            ${renderWikiDossierFolios(page.sections)}
            ${renderWikiDossierNotes(page.updates)}
            ${renderWikiDossierPager(categories, pages, currentSlug)}
          </div>
          <div class="wiki-dossier__side">
            ${renderWikiDossierNavigator(page.sections)}
          </div>
        </section>
      </div>
    `);

    bindWikiDossierControls();
  };

  function renderWikiArchiveSidebar(categories, pages, currentSlug, updatedAt) {
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
          <div class="section__eyebrow">SGCNR handbook</div>
          <h2>Wiki directory</h2>
          <p class="doc-p">Browse the original handbook pages by group. Updated ${escapeHtml(updatedAt || "recently")}.</p>
        </div>
        <div class="wiki-sidebar__navWrap">
          <div class="wiki-nav">${groups}</div>
        </div>
      </aside>
    `;
  }

  renderWikiSidebar = function renderWikiArchiveSidebarOverride(categories, pages, currentSlug, updatedAt) {
    return renderWikiArchiveSidebar(categories, pages, currentSlug, updatedAt);
  };

  renderWiki = function renderWikiArchive(pageSlug) {
    const wiki = getWikiDataset();
    const categories = Array.isArray(wiki.categories) ? wiki.categories : [];
    const pages = wiki.pages && typeof wiki.pages === "object" ? wiki.pages : {};
    const requestedSlug = (pageSlug || "introduction").toString().toLowerCase();
    const currentSlug = pages[requestedSlug] ? requestedSlug : "introduction";
    const page = pages[currentSlug];

    if (!page) {
      setView(`
        <div class="wiki-shell wiki-archive">
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
    const sidebar = renderWikiArchiveSidebar(categories, pages, currentSlug, wiki.updatedAt);
    const facts = renderWikiFacts(page);
    const overview = renderWikiOverviewCards(page.overviewCards);
    const updates = renderWikiUpdates(page.updates);
    const content = renderWikiSections(page.sections);
    const pager = renderWikiPager(categories, pages, currentSlug);

    setView(`
      <div class="wiki-shell wiki-archive">
        ${renderHeader("Wiki", [{ label: "Wiki" }, { label: heading }])}
        <section class="section section--hero wiki-archive__hero">
          <div class="wiki-archive__heroBody">
            <div class="wiki-archive__heroCopy">
              <div class="section__eyebrow">${escapeHtml(page.eyebrow || "Wiki page")}</div>
              <h2>${escapeHtml(page.title)}</h2>
              <p class="doc-p">${escapeHtml(page.summary || "")}</p>
            </div>
            <div class="wiki-archive__heroMeta">
              <article class="wiki-archive__metaCard">
                <span>Category</span>
                <strong>${escapeHtml(category?.title || "Wiki")}</strong>
              </article>
              <article class="wiki-archive__metaCard">
                <span>Updated</span>
                <strong>${escapeHtml(wiki.updatedAt || "2026-04-01")}</strong>
              </article>
              <article class="wiki-archive__metaCard">
                <span>Sections</span>
                <strong>${escapeHtml(String((page.sections || []).length || 0))}</strong>
              </article>
            </div>
          </div>
        </section>
        <div class="wiki-layout wiki-archive__layout">
          ${sidebar}
          <section class="section wiki-article wiki-archive__article">
            <div class="wiki-archive__articleTop">
              <div class="section__eyebrow">Guide content</div>
              <p class="doc-p">Everything below stays in the original handbook order. Only the presentation has been cleaned up.</p>
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
  };

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
      applicationCenterState.historyUnavailable = false;
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
      applicationCenterState.historyUnavailable = false;
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
      applicationCenterState.historyUnavailable = Boolean(payload?.unavailable);

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
      if (error?.payload?.error === "applications_query_failed") {
        applicationCenterState.historyUnavailable = true;
        applicationCenterState.error = "";
      } else if (error?.payload?.error !== "not_authenticated") {
        applicationCenterState.historyUnavailable = false;
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
    if (reason === "applications_not_configured") return "The application backend is not connected on the live site yet.";
    return "Your application could not be written to the live database. Check the live DB credentials and make sure the website user can create, alter, insert, and select in the application tables.";
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
    if (reason === "applications_not_configured") return "The application backend is not connected on the live site yet.";
    if (reason === "applications_query_failed") return "The application database could not be reached. Check the live DB credentials and make sure the website user can create, alter, select, and insert into the application tables.";
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
    const historyUnavailable = Boolean(applicationCenterState.historyUnavailable);
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
          ${historyUnavailable ? `<div class="account-feedback">Previous application history is not available right now. You can still send a new application below.</div>` : ""}
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

  renderStart = function renderStartEnhancedClean() {
    const quickLinks = [
      { label: "Rules", detail: "Learn the basics before you join.", href: "/rules" },
      { label: "Map", detail: "Keep the city layout nearby.", href: "/map" },
      { label: "Live", detail: "Check the server and bot state fast.", href: "/live" }
    ];

    setView(`
      <div>
        ${renderHeader("Start Here", [{ label: "Start" }], { showBadge: false })}
        <section class="section section--hero start-clean">
          <div class="section__eyebrow">New player entry</div>
          <h2>Get into the city without missing the basics.</h2>
          <p class="doc-p">This page is your fast lane: find the server, lock in the rules, and keep the right links ready before you start moving.</p>
          <div class="start-clean__flow">
            <article class="start-clean__step">
              <span class="start-clean__stepIndex">01</span>
              <div class="start-clean__stepCopy">
                <strong>Find SGCNR in FiveM</strong>
                <span>Search for the server in FiveM and join from there.</span>
              </div>
            </article>
            <article class="start-clean__step">
              <span class="start-clean__stepIndex">02</span>
              <div class="start-clean__stepCopy">
                <strong>Read the rules first</strong>
                <span>Use the Rules page before you jump into active situations in the city.</span>
              </div>
            </article>
            <article class="start-clean__step">
              <span class="start-clean__stepIndex">03</span>
              <div class="start-clean__stepCopy">
                <strong>Use Discord for support</strong>
                <span>Tickets, ban history, and staff help stay in Discord so everything is tracked properly.</span>
              </div>
            </article>
          </div>
        </section>

        <section class="start-clean__links" aria-label="Start shortcuts">
          ${quickLinks.map((item) => `
            <a class="start-clean__linkCard" href="${escapeHtml(item.href)}">
              <span class="start-clean__linkLabel">${escapeHtml(item.label)}</span>
              <strong class="start-clean__linkTitle">${escapeHtml(item.detail)}</strong>
            </a>
          `).join("")}
        </section>
      </div>
    `);
  };

  renderWikiSidebar = function renderWikiSidebarEnhancedClean(categories, pages, currentSlug, updatedAt) {
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
          <div class="section__eyebrow">Guide index</div>
          <h2>SGCNR Wiki</h2>
          <p class="doc-p">${escapeHtml(String(totalPages))} pages across ${escapeHtml(String(categories.length))} groups. Updated ${escapeHtml(updatedAt || "recently")}.</p>
        </div>
        <div class="wiki-sidebar__navWrap">
          <div class="wiki-nav">${groups}</div>
        </div>
      </aside>
    `;
  };

  function renderWikiJournalRail(categories, pages, currentSlug, updatedAt) {
    return `
      <aside class="section section--stack wiki-ledger__directory">
        <div class="wiki-ledger__directoryTop">
          <div class="section__eyebrow">Guide directory</div>
          <h2>Wiki pages</h2>
          <p class="doc-p">Move through systems, roles, and procedures from one cleaner library view.</p>
        </div>
        <div class="wiki-ledger__directoryGroups">
          ${categories.map((category) => {
            const links = (category.pages || []).map((slug) => {
              const page = pages[slug];
              if (!page) return "";
              const isActive = slug === currentSlug ? " is-active" : "";
              return `
                <a class="wiki-ledger__directoryLink${isActive}" href="/wiki/${escapeHtml(slug)}">
                  ${escapeHtml(page.navLabel || page.title)}
                </a>
              `;
            }).join("");

            return `
              <section class="wiki-ledger__directoryGroup">
                <div class="wiki-ledger__directoryGroupTop">
                  <span>${escapeHtml(category.title)}</span>
                  <span class="wiki-ledger__directoryCount">${escapeHtml(String((category.pages || []).length))}</span>
                </div>
                <div class="wiki-ledger__directoryList">${links}</div>
              </section>
            `;
          }).join("")}
        </div>
      </aside>
    `;
  }

  function renderWikiJournalHero(page, category, updatedAt, currentIndex, totalPages) {
    return `
      <section class="section section--hero wiki-ledger__masthead">
        <div class="wiki-ledger__mastheadGrid">
          <div class="wiki-ledger__mastheadCopy">
            <div class="section__eyebrow">${escapeHtml(page.eyebrow || "Wiki page")}</div>
            <h2>${escapeHtml(page.title)}</h2>
            <p class="doc-p">${escapeHtml(page.summary || "")}</p>
          </div>
          <div class="wiki-ledger__mastheadMeta">
            <article class="wiki-ledger__metaCard">
              <span>Category</span>
              <strong>${escapeHtml(category?.title || "Wiki")}</strong>
            </article>
            <article class="wiki-ledger__metaCard">
              <span>Page</span>
              <strong>${escapeHtml(String(currentIndex + 1))} / ${escapeHtml(String(totalPages))}</strong>
            </article>
            <article class="wiki-ledger__metaCard">
              <span>Updated</span>
              <strong>${escapeHtml(updatedAt || "2026-04-01")}</strong>
            </article>
          </div>
        </div>
      </section>
    `;
  }

  renderWikiSidebar = function renderWikiSidebarJournal(categories, pages, currentSlug, updatedAt) {
    return renderWikiJournalRail(categories, pages, currentSlug, updatedAt);
  };

  renderWiki = function renderWikiJournal(pageSlug) {
    const wiki = getWikiDataset();
    const categories = Array.isArray(wiki.categories) ? wiki.categories : [];
    const pages = wiki.pages && typeof wiki.pages === "object" ? wiki.pages : {};
    const requestedSlug = (pageSlug || "introduction").toString().toLowerCase();
    const currentSlug = pages[requestedSlug] ? requestedSlug : "introduction";
    const page = pages[currentSlug];

    if (!page) {
      setView(`
        <div class="wiki-ledger">
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
    const order = getWikiPageOrder(categories).filter((slug) => pages[slug]);
    const currentIndex = Math.max(0, order.indexOf(currentSlug));
    const sidebar = renderWikiJournalRail(categories, pages, currentSlug, wiki.updatedAt);
    const facts = renderWikiFacts(page);
    const overview = renderWikiOverviewCards(page.overviewCards);
    const updates = renderWikiUpdates(page.updates);
    const content = renderWikiSections(page.sections);
    const pager = renderWikiPager(categories, pages, currentSlug);

    setView(`
      <div class="wiki-ledger">
        ${renderHeader("Wiki", [{ label: "Wiki" }, { label: heading }])}
        ${renderWikiJournalHero(page, category, wiki.updatedAt, currentIndex, order.length || 1)}
        <div class="wiki-ledger__layout">
          ${sidebar}
          <div class="wiki-ledger__body">
            <section class="section wiki-ledger__summary">
              <div class="section__eyebrow">Overview</div>
              <h3>Quick reference</h3>
              ${facts}
              ${overview}
            </section>
            <section class="section wiki-ledger__document">
              <div class="section__eyebrow">Guide content</div>
              <h3>${escapeHtml(page.title)}</h3>
              ${content}
            </section>
            <section class="section wiki-ledger__updates">
              <div class="section__eyebrow">Recent notes</div>
              <h3>Updates</h3>
              ${updates || `<div class="empty">No update notes are listed for this page.</div>`}
            </section>
            <section class="section wiki-ledger__navigator">
              <div class="section__eyebrow">Continue</div>
              <h3>Next guide</h3>
              ${pager}
            </section>
          </div>
        </div>
      </div>
    `);
  };

  function getApplicationLoadErrorMessage(error, fallbackMessage) {
    const reason = error?.payload?.error || error?.message || "application_load_failed";
    if (reason === "applications_not_configured") return "Applications are not connected on the live site yet.";
    if (reason === "applications_query_failed") return "Applications could not read from the live database. Check the live DB credentials and make sure the website user can create, alter, select, and insert into the application tables.";
    if (reason === "application_detail_failed") return "That application could not be opened right now.";
    return fallbackMessage;
  }

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

  const originalUpdateAuthUi = updateAuthUi;
  updateAuthUi = function updateAuthUiFinal() {
    originalUpdateAuthUi();
    if (loginBtn) {
      loginBtn.textContent = "Login";
    }
  };

  renderRulesDisclaimer = function renderRulesDisclaimerFinal() {
    return "";
  };

  renderHeader = function renderHeaderFinal(title, breadcrumbItems, options = {}) {
    const bc = breadcrumbItems?.length ? buildBreadcrumb(breadcrumbItems) : "";
    const eyebrow = options.eyebrow || breadcrumbItems?.[0]?.label || "";
    const badge = options.showBadge && options.badgeLabel ? `<div class="neo-hero__badge">${escapeHtml(options.badgeLabel)}</div>` : "";
    return `
      <div class="neo-hero">
        ${bc}
        <div class="neo-hero__top">
          ${eyebrow ? `<span class="neo-hero__eyebrow">${escapeHtml(eyebrow)}</span>` : ""}
          ${badge}
        </div>
        <h1 class="neo-hero__title">${escapeHtml(title)}</h1>
      </div>
    `;
  };

  renderLandingHome = function renderLandingHomeFinal() {
    setView(`
      <div class="neo-home">
        <section class="neo-home__hero section section--hero" data-reveal>
          <div class="neo-home__copy">
            <span class="neo-home__eyebrow">Los Santos network</span>
            <h2 class="neo-home__title">One clean front door for SGCNR.</h2>
            <p class="neo-home__text">Jump into the pages players actually use: getting started, the map, live status, applications, and support. No filler, no duplicate routes, just the essentials in one place.</p>
            <div class="neo-home__actions">
              <a class="auth__btn auth__btn--primary" href="/start">Start here</a>
              <a class="auth__btn" href="/map">Open map</a>
              <a class="auth__btn" href="${escapeHtml(DISCORD_INVITE_URL)}" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
          </div>
          <div class="neo-home__signals">
            <article class="neo-signal">
              <span class="neo-signal__label">Start</span>
              <strong class="neo-signal__title">Join the city the right way</strong>
              <span class="neo-signal__text">Use Start for first steps, Rules for standards, and Map for locations.</span>
            </article>
            <article class="neo-signal">
              <span class="neo-signal__label">Live</span>
              <strong class="neo-signal__title">Check the two signals that matter</strong>
              <span class="neo-signal__text">See server status and Discord bot status before you move.</span>
            </article>
            <article class="neo-signal">
              <span class="neo-signal__label">Support</span>
              <strong class="neo-signal__title">Tickets stay in Discord</strong>
              <span class="neo-signal__text">Support, ban history, and staff contact stay tracked in the Discord ticket channel.</span>
            </article>
          </div>
        </section>

        <section class="neo-home__grid" aria-label="Homepage shortcuts">
          <a class="neo-card" href="/start" data-reveal>
            <span class="neo-card__label">Start</span>
            <strong class="neo-card__title">First steps</strong>
            <span class="neo-card__text">Find the server, check the basics, and keep the useful pages close.</span>
          </a>
          <a class="neo-card" href="/wiki" data-reveal>
            <span class="neo-card__label">Wiki</span>
            <strong class="neo-card__title">Jobs and systems</strong>
            <span class="neo-card__text">Browse roles, city jobs, systems, and activity pages through one filtered library.</span>
          </a>
          <a class="neo-card" href="/map" data-reveal>
            <span class="neo-card__label">Map</span>
            <strong class="neo-card__title">City layout</strong>
            <span class="neo-card__text">Keep service locations and route context visible while you play.</span>
          </a>
          <a class="neo-card" href="/apply" data-reveal>
            <span class="neo-card__label">Apply</span>
            <strong class="neo-card__title">Staff applications</strong>
            <span class="neo-card__text">Send one application, track one private case, and keep follow-up in one thread.</span>
          </a>
        </section>
      </div>
    `);
  };

  renderStart = function renderStartFinal() {
    setView(`
      <div class="neo-start">
        ${renderHeader("Start Here", [{ label: "Start" }], { showBadge: false })}
        <section class="section neo-start__panel" data-reveal>
          <span class="neo-kicker">First steps</span>
          <h2>Get in, get set, and keep moving.</h2>
          <p class="doc-p">Use this page as the short setup path before you jump into the city.</p>
          <div class="neo-stepGrid">
            <article class="neo-step">
              <span class="neo-step__index">01</span>
              <div>
                <strong>Find SGCNR in FiveM</strong>
                <p>Search for the server in FiveM and join from there.</p>
              </div>
            </article>
            <article class="neo-step">
              <span class="neo-step__index">02</span>
              <div>
                <strong>Read the rules</strong>
                <p>Check the rules page before you enter active situations in the city.</p>
              </div>
            </article>
            <article class="neo-step">
              <span class="neo-step__index">03</span>
              <div>
                <strong>Use Discord for support</strong>
                <p>Support, ban history, and staff contact all stay tracked in Discord tickets.</p>
              </div>
            </article>
          </div>
        </section>
      </div>
    `);
  };

  renderHelp = function renderHelpFinal() {
    const ticketLink = `<a class="info-link" href="${escapeHtml(DISCORD_TICKET_CHANNEL_URL)}" target="_blank" rel="noopener noreferrer">open the ticket channel</a>`;
    setView(`
      <div class="neo-help">
        ${renderHeader("Help", [{ label: "Help" }], { showBadge: false })}
        <div class="neo-help__grid">
          <section class="section neo-help__panel">
            <span class="neo-kicker">Quick answers</span>
            <h2>Use the fast route.</h2>
            <div class="info-faq">
              <div class="info-faq__item">
                <div class="info-faq__q">Need support or want to report a player?</div>
                <div class="info-faq__a">Join Discord and ${ticketLink} so staff can track the case properly.</div>
              </div>
              <div class="info-faq__item">
                <div class="info-faq__q">Need your ban history?</div>
                <div class="info-faq__a">Open a Discord ticket and choose <strong>Ban history</strong>.</div>
              </div>
              <div class="info-faq__item">
                <div class="info-faq__q">Appealing something?</div>
                <div class="info-faq__a">Use the ticket channel and include your ID, the context, and any evidence you have.</div>
              </div>
              <div class="info-faq__item">
                <div class="info-faq__q">Not sure about a rule?</div>
                <div class="info-faq__a">Ask staff before you act. It is better than fixing the damage later.</div>
              </div>
            </div>
          </section>

          <aside class="section neo-help__panel neo-help__panel--side">
            <span class="neo-kicker">Best practice</span>
            <h2>Before you send a ticket</h2>
            <div class="neo-stepStack">
              <div class="neo-step neo-step--compact"><span class="neo-step__index">01</span><div><strong>Be direct</strong><p>Write the issue clearly and keep it short.</p></div></div>
              <div class="neo-step neo-step--compact"><span class="neo-step__index">02</span><div><strong>Bring proof</strong><p>Add screenshots, IDs, clips, or anything else staff needs.</p></div></div>
              <div class="neo-step neo-step--compact"><span class="neo-step__index">03</span><div><strong>Stay in one thread</strong><p>Keep the whole case in the same Discord ticket.</p></div></div>
            </div>
          </aside>
        </div>
      </div>
    `);
  };

  renderServerStatusShell = function renderServerStatusShellFinal() {
    return `
      <div class="status-page status-page--minimal">
        ${renderHeader("Live", [{ label: "Live" }], { showBadge: false })}
        <section class="section section--hero live-minimal__hero" data-reveal>
          <span class="neo-kicker">Live checks</span>
          <h2>Server and Discord bot status.</h2>
          <p class="doc-p">Two checks, one page: the game server and the Discord bot bridge.</p>
          <div class="status-live__actions">
            <button class="auth__btn" id="statusRefreshBtn" type="button">Refresh</button>
          </div>
        </section>
        <div id="serverStatusMount">${renderServerStatusLoading()}</div>
      </div>
    `;
  };

  const originalRenderApplyFinalBase = renderApply;
  renderApply = function renderApplyFinal() {
    originalRenderApplyFinalBase();

    const hero = document.querySelector(".apply-stage__hero");
    if (hero) {
      const heading = hero.querySelector("h2");
      const copy = hero.querySelector(".doc-p");
      if (heading) heading.textContent = "Staff applications";
      if (copy) copy.textContent = "Use the website form once your ban history is ready. Staff replies and status updates stay inside your private case thread here.";
    }

    document.querySelectorAll(".apply-stage__hero .auth__btn--primary").forEach((button) => {
      if (/discord/i.test(button.textContent || "")) {
        button.textContent = "Sign in";
      }
    });
  };

  renderMapStageAside = function renderMapStageAsideFinal(location) {
    const legend = renderMapLegend();
    if (!location) {
      return `
        <div class="map-stage-card map-stage-card--focus">
          <div class="map-stage-card__eyebrow">Map focus</div>
          <div class="map-stage-card__title">Los Santos services</div>
          <div class="map-stage-card__body">Use the filters and location list to move through service points faster.</div>
        </div>
        <div class="map-stage-card">
          <div class="map-stage-card__eyebrow">Legend</div>
          <div class="map-stage-card__legend">${legend}</div>
        </div>
      `;
    }

    const meta = getMapTypeMeta(location.type);
    return `
      <div class="map-stage-card map-stage-card--focus">
        <div class="map-stage-card__eyebrow">${escapeHtml(meta.label)}</div>
        <div class="map-stage-card__title">${escapeHtml(location.name)}</div>
        <div class="map-stage-card__body">${escapeHtml(getMapLocationDescription(location))}</div>
      </div>
      <div class="map-stage-card">
        <div class="map-stage-card__eyebrow">Region</div>
        <div class="map-stage-card__title">${escapeHtml(location.region || "Los Santos")}</div>
        <div class="map-stage-card__body">${escapeHtml(getMapLocationMeta(location))}</div>
      </div>
    `;
  };

  if (MAP_TYPE_META?.police) MAP_TYPE_META.police = { ...MAP_TYPE_META.police, color: "#79ffb4", glow: "rgba(121, 255, 180, .24)" };
  if (MAP_TYPE_META?.hospital) MAP_TYPE_META.hospital = { ...MAP_TYPE_META.hospital, color: "#d9ffeb", glow: "rgba(217, 255, 235, .22)" };
  if (MAP_TYPE_META?.fire) MAP_TYPE_META.fire = { ...MAP_TYPE_META.fire, color: "#56d88a", glow: "rgba(86, 216, 138, .24)" };
  if (MAP_TYPE_META?.carwash) MAP_TYPE_META.carwash = { ...MAP_TYPE_META.carwash, color: "#9cf6c2", glow: "rgba(156, 246, 194, .22)" };
  if (MAP_TYPE_META?.underground) MAP_TYPE_META.underground = { ...MAP_TYPE_META.underground, color: "#48b76e", glow: "rgba(72, 183, 110, .24)" };

  const WIKI_FILTERS = [
    { id: "all", label: "All" },
    { id: "response", label: "Response" },
    { id: "jobs", label: "Jobs" },
    { id: "systems", label: "Systems" },
    { id: "illegal", label: "Illegal" },
    { id: "property", label: "Property" },
    { id: "support", label: "Support" }
  ];

  const wikiUiState = {
    filter: "all",
    query: ""
  };

  function getWikiPageEntries(categories, pages) {
    return categories.flatMap((category) =>
      (category.pages || []).map((slug) => {
        const page = pages[slug];
        if (!page) return null;
        let bucket = "systems";
        if (category.id === "basics") bucket = "all";
        if (category.id === "emergency") bucket = "response";
        if (category.id === "civilian") bucket = "jobs";
        if (category.id === "gameplay") bucket = "systems";
        if (category.id === "criminal") bucket = "illegal";
        if (category.id === "properties") bucket = "property";
        if (category.id === "misc") bucket = "support";

        return {
          slug,
          title: page.navLabel || page.title,
          summary: page.summary || "",
          bucket,
          categoryTitle: category.title,
          searchIndex: normalize(`${page.navLabel || page.title} ${page.summary || ""} ${category.title}`)
        };
      }).filter(Boolean)
    );
  }

  function wikiEntryMatches(entry) {
    const filterMatch = wikiUiState.filter === "all" || entry.bucket === wikiUiState.filter;
    const queryMatch = !wikiUiState.query || entry.searchIndex.includes(normalize(wikiUiState.query));
    return filterMatch && queryMatch;
  }

  function bindWikiShowcase() {
    const search = document.querySelector("[data-wiki-search]");
    const cards = Array.from(document.querySelectorAll("[data-wiki-card]"));
    const empty = document.querySelector("[data-wiki-empty]");

    const sync = () => {
      let visible = 0;
      cards.forEach((card) => {
        const matchesFilter = wikiUiState.filter === "all" || card.dataset.bucket === wikiUiState.filter;
        const matchesQuery = !wikiUiState.query || (card.dataset.search || "").includes(normalize(wikiUiState.query));
        const show = matchesFilter && matchesQuery;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (empty) {
        empty.hidden = visible > 0;
      }
      document.querySelectorAll("[data-wiki-filter]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.wikiFilter === wikiUiState.filter);
      });
    };

    if (search) {
      search.value = wikiUiState.query;
      search.addEventListener("input", () => {
        wikiUiState.query = search.value || "";
        sync();
      });
    }

    document.querySelectorAll("[data-wiki-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        wikiUiState.filter = button.dataset.wikiFilter || "all";
        sync();
      });
    });

    sync();
  }

  renderWiki = function renderWikiShowcase(pageSlug) {
    const wiki = getWikiDataset();
    const categories = Array.isArray(wiki.categories) ? wiki.categories : [];
    const pages = wiki.pages && typeof wiki.pages === "object" ? wiki.pages : {};
    const entries = getWikiPageEntries(categories, pages);
    const requestedSlug = (pageSlug || "introduction").toString().toLowerCase();
    const currentSlug = pages[requestedSlug] ? requestedSlug : "introduction";
    const page = pages[currentSlug];

    if (!page) {
      setView(`
        <div class="neo-wiki">
          ${renderHeader("Wiki", [{ label: "Wiki" }], { showBadge: false })}
          <section class="section"><div class="empty">Wiki data is missing right now.</div></section>
        </div>
      `);
      return;
    }

    const pageFacts = Array.isArray(page.facts) ? page.facts : [];
    const pageSections = Array.isArray(page.sections) ? page.sections : [];
    const pageUpdates = Array.isArray(page.updates) ? page.updates : [];

    setView(`
      <div class="neo-wiki">
        ${renderHeader("Wiki", [{ label: "Wiki" }], { showBadge: false })}
        <section class="section section--hero neo-wiki__hero" data-reveal>
          <span class="neo-kicker">Knowledgebase</span>
          <h2>${escapeHtml(page.title)}</h2>
          <p class="doc-p">${escapeHtml(page.summary || "Browse jobs, systems, support pages, and city mechanics from one cleaner library.")}</p>
          <div class="neo-wiki__controls">
            <input class="neo-wiki__search" data-wiki-search type="search" placeholder="Filter wiki pages..." />
            <div class="neo-wiki__filters">
              ${WIKI_FILTERS.map((filter) => `<button class="neo-wiki__filter${filter.id === wikiUiState.filter ? " is-active" : ""}" type="button" data-wiki-filter="${escapeHtml(filter.id)}">${escapeHtml(filter.label)}</button>`).join("")}
            </div>
          </div>
        </section>

        <div class="neo-wiki__layout">
          <aside class="neo-wiki__rail section" data-reveal>
            <div class="neo-wiki__railTop">
              <span class="neo-kicker">Pages</span>
              <h3>Filtered library</h3>
            </div>
            <div class="neo-wiki__cards">
              ${entries.map((entry) => `
                <a class="neo-wiki__card${entry.slug === currentSlug ? " is-current" : ""}" href="/wiki/${escapeHtml(entry.slug)}" data-wiki-card data-bucket="${escapeHtml(entry.bucket)}" data-search="${escapeHtml(entry.searchIndex)}">
                  <span class="neo-wiki__cardMeta">${escapeHtml(entry.categoryTitle)}</span>
                  <strong class="neo-wiki__cardTitle">${escapeHtml(entry.title)}</strong>
                  <span class="neo-wiki__cardText">${escapeHtml(entry.summary)}</span>
                </a>
              `).join("")}
              <div class="empty" data-wiki-empty hidden>No wiki pages match this filter yet.</div>
            </div>
          </aside>

          <section class="neo-wiki__article section" data-reveal>
            <div class="neo-wiki__facts">
              ${pageFacts.map(([label, value]) => `
                <article class="neo-wiki__fact">
                  <span>${escapeHtml(label)}</span>
                  <strong>${escapeHtml(value)}</strong>
                </article>
              `).join("")}
            </div>

            <div class="neo-wiki__sections">
              ${pageSections.map((section, index) => `
                <article class="neo-wiki__section">
                  <div class="neo-wiki__sectionTop">
                    <span class="neo-wiki__sectionIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
                    <h3>${escapeHtml(section.title || `Section ${index + 1}`)}</h3>
                  </div>
                  ${(section.paragraphs || []).map((paragraph) => `<p class="doc-p">${escapeHtml(paragraph)}</p>`).join("")}
                  ${Array.isArray(section.bullets) && section.bullets.length ? `
                    <ul class="doc-list neo-wiki__list">
                      ${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
                    </ul>
                  ` : ""}
                </article>
              `).join("")}
            </div>

            ${pageUpdates.length ? `
              <section class="neo-wiki__updates">
                <span class="neo-kicker">Current notes</span>
                <div class="neo-wiki__updateList">
                  ${pageUpdates.map((note, index) => `
                    <div class="neo-wiki__update">
                      <span class="neo-wiki__updateIndex">${escapeHtml(String(index + 1).padStart(2, "0"))}</span>
                      <span>${escapeHtml(note)}</span>
                    </div>
                  `).join("")}
                </div>
              </section>
            ` : ""}
          </section>
        </div>
      </div>
    `);

    bindWikiShowcase();
  };

  route();
})();
