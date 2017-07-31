((() => {
    'use strict';

    angular
        .module('dpSearchResults')
        .run(runBlock);

    runBlock.$inject = ['search'];

    function runBlock (search) {
        search.initialize();
    }
}))();
