((() => {
    'use strict';

    angular
        .module('atlas')
        .directive('dpScrollableContent', dpScrollableContentDirective);

    dpScrollableContentDirective.$inject = ['store', 'dashboardColumns'];

    /**
     * @description This will reset the scroll position whenever the active component (e.g. dp-detail, dp-page,
     * dp-search-results) changes.
     */
    function dpScrollableContentDirective (store, dashboardColumns) {
        return {
            restrict: 'A',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            var rightColumnContent = null;
            store.subscribe(scrollContent);

            function scrollContent () {
                const state = store.getState(),
                    visibility = dashboardColumns.determineVisibility(state),
                    pageName = state.page.name;

                var newRightColumnContent = checkRightColumnContent(visibility, pageName);

                if (rightColumnContent !== newRightColumnContent) {
                    element[0].scrollTop = 0;

                    rightColumnContent = newRightColumnContent;
                }
            }

            function checkRightColumnContent (visibility, pageName) {
                var components = ['page', 'detail', 'searchResults', 'dataSelection'],
                    activeComponent,
                    i;

                for (i = 0; i < components.length; i++) {
                    if (visibility[components[i]]) {
                        activeComponent = components[i];

                        if (activeComponent === 'page') {
                            return 'page_' + pageName;
                        } else {
                            return activeComponent;
                        }
                    }
                }

                return null;
            }
        }
    }
}))();
