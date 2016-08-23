(function () {
    angular
        .module('atlas')
        .directive('atlasPrintState', AtlasPrintStateDirective);

    AtlasPrintStateDirective.$inject = ['store'];

    function AtlasPrintStateDirective (store) {
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
