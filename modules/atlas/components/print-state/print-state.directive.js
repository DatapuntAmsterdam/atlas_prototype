/**
 * @ngdoc directive
 * @name atlas.directive:dpPrintState
 * @restrict: 'A'
 * @description
 * Directive to add the ```is-print-mode``` class to the element on which it is included, based on the state.
 * This would add;
 * <pre>
 *    <div class="is-print-mode"></div>
 * </pre>
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
                } else {
                    element.removeClass('is-print-mode');
                }
            }
        }
    }
})();
