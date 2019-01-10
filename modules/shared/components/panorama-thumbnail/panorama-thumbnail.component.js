import {
    toPanoramaAndPreserveQuery
} from '../../../../src/store/redux-first-router/actions';
import { getDetailLocation } from '../../../../src/store/redux-first-router/selectors';

(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpPanoramaThumbnail', {
            bindings: {
                panorama: '<',
                isLoading: '<'
            },
            templateUrl: 'modules/shared/components/panorama-thumbnail/panorama-thumbnail.html',
            controller: DpPanoramaThumbnailController,
            controllerAs: 'vm'
        });

    DpPanoramaThumbnailController.$inject = ['sharedConfig', 'store'];

    function DpPanoramaThumbnailController (sharedConfig, store) {
        const vm = this;
        const state = store.getState();

        const reference = getDetailLocation(state);
        vm.radius = sharedConfig.RADIUS;

        function setLinkTo (panorama) {
            if (panorama) {
                vm.linkTo = toPanoramaAndPreserveQuery(
                    panorama.id,
                    panorama.heading,
                    reference
                );
            }
        }

        this.$onInit = function () {
            setLinkTo(vm.panorama);
        };

        this.$onChanges = function () {
            setLinkTo(vm.panorama);
        };
    }
})();
