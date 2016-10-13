/**
 * @ngdoc controller
 * @name atlas.controller:DetailController
 * @description
 * Controller definition of the atlasHeader component
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('DetailController', DetailController);

    DetailController.$inject = ['store'];

    function DetailController (store) {
        var vm = this;

        store.subscribe(update);
        update();

        function update () {
            var state = store.getState();

            vm.endpoint = state.detail && state.detail.endpoint;
            vm.isLoading = state.detail && state.detail.isLoading;
        }
    }
})();