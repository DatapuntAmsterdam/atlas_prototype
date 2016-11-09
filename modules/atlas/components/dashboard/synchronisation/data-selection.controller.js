/**
 * @ngdoc controller
 * @name atlas.controller:DataSelectionController
 * @requires store
 * @description
 * Controller definition
 * @property {string} vm.dataSelectionState This is some example of how a vm could be used
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
