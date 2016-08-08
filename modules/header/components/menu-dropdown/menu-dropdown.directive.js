(function () {
    'use strict';

    angular
        .module('atlasHeader')
        .directive('atlasMenuDropdown', atlasMenuDropdownDirective);

    function atlasMenuDropdownDirective() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'modules/header/components/menu-dropdown/menu-dropdown.html',
            link: linkFunction
        };
    }

    function linkFunction (scope, element) {
        var everywhere = angular.element(window.document);

        scope.isVisible = false;

        scope.toggleDropdown = function () {
            scope.isVisible = !scope.isVisible;
        };

        everywhere.bind('click', function (event) {
            var isButtonClick = event.target === element.find('button')[0];

            if (!isButtonClick) {
                scope.isVisible = false;
            }

            scope.$apply();
        });
    }
})();