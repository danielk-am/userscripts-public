// ==UserScript==
// @name         Facebook → Ads Manager | Focus Mode
// @namespace    alkamy.ltd
// @version      1.2.0
// @description  Open Ads Manager from Facebook's feed after login, once per tab.
// @match        *://facebook.com/*
// @match        *://*.facebook.com/*
// @run-at       document-start
// @grant        none
// @updateURL    https://raw.githubusercontent.com/danielk-am/userscripts-public/main/scripts/facebook-ads-manager-focus-mode.user.js
// @downloadURL  https://raw.githubusercontent.com/danielk-am/userscripts-public/main/scripts/facebook-ads-manager-focus-mode.user.js
// ==/UserScript==

(() => {
  'use strict';

  const host = location.hostname.toLowerCase();
  const path = location.pathname.replace(/\/+$/, '') || '/';

  const ADS_MANAGER =
    'https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=';
  const REDIRECTED_KEY = 'alkamy:facebook-ads-manager:redirected';

  // Ads Manager, login, recovery, and unrelated Facebook pages stay accessible.
  if (host === 'adsmanager.facebook.com') return;
  if (host !== 'facebook.com' && host !== 'www.facebook.com') return;
  if (path !== '/' && path !== '/home.php') return;

  // Facebook's c_user cookie indicates a signed-in account. If the cookie is
  // unavailable, fail open rather than trapping the user in a redirect loop.
  const isLoggedIn = document.cookie
    .split(';')
    .some(cookie => /^c_user=\d+$/.test(cookie.trim()));

  if (!isLoggedIn) return;

  // If Ads Manager sends us back, do not redirect again in this tab.
  try {
    if (sessionStorage.getItem(REDIRECTED_KEY)) return;
    sessionStorage.setItem(REDIRECTED_KEY, '1');
  } catch {
    // Storage may be blocked. Do not redirect without the loop guard.
    return;
  }

  // Redirect without adding a history entry.
  location.replace(ADS_MANAGER);
})();
