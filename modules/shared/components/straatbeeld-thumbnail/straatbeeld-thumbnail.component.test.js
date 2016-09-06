describe('The dp-straatbeeld-thumbnail component', function () {
    var $compile,
        $rootScope,
        $q,
        hasNearbyPanorama,
        api,
        store,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                sharedConfig: {
                    STRAATBEELD_THUMB_URL: 'http://fake.straatbeeld.url/path/'
                },
                api: {
                    getByUrl: function () {
                        var q = $q.defer(),
                            response;

                        if (hasNearbyPanorama) {
                            response = {
                                url: 'http://www.example.com/panorama-plaatjes/abf123/',
                                heading: 0
                            };
                        } else {
                            response = [];
                        }

                        q.resolve(response);

                        return q.promise;
                    }
                },
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _api_, _store_, _ACTIONS_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            api = _api_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(api, 'getByUrl').and.callThrough();
        spyOn(store, 'dispatch');
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

    describe('when a panorama has been found', function () {
        beforeEach(function() {
            hasNearbyPanorama = true;
        });

        it('shows a thumbnail based on a location', function () {
            var component = getComponent([52.369, 4.963]);
            expect(component.find('img').attr('src'))
                .toBe('http://www.example.com/panorama-plaatjes/abf123/');
        });

        it('wraps the thumbnail inside a button that triggers FETCH_STRAATBEELD', function () {
            var component = getComponent([52.369, 4.963]);

            expect(component.find('button img')).toBeDefined();
            expect(component.find('button').length).toBe(1);
            expect(component.find('img').length).toBe(1);

            expect(component.find('button').click());

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_STRAATBEELD,
                payload: { id: [ 52.369, 4.963 ], heading: 0 }
            });
        });
    });

    describe('when there is no nearby panorama', function () {
        beforeEach(function () {
            hasNearbyPanorama = false;
        });

        it('shows a message that there is nothing to show here', function () {
             var component = getComponent([52.369, 4.963]);
             expect( component.find('p').text()).toBe('Geen straatbeeld beschikbaar.');
        });
    });
});