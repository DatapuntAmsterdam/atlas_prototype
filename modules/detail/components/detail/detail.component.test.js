describe('the atlas-detail component', function() {
    var $compile,
        $rootScope,
        $q,
        store,
        ACTIONS,
        api,
        endpointParser,
        geometry,
        mockedGeometryPoint = {type: 'Point', coordinates: 'FAKE_NUMMERAANDUIDING_POINT'},
        mockedGeometryMultiPolygon = {type: 'MultiPolygon', coordinates: 'FAKE_KADASTRAAL_OBJECT_MULTIPOLYGON'};

    beforeEach(function() {
        angular.mock.module(
            'atlasDetail',
            {
                store: {
                    dispatch: function () {}
                },
                api: {
                    getByUrl: function (endpoint) {
                        var q = $q.defer();

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/') {
                            q.resolve({
                                dummy: 'A',
                                something: 3
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            q.resolve({
                                dummy: 'B',
                                something: -90
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/subject/123/') {
                            q.resolve({
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
                api = _api_;
                endpointParser = _endpointParser_;
                geometry = _geometry_;
            }
        );

        spyOn(store, 'dispatch');
    });

    function getComponent (endpoint, isLoading) {
        var component,
            element,
            scope;

        element = document.createElement('atlas-detail');
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
                dummy: 'A',
                something: 3
            }
        });
    });

    it('triggers the SHOW_DETAIL action with the geometry as it\'s payload', function () {
        getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: mockedGeometryPoint
        });
    });

    it('loads new API data and triggers a new SHOW_DETAIL action when the endpoint changes', function () {
        var component,
            scope,
            endpoint;

        expect(store.dispatch).not.toHaveBeenCalled();

        //Set an initial endpoint
        endpoint = 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/';
        component = getComponent(endpoint, false);
        scope = component.isolateScope();

        expect(scope.vm.apiData).toEqual({
            results: {
                dummy: 'A',
                something: 3
            }
        });
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: mockedGeometryPoint
        });

        //Change the endpoint
        scope.vm.endpoint = 'http://www.fake-endpoint.com/brk/object/789/';
        $rootScope.$apply();

        expect(scope.vm.apiData).toEqual({
            results: {
                dummy: 'B',
                something: -90
            }
        });
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: mockedGeometryMultiPolygon
        });
    });

    it('sets the SHOW_DETAIL location payload to null if there is no geometry', function () {
        var component;

        component = getComponent('http://www.fake-endpoint.com/brk/subject/123/');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: null
        });
    });
});