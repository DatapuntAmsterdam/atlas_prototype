((() => {
    'use strict';

    angular
        .module('atlas')
        .factory('piwik', piwikFactory);

    piwikFactory.$inject = ['$window', '$document', 'environment', 'PIWIK_CONFIG'];

    function piwikFactory ($window, $document, environment, PIWIK_CONFIG) {
        return {
            initialize: initialize
        };

        function initialize () {
            const urlBase = 'https://piwik.data.amsterdam.nl/';

            $window._paq = $window._paq || [];

            $window._paq.push(['enableLinkTracking']);

            $window._paq.push(['setTrackerUrl', urlBase + 'piwik.php']);
            $window._paq.push(['setSiteId', PIWIK_CONFIG[environment.NAME].SITE_ID]);

            const doc = $document[0];
            const piwik = doc.createElement('script');
            const scripts = doc.getElementsByTagName('script')[0];

            piwik.type = 'text/javascript';
            piwik.async = true;
            piwik.defer = true;
            piwik.src = urlBase + 'piwik.js';

            scripts.parentNode.insertBefore(piwik, scripts);
        }
    }
}))();
