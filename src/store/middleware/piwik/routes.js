import { routing } from '../../../app/routes';
import { isEmbedded } from '../../../shared/ducks/ui/ui';
import { PIWIK_CONSTANTS } from './piwikMiddleware';

let routes = Object.entries(routing).reduce((acc, [, value]) => ({
  ...acc,
  [value.type]: function trackRoute({ firstAction = null, href, title }) {
    return (firstAction) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title,
      href,
      null
    ] : [];
  }
}));

routes = {
  ...routes,
  'atlasRouter/HOME': function trackRoute({ firstAction = null, href, title }) {
    return (firstAction) ? [
      PIWIK_CONSTANTS.TRACK_VIEW,
      title,
      href,
      null
    ] : [];
  },
  'atlasRouter/DATA': function trackRoute({ firstAction = null, href, title, state }) {
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
  }
};

const trackRoutes = routes;

export default trackRoutes;
