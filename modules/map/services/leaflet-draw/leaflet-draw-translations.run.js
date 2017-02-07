(function () {
    'use strict';

    angular
        .module('dpMap')
        .run(runBlock);

    runBlock.$inject = ['leafletDrawTranslations'];

    function runBlock (leafletDrawTranslations) {
        leafletDrawTranslations.initialize();
    }
})();
