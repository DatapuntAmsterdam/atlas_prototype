(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('markdownParser', markdownParserFactory);

    markdownParserFactory.inject = ['marked'];

    function markdownParserFactory (marked) {
        return {
            parse
        };

        function parse (markdownText) {
            return marked(markdownText);
        }
    }
})();
