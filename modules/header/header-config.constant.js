(function () {
    'use strict';

    angular
        .module('dpHeader')
        .constant('HEADER_CONFIG', {
            AUTOCOMPLETE_ENDPOINT: 'atlas/typeahead/'
        });
})();
