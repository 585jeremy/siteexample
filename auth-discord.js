// auth-discord.js
// Bridges the PHP Discord OAuth session with the existing app.js auth UI.
// Must be loaded AFTER app.js in index.html.

window.addEventListener("load", async function () {
  const config = window.SGCNR_SERVER_CONFIG || {};
  const AUTH_API = config.authProfileUrl || config.authApiUrl || "https://sgcnr.net/auth/api.php";
  const LOGIN_URL = config.authLoginUrl || config.discordOAuthUrl || "https://sgcnr.net/auth/login.php";
  const LOGOUT_URL = config.authLogoutUrl || (() => {
    try {
      const base = new URL(AUTH_API, window.location.href);
      return `${base.origin}/auth/logout.php`;
    } catch {
      return "https://sgcnr.net/auth/logout.php";
    }
  })();

  const AUTH_ACCOUNTS_KEY = "sgcnr_demo_accounts_v1";
  const AUTH_SESSION_KEY = "sgcnr_demo_session_v1";

  function readAccounts() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_ACCOUNTS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function clearDiscordSession() {
    localStorage.removeItem(AUTH_SESSION_KEY);
  }

  let discordUser = null;
  let authCheckFailed = false;
  try {
    const res = await fetch(AUTH_API, {
      credentials: "include",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache"
      }
    });
    const data = await res.json();
    if (data.authenticated && data.user) {
      discordUser = data.user;
    }
  } catch {
    authCheckFailed = true;
  }

  if (discordUser) {
    const username =
      discordUser.discordId ||
      discordUser.discordUsername ||
      discordUser.discordDisplayName ||
      discordUser.guildNickname;

    const accounts = readAccounts();
    accounts[username] = {
      username,
      displayName: discordUser.guildNickname || discordUser.discordDisplayName || discordUser.discordUsername || username,
      websiteDisplayName: discordUser.guildNickname || discordUser.discordDisplayName || discordUser.discordUsername || username,
      email: "",
      phone: "",
      discord: discordUser.discordUsername || "",
      guildNickname: discordUser.guildNickname || "",
      discordDisplayName: discordUser.discordDisplayName || "",
      discordUsername: discordUser.discordUsername || "",
      discordAvatarUrl: discordUser.discordAvatarUrl || "",
      discordAvatarHash: discordUser.discordAvatarHash || "",
      bio: "",
      region: config.region || "EU",
      password: "__discord__",
      trackingOptIn: Boolean(discordUser.trackingOptIn),
      emailUpdates: false,
      createdAt: discordUser.createdAt || "",
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      discordLinked: true,
      discordId: discordUser.discordId || "",
      verifiedIdentity: discordUser.verifiedIdentity || discordUser.guildNickname || discordUser.discordDisplayName || discordUser.discordUsername || username,
      discordRoles: discordUser.roles || [],
    };

    localStorage.setItem(AUTH_ACCOUNTS_KEY, JSON.stringify(accounts));
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ username }));

    if (typeof updateAuthUi === "function") updateAuthUi();
    if (window.location.hash === "#/account" && typeof route === "function") {
      route();
    }
  } else if (!authCheckFailed) {
    clearDiscordSession();
    if (typeof updateAuthUi === "function") updateAuthUi();
  }

  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.replaceWith(loginBtn.cloneNode(true));
    const newLoginBtn = document.getElementById("loginBtn");
    if (newLoginBtn) {
      newLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.href = LOGIN_URL;
      });
    }
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.replaceWith(logoutBtn.cloneNode(true));
    const newLogoutBtn = document.getElementById("logoutBtn");
    if (newLogoutBtn) {
      newLogoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        clearDiscordSession();
        window.location.href = LOGOUT_URL;
      });
    }
  }
});
