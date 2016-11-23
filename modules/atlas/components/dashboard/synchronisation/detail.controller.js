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
            vm.reload = state.detail && state.detail.reload;
            vm.isLoading = state.detail && state.detail.isLoading;
        }
    }
})();
