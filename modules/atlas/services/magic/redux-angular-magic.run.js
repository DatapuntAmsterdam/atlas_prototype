(function () {
    'use strict';

    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = ['reduxAngularMagic'];

    function runBlock (reduxAngularMagic) {
        reduxAngularMagic.initialize();
    }
})();
