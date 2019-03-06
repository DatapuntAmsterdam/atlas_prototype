import { routing } from '../../../app/routes';
import { isEmbedded } from '../../../shared/ducks/ui/ui';
import { getDetail } from '../../../shared/ducks/detail/selectors';
import { PIWIK_CONSTANTS } from './piwikMiddleware';
import { FETCH_DETAIL_SUCCESS } from '../../../shared/ducks/detail/constants';
import { isDatasetDetailPage } from '../../redux-first-router/selectors';

let views = Object.entries(routing).reduce((acc, [, value]) => ({
  ...acc,
  [value.type]: function trackView({ firstAction = null, href, title }) {
    return (firstAction) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title,
      href,
      null
    ] : [];
  }
}));

views = {
  ...views,
  'atlasRouter/HOME': function trackView({ firstAction = null, href, title }) {
    return (firstAction) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title,
      href,
      null
    ] : [];
  },
  'atlasRouter/DATA': function trackView({ firstAction = null, href, title, state }) {
    return (isEmbedded(state)) ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'embed', // PAGEVIEW -> MAP IN EMBED VIEW
      'embedkaart',
      href
    ] : (firstAction) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title, // PAGEVIEW -> MAP
      href,
      null
    ] : [];
  },
  'atlasRouter/DATA_DETAIL': function trackView({ firstAction = null, href, title, state, tracking }) {
    return (
      !firstAction && (tracking && tracking.id !== getDetail(state).id)
    ) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title, // PAGEVIEW -> DETAIL VIEW CLICK THROUGH VIEWS
      href,
      null
    ] : (firstAction) ? [
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
