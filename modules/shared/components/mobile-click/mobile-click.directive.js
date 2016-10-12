(function () {
    'use strict';
    angular
        .module('dpShared')
        .directive('dpClick', [function () {
            return function (scope, element, attrs) {
                // Add click AND touchsstart events to the element
                element.bind('touchstart click', function () {
                    scope.$apply(attrs['dpClick']);
                });
            };
        }]);
})();


