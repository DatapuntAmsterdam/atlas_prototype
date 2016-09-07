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

    AtlasStraatbeeldThumbnailController.$inject = ['sharedConfig', 'api', 'store', 'ACTIONS'];

    function AtlasStraatbeeldThumbnailController (sharedConfig, api, store, ACTIONS) {
        var vm = this,
            url, 
            heading;

        vm.isLoading = true;
        
        url = sharedConfig.STRAATBEELD_THUMB_URL +
            '?lat=' + vm.location[0] +
            '&lon=' + vm.location[1] +
            '&width=400' +
            '&radius=' + sharedConfig.STRAATBEELD_SEARCH_RADIUS;

        api.getByUrl(url).then(function (thumbnailData) {
            heading = thumbnailData.heading; 
            
            if (angular.isString(thumbnailData.url)) {
                vm.imageUrl = thumbnailData.url;
            }

            vm.isLoading = false;
        });
         
        vm.openStraatbeeld = function () { 
            store.dispatch({
                type: ACTIONS.FETCH_STRAATBEELD,
                payload: { id: vm.location, heading: heading }   
            });
        };
    }
})();
