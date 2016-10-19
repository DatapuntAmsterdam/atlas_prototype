describe('The dp-straatbeeld-thumbnail component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS,
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
                    dispatch: angular.noop
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

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _ACTIONS_, _$q_, _api_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
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
        var m = 'Geen panorama beschikbaar (binnen 50m van deze locatie). Tip: kies via de kaart een nabije locatie.';

        finishApiCall();

        expect(component.find('img').length).toBe(0);
        expect(scope.vm.isLoading).toBe(false);
        expect(component.find('.qa-found-no-straatbeeld').text()).toContain(m);
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

    it('responds to click on thumbnail', function () {
        var component = getComponent([52, 4]);

        finishApiCall();

        component.find('button').trigger('click');

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_STRAATBEELD,
            payload: {
                id: 'ABC',
                heading: 179,
                isInitial: true
            }
        });
    });
});
