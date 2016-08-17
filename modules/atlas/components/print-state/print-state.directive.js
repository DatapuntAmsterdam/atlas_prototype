(function () {
    angular
        .module('atlas')
        .directive('atlasPrintState', AtlasPrintStateDirective);

    AtlasPrintStateDirective.$inject = ['$timeout', '$window', '$document'];

    function AtlasPrintStateDirective ($timeout, $window, $document) {
        return {
            restrict: 'A',
            scope: {
                isPrintMode: '='
            },
            link: linkFunction
        };

        function linkFunction (scope) {
            scope.$watch('isPrintMode', function (isPrintMode) {
                var html = angular.element($document[0].querySelector('html'));

                if (isPrintMode) {
                    html.addClass('is-print-mode');
                } else {
                    html.removeClass('is-print-mode');
                }
            });
        }
    }
})();
