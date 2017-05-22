(function () {
    angular
        .module('dpShared')
        .directive('dpExpandCollapse', DpExpandCollapseDirective);

    DpExpandCollapseDirective.$inject = [
        '$compile',
        '$interval'
    ];

    function DpExpandCollapseDirective ($compile, $interval) {
        return {
            restrict: 'A',
            link: linkFn,
            scope: true
        };

        function linkFn (scope, element, attrs, controller, transcludeFn) {
            // NB: `$timeout` is required to await the element's rendering
            $interval(() => {
                const initialHeight = element[0].offsetHeight;
                const scrollHeight = element[0].scrollHeight;

                if (scrollHeight <= initialHeight) {
                    return;
                }

                scope.collapsed = true;

                const showMoreButton = $compile([
                    '<button class="c-show-more">',
                    '{{ collapsed ? "Toon meer" : "Toon minder" }}',
                    '</button>'
                ].join(''))(scope);

                showMoreButton.on('click', () => {
                    if (scope.collapsed) {
                        element.css('max-height', scrollHeight + 'px');
                    } else {
                        element.css('max-height', initialHeight + 'px');
                    }
                    scope.collapsed = !scope.collapsed;
                });

                element.after(showMoreButton);
            });
        }
    }
})();
