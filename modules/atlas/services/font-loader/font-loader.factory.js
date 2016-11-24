(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('fontLoader', fontLoaderFactory);

    fontLoaderFactory.$inject = ['$document', 'FONT_LOADER_CONFIG'];

    function fontLoaderFactory ($document, FONT_LOADER_CONFIG) {
        return {
            initialize: initialize
        };

        function initialize () {
            let scriptTag;

            scriptTag = $document[0].createElement('script');
            scriptTag.src = 'https://fast.fonts.net/jsapi/' + FONT_LOADER_CONFIG.API_KEY + '.js';
            scriptTag.async = true;

            $document[0].head.appendChild(scriptTag);
        }
    }
})();
