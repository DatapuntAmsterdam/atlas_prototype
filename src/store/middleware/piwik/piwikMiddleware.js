import piwikTracker from '../../../shared/services/piwik-tracker/piwik-tracker';
import { ENVIRONMENTS, getEnvironment } from '../../../shared/environment';
import { getUserScopes, userIsAuthenticated } from '../../../shared/ducks/user/user';
import events from './events';
import routes from './routes';
import { routing } from '../../../app/routes';

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
  TRACK_VIEW: 'trackPageView',
  DIMENSION3: {
    AUTHENTICATED: true,
    UNAUTHENTICATED: false
  },
  DIMENSION4: {
    UNDEFINED: null
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

const authCustomDimensions = (state) => {
  const authenticated = (userIsAuthenticated(state))
    ? PIWIK_CONSTANTS.DIMENSION3.AUTHENTICATED : PIWIK_CONSTANTS.DIMENSION3.UNAUTHENTICATED;
  const scopes = (authenticated) ? getUserScopes(state) : [];

  let role = PIWIK_CONSTANTS.DIMENSION4.UNDEFINED;
  if (scopes.length > 0) {
    role = scopes.join('|');
  }

  return [
    { id: 3, value: authenticated }, // customDimension = 'Authenticated'
    { id: 4, value: role } // customDimension = 'Role'
  ];
};

// Delay logging the datasetDetail route in piwik,
//    to allow logging the document title
//    this will evolve to an exclusion list of routes as soon as this extra functionality is needed
const logRoute = (actionType) => actionType !== routing.datasetDetail.type;

// Execute Piwik actions
const piwikMiddleware = ({ getState }) => (next) => (action) => {
  initializePiwik();
  const nextAction = action;

  const actionsToPiwik = [];
  if (routes[action.type] && logRoute(action.type)) {
    actionsToPiwik.push(routes[action.type]);
  }
  if (events[action.type]) {
    actionsToPiwik.push(events[action.type]);
  }

  if (actionsToPiwik.length) {
    const { firstAction, location, query, tracking } = action.meta || {};
    const state = getState();

    const href = window.location.href;
    const title = window.document.title;

    if (tracking || location) {
      const customDimensions = authCustomDimensions(state);
      actionsToPiwik.forEach((piwikAction) => {
        piwikTracker(
          piwikAction({ tracking, firstAction, query, state, title, href }),
          href,
          title,
          customDimensions
        );
      });
    }
  }
  next(nextAction);
};

export default piwikMiddleware;
