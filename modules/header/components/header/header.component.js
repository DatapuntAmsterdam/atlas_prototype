import { hideEmbedMode, hidePrintMode } from '../../../../src/shared/ducks/ui/ui';
import headerSize from '../../../../src/header/services/header-size/header-size.constant';

(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpHeader', {
            templateUrl: 'modules/header/components/header/header.html',
            controller: DpHeaderController,
            controllerAs: 'vm',
            bindings: {
                isHomePage: '<',
                hasMaxWidth: '<',
                isPrintMode: '<',
                isEmbedPreview: '<',
                user: '<',
                isPrintOrEmbedOrPreview: '<'
            }
        });

    DpHeaderController.$inject = ['$scope'];

    function DpHeaderController ($scope) {
        const vm = this;

        vm.hidePrintAction = hidePrintMode();
        vm.hideEmbedMode = hideEmbedMode();

        $scope.$watch('vm.isHomePage', updateSize);

        function updateSize () {
            vm.headerSize = vm.isHomePage ? headerSize.SIZE.TALL : headerSize.SIZE.SHORT;
        }

        updateSize();
    }
})();
