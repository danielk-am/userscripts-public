
 // ==UserScript==
 // @name         Semrush Inline Backlink Screenshots
 // @namespace    danielkam-tools
 // @version      1.2
 // @match        https://www.semrush.com/*
 // @run-at       document-idle
 // @grant        none
 // ==/UserScript==

 (() => {
   'use strict';

   const TARGET = [
     '___SFlex_mjgw6_gg_',
     '_inAfterOutline_false_1x3xu_gg_',
     '___SBox_1x3xu_gg_'
   ].map(c => '[class~="' + c + '"]').join('');

   const STYLE_ID = 'ts-inline-preview-style';

   if (!document.getElementById(STYLE_ID)) {
     const style = document.createElement('style');
     style.id = STYLE_ID;
     style.textContent = `
       .ts-preview {
         margin: 10px 0;
         width: 260px;
         max-width: 100%;
         border: 1px solid #ddd;
         border-radius: 8px;
         overflow: hidden;
         background: white;
       }
       .ts-preview img {
         display: block;
         width: 100%;
         height: 160px;
         object-fit: cover;
         object-position: top;
         background: #f2f2f2;
       }
       .ts-preview a {
         display: block;
         padding: 7px;
         font: 12px system-ui;
         color: #333;
         overflow-wrap: anywhere;
       }
     `;
     document.head.appendChild(style);
   }

   function scan() {
     // Source links are matched against Semrush's
     // row-selection labels, excluding target URLs.
     const sources = new Set();

     document.querySelectorAll(
       'input[type="checkbox"][aria-label^="Select http"]'
     ).forEach(input => {
       const url = input.getAttribute('aria-label')
         .replace(/^Select\s+/, '');
       sources.add(url);
     });

     document.querySelectorAll(
       'a[aria-label^="Go to http"]'
     ).forEach(link => {
       const url = link.getAttribute('href');
       if (!sources.has(url)) return;

       const anchor = link.closest(TARGET);
       if (!anchor) return;

       // Avoid duplicate thumbnails during SPA updates.
       if (
         anchor.nextElementSibling?.classList
           .contains('ts-preview')
       ) return;

       const preview = document.createElement('div');
       preview.className = 'ts-preview';

       const img = document.createElement('img');
       img.loading = 'lazy';
       img.alt = 'Website screenshot';
       img.referrerPolicy = 'no-referrer';
       img.src =
         'https://image.thum.io/get/width/520/crop/900/noanimate/' +
         url;

       const caption = document.createElement('a');
       caption.href = url;
       caption.target = '_blank';
       caption.rel = 'noopener noreferrer';
       caption.textContent = new URL(url).hostname;

       img.onerror = () => {
         img.alt = 'Screenshot unavailable';
       };

       preview.append(img, caption);
       anchor.insertAdjacentElement('afterend', preview);
     });
   }

   let scheduled = false;

   function scheduleScan() {
     if (scheduled) return;
     scheduled = true;

     requestAnimationFrame(() => {
       scheduled = false;
       scan();
     });
   }

   // Initial scan.
   scan();

   // Watch Semrush SPA page changes.
   const observer = new MutationObserver(scheduleScan);
   observer.observe(document.body, {
     childList: true,
     subtree: true
   });

   console.log('[Semrush Screenshots] Active');
 })();
