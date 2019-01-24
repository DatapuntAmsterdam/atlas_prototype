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

// Map actions to be tracked
export const actionsToPiwik = {
  ...routes,
  ...events
};

// Execute Piwik actions
const piwikMiddleware = ({ getState }) => (next) => (action) => {
  initializePiwik();
  const nextAction = action;

  const actionMap = actionsToPiwik[action.type];

  if (actionMap) {
    const { firstAction, location, query, tracking } = action.meta || {};
    const state = getState();
    const href = window.location.href;
    const title = document.title;

    if (tracking || location) {
      piwikTracker(actionMap({ tracking, firstAction, query, state, title, href }));
    }
  }

  next(nextAction);
};

export default piwikMiddleware;
