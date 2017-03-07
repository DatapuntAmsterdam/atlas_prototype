(function () {
    angular
        .module('dpDetail')
        .component('dpDetail', {
            bindings: {
                endpoint: '@',
                reload: '=',
                isLoading: '='
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
        'user',
        'geometry',
        'geojson',
        'crsConverter',
        'dataFormatter'
    ];

    function DpDetailController (
            $scope,
            store,
            ACTIONS,
            api,
            endpointParser,
            user,
            geometry,
            geojson,
            crsConverter,
            dataFormatter) {
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

        // (Re)load the data when the user logs in or out
        $scope.$watch(() => user.getStatus().isLoggedIn, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                getData(vm.endpoint);
            }
        });

        function getData (endpoint) {
            vm.location = null;

            api.getByUrl(endpoint).then(function (data) {
                vm.includeSrc = endpointParser.getTemplateUrl(endpoint);

                let subject = endpointParser.getSubject(endpoint);

                data = dataFormatter.formatData(data, subject);

                vm.apiData = {
                    results: data
                };

                // Derive whether more info is available if the user would login
                vm.isMoreInfoAvailable = vm.apiData.results.is_natuurlijk_persoon && !user.getStatus().isLoggedIn;

                vm.filterSelection = {
                    [subject]: vm.apiData.results.naam
                };

                geometry.getGeoJSON(endpoint).then(function (geoJSON) {
                    if (geoJSON !== null) {
                        vm.location = crsConverter.rdToWgs84(geojson.getCenter(geoJSON));
                    }

                    store.dispatch({
                        type: ACTIONS.SHOW_DETAIL,
                        payload: {
                            display: data._display,
                            geometry: geoJSON,
                            isFullscreen: subject === 'api'
                        }
                    });
                }, errorHandler);
            }, errorHandler);
        }

        function errorHandler () {
            store.dispatch({
                type: ACTIONS.SHOW_DETAIL,
                payload: {}
            });
        }
    }
})();
