describe('the dp-detail component', function () {
    var $compile,
        $rootScope,
        $q,
        store,
        user,
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

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/' ||
                                endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/geo/404/') {
                            q.resolve({
                                _display: 'Adresstraat 1A',
                                dummy: 'A',
                                something: 3,
                                naam: 'naam'
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
                                something: 4,
                                is_natuurlijk_persoon: true
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/subject/456/') {
                            q.resolve({
                                _display: 'Ferdinand de Vries BV',
                                dummy: 'C',
                                something: 4,
                                is_natuurlijk_persoon: false
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/subject/404/') {
                            q.reject();
                        }

                        return q.promise;
                    }
                },
                endpointParser: {
                    getSubject: function (endpoint) {
                        let subject = '';

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/') {
                            subject = 'nummeraanduiding';
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            subject = 'object';
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/subject/123/') {
                            subject = 'subject';
                        }

                        return subject;
                    },
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
                        } else if (endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/geo/404/') {
                            q.reject();
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

        angular.mock.module(
            'dpShared',
            {
                user: {
                    isLoggedIn: false,
                    getStatus: function () {
                        return {
                            isLoggedIn: this.isLoggedIn
                        };
                    }
                }
            }
        );

        angular.mock.inject(function (
            _$compile_,
            _$rootScope_,
            _$q_,
            _store_,
            _ACTIONS_,
            _user_,
            _api_,
            _endpointParser_,
            _geometry_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            user = _user_;
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
        element.setAttribute('reload', 'reload');

        scope = $rootScope.$new();
        scope.endpoint = endpoint;
        scope.isLoading = isLoading;
        scope.reload = false;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('puts data on the scope based on the endpoint', function () {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
        scope = component.isolateScope();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Adresstraat 1A',
                dummy: 'A',
                something: 3,
                naam: 'naam'
            }
        });
    });

    it('puts a template URL on the scope based on the endpoint', function () {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
        scope = component.isolateScope();

        expect(scope.vm.includeSrc).toBe('modules/detail/components/detail/templates/bag/nummeraanduiding.html');
    });

    it('puts a filter selection on the scope based on the endpoint', function () {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
        scope = component.isolateScope();

        expect(scope.vm.filterSelection).toEqual({
            nummeraanduiding: 'naam'
        });
    });

    it('triggers the SHOW_DETAIL action with the display and geometry as its payload', function () {
        getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint,
                isFullscreen: false
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
                something: 3,
                naam: 'naam'
            }
        });
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint,
                isFullscreen: false
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
                geometry: mockedGeometryMultiPolygon,
                isFullscreen: false
            }
        });
    });

    it('loads new API data and triggers a new SHOW_DETAIL action when the reload flag has been set', function () {
        var component,
            scope,
            endpoint;

        expect(store.dispatch).not.toHaveBeenCalled();

        // Set an initial endpoint
        endpoint = 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/';
        component = getComponent(endpoint, false);
        scope = component.isolateScope();

        // Turn on the reload flag
        scope.vm.reload = true;
        $rootScope.$apply();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Adresstraat 1A',
                dummy: 'A',
                something: 3,
                naam: 'naam'
            }
        });
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint,
                isFullscreen: false
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

    it('shows a message that more info is available for natuurlijke personen and anonymous users', function () {
        var component,
            scope;

        user.isLoggedIn = false;

        component = getComponent('http://www.fake-endpoint.com/brk/subject/123/');
        scope = component.isolateScope();

        expect(scope.vm.isMoreInfoAvailable).toBe(true);

        scope.vm.endpoint = 'http://www.fake-endpoint.com/brk/subject/456/';
        scope.$apply();
        expect(scope.vm.isMoreInfoAvailable).toBe(false);
    });

    it('does not show a message that more info is available when a user is logged in', function () {
        var component,
            scope;

        user.isLoggedIn = true;

        component = getComponent('http://www.fake-endpoint.com/brk/subject/123/');
        scope = component.isolateScope();

        expect(scope.vm.isMoreInfoAvailable).toBe(false);

        scope.vm.endpoint = 'http://www.fake-endpoint.com/brk/subject/456/';
        scope.$apply();
        expect(scope.vm.isMoreInfoAvailable).toBe(false);

        user.isLoggedIn = false;
        scope.$apply();
        expect(scope.vm.isMoreInfoAvailable).toBe(false);
    });

    it('gracefully handles a 404 with no data', function () {
        getComponent('http://www.fake-endpoint.amsterdam.nl/brk/subject/404/');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {}
        });
    });

    it('gracefully handles a 404 from geo json', function () {
        getComponent('http://www.fake-endpoint.amsterdam.nl/brk/geo/404/');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {}
        });
    });
});
