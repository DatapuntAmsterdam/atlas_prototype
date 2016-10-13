/**
 * @ngdoc directive
 * @name atlas.directive:atlasScrollableContent
 * @restrict: 'A'
 * @description
 * A description
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .directive('atlasScrollableContent', atlasScrollableContentDirective);

    /**
     * @description This will reset the scroll position whenever the active component (e.g. atlas-detail, atlas-page,
     * atlas-search-results) changes.
     */
    function atlasScrollableContentDirective () {
        return {
            restrict: 'A',
            scope: {
                visibility: '=',
                pageName: '@'
            },
            link: linkFunction
        };

        function linkFunction (scope, element) {
            var rightColumnContent = null;

            scope.$watchGroup(['visibility', 'pageName'], function () {
                var newRightColumnContent = checkRightColumnContent(scope.visibility, scope.pageName);

                if (rightColumnContent !== newRightColumnContent) {
                    element[0].scrollTop = 0;

                    rightColumnContent = newRightColumnContent;
                }
            });

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
})();