/**
 *
 * @param {array} data - Array of tracker event. For more info on the allowed events, see
 * https://developer.matomo.org/guides/tracking-javascript-guide#manually-trigger-events
 */
export default function piwikTracker(data = [], href, title, customDimensions = false) {
  if (data.length) {
    if (customDimensions.length) {
      customDimensions.map(
        (customDimension) => window._paq.push(['setCustomDimension', customDimension.id, customDimension.value])
      );
    }

    window._paq.push(['setCustomUrl', href]);
    window._paq.push(['setDocumentTitle', title]);
    window._paq.push(['enableHeartBeatTimer']); // accurately measure the time spent on the last pageview of a visit
    window._paq.push(data);
  }
}
