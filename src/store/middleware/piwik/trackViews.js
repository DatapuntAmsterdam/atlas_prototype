import { routing } from '../../../app/routes';
import { getDetail } from '../../../shared/ducks/detail/selectors';
import { PIWIK_CONSTANTS } from './piwikMiddleware';
import { FETCH_DETAIL_SUCCESS } from '../../../shared/ducks/detail/constants';
import { isDatasetDetailPage } from '../../redux-first-router/selectors';

let views = Object.entries(routing).reduce((acc, [, value]) => ({
  ...acc,
  [value.type]: function trackView({ firstAction = null, query = {}, href, title }) {
    return (firstAction || !!query.print) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title,
      href,
      null
    ] : [];
  }
}));

views = {
  ...views,
  [routing.home.type]: function trackView({ firstAction = null, query = {}, href, title }) {
    return (firstAction || !!query.print) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title,
      href,
      null
    ] : [];
  },
  [routing.data.type]: function trackView({ firstAction = null, query = {}, href, title }) {
    return (firstAction || !!query.print) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title, // PAGEVIEW -> MAP
      href,
      null
    ] : [];
  },
  [routing.verplaatst.type]: function trackView({ href, title }) {
    return [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title, // PAGEVIEW -> VERPLAATS
      href,
      document.referrer
    ];
  },
  [routing.dataDetail.type]: function trackView({
    firstAction = null,
    query = {},
    href,
    title,
    state,
    tracking
  }) {
    return (
      !firstAction && (tracking && tracking.id !== getDetail(state).id)
    ) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title, // PAGEVIEW -> DETAIL VIEW CLICK THROUGH VIEWS
      href,
      null
    ] : (firstAction || !!query.print) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title, // PAGEVIEW -> DETAIL VIEW INITIAL LOAD
      href,
      null
    ] : [];
  },
  [FETCH_DETAIL_SUCCESS]: function trackView({ href, title, state }) {
    return isDatasetDetailPage(state) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title,
      href,
      null
    ] : [];
  }
};

// Prevent tracking of the next routes.
delete views[routing.datasetDetail.type];

const trackViews = views;

export default trackViews;
