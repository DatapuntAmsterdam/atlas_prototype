(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('PageController', PageController);

    PageController.$inject = ['store'];

    function PageController (store) {
        var vm = this;

        store.subscribe(update);
        update();

        function update () {
            var state = store.getState();

            vm.pageName = state.page.name;
        }
    }
})();
