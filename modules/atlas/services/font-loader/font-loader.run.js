(function () {
    'use strict';

    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = ['fontLoader'];

    function runBlock (fontLoader) {
        fontLoader.initialize();
    }
})();
