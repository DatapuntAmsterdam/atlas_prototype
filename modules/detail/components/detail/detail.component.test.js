import * as piwik from '../../../../src/shared/services/piwik-tracker/piwik-tracker';

describe('the dp-detail component', () => {
    var $compile,
        $rootScope,
        $q,
        store,
        ACTIONS,
        api,
        mockedUser,
        mockedGeometryPoint = {
            type: 'Point',
            coordinates: 'FAKE_NUMMERAANDUIDING_POINT'
        },
        mockedGeometryMultiPolygon = {
            type: 'MultiPolygon',
            coordinates: 'FAKE_KADASTRAAL_OBJECT_MULTIPOLYGON'
        };

    const grondexploitatieEndPoint = 'http://www.fake-endpoint.com/grondexploitatie/project/987/';
    const naturalPersonEndPoint = 'http://www.fake-endpoint.com/brk/subject/123/';
    const noneNaturalPersonEndPoint = 'http://www.fake-endpoint.com/brk/subject/456/';
    const dcatdEndPoint = 'http://www.fake-endpoint.com/dcatd/datasets/789/';

    beforeEach(() => {
        angular.mock.module(
            'dpDetail', {
                store: {
                    dispatch: () => {},
                    getState: angular.noop
                },
                api: {
                    getByUrl: function (endpoint) { // eslint-disable-line complexity
                        var q = $q.defer();

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/' ||
                            endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/geo/404/' ||
                            endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/'
                        ) {
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
                        } else if (endpoint === grondexploitatieEndPoint) {
                            q.resolve({
                                _display: 'My grex',
                                dummy: 'G'
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.com/handelsregister/vestiging/987/') {
                            q.resolve({
                                _display: 'Een of andere vestiging',
                                dummy: 'D',
                                something: 666
                            });
                        } else if (endpoint === naturalPersonEndPoint) {
                            q.resolve({
                                _display: 'Ferdinand de Vries',
                                dummy: 'C',
                                something: 4,
                                is_natuurlijk_persoon: true
                            });
                        } else if (endpoint === noneNaturalPersonEndPoint) {
                            q.resolve({
                                _display: 'Ferdinand de Vries BV',
                                dummy: 'C',
                                something: 4,
                                is_natuurlijk_persoon: false
                            });
                        } else if (endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/subject/404/') {
                            q.reject();
                        } else if (endpoint === dcatdEndPoint) {
                            q.resolve({'dct:description': 'description'});
                        }

                        return q.promise;
                    }
                },
                endpointParser: {
                    getParts: function (endpoint) {
                        let category = '';
                        let subject = '';

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/') {
                            category = 'bag';
                            subject = 'nummeraanduiding';
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            category = 'brk';
                            subject = 'object';
                        } else if (endpoint === 'http://www.fake-endpoint.com/handelsregister/vestiging/987/') {
                            category = 'handelsregister';
                            subject = 'vestiging';
                        } else if (endpoint === grondexploitatieEndPoint) {
                            category = 'grondexploitatie';
                            subject = 'project';
                        } else if (endpoint === naturalPersonEndPoint) {
                            category = 'brk';
                            subject = 'subject';
                        } else if (endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/') {
                            subject = 'api';
                        } else if (endpoint === dcatdEndPoint) {
                            category = 'dcatd';
                            subject = 'datasets';
                        }

                        return [category, subject];
                    },
                    getTemplateUrl: function (endpoint) {
                        var templateUrl = 'modules/detail/components/detail/templates/';

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/' ||
                            endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/') {
                            templateUrl += 'bag/nummeraanduiding';
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            templateUrl += 'brk/object';
                        } else if (endpoint === naturalPersonEndPoint) {
                            templateUrl += 'brk/subject';
                        }

                        templateUrl += '.html';

                        return templateUrl;
                    }
                },
                dataFormatter: {
                    formatData: angular.identity
                },
                geometry: {
                    getGeoJSON: function (endpoint) {
                        var q = $q.defer();

                        if (endpoint === 'http://www.fake-endpoint.com/bag/nummeraanduiding/123/' ||
                            endpoint === 'http://fake-endpoint.amsterdam.nl/api/subject/123/') {
                            q.resolve(mockedGeometryPoint);
                        } else if (endpoint === 'http://www.fake-endpoint.com/brk/object/789/') {
                            q.resolve(mockedGeometryMultiPolygon);
                        } else if (endpoint === naturalPersonEndPoint) {
                            q.resolve(null);
                        } else if (endpoint === 'http://www.fake-endpoint.amsterdam.nl/brk/geo/404/') {
                            q.reject();
                        }

                        return q.promise;
                    }
                },
                geojson: {
                    getCenter: () => {
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
                },
                markdownParser: {
                    parse: angular.noop
                }
            },
            function ($provide) {
                $provide.factory('ngIncludeDirective', () => {
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
            _api_
        ) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            api = _api_;
        });

        mockedUser = {
            authenticated: false,
            scopes: ['HR/R'],
            name: ''
        };

        spyOn(store, 'dispatch');
        spyOn(store, 'getState').and.returnValue({
            mapClickLocation: { latitude: 52.654, longitude: 4.987 }
        });
        spyOn(api, 'getByUrl').and.callThrough();
        spyOn(piwik, 'default').and.callFake(angular.noop);
    });

    function getComponent (endpoint, isLoading, skippedSearchResults = false, show = true, catalogFilters = undefined) {
        var component,
            element,
            scope;

        element = document.createElement('dp-detail');
        element.setAttribute('show', 'show');
        element.setAttribute('endpoint', '{{endpoint}}');
        element.setAttribute('is-loading', 'isLoading');
        element.setAttribute('reload', 'reload');
        element.setAttribute('user', 'user');
        element.setAttribute('skipped-search-results', 'skippedSearchResults');
        element.setAttribute('catalog-filters', 'catalogFilters');

        scope = $rootScope.$new();
        scope.show = show;
        scope.endpoint = endpoint;
        scope.isLoading = isLoading;
        scope.reload = false;
        scope.user = mockedUser;
        scope.skippedSearchResults = skippedSearchResults;
        scope.catalogFilters = catalogFilters;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('visibility', () => {
        it('is not visible when `show` is false while loading', () => {
            const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', true, true, false);
            expect(component.find('.qa-detail-content').length).toBe(0);
        });

        it('is not visible when `show` is false while not loading', () => {
            const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/',
                false, true, false);
            expect(component.find('.qa-detail-content').length).toBe(0);
        });

        it('is not visible when `show` is true while loading', () => {
            const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', true);
            expect(component.find('.qa-detail-content').length).toBe(0);
        });

        it('is visible when `show` is true while not loading', () => {
            const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
            expect(component.find('.qa-detail-content').length).toBe(1);
        });
    });

    it('puts data on the scope based on the endpoint', () => {
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

    it('puts data on the scope based on the hr endpoint', () => {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/handelsregister/vestiging/987/', false);
        scope = component.isolateScope();

        expect(scope.vm.apiData).toEqual({
            results: {
                _display: 'Een of andere vestiging',
                dummy: 'D',
                something: 666
            }
        });
    });

    it('puts a template URL on the scope based on the endpoint', () => {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
        scope = component.isolateScope();

        expect(scope.vm.includeSrc).toBe('modules/detail/components/detail/templates/bag/nummeraanduiding.html');
    });

    it('puts a filter selection on the scope based on the endpoint', () => {
        var component,
            scope;

        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);
        scope = component.isolateScope();

        expect(scope.vm.filterSelection).toEqual({
            nummeraanduiding: 'naam'
        });
    });

    it('triggers the SHOW_DETAIL and DETAIL_FULLSCREEN action with the display and geometry as its payload', () => {
        getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint
            }
        });

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.DETAIL_FULLSCREEN,
            payload: false
        });
    });

    it('triggers the SHOW_DETAIL and not DETAIL_FULLSCREEN action when skippedSearchResults is true', () => {
        getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false, true);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint
            }
        });

        expect(store.dispatch).not.toHaveBeenCalledWith({
            type: ACTIONS.DETAIL_FULLSCREEN,
            payload: false
        });
    });

    it('loads new API data and triggers a new SHOW_DETAIL and DETAIL_FULLSCREEN action when the endpoint ' +
        'changes', () => {
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
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint
            }
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.DETAIL_FULLSCREEN,
            payload: false
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
        expect(store.dispatch).toHaveBeenCalledTimes(4);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Een of ander kadastraal object',
                geometry: mockedGeometryMultiPolygon
            }
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.DETAIL_FULLSCREEN,
            payload: false
        });
    });

    it('loads new API data and triggers a new SHOW_DETAIL and DETAIL_FULLSCREEN action when the reload flag has been ' +
        'set', () => {
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
        expect(store.dispatch).toHaveBeenCalledTimes(4);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {
                display: 'Adresstraat 1A',
                geometry: mockedGeometryPoint
            }
        });
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.DETAIL_FULLSCREEN,
            payload: false
        });
    });

    it('sets the SHOW_DETAIL geometry payload to null if there is no geometry', () => {
        mockedUser.scopes = ['BRK/RS'];

        getComponent(naturalPersonEndPoint);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: jasmine.objectContaining({
                geometry: null
            })
        });
    });

    describe('the DETAIL_FULLSCREEN payload', () => {
        it('sets it to true when the subject is \'api\'', () => {
            getComponent('http://fake-endpoint.amsterdam.nl/api/subject/123/');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.DETAIL_FULLSCREEN,
                payload: true
            });
        });

        it('sets it to true when there is no geometry', () => {
            mockedUser.scopes = ['BRK/RS'];

            getComponent('http://www.fake-endpoint.com/brk/subject/123/');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.DETAIL_FULLSCREEN,
                payload: true
            });
        });

        it('sets it to false otherwise', () => {
            getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.DETAIL_FULLSCREEN,
                payload: false
            });
        });
    });

    it('sets the center location of the geometry on the scope (for the straatbeeld thumbnail)', () => {
        var component,
            scope;

        // Something with geometry (converted from RD to WGS84)
        component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/');
        scope = component.isolateScope();
        expect(scope.vm.location).toEqual([51.123, 3.123]);

        // Something without geometry
        scope.vm.endpoint = naturalPersonEndPoint;
        scope.$apply();
        expect(scope.vm.location).toBeNull();
    });

    it('gracefully handles a 404 with no data', () => {
        getComponent('http://www.fake-endpoint.amsterdam.nl/brk/subject/404/');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {}
        });
    });

    it('gracefully handles a 404 from geo json', () => {
        getComponent('http://www.fake-endpoint.amsterdam.nl/brk/geo/404/');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_DETAIL,
            payload: {}
        });
    });

    describe('"kadastraal subject" data', () => {
        it('should be fetched if is authenticated as EMPLOYEE', () => {
            mockedUser.scopes = ['BRK/RS'];

            getComponent(naturalPersonEndPoint);

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DETAIL,
                payload: jasmine.objectContaining({
                    geometry: null
                })
            });
        });
        it('should not fetch data if not authorized', () => {
            const component = getComponent(naturalPersonEndPoint);

            const scope = component.isolateScope();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DETAIL,
                payload: {}
            });

            expect(scope.vm.apiData).toBeUndefined();
            expect(store.dispatch).toHaveBeenCalledTimes(1);
        });
        it('should remove apiData if not authorized', () => {
            // Special case where user is logged out while on detail page and the user loses access to content
            mockedUser.scopes = ['BRK/RS'];
            const component = getComponent(naturalPersonEndPoint);
            const scope = component.isolateScope();
            store.dispatch.calls.reset();
            expect(scope.vm.apiData).toBeDefined(); // data shown

            mockedUser.scopes = []; // triggers $watch
            scope.$digest();

            expect(scope.vm.apiData).toBeUndefined();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DETAIL,
                payload: {}
            });
        });
    });

    describe('"grondexploitatie" data', () => {
        it('should be fetched if is authenticated as EMPLOYEE', () => {
            mockedUser.scopes = ['GREX/R'];

            getComponent(grondexploitatieEndPoint);
        });

        it('should not fetch data if not authorized', () => {
            const component = getComponent(grondexploitatieEndPoint);

            const scope = component.isolateScope();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_DETAIL,
                payload: {}
            });

            expect(scope.vm.apiData).toBeUndefined();
            expect(store.dispatch).toHaveBeenCalledTimes(1);
        });
    });

    describe('"dcatd" data', () => {
        it('should not fetch data when catalogFilters are not provided', () => {
            const component = getComponent(dcatdEndPoint);
            const scope = component.isolateScope();

            expect(scope.vm.apiData).toBeUndefined();
            expect(api.getByUrl).not.toHaveBeenCalled();
        });

        it('should fetch data when the catatalogFilters are set', () => {
            const component = getComponent(dcatdEndPoint, true, true, true, {});

            const scope = component.isolateScope();

            expect(scope.vm.apiData).not.toBeUndefined();
            expect(api.getByUrl).toHaveBeenCalled();
        });
    });

    describe('the geosearch button', () => {
        it('is not shown by default', () => {
            const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false);

            const scope = component.isolateScope();
            expect(scope.vm.geosearchButton).toBe(false);
        });

        it('is shown when skippedSearchResults is true', () => {
            const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false, true);

            const scope = component.isolateScope();
            expect(scope.vm.geosearchButton).toEqual([52.654, 4.987]);
        });

        it('it handles piwik on ng-click', () => {
            const component = getComponent('http://www.fake-endpoint.com/bag/nummeraanduiding/123/', false, true);
            component.find('.c-detail__geosearch').click();
            expect(piwik.default).toHaveBeenCalledWith(['trackEvent', 'navigation', 'show-all-results', '']);
        });
    });

    describe('the stripMarkdown function', () => {
        it('returns a value', () => {
            const component = getComponent('http://www.fake-endpoint.com/dcatd/datasets/789/', false);

            const scope = component.isolateScope();
            const vm = scope.vm;
            const description = vm.stripMarkdown('test description');

            expect(description).toEqual('test description');
        });
    });
});
