describe('the dp-detail component', function () {
    var $compile,
        $rootScope,
        $q,
        store,
        ACTIONS,
        mockedGeometryPoint = {type: 'Point', coordinates: 'FAKE_NUMMERAANDUIDING_POINT'},
        mockedGeometryMultiPolygon = {type: 'MultiPolygon', coordinates: 'FAKE_KADASTRAAL_OBJECT_MULTIPOLYGON'};

    beforeEach(function () {
        angular.mock.module(
            'dpDetail',
            {
                store: {
                    dispatch: function () {}
                },
                api: {
                    getByUrl: function (endpoint) {
                        var q = $q.defer();

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/') {
                            q.resolve({
                                _display: 'Adresstraat 1A',
                                dummy: 'A',
                                something: 3
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            q.resolve({
                                _display: 'Een of ander kadastraal object',
                                dummy: 'B',
                                something: -90
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/subject/123/') {
                            q.resolve({
                                _display: 'Ferdinand de Vries',
                                dummy: 'C',
                                something: 4
                            });
                        }

                        return q.promise;
                    }
                },
                endpointParser: {
                    getTemplateUrl: function (endpoint) {
                        var templateUrl = 'modules/detail/components/detail/templates/';

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/') {
                            templateUrl += 'bag/nummeraanduiding';
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            templateUrl += 'brk/object';
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/subject/123/') {
                            templateUrl += 'brk/subject';
                        }

                        templateUrl += '.html';

                        return templateUrl;
                    }
                },
                geometry: {
                    getGeoJSON: function (endpoint) {
                        var q = $q.defer();

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/') {
                            q.resolve(mockedGeometryPoint);
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            q.resolve(mockedGeometryMultiPolygon);
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/subject/123/') {
                            q.resolve(null);
                        }

                        return q.promise;
                    }
                },
                geojson: {
                    getCenter: function () {
                        return [52.123, 4.123];
                    }
                },
                crsConverter: {
                    rdToWgs84: function (rdLocation) {
                        return [
                            --rdLocation[0],
                            --rdLocation[1]
                        ];
                    }
                }
            },
            function ($provide) {
                $provide.factory('ngIncludeDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (
            _$compile_,
            _$rootScope_,
            _$q_,
            _store_,
            _ACTIONS_,
            _api_,
            _endpointParser_,
            _geometry_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(store, 'dispatch');
    });

    function getComponent (endpoint, isLoading) {
        var component,
            element,
            scope;

        element = document.createElement('dp-detail');
        element.setAttribute('endpoint', '{{endpoint}}');
        element.setAttribute('is-loading', 'isLoading');

        scope = $rootScope.$new();
        scope.endpoint = endpoint;
        scope.isLoading = isLoading;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('puts data and a template URL variable on the scope based on the endpoint', function () {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
        scope = component.isolateScope();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Adresstraat 1A',
                dummy: 'A',
                something: 3
            }
        });
    });

    it('triggers the SHOW_DETAIL action with the display and geometry as it\'s payload', function () {
        getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint
            }
        });
    });

    it('loads new API data and triggers a new SHOW_DETAIL action when the endpoint changes', function () {
        var component,
            scope,
            endpoint;

        expect(store.dispatch).not.toHaveBeenCalled();

        // Set an initial endpoint
        endpoint = 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/';
        component = getComponent(endpoint, false);
        scope = component.isolateScope();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Adresstraat 1A',
                dummy: 'A',
                something: 3
            }
        });
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint
            }
        });

        // Change the endpoint
        scope.vm.endpoint = 'http://www.fake-endpoint.com/brk/object/789/';
        $rootScope.$apply();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Een of ander kadastraal object',
                dummy: 'B',
                something: -90
            }
        });
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Een of ander kadastraal object',
                geometry: mockedGeometryMultiPolygon
            }
        });
    });

    it('sets the SHOW_DETAIL geometry payload to null if there is no geometry', function () {
        getComponent('http://www.fake-endpoint.com/brk/subject/123/');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: jasmine.objectContaining({
                geometry: null
            })
        });
    });

    it('sets the center location of the geometry on the scope (for the straatbeeld thumbnail)', function () {
        var component,
            scope;

        // Something with geometry (converted from RD to WGS84)
        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/');
        scope = component.isolateScope();
        expect(scope.vm.location).toEqual([51.123, 3.123]);

        // Something without geometry
        scope.vm.endpoint = 'http://www.fake-endpoint.com/brk/subject/123/';
        scope.$apply();
        expect(scope.vm.location).toBeNull();
    });
});
