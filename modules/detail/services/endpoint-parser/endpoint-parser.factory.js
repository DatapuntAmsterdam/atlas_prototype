(function () {
    'use strict';

    angular
        .module('dpDetail')
        .factory('endpointParser', endpointParserFactory);

    function endpointParserFactory () {
        return {
            getTemplateUrl,
            getGlossaryKey,
            getParts
        };

        function getTemplateUrl (endpoint) {
            const [category, subject] = getParts(endpoint);
            return `modules/detail/components/detail/templates/${category}/${subject}.html`;
        }

        function getGlossaryKey (endpoint) {
            const [, subject] = getParts(endpoint);
            return subject.toUpperCase().replace(/-/g, '_');
        }

        function getParts (endpoint) {
            const anchor = document.createElement('a');
            anchor.href = endpoint;

            // Transform http://www.api-root.com/this/that/123 to ['this', 'that', '123']
            const uriParts = anchor.pathname
                    .replace(/^\//, '') // Strip leading slash
                    .replace(/\/$/, '') // Strip trailing slash
                    .split('/');

            if (isZakelijkRecht(uriParts)) {
                return ['brk', 'subject'];
            } else if (isCatalogus(uriParts)) {
                return ['catalogus', 'api'];
            } else {
                // Remove the last segment (the ID)
                uriParts.pop();

                // Return the last two 'path' segments
                return uriParts.slice(-2);
            }

            function isZakelijkRecht (someUriParts) {
                return someUriParts[0] === 'brk' &&
                    someUriParts[1] === 'zakelijk-recht' &&
                    someUriParts[someUriParts.length - 1] === 'subject';
            }

            function isCatalogus (someUriParts) {
                return someUriParts[0] === 'catalogus' && someUriParts[1] === 'api';
            }
        }
    }
})();
