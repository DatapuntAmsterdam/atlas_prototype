describe('The dp-straatbeeld-thumbnail component', function () {
    var $compile,
        $rootScope,
        store,
        $q,
        api,
        hasMockedThumbnail,
        finishApiCall;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                sharedConfig: {
                    STRAATBEELD_THUMB_URL: 'http://fake.straatbeeld.url/path/',
                    RADIUS: 50,
                    THUMBNAIL_WIDTH: 240
                },
                store: {
                    dispatch: angular.noop,
                    subscribe: angular.noop,
                    getState: angular.noop
                },
                applicationState: {
                    getReducer: function () {
                        return function (state, action) {
                            return action;
                        };
                    },
                    getStateToUrl: function () {
                        return {
                            create: function (state) {
                                return state;
                            }
                        };
                    }
                },
                api: {
                    getByUrl: function () {
                        var q = $q.defer();

                        finishApiCall = function () {
                            var response;

                            if (hasMockedThumbnail) {
                                response = {
                                    url: 'http://example.com/example.png',
                                    pano_id: 'ABC',
                                    heading: 179
                                };
                            } else {
                                response = [];
                            }
                            q.resolve(response);
                            $rootScope.$apply();
                        };
                        return q.promise;
                    }
                }

            }, function ($provide) {
                $provide.factory('dpLoadingIndicatorDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _$q_, _api_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            $q = _$q_;
            api = _api_;
        });

        hasMockedThumbnail = true;

        spyOn(store, 'dispatch');
        spyOn(api, 'getByUrl').and.callThrough();
    });

    function getComponent (location) {
        var component,
            element,
            scope;

        element = document.createElement('dp-straatbeeld-thumbnail');
        element.setAttribute('location', 'location');

        scope = $rootScope.$new();
        scope.location = location;

        component = $compile(element)(scope);

        scope.$apply();

        return component;
    }

    it('when it cannot find a thumbnail it shows a message', function () {
        hasMockedThumbnail = false;
        var component = getComponent([52, 4]);
        var scope = component.isolateScope();

        finishApiCall();

        expect(component.find('img').length).toBe(0);
        expect(scope.vm.isLoading).toBe(false);

        expect(component.find('.qa-found-no-straatbeeld').text())
            .toContain(
                'Geen panoramabeeld beschikbaar (binnen 50m van deze locatie).'
            );
        expect(component.find('.qa-found-no-straatbeeld').text())
            .toContain(
                'Tip: kies via de kaart een nabije locatie.'
            );
    });

    it('waits for a valid location to be present', function () {
        hasMockedThumbnail = true;
        var component = getComponent();
        var scope = component.isolateScope();

        finishApiCall();

        expect(component.find('.qa-found-no-straatbeeld').length).toBe(1);
        expect(component.find('img').attr('src')).toBeUndefined();
        expect(scope.vm.isLoading).toBeUndefined();

        scope.vm.location = [1, 2];
        $rootScope.$apply();

        expect(component.find('.qa-found-no-straatbeeld').length).toBe(0);
        expect(component.find('img').attr('src')).toBeUndefined();
        expect(scope.vm.isLoading).toBe(true);

        finishApiCall();

        expect(component.find('.qa-found-no-straatbeeld').length).toBe(0);
        expect(component.find('img').attr('src')).toBe('http://example.com/example.png');
        expect(scope.vm.isLoading).toBe(false);
    });

    it('shows a thumbnail when thumbnail is found', function () {
        hasMockedThumbnail = true;
        var component = getComponent([52, 4]);
        var scope = component.isolateScope();

        finishApiCall();

        expect(component.find('.qa-found-no-straatbeeld').length).toBe(0);
        expect(component.find('img').attr('src')).toBe('http://example.com/example.png');
        expect(scope.vm.isLoading).toBe(false);
    });

    it('shows a loading indicator when loading', function () {
        var component = getComponent([52, 4]);
        var scope = component.isolateScope();
        expect(component.find('dp-loading-indicator').length).toBe(1);
        expect(component.find('dp-loading-indicator').attr('is-loading')).toBe('vm.isLoading');

        expect(component.find('img').length).toBe(0);
        expect(component.find('.qa-found-no-straatbeeld').length).toBe(0);
        expect(scope.vm.isLoading).toBe(true);
    });

    it('sets the hyperlink url on basis of the state and payload', function () {
        var component = getComponent([52, 4]);

        finishApiCall();

        expect(component.find('a').attr('ng-href')).toEqual(
            '{"type":{"id":"FETCH_STRAATBEELD","ignore":true},' +
            '"payload":{"id":"ABC","heading":179,"isInitial":true,"isFullscreen":true}}');
    });
});
