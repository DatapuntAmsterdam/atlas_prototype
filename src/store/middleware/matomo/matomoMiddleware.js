import MatomoTracker from '@datapunt/matomo-tracker-js'
import { getEnvironment } from '../../../shared/environment'
// eslint-disable-next-line import/no-cycle
import trackEvents from './trackEvents'
// eslint-disable-next-line import/no-cycle
import trackViews from './trackViews'
import { authCustomDimensions, viewCustomDimensions } from './customDimensions'
import { MATOMO_CONFIG } from './constants'

// Execute Matomo actions
const matomoMiddleware = ({ getState }) => next => action => {
  const nextAction = action

  // Initialize connection with Matomo
  const MatomoInstance = new MatomoTracker({
    urlBase: MATOMO_CONFIG.BASE_URL,
    siteId: MATOMO_CONFIG[getEnvironment(window.location.hostname)].SITE_ID,
  })

  const actionsToMatomo = []
  if (trackViews[action.type]) {
    actionsToMatomo.push(trackViews[action.type])
  }
  if (trackEvents[action.type]) {
    actionsToMatomo.push(trackEvents[action.type])
  }

  if (actionsToMatomo.length) {
    const { firstAction, location, query, tracking } = action.meta || {}
    const state = getState()

    const { href } = window.location
    const { title } = window.document

    if (tracking || location) {
      const customDimensions = [
        ...authCustomDimensions(state),
        ...viewCustomDimensions(query, state),
      ]

      actionsToMatomo.forEach(matomoAction => {
        MatomoInstance.track({
          data: matomoAction({
            tracking,
            firstAction,
            query,
            state,
            title,
            href,
          }),
          href,
          title,
          customDimensions,
        })
      })
    }
  }
  next(nextAction)
}

export default matomoMiddleware
