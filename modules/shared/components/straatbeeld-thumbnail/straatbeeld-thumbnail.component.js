(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpStraatbeeldThumbnail', {
            bindings: {
                location: '='
            },
            templateUrl: 'modules/shared/components/straatbeeld-thumbnail/straatbeeld-thumbnail.html',
            controller: DpStraatbeeldThumbnailController,
            controllerAs: 'vm'
        });

    DpStraatbeeldThumbnailController.$inject = ['sharedConfig', 'api', 'store', 'ACTIONS'];

    function DpStraatbeeldThumbnailController (sharedConfig, api, store, ACTIONS) {
        var vm = this,
            imageUrl,
            heading,
            id;

        imageUrl = sharedConfig.STRAATBEELD_THUMB_URL +
            '?lat=' + vm.location[0] +
            '&lon=' + vm.location[1] +
            '&width=' + sharedConfig.THUMBNAIL_WIDTH +
            '&radius=' + sharedConfig.RADIUS;

        vm.isLoading = true;
        vm.radius = sharedConfig.RADIUS;

        api.getByUrl(imageUrl).then(function (thumbnailData) {
            heading = thumbnailData.heading;
            id = thumbnailData.pano_id;

            if (!angular.isArray(thumbnailData)) {
                vm.imageUrl = thumbnailData.url;
                vm.hasThumbnail = true;
            } else {
                vm.hasThumbnail = false;
            }

            vm.isLoading = false;
        });

        vm.openStraatbeeld = function () {
            store.dispatch({
                type: ACTIONS.FETCH_STRAATBEELD,
                payload: {
                    id: id,
                    heading: heading,
                    isInitial: true
                }
            });
        };
    }
})();
