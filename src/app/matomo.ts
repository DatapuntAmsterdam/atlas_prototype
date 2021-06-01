import MatomoTracker from '@datapunt/matomo-tracker-js'
import { Environment } from '../shared/environment'
import environment from '../environment'

const MATOMO_CONFIG = {
  BASE_URL: 'https://analytics.data.amsterdam.nl/',
  [Environment.Production]: {
    SITE_ID: 1,
  },
  [Environment.Acceptance]: {
    SITE_ID: 3,
  },
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
