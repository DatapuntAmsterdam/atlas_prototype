(function () {
    angular
        .module('atlas')
        .directive('dpDocumentTitle', DpDocumentTitleDirective);

    DpDocumentTitleDirective.$inject = [
        '$document',
        '$q',
        'store',
        'dashboardColumns',
        'dpDataSelectionDocumentTitle',
        'dpDetailDocumentTitle',
        'dpMapDocumentTitle',
        'dpPageDocumentTitle',
        'dpSearchResultsDocumentTitle',
        'dpStraatbeeldDocumentTitle',
        'dpCombinedDocumentTitle'
    ];

    function DpDocumentTitleDirective ( // eslint-disable-line max-params
        $document,
        $q,
        store,
        dashboardColumns,
        dpDataSelectionDocumentTitle,
        dpDetailDocumentTitle,
        dpMapDocumentTitle,
        dpPageDocumentTitle,
        dpSearchResultsDocumentTitle,
        dpStraatbeeldDocumentTitle,
        dpCombinedDocumentTitle
    ) {
        const mapping = [
            {
                visibility: 'dataSelection',
                documentTitle: dpDataSelectionDocumentTitle,
                state: 'dataSelection'
            }, {
                visibility: 'detail',
                documentTitle: dpDetailDocumentTitle,
                state: 'detail'
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
                visibility: 'activePreviewPanel',
                documentTitle: dpCombinedDocumentTitle,
                state: 'map'
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

        function getPrintOrEmbedOrPreviewTitleAddition (state) {
            if (!state || !state.ui) {
                return '';
            }

            if (state.ui.isPrintMode) {
                return '(printversie) - ';
            } else if (state.ui.isEmbedPreview) {
                return '(embedversie) - ';
            } else if (state.ui.isEmbed) {
                return '(embedded) - ';
            }
            return '';
        }

        function linkFn (scope, element, attrs, controller, transcludeFn) {
            const baseTitle = transcludeFn().text();

            store.subscribe(setTitle);

            function setTitle () {
                let titleData;
                const state = store.getState();
                const visibility = dashboardColumns.determineVisibility(state);
                const filtered = mapping.filter(item => visibility[item.visibility]);
                // mapping.filter returns an array, possibly empty
                const current = filtered[0];
                const hasPreviewPanel = current && current.visibility === 'activePreviewPanel';
                const stateData = current ? state[current.state] : null;
                const displayNewTitle = current && stateData && !stateData.isLoading;
                const getTitle = displayNewTitle ? current.documentTitle.getTitle : null;
                const printOrEmbedOrPreviewTitleAddition = getPrintOrEmbedOrPreviewTitleAddition(state);

                if (hasPreviewPanel) {
                    titleData = getTitle ? getTitle(state) : null;
                } else {
                    titleData = getTitle ? getTitle(stateData, state.filters) : null;
                }

                if (angular.isString(titleData)) {
                    const q = $q.defer();
                    q.resolve(titleData);
                    titleData = q.promise;
                }
                if (displayNewTitle && titleData) {
                    titleData.then(result => {
                        const enrichedResult = result ? `${result} - ` : '';
                        scope.title = `${enrichedResult}${printOrEmbedOrPreviewTitleAddition}${baseTitle}`;
                    });
                }
            }
        }
    }
})();
