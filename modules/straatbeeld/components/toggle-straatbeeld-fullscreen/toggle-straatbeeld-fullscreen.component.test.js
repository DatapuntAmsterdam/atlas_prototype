import { UPDATE_MAP } from '../../../../src/map/ducks/map/map';

describe('The dp-toggle-straatbeeld-fullscreen component', function () {
    var $compile,
        $rootScope,
        store,
        scope,
        currentLocation = {
            type: 'atlasRouter/PANORAMA'
        };

    beforeEach(function () {
        angular.mock.module(
            'dpStraatbeeld',
            {
                store: {
                    dispatch: function () { },
                    getState: function () {
                        return {
                            location: currentLocation
                        };
                    }
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        spyOn(store, 'dispatch');
    });

    function getDirective (isFullscreen) {
        var result,
            element;

        element = document.createElement('dp-toggle-straatbeeld-fullscreen');

        element.setAttribute('is-fullscreen', 'isFullscreen');

        scope = $rootScope.$new();
        scope.isFullscreen = isFullscreen;

        result = $compile(element)(scope);
        scope.$apply();

        return result;
    }

    describe ('The fullscreen button for panorama', function () {
        it('can change a window-view straatbeeld to fullscreen', function () {
            let directive;

            // When straatbeeld is small
            directive = getDirective(false);

            directive.find('.qa-toggle-straatbeeld-fullscreen').click();
            $rootScope.$apply();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: UPDATE_MAP,
                payload: {
                    noRedirect: true,
                    route: 'atlasRouter/KAART_PANORAMA',
                    query: {
                        panoId: undefined,
                        panoHeading: undefined
                    }
                }
            });

            currentLocation = {
                type: 'atlasRouter/KAART_PANORAMA'
            };
            store.dispatch.calls.reset();
            // When straatbeeld is large
            directive = getDirective(true);

            directive.find('.qa-toggle-straatbeeld-fullscreen').click();
            $rootScope.$apply();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: UPDATE_MAP,
                payload: {
                    noRedirect: true,
                    route: 'atlasRouter/PANORAMA',
                    query: {
                        panoId: undefined,
                        panoHeading: undefined
                    }
                }
            });
        });

        it('sets a screen reader text', () => {
            let component;

            // When the map is small
            component = getDirective(false);
            expect(component.find('.u-sr-only').text()).toBe('Panoramabeeld vergroten');

            // When the map is large
            component = getDirective(true);
            expect(component.find('.u-sr-only').text()).toBe('Panoramabeeld verkleinen');
        });
    });
});
