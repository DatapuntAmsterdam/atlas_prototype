import PAGES from '../../../../../src/pages';

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
            vm.isFullscreen = state.ui.page === PAGES.PANORAMA;
        }
    }
})();
