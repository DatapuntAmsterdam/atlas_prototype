(function () {
    'use strict';

    angular
        .module('atlasDetail')
        .factory('endpointParser', endpointParserFactory);

    function endpointParserFactory () {
        return {
            getTemplateUrl: getTemplateUrl
        };

        function getTemplateUrl (endpoint) {
            var anchor,
                pathname,
                uriParts,
                template;

            // Transform http://www.api-root.com/this/that/123 to ['this', 'that', '123']
            anchor = document.createElement('a');
            anchor.href = endpoint;

            pathname = anchor.pathname;

            // Strip leading slash
            pathname = pathname.replace(/^\//, '');

            // Strip trailing slash
            pathname = pathname.replace(/\/$/, '');

            uriParts = pathname.split('/');

            if (isZakelijkRecht(uriParts)) {
                template = 'brk/subject.html';
            } else {
                template = uriParts[0] + '/' + uriParts[1] + '.html';
            }

            return 'modules/detail/components/detail/templates/' + template;

            function isZakelijkRecht (someUriParts) {
                return someUriParts[0] === 'brk' &&
                    someUriParts[1] === 'zakelijk-recht' &&
                    someUriParts[someUriParts.length - 1] === 'subject';
            }
        }
    }
})();
