(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['store'];

    function HeaderController (store) {
        var vm = this;

        store.subscribe(update);
        update();

        function update () {
            var state = store.getState();

            vm.query = state.search && state.search.query;
            vm.hasPrintButton = !angular.isObject(state.dataSelection);
        }
    }
})();
