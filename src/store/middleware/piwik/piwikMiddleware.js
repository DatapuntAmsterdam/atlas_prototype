import piwikTracker from '../../../shared/services/piwik-tracker/piwik-tracker';
import { ENVIRONMENTS, getEnvironment } from '../../../shared/environment';
import events from './events';
import routes from './routes';

// Configure environment variables
const PIWIK_CONFIG = {
  [ENVIRONMENTS.PRODUCTION]: {
    SITE_ID: 1
  },
  [ENVIRONMENTS.PRE_PRODUCTION]: {
    SITE_ID: 3
  },
  [ENVIRONMENTS.ACCEPTANCE]: {
    SITE_ID: 3
  },
  [ENVIRONMENTS.DEVELOPMENT]: {
    SITE_ID: 3
  }
};

export const PIWIK_CONSTANTS = {
  TRACK_EVENT: 'trackEvent',
  TRACK_SEARCH: 'trackSiteSearch',
  TRACK_VIEW: 'trackPageView'
};

// Initialize connection with Piwik
export const initializePiwik = () => {
  const urlBase = 'https://piwik.data.amsterdam.nl/';

  window._paq = window._paq || [];

  if (window._paq.length === 0) {
    window._paq.push(['enableLinkTracking']);
    window._paq.push(['setTrackerUrl', `${urlBase}piwik.php`]);
    window._paq.push(['setSiteId', PIWIK_CONFIG[getEnvironment(window.location.hostname)].SITE_ID]);

    const doc = document;
    const piwik = doc.createElement('script');
    const scripts = doc.getElementsByTagName('script')[0];

    piwik.type = 'text/javascript';
    piwik.async = true;
    piwik.defer = true;
    piwik.src = `${urlBase}piwik.js`;

    scripts.parentNode.insertBefore(piwik, scripts);
  }
};

// Execute Piwik actions
const piwikMiddleware = ({ getState }) => (next) => (action) => {
  initializePiwik();
  const nextAction = action;

  const actionsToPiwik = [];
  if (routes[action.type]) {
    actionsToPiwik.push(routes[action.type]);
  }
  if (events[action.type]) {
    actionsToPiwik.push(events[action.type]);
  }

  if (actionsToPiwik.length) {
    const { firstAction, location, query, tracking } = action.meta || {};
    const state = getState();
    const href = window.location.href;
    const title = document.title;

    if (tracking || location) {
      actionsToPiwik.forEach((piwikAction) => {
        piwikTracker(piwikAction({ tracking, firstAction, query, state, title, href }));
      });
    }
  }

  next(nextAction);
};

export default piwikMiddleware;
