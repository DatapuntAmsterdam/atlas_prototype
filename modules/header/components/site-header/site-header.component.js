import HEADER_SIZE from '../../../../src/header/services/header-size/header-size.constant';

(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpSiteHeader', {
            bindings: {
                hasPrintButton: '<',
                hasEmbedButton: '<',
                isHomepage: '<',
                size: '=',
                user: '<'
            },
            templateUrl: 'modules/header/components/site-header/site-header.html',
            controller: DpSiteHeaderController,
            controllerAs: 'vm'
        });

    DpSiteHeaderController.$inject = ['$scope', '$window', '$timeout'];

    function DpSiteHeaderController ($scope, $window, $timeout) {
        const vm = this;
        const React = $window.React;
        const render = $window.render;
        const headerSearchWrapper = $window.HeaderSearchWrapper;

        $scope.$watch('vm.size', updateSize);

        function updateSize (size) {
            vm.menuSize = vm.size === HEADER_SIZE.SIZE.TALL ? HEADER_SIZE.SIZE.SHORT : HEADER_SIZE.SIZE.TALL;
            vm.isTall = vm.size === HEADER_SIZE.SIZE.TALL;
            vm.isShort = vm.size === HEADER_SIZE.SIZE.SHORT;
            $timeout(setSearchComponent);
        }

        function setSearchComponent () {
            const autosuggestContainer = $window.document.querySelector('.react-auto-suggest-container');
            if (autosuggestContainer) {
                render(React.createElement(headerSearchWrapper, null), autosuggestContainer);
            }
        }
    }
})();
