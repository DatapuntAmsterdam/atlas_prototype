(function () {
    angular
        .module('atlas')
        .directive('atlasPrintState', AtlasPrintStateDirective);

    AtlasPrintStateDirective.$inject = ['$rootScope', '$window'];

    function AtlasPrintStateDirective ($rootScope, $window) {
        return {
            restrict: 'A',
            scope: {
                isPrintMode: '='
            },
            link: linkFunction
        };

        function linkFunction (scope, element) {
            scope.$watch('isPrintMode', function (isPrintMode) {
                if (isPrintMode) {
                    element.addClass('is-print-mode');

                    $rootScope.$applyAsync(function () {
                        $window.print();
                    });
                } else {
                    element.removeClass('is-print-mode');
                }
            });
        }
    }
})();