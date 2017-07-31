/**
 * @ngdoc directive
 * @name atlas.directive:dpPreviewState
 * @restrict: 'A'
 * @description
 * Directive to add the ```is-print-mode``` class and/or ```is-print-mode--landscape```
 *  to the element on which it is included, based on the state.
 *  This would display the page in a wide format for landscape printing in
 *  the following conditions.
 *
 * - in the map plus panorama view
 * - in a fullscreen map view
 *
 * Result:
 * <pre>
 *    <div class="is-print-mode is-print-mode--landscape"></div>
 * </pre>
 *
*/

((() => {
    angular
        .module('atlas')
        .directive('dpPreviewState', DpPreviewStateDirective);

    DpPreviewStateDirective.$inject = ['store'];

    function DpPreviewStateDirective (store) {
        return {
            restrict: 'A',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            store.subscribe(setPrintMode);
            setPrintMode();

            function setPrintMode () {
                var state = store.getState();

                if (state.atlas.isPrintMode) {
                    element.addClass('is-print-mode');

                    // Add the landscape modifier when we are at straatbeeld,
                    // fullscreen map, or data selection in list view
                    if (state.straatbeeld ||
                            (state.map && state.map.isFullscreen) ||
                            (state.dataSelection && state.dataSelection.view === 'LIST')) {
                        element.addClass('is-print-mode--landscape');
                    } else {
                        element.removeClass('is-print-mode--landscape');
                    }
                } else {
                    element.removeClass('is-print-mode is-print-mode--landscape');
                }

                if (state.atlas.isEmbedPreview) {
                    element.addClass('is-embed-preview');
                } else {
                    element.removeClass('is-embed-preview');
                }

                if (state.atlas.isEmbed) {
                    element.addClass('is-embed');
                } else {
                    element.removeClass('is-embed');
                }
            }
        }
    }
}))();
