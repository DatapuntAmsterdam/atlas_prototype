import { MATOMO_CONSTANTS } from '../../../app/matomo'
import { routing } from '../../../app/routes'
import {
  AUTHENTICATE_USER_REQUEST,
  AUTHENTICATE_USER_SUCCESS,
} from '../../../shared/ducks/user/user'
import { isPanoPage } from '../../redux-first-router/selectors'

export const TRACK_ACTION_NAVIGATION = 'navigation'
export const TRACK_CATEGORY_AUTO_SUGGEST = 'auto-suggest'
export const TRACK_NAME_ENLARGE_DETAIL_MAP = 'detail-kaart-vergroten'
export const TRACK_NAME_FULL_DETAIL = 'detail-volledig-weergeven'
export const TRACK_NAME_LEAVE_PANO = 'panorama-verlaten'

/* istanbul ignore next */
const trackEvents = {
  // NAVIGATION
  // NAVIGATION -> NAVIGATE TO DATA DETAIL
  [routing.dataDetail.type]: function trackDataDetail({ tracking, state }) {
    if (tracking?.event === 'auto-suggest') {
      return [
        MATOMO_CONSTANTS.TRACK_EVENT,
        'auto-suggest', // NAVIGATION -> SELECT AUTOSUGGEST OPTION
        tracking.category,
        tracking.query,
      ]
    }

    if (isPanoPage(state)) {
      return [
        MATOMO_CONSTANTS.TRACK_EVENT,
        'navigation', // NAVIGATION -> CLICK CLOSE FROM PANORAMA
        'panorama-verlaten',
        null,
      ]
    }

    return []
  },
  // AUTHENTICATION
  // AUTHENTICATION BUTTON -> "inloggen" / "uitloggen"
  [AUTHENTICATE_USER_REQUEST]: ({ tracking, title }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'login',
    tracking,
    title,
  ],
  // AUTHENTICATION AFTER RETURN
  [AUTHENTICATE_USER_SUCCESS]: ({ tracking }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'login',
    'ingelogd',
    tracking,
  ],
  // NOT FOUND
  '@@redux-first-router/NOT_FOUND': ({ state }) => [
    MATOMO_CONSTANTS.TRACK_EVENT,
    'niet-gevonden',
    state.location.pathname,
    null,
  ],
}

export default trackEvents
