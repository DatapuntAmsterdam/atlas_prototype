((() => {
    'use strict';

    angular
        .module('dpHeader')
        .filter('suggestionHighlight', suggestionHighlightFilter);

    function suggestionHighlightFilter () {
        return (suggestion, query) => suggestion.replace(new RegExp('(' + query + ')', 'gi'), '<strong>$1</strong>');
    }
}))();
