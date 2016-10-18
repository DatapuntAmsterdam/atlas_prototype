/**
 * @ngdoc controller
 * @name atlas.controller:StraatbeeldController
 * @description
 * Controller definition
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('StraatbeeldController', StraatbeeldController);

    StraatbeeldController.$inject = ['store'];

    function StraatbeeldController (store) {
        var vm = this;

        store.subscribe(update);
        update();

        function update () {
            var state = store.getState();

            vm.straatbeeldState = state.straatbeeld;
        }
    }
})();
