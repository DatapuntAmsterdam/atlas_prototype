import MatomoTracker from '@datapunt/matomo-tracker-js'

import { ENVIRONMENTS } from '../shared/environment'
import environment from '../environment'

const MATOMO_CONFIG = {
  BASE_URL: 'https://analytics.data.amsterdam.nl/',
  [ENVIRONMENTS.PRODUCTION]: {
    SITE_ID: 1,
  },
  [ENVIRONMENTS.ACCEPTANCE]: {
    SITE_ID: 3,
  },
  [ENVIRONMENTS.DEVELOPMENT]: {
    SITE_ID: 3,
  },
}

export const MATOMO_CONSTANTS = {
  TRACK_EVENT: 'trackEvent',
  TRACK_SEARCH: 'trackSiteSearch',
  TRACK_VIEW: 'trackPageView',
}

// Initialize connection with Matomo
export default new MatomoTracker({
  urlBase: MATOMO_CONFIG.BASE_URL,
  siteId: MATOMO_CONFIG[environment.DEPLOY_ENV].SITE_ID,
  heartBeat: {
    active: true,
    seconds: 10, // Set the heartbeat time differently to test high bounce rate in the first 10 seconds
  },
  linkTracking: false, // Important: we already use the enableLinkTracking method from matomo-tracker-react
})
