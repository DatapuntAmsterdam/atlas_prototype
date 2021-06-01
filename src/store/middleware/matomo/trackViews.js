import { MATOMO_CONSTANTS } from '../../../app/matomo'
import { routing } from '../../../app/routes'

let views = Object.entries(routing).reduce((acc, [, value]) => ({
  ...acc,
  [value.type]: function trackView({ isFirstAction = null, query = {}, href, title }) {
    return isFirstAction || !!query.print ? [MATOMO_CONSTANTS.TRACK_VIEW, title, href, null] : []
  },
}))

views = {
  ...views,
  [routing.home.type]: function trackView({ isFirstAction = null, query = {}, href, title }) {
    return isFirstAction || !!query.print ? [MATOMO_CONSTANTS.TRACK_VIEW, title, href, null] : []
  },
  [routing.data.type]: function trackView({ isFirstAction = null, query = {}, href, title }) {
    return isFirstAction || !!query.print
      ? [
          MATOMO_CONSTANTS.TRACK_VIEW,
          title, // PAGEVIEW -> MAP
          href,
          null,
        ]
      : []
  },
}

// Prevent tracking of the next routes as they're using the useMatomo hook to track their visits
delete views[routing.datasetDetail.type]
delete views[routing.articleDetail.type]
delete views[routing.publicationDetail.type]
delete views[routing.specialDetail.type]
delete views[routing.specialSearch.type]
delete views[routing.publicationSearch.type]
delete views[routing.articleSearch.type]
delete views[routing.dataSearch.type]
delete views[routing.search.type]
delete views[routing.datasetSearch.type]
delete views[routing.collectionSearch.type]
delete views[routing.mapSearch.type]

const trackViews = views

export default trackViews
