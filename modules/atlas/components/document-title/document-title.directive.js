import { trackPageNavigation } from '../../../../src/shared/services/piwik-tracker/piwik-tracker';

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
        'dpCombinedDocumentTitle',
        '$timeout'
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
        dpCombinedDocumentTitle,
        $timeout
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
                visibility: 'mapPreviewPanel',
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
                return ' | Printversie';
            } else if (state.ui.isEmbedPreview) {
                return ' | Embedversie';
            } else if (state.ui.isEmbed) {
                return ' | Embedded';
            }
            return '';
        }

        function hasStateSomethingLoading (state) {
            // deep check in the state to check for an 'isLoading' key that's true
            const stateKeys = Object.keys(state);
            for (let i = 0; i < stateKeys.length; i++) {
                if (state.isLoading || state[stateKeys[i]] && state[stateKeys[i]].isLoading) {
                    return true;
                }
            }
            return false;
        }

        function linkFn (scope, element, attrs, controller, transcludeFn) {
            const baseTitle = transcludeFn().text();
            let trackerTimeout;

            store.subscribe(setTitle);

            scope.$watch('title', (newVal, oldVal) => {
                if (newVal !== oldVal) {
                    triggerTracker();
                }
            });

            function triggerTracker () {
                // recursive function
                // this function is triggered if the title is changed, so tracking needs to be done
                // make sure that the page is finished loading. before actually track the navigation
                // if the page is still loading, wait 200ms and call itself to check again.
                const state = store.getState();
                $timeout.cancel(trackerTimeout);

                if (!hasStateSomethingLoading(state)) {
                    trackPageNavigation();
                } else {
                    trackerTimeout = $timeout(() => {
                        triggerTracker();
                    }, 200);
                }
            }

            function setTitle () {
                let titleData;
                const state = store.getState();
                const visibility = dashboardColumns.determineVisibility(state);
                const activity = dashboardColumns.determineActivity(state);

                // combine specific activity values with the visibility object
                const combinedVisibilityActivity = {
                    ...visibility,
                    mapPreviewPanel: activity.mapPreviewPanel
                };
                const filtered = mapping.filter(item =>
                    combinedVisibilityActivity[item.visibility]
                );

                // mapping.filter returns an array, possibly empty
                const current = filtered[0];
                const hasPreviewPanel = current && current.visibility === 'mapPreviewPanel';
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
                        const enrichedResult = result
                            ? `${result}${printOrEmbedOrPreviewTitleAddition} - `
                            : `${printOrEmbedOrPreviewTitleAddition}`;
                        scope.title = `${enrichedResult}${baseTitle}`;
                    });
                }
            }
        }
    }
})();
