(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('PanoramaController', PanoramaController);

    PanoramaController.$inject = ['store'];

    function PanoramaController (store) {
        var vm = this;

        store.subscribe(update);
        update();

        function update () {
            var state = store.getState();
            vm.panoramaState = state.panorama;
        }
    }
})();