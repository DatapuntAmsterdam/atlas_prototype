describe('The dp-straatbeeld-thumbnail component', () => {
    var $compile,
        $rootScope,
        store,
        $q,
        api,
        hasMockedThumbnail,
        httpStatus,
        response,
        finishApiCall;

    beforeEach(() => {
        angular.mock.module(
            'dpShared',
            {
                store: {
                    dispatch: angular.noop,
                    subscribe: angular.noop,
                    getState: angular.noop
                },
                api: {
                    getByUrl: function () {
                        var q = $q.defer();

                        finishApiCall = () => {
                            if (httpStatus && httpStatus !== 200) {
                                response = {
                                    status: httpStatus
                                };
                                q.reject(response);
                            } else {
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
                            }
                            $rootScope.$apply();
                        };
                        return q.promise;
                    }
                },
                sharedConfig: {
                    STRAATBEELD_THUMB_URL: 'http://fake.straatbeeld.url/path/',
                    RADIUS: 50,
                    THUMBNAIL_WIDTH: 240
                }
            }, $provide => {
                $provide.factory('dpLoadingIndicatorDirective', () => ({}));

                $provide.factory('dpLinkDirective', () => ({}));
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _$q_, _api_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            $q = _$q_;
            api = _api_;
        });

        hasMockedThumbnail = true;
        httpStatus = 200;
        response = null;

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

    it('when it cannot find a thumbnail it shows a message', () => {
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

    it('shows a message when the response is a 404 not found', () => {
        httpStatus = 404;
        var component = getComponent([52, 4]);
        var scope = component.isolateScope();

        finishApiCall();

        expect(response.errorHandled).toBeTruthy();

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

    it('does not mark error handled when status is neither 200 nor 404', () => {
        httpStatus = 500;
        var component = getComponent([52, 4]);
        var scope = component.isolateScope();

        finishApiCall();

        expect(response.errorHandled).toBeFalsy();

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

    it('waits for a valid location to be present', () => {
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

    it('shows a thumbnail when thumbnail is found', () => {
        hasMockedThumbnail = true;
        var component = getComponent([52, 4]);
        var scope = component.isolateScope();

        finishApiCall();

        expect(component.find('.qa-found-no-straatbeeld').length).toBe(0);
        expect(component.find('img').attr('src')).toBe('http://example.com/example.png');
        expect(scope.vm.isLoading).toBe(false);
    });

    it('shows a loading indicator when loading', () => {
        var component = getComponent([52, 4]);
        var scope = component.isolateScope();
        expect(component.find('dp-loading-indicator').length).toBe(1);
        expect(component.find('dp-loading-indicator').attr('is-loading')).toBe('vm.isLoading');

        expect(component.find('img').length).toBe(0);
        expect(component.find('.qa-found-no-straatbeeld').length).toBe(0);
        expect(scope.vm.isLoading).toBe(true);
    });
});
