/**
 * @ngdoc controller
 * @name atlas.controller:DataSelectionController
 * @description
 * Controller definition
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('DataSelectionController', DataSelectionController);

    DataSelectionController.$inject = ['store'];

    function DataSelectionController (store) {
        var vm = this;

        store.subscribe(update);
        update();

        function update () {
            var state = store.getState();

            vm.dataSelectionState = state.dataSelection;
        }
    }
})();