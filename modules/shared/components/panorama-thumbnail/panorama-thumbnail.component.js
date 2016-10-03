(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpPanoramaThumbnail', {
            bindings: {
                location: '='
            },
            templateUrl: 'modules/shared/components/panorama-thumbnail/panorama-thumbnail.html',
            controller: AtlasPanoramaThumbnailController,
            controllerAs: 'vm'
        });

    AtlasPanoramaThumbnailController.$inject = ['sharedConfig', 'api', 'store', 'ACTIONS' ];

    function AtlasPanoramaThumbnailController(sharedConfig, api, store, ACTIONS) {
        var vm = this,
            imageUrl,
            heading,
            id;

        imageUrl = sharedConfig.PANORAMA_THUMB_URL +
            '?lat=' + vm.location[0] +
            '&lon=' + vm.location[1] +
            '&width=240' +
            '&radius=' + sharedConfig.RADIUS;

        vm.isLoading = true;
        vm.radius = sharedConfig.RADIUS; 

        api.getByUrl(imageUrl).then(function (thumbnailData) {
            heading = thumbnailData.heading;
            id = thumbnailData['pano_id'];
            
            if (!angular.isArray(thumbnailData)) {
                vm.imageUrl = thumbnailData.url;
                vm.hasThumbnail = true;
            } else {
                vm.hasThumbnail = false;
            }

            vm.isLoading = false;
        });
 
        vm.openPanorama = function () {
            store.dispatch({
                type: ACTIONS.FETCH_PANORAMA,
                payload: { id: id, heading: heading, isInitial: true } 
            });
        };
    }
})();