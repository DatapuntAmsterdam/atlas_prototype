import { Component } from 'react';
import { ENVIRONMENTS, getEnvironment } from '../../../shared/environment';

const PIWIK_CONFIG = {
  [ENVIRONMENTS.PRODUCTION]: {
    SITE_ID: 1
  },
  [ENVIRONMENTS.PRE_PRODUCTION]: {
    SITE_ID: 3
  },
  [ENVIRONMENTS.ACCEPTANCE]: {
    SITE_ID: 3
  },
  [ENVIRONMENTS.DEVELOPMENT]: {
    SITE_ID: 3
  }
};

class PiwikComponent extends Component {
  componentDidMount() {
    const urlBase = 'https://piwik.data.amsterdam.nl/';

    window._paq = window._paq || [];

    window._paq.push(['enableLinkTracking']);

    window._paq.push(['setTrackerUrl', `${urlBase}piwik.php`]);
    window._paq.push(['setSiteId', PIWIK_CONFIG[getEnvironment(window.location.hostname)].SITE_ID]);

    const doc = document;
    const piwik = doc.createElement('script');
    const scripts = doc.getElementsByTagName('script')[0];

    piwik.type = 'text/javascript';
    piwik.async = true;
    piwik.defer = true;
    piwik.src = `${urlBase}piwik.js`;

    scripts.parentNode.insertBefore(piwik, scripts);
  }

  render() {
    return null;
  }
}

export default PiwikComponent;
