(function () {
    angular
        .module('atlas')
        .directive('dpDocumentTitle', DpDocumentTitleDirective);

    DpDocumentTitleDirective.$inject = [
        '$document',
        'store',
        'dashboardColumns',
        'dpDataSelectionDocumentTitle',
        'dpDetailDocumentTitle',
        'dpLayerSelectionDocumentTitle',
        'dpMapDocumentTitle',
        'dpPageDocumentTitle',
        'dpSearchResultsDocumentTitle',
        'dpStraatbeeldDocumentTitle'

    ];

    function DpDocumentTitleDirective (
            $document,
            store,
            dashboardColumns,
            dpDataSelectionDocumentTitle,
            dpDetailDocumentTitle,
            dpLayerSelectionDocumentTitle,
            dpMapDocumentTitle,
            dpPageDocumentTitle,
            dpSearchResultsDocumentTitle,
            dpStraatbeeldDocumentTitle) {
        var mapping = [
            {
                visibility: 'dataSelection',
                documentTitle: dpDataSelectionDocumentTitle,
                state: 'dataSelection'
            }, {
                visibility: 'detail',
                documentTitle: dpDetailDocumentTitle,
                state: 'detail'
            }, {
                visibility: 'layerSelection',
                documentTitle: dpLayerSelectionDocumentTitle,
                state: 'layerSelection'
            }, {
                visibility: 'page',
                documentTitle: dpPageDocumentTitle,
                state: 'page'
            }, {
                visibility: 'searchResults',
                documentTitle: dpSearchResultsDocumentTitle,
                state: 'search'
            }, {
                visibility: 'straatbeeld',
                documentTitle: dpStraatbeeldDocumentTitle,
                state: 'straatbeeld'
            }, {
                visibility: 'map',
                documentTitle: dpMapDocumentTitle,
                state: 'map'
            }];

        return {
            restrict: 'A',
            transclude: true,
            scope: true,
            template: '{{title}}',
            link: linkFn
        };

        function linkFn (scope, element, attrs, controller, transcludeFn) {
            var baseTitle = transcludeFn().text();
            scope.title = baseTitle;

            store.subscribe(setTitle);

            function setTitle () {
                const state = store.getState(),
                    visibility = dashboardColumns.determineVisibility(state),
                    filtered = mapping.filter(item => visibility[item.visibility]),
                    // mapping.filter returns an array, possibly empty
                    current = filtered[0],
                    stateData = current ? state[current.state] : null,
                    displayNewTitle = current && stateData && !stateData.isLoading,
                    getTitle = displayNewTitle ? current.documentTitle.getTitle : null,
                    titleData = getTitle ? getTitle(stateData) : null,
                    title = (titleData ? titleData + ' – ' : '') + baseTitle;

                if (displayNewTitle) {
                    scope.title = title;
                }
            }
        }
    }
})();
