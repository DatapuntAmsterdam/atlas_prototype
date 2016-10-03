(function () {
    'use strict';

    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = ['piwik'];

    function runBlock (piwik) {
        piwik.initialize();
    }
})();
