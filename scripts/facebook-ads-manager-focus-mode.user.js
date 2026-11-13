// ==UserScript==
// @name         Facebook → Ads Manager | Focus Mode
// @namespace    alkamy.ltd
// @version      1.1.0
// @description  Skip Facebook's feed and open Ads Manager.
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

  const ADS_MANAGER =
    'https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=';

  // Never interfere with Ads Manager itself.
  if (host === 'adsmanager.facebook.com') return;

  const isFacebook =
    host === 'facebook.com' ||
    host.endsWith('.facebook.com');

  if (!isFacebook) return;

  // Keep authentication and account recovery available.
  const authenticationPaths = [
    /^\/login(?:\/|$)/,
    /^\/recover(?:\/|$)/,
    /^\/checkpoint(?:\/|$)/,
    /^\/two_step_verification(?:\/|$)/
  ];

  if (
    authenticationPaths.some(pattern =>
      pattern.test(location.pathname)
    )
  ) {
    return;
  }

  // Prevent feed content from appearing before navigation.
  document.documentElement.style.setProperty(
    'visibility',
    'hidden',
    'important'
  );

  // Redirect without adding to browser history.
  location.replace(ADS_MANAGER);
})();
