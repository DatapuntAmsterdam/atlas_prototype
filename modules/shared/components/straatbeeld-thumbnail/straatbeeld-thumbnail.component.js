(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpStraatbeeldThumbnail', {
            bindings: {
                location: '='
            },
            templateUrl: 'modules/shared/components/straatbeeld-thumbnail/straatbeeld-thumbnail.html',
            controller: AtlasStraatbeeldThumbnailController,
            controllerAs: 'vm'
        });

    AtlasStraatbeeldThumbnailController.$inject = ['detailConfig', 'store', 'ACTIONS'];

    function AtlasStraatbeeldThumbnailController (detailConfig, store, ACTIONS) {
        var vm = this;

        vm.imageUrl = detailConfig.STRAATBEELD_THUMB_URL +
            '?lat=' + vm.location[0] +
            '&lon=' + vm.location[1] +
            '&width=240&height=135';

        vm.openStraatbeeld = function () {
            store.dispatch({
                type: ACTIONS.FETCH_STRAATBEELD,
                payload: vm.location
            });
        };
    }
})();
