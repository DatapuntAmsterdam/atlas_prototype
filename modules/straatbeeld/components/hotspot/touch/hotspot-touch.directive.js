(function () {
    'use strict';
    angular
        .module('dpStraatbeeld')
        .directive('dpHotspotTouch', dpHotspotTouchDirective);

    function dpHotspotTouchDirective () {
        return {
            restrict: 'A',
            scope: {
                dpHotspotTouch: '='
            },
            link: linkFn
        };
    }
    function linkFn (scope, element) {
        // Add click AND touchsstart events to the element
        element.bind('touchstart click', function () {
            scope.$apply(scope.dpHotspotTouch());
        });
    }
})();
