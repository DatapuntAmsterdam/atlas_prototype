(function () {
    'use strict';

    angular
        .module('atlasHeader')
        .constant('HEADER_CONFIG', {
            AUTOCOMPLETE_ENDPOINT: 'atlas/typeahead/'
        });
})();
