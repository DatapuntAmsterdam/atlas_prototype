(function () {
    'use strict';

    angular
        .module('atlas')
        .service('piwik', piwikFactory);

    piwikFactory.$inject = ['$window', '$document', 'environment', 'PIWIK_CONFIG'];

    function piwikFactory ($window, $document, environment, PIWIK_CONFIG) {
        return {
            initialize: initialize
        };

        function initialize () {
            var u, d, g, s;

            $window._paq = $window._paq || [];

            $window._paq.push(['trackPageView']);
            $window._paq.push(['enableLinkTracking']);

            u = '//admin.datapunt.amsterdam.nl/piwik/';

            $window._paq.push(['setTrackerUrl', u + 'piwik.php']);
            $window._paq.push(['setSiteId', PIWIK_CONFIG[environment.NAME].SITE_ID]);

            d = $document[0];
            g = d.createElement('script');
            s = d.getElementsByTagName('script')[0];

            g.type = 'text/javascript';
            g.async = false;
            g.defer = false;
            g.src = u + 'piwik.js';

            s.parentNode.insertBefore(g, s);
        }
    }
})();
