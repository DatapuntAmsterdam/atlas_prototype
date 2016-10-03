(function () {
    'use strict';

    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = ['urlToState'];

    function runBlock (urlToState) {
        urlToState.initialize();
    }
})();
