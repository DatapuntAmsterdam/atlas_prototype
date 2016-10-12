(function () {
    'use strict';
    angular
        .module('dpShared')
        .directive('dpClick', dpClickDirective);

    function dpClickDirective () {
        return {
            restrict: 'A',
            link: link
        };
    }

    function link (scope, element, attrs) {
        // Add click AND touchsstart events to the element
        element.bind('touchstart click', function () {
            scope.$apply(attrs.dpClick);
        });
    }
})();
