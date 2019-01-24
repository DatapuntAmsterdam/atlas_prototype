import { routing } from '../../../app/routes';

const routes = Object.entries(routing).reduce((acc, [, value]) => ({
  ...acc,
  [value.type]: function trackRoute({ firstAction = null, href, title }) {
    return (firstAction) ? [
      'trackPageView',
      title,
      href,
      null
    ] : [];
  }
}));

export default routes;
