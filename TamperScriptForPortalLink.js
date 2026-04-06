// ==UserScript==
// @name         Corebridge - Fix Portal Link and Google Stars
// @namespace    https://signarama.com.au/
// @version      1.3
// @description  Styles the injected portal link, updates its text, and fixes Google star characters.
// @match        https://sar10686.corebridge.net/DesignModule/DesignProductEdit.aspx*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
      'use strict';

      const SPAN_ID = 'customerPortalLinkSpan';
      let observer = null;
      let scanScheduled = false;

      function applyPortalLinkStyles(span) {
            if(!span) return false;

            const link = span.querySelector('a');
            if(!link) return false;

            if(link.dataset.tmPortalStyled === '1') return true;

            const spanStyle = span.getAttribute('style') || '';
            const linkStyle = link.getAttribute('style') || '';

            const forcedLinkStyle = [
                  spanStyle,
                  linkStyle,
                  'display:inline-block',
                  'width:auto',
                  'box-sizing:border-box',
                  'color:#ffffff',
                  'text-decoration:none',
                  'font-family:Arial, Helvetica, sans-serif',
                  'font-size:14px',
                  'font-weight:700',
                  'line-height:1.2',
                  'cursor:pointer'
            ].join(';');

            if(observer) observer.disconnect();

            link.setAttribute('style', forcedLinkStyle);
            link.textContent = 'Click to View Proofs in Portal';
            link.title = 'Click to View Proofs in Portal';
            link.dataset.tmPortalStyled = '1';

            span.style.display = 'inline';
            span.style.padding = '0';
            span.style.color = '';
            span.style.background = 'transparent';
            span.style.border = '0';
            span.style.margin = '0';

            startObserver();
            return true;
      }

      function fixGoogleStars() {
            const candidates = document.querySelectorAll('span[aria-label*="out of 5 stars"], span[title*="out of 5"]');

            candidates.forEach(container => {
                  const starSpan = Array.from(container.querySelectorAll('span')).find(el => {
                        const txt = (el.textContent || '').trim();
                        return txt.includes('?') || txt === '' || /^[★☆?]+$/.test(txt);
                  });

                  if(!starSpan) return;

                  const txt = (starSpan.textContent || '').trim();

                  if(txt.includes('?') || txt === '') {
                        starSpan.textContent = '★★★★★';
                        starSpan.style.color = '#f4b400';
                        starSpan.style.letterSpacing = '1px';
                        starSpan.dataset.tmStarsFixed = '1';
                  }
            });
      }

      function scan() {
            scanScheduled = false;

            document.querySelectorAll(`#${SPAN_ID}`).forEach(applyPortalLinkStyles);
            fixGoogleStars();
      }

      function scheduleScan() {
            if(scanScheduled) return;
            scanScheduled = true;
            requestAnimationFrame(scan);
      }

      function startObserver() {
            if(observer) observer.disconnect();

            observer = new MutationObserver((mutations) => {
                  for(const mutation of mutations) {
                        if(mutation.type === 'childList' && (mutation.addedNodes.length || mutation.removedNodes.length)) {
                              scheduleScan();
                              break;
                        }
                  }
            });

            observer.observe(document.body, {
                  childList: true,
                  subtree: true
            });
      }

      scan();
      startObserver();
})();