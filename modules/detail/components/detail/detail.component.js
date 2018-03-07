(function () {
    angular
        .module('dpDetail')
        .component('dpDetail', {
            bindings: {
                show: '=',
                endpoint: '@',
                reload: '=',
                isLoading: '=',
                isMapHighlight: '=',
                user: '<'
            },
            templateUrl: 'modules/detail/components/detail/detail.html',
            controller: DpDetailController,
            controllerAs: 'vm'
        });

    DpDetailController.$inject = [
        '$scope',
        'store',
        'ACTIONS',
        'api',
        'endpointParser',
        'geometry',
        'geojson',
        'crsConverter',
        'dataFormatter',
        'nearestDetail'
    ];

    /* eslint-disable max-params */
    function DpDetailController (
        $scope,
        store,
        ACTIONS,
        api,
        endpointParser,
        geometry,
        geojson,
        crsConverter,
        dataFormatter,
        nearestDetail
    ) {
        /* eslint-enable max-params */
        var vm = this;

        // Reload the data when the reload flag has been set (endpoint has not
        // changed)
        $scope.$watch('vm.reload', reload => {
            if (reload) {
                getData(vm.endpoint);
            }
        });

        // (Re)load the data when the endpoint is set or gets changed
        $scope.$watch('vm.endpoint', getData);

        // (Re)load the data when the user logs in or out or on a change of authorization level
        $scope.$watch('vm.user.scopes', (newValue, oldValue) => {
            if (newValue !== oldValue) {
                getData(vm.endpoint);
            }
        });

        function getData (endpoint) {
            vm.location = null;

            vm.includeSrc = endpointParser.getTemplateUrl(endpoint);

            vm.geosearchButton = vm.isMapHighlight ? false : nearestDetail.getLocation();

            const [category, subject] = endpointParser.getParts(endpoint);
            if ((category === 'brk' && subject === 'subject' && !vm.user.scopes.includes('BRK/RS')) ||
                (category === 'handelsregister' && !vm.user.scopes.includes('HR/R'))
            ) {
                // User is not authorized to view BRK Kadastrale Subjecten, nor
                // handelsregister, so do not fetch data
                delete vm.apiData;
                errorHandler();
            } else {
                api.getByUrl(endpoint).then(function (data) {
                    data = dataFormatter.formatData(data, subject);

                    vm.apiData = {
                        results: data
                    };

                    vm.filterSelection = {
                        [subject]: vm.apiData.results.naam
                    };

                    geometry.getGeoJSON(endpoint).then(function (geoJSON) {
                        if (geoJSON !== null) {
                            vm.location = crsConverter.rdToWgs84(geojson.getCenter(geoJSON));
                            
                            store.dispatch({
                                type: ACTIONS.MAP_PAN,
                                payload: vm.location
                            });
                        }

                        if (vm.isMapHighlight) {
                            store.dispatch({
                                type: ACTIONS.DETAIL_FULLSCREEN,
                                payload: subject === 'api' || !geoJSON
                            });
                        }

                        store.dispatch({
                            type: ACTIONS.SHOW_DETAIL,
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
                type: ACTIONS.SHOW_DETAIL,
                payload: {}
            });
        }
    }
})();
