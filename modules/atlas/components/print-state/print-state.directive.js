(function () {
    angular
        .module('atlas')
        .directive('atlasPrintState', AtlasPrintStateDirective);

    function AtlasPrintStateDirective () {
        return {
            restrict: 'A',
            scope: {
                isPrintMode: '='
            },
            link: linkFunction
        };

        function linkFunction (scope, element) {
            scope.$watch('isPrintMode', function () {
                if (scope.isPrintMode) {
                    element.addClass('is-print-mode');
                } else {
                    element.removeClass('is-print-mode');
                }
            });
        }
    }
})();