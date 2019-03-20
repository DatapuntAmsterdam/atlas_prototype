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

    DpSiteHeaderController.$inject = ['$scope', 'HEADER', '$window', '$timeout'];

    function DpSiteHeaderController ($scope, HEADER, $window, $timeout) {
        const vm = this;
        const React = $window.React;
        const render = $window.render;
        const headerSearchWrapper = $window.HeaderSearchWrapper;

        $scope.$watch('vm.size', updateSize);

        function updateSize (size) {
            vm.menuSize = vm.size === HEADER.SIZE.TALL ? HEADER.SIZE.SHORT : HEADER.SIZE.TALL;
            vm.isTall = vm.size === HEADER.SIZE.TALL;
            vm.isShort = vm.size === HEADER.SIZE.SHORT;
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
