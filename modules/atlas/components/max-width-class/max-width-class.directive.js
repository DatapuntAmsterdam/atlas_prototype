/**
 * @ngdoc directive
 * @name atlas.directive:dpMaxWidthClass
 * @restrict: 'A'
 * @description
 * Adds the specified css class to the element when the application is
 * restricted to a maximum width.
 *
 * Result:
 * <pre>
 *    <div ng-max-width-class="class-name" class="class-name"></div>
 * </pre>
 *
 */

((() => {
    angular
        .module('atlas')
        .directive('dpMaxWidthClass', dpMaxWidthClassDirective);

    dpMaxWidthClassDirective.$inject = ['store', 'dashboardColumns'];

    function dpMaxWidthClassDirective (store, dashboardColumns) {
        return {
            restrict: 'A',
            link: linkFunction
        };

        function linkFunction (scope, element, attrs) {
            const className = attrs.dpMaxWidthClass;
            store.subscribe(setMaxWidthClass);

            function setMaxWidthClass () {
                const state = store.getState(),
                    maxWidth = dashboardColumns.hasLimitedWidth(state);

                if (maxWidth) {
                    element.addClass(className);
                } else {
                    element.removeClass(className);
                }
            }
        }
    }
}))();
