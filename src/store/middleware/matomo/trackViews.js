import { routing } from '../../../app/routes'
import { getDetail } from '../../../shared/ducks/detail/selectors'
import { FETCH_DETAIL_SUCCESS } from '../../../shared/ducks/detail/constants'
import { isDatasetDetailPage } from '../../redux-first-router/selectors'
import { MATOMO_CONSTANTS } from './constants'

let views = Object.entries(routing).reduce((acc, [, value]) => ({
  ...acc,
  [value.type]: function trackView({ firstAction = null, query = {}, href, title }) {
    return firstAction || !!query.print ? [MATOMO_CONSTANTS.TRACK_VIEW, title, href, null] : []
  },
}))

views = {
  ...views,
  [routing.home.type]: function trackView({ firstAction = null, query = {}, href, title }) {
    return firstAction || !!query.print ? [MATOMO_CONSTANTS.TRACK_VIEW, title, href, null] : []
  },
  [routing.data.type]: function trackView({ firstAction = null, query = {}, href, title }) {
    return firstAction || !!query.print
      ? [
          MATOMO_CONSTANTS.TRACK_VIEW,
          title, // PAGEVIEW -> MAP
          href,
          null,
        ]
      : []
  },
  [routing.verplaatst.type]: function trackView({ href, title }) {
    return [
      MATOMO_CONSTANTS.TRACK_VIEW,
      title, // PAGEVIEW -> VERPLAATS
      href,
      document.referrer,
    ]
  },
  [routing.dataDetail.type]: function trackView({
    firstAction = null,
    query = {},
    href,
    title,
    state,
    tracking,
  }) {
    // eslint-disable-next-line no-nested-ternary
    return !firstAction && (tracking && tracking.id !== getDetail(state).id)
      ? [
          MATOMO_CONSTANTS.TRACK_VIEW,
          title, // PAGEVIEW -> DETAIL VIEW CLICK THROUGH VIEWS
          href,
          null,
        ]
      : firstAction || !!query.print
      ? [
          MATOMO_CONSTANTS.TRACK_VIEW,
          title, // PAGEVIEW -> DETAIL VIEW INITIAL LOAD
          href,
          null,
        ]
      : []
  },
  [FETCH_DETAIL_SUCCESS]: function trackView({ href, title, state }) {
    return isDatasetDetailPage(state) ? [MATOMO_CONSTANTS.TRACK_VIEW, title, href, null] : []
  },
}

// Prevent tracking of the next routes as they're using the useMatomo hook to track their visits
delete views[routing.datasetDetail.type]
delete views[routing.articleDetail.type]
delete views[routing.publicationDetail.type]
delete views[routing.specialDetail.type]

const trackViews = views

export default trackViews
