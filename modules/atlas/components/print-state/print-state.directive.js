/**
 * @ngdoc directive
 * @name atlas.directive:dpPrintState
 * @restrict: 'A'
 * @description
 * Directive to add the ```is-print-mode``` class and/or ```print-landscape```
 *  to the element on which it is included, based on the state.
 *  This would display the page in a wide format for landscape printing in
 *  the following conditions.
 *
 * - in the map plus panorama view
 * - in a fullscreen map view
 *
 * Result:
 * <pre>
 *    <div class="is-print-mode print-landscape"></div>
 * </pre>
 *
*/

(function () {
    angular
        .module('atlas')
        .directive('dpPrintState', DpPrintStateDirective);

    DpPrintStateDirective.$inject = ['store'];

    function DpPrintStateDirective (store) {
        return {
            restrict: 'A',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            store.subscribe(setPrintMode);
            setPrintMode();

            function setPrintMode () {
                var state = store.getState();

                if (state.isPrintMode) {
                    element.addClass('is-print-mode');

                    // Check if we are not on a detail page or search result page. Only add the class
                    // when we are on a map+panorama or fullscreen map page.
                    if (state.straatbeeld !== null || state.map.isFullscreen === true) {
                        element.addClass('print-landscape');
                    } else {
                        element.removeClass('print-landscape');
                    }
                } else {
                    element.removeClass('is-print-mode');
                }
            }
        }
    }
})();
