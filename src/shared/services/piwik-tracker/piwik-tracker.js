/**
 *
 * @param {array} data - Array of tracker event. For more info on the allowed events, see
 * https://developer.matomo.org/guides/tracking-javascript-guide#manually-trigger-events
 */
export default function piwikTracker(data) {
  // eslint-disable-next-line no-underscore-dangle
  window._paq.push(data);
}

export function trackPageNavigation() {
  // get full path after the "/#?", as this is the way Piwik (Matomo) wants it
  const currentPath = `?${window.location.href.split('?')[1]}`;

  piwikTracker(['setDocumentTitle', window.document.title]);
  piwikTracker(['setCustomUrl', currentPath]);
  piwikTracker(['trackPageView']);
}
