((() => {
    'use strict';

    angular
        .module('dpDataSelection')
        .run(runBlock);

    runBlock.$inject = ['dataSelectionApi'];

    function runBlock (dataSelectionApi) {
        dataSelectionApi.initialize();
    }
}))();
