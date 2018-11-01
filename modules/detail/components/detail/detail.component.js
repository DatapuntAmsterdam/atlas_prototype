import removeMd from 'remove-markdown';
import piwikTracker from '../../../../src/shared/services/piwik-tracker/piwik-tracker';
import { SHOW_DETAIL } from '../../../../src/shared/ducks/detail/detail';

(function () {
    angular
        .module('dpDetail')
        .component('dpDetail', {
            bindings: {
                endpoint: '@',
                isLoading: '=',
                catalogFilters: '=',
                user: '<'
            },
            templateUrl: 'modules/detail/components/detail/detail.html',
            controller: DpDetailController,
            controllerAs: 'vm'
        });

    DpDetailController.$inject = [
        '$scope',
        'store',
        'api',
        'endpointParser',
        'geometry',
        'geojson',
        'crsConverter',
        'dataFormatter',
        'markdownParser'
    ];

    /* eslint-disable max-params */
    function DpDetailController (
        $scope,
        store,
        api,
        endpointParser,
        geometry,
        geojson,
        crsConverter,
        dataFormatter,
        markdownParser
    ) {
        /* eslint-enable max-params */
        const vm = this;

        // (Re)load the data when the endpoint is set or gets changed
        $scope.$watch('vm.endpoint', getData);

        // Ensure the catalog filters for dcatd endpoints
        $scope.$watch('vm.catalogFilters', () => {
            if (vm.catalogFilters) {
                getData(vm.endpoint);
            }
        });

        // (Re)load the data when the user logs in or out or on a change of authorization level
        $scope.$watch('vm.user.scopes', (newValue, oldValue) => {
            if (newValue !== oldValue) {
                getData(vm.endpoint);
            }
        });

        vm.stripMarkdown = (val) => removeMd(val);

        // TODO DP-6031: Create Redux Middelware, map Piwik events to ACTIONS
        vm.geosearchButtonClick = () => sendPiwikEvent();

        function getData (endpoint) {
            vm.location = null;

            vm.includeSrc = endpointParser.getTemplateUrl(endpoint);

            const [category, subject] = endpointParser.getParts(endpoint);

            if ((category === 'brk' && subject === 'subject' && !vm.user.scopes.includes('BRK/RS')) ||
                (category === 'handelsregister' && !vm.user.scopes.includes('HR/R')) ||
                (category === 'grondexploitatie' && !vm.user.scopes.includes('GREX/R'))
            ) {
                // User is not authorized to view
                //   BRK Kadastrale Subjecten, nor
                //   handelsregister, nor
                //   grondexploitatie
                // so do not fetch data
                delete vm.apiData;
                errorHandler();
            } else if (category === 'dcatd' && subject === 'datasets' && !vm.catalogFilters) {
                // The catalogFilters data is not present so do not fetch data
                delete vm.apiData;
                errorHandler();
            } else {
                const endpointVersion = category === 'grondexploitatie' ? '?version=3' : '';
                api.getByUrl(`${endpoint}${endpointVersion}`).then(function (data) {
                    data = dataFormatter.formatData(data, subject, vm.catalogFilters);

                    if (category === 'dcatd' && subject === 'datasets') {
                        const fields = ['dct:description', 'overheid:grondslag', 'overheidds:doel'];
                        const markdownFields = fields.reduce((acc, field) => {
                            if (data[field]) {
                                acc[field] = markdownParser.parse(data[field]);
                            }
                            return acc;
                        }, {});

                        data = { ...data, ...markdownFields };

                        data.canEditDataset = vm.user.scopes.includes('CAT/W');
                    }

                    vm.apiData = {
                        results: data
                    };

                    vm.filterSelection = {
                        [subject]: vm.apiData.results.naam
                    };

                    geometry.getGeoJSON(endpoint).then(function (geoJSON) {
                        if (geoJSON !== null) {
                            const rd = geojson.getCenter(geoJSON);
                            vm.location = crsConverter.rdToWgs84([rd.x, rd.y]);
                        }

                        store.dispatch({
                            type: SHOW_DETAIL,
                            payload: {
                                display: data._display,
                                geometry: geoJSON
                            }
                        });
                    }, errorHandler);
                }, errorHandler);
            }
        }

        function errorHandler () {
            store.dispatch({
                type: SHOW_DETAIL,
                payload: {}
            });
        }

        // TODO DP-6031: Create Redux Middelware, map Piwik events to ACTIONS
        function sendPiwikEvent () {
            const piwik = {
                TRACK_EVENT: 'trackEvent',
                SHOW_ALL_RESULTS: 'show-all-results',
                NAVIGATION: 'navigation'
            };

            piwikTracker([piwik.TRACK_EVENT, piwik.NAVIGATION,
                piwik.SHOW_ALL_RESULTS, window.document.title]);
        }
    }
})();
