/**
 * @ngdoc directive
 * @name atlas.directive:atlasPrintState
 * @restrict: 'A'
 * @description
 * A description
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
