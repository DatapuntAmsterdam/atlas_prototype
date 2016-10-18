(function () {
    'use strict';

    angular
        .module('dpHeader')
        .filter('suggestionHighlight', suggestionHighlightFilter);

    function suggestionHighlightFilter () {
        return function (suggestion, query) {
            return suggestion.replace(new RegExp('(' + query + ')', 'gi'), '<strong>$1</strong>');
        };
    }
})();
