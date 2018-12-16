import { toPanorama } from '../../../../src/store/redux-first-router';
import PANORAMA_VIEW from '../../../../src/panorama/ducks/panorama-view';

import * as straatbeeld from '../../../../src/panorama/ducks/panorama';

describe('The dp-toggle-straatbeeld-fullscreen component', function () {
    let $compile,
        $rootScope,
        store,
        scope,
        id,
        heading;

    beforeEach(function () {
        angular.mock.module(
            'dpStraatbeeld',
            {
                store: {
                    dispatch: function () { },
                    getState: () => ({})
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        id = 42;
        heading = 99;
        straatbeeld.getPanoramaId = () => id;
        straatbeeld.getPanoramaHeading = () => heading;

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
        it('can open fullscreen', function () {
            // When straatbeeld is small
            const directive = getDirective(false);

            directive.find('.qa-toggle-straatbeeld-fullscreen').click();

            expect(store.dispatch).toHaveBeenCalledWith(toPanorama(id, heading, PANORAMA_VIEW.PANO));
        });

        it('can close fullscreen view', () => {
            const directive = getDirective(true);

            directive.find('.qa-toggle-straatbeeld-fullscreen').click();

            expect(store.dispatch).toHaveBeenCalledWith(toPanorama(id, heading, PANORAMA_VIEW.MAP_PANO));
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
