import { fetchPanoramaRequest } from '../../../../src/shared/ducks/panorama/actions';

describe('The dp-hotspot directive', function () {
    var $compile,
        $rootScope,
        store;

    beforeEach(function () {
        angular.mock.module(
            'dpStraatbeeld',
            {
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
        });
    });

    function getComponent (sceneId, distance, pitch, year) {
        var directive,
            element,
            scope;

        element = document.createElement('dp-hotspot');
        element.setAttribute('scene-id', 'sceneId');
        element.setAttribute('distance', 'distance');
        element.setAttribute('pitch', 'pitch');
        element.setAttribute('year', 'year');

        scope = $rootScope.$new();
        scope.sceneId = sceneId;
        scope.distance = distance;
        scope.pitch = pitch;
        scope.year = year;

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('creates a button with dimensions and rotations based on the distance', function () {
        var directive;

        directive = getComponent('ABC', 4, 0.1, 2016);
        expect(directive.find('.qa-hotspot-rotation').attr('style')).toContain('width: 102px; height: 102px;');
        expect(directive.find('.qa-hotspot-rotation').attr('style')).toContain('rotateX(75.99264427091398deg)');

        directive = getComponent('ABC', 10, 0.15, 2017);
        expect(directive.find('.qa-hotspot-rotation').attr('style')).toContain('width: 41px; height: 41px;');
        expect(directive.find('.qa-hotspot-rotation').attr('style')).toContain('rotateX(72.98896640637098deg)');

        directive = getComponent('ABC', 15, 0.2, 2016);
        expect(directive.find('.qa-hotspot-rotation').attr('style')).toContain('width: 27px; height: 27px;');
        expect(directive.find('.qa-hotspot-rotation').attr('style')).toContain('rotateX(69.82655838309783deg)');

        directive = getComponent('ABC', 21, 0.5, 2017);
        expect(directive.find('.qa-hotspot-rotation').attr('style')).toContain('width: 20px; height: 20px;');
        expect(directive.find('.qa-hotspot-rotation').attr('style')).toContain('rotateX(48.35211024345884deg)');
    });

    it('hotspots have a minimum and maximum size as if they in the 4-21 meter range', function () {
        var directive,
            minimumStyle,
            maximumStyle;

        // Minimum size
        directive = getComponent('ABC', 4, 0.1, 2016);
        minimumStyle = directive.find('.qa-hotspot-button').attr('style');

        directive = getComponent('ABC', 3, 0.1, 2017);
        expect(minimumStyle).toBe(directive.find('.qa-hotspot-button').attr('style'));

        // Maximum size
        directive = getComponent('ABC', 21, 0.1, 2016);
        maximumStyle = directive.find('.qa-hotspot-button').attr('style');

        directive = getComponent('ABC', 22, 0.1, 2017);
        expect(maximumStyle).toBe(directive.find('.qa-hotspot-button').attr('style'));
    });

    it('hotspots have the correct year attached to them', function () {
        let directive;

        // 2016
        directive = getComponent('ABC', 4, 0.1, 2016);
        expect(directive.find('.qa-hotspot-button').attr('class')).toContain('c-hotspot--year-2016');

        // 2017
        directive = getComponent('ABC', 4, 0.3, 2017);
        expect(directive.find('.qa-hotspot-button').attr('class')).toContain('c-hotspot--year-2017');
    });

    it('clicking the hotspot will trigger the page change action', function () {
        const id = 'ABC';

        spyOn(store, 'dispatch');
        const directive = getComponent(id, 20, 0.5, 2016);
        directive.find('button').click();

        expect(store.dispatch).toHaveBeenCalledWith(fetchPanoramaRequest(id));
    });

    it('has a screen reader fallback text', function () {
        var directive;

        directive = getComponent('ABC', 5, 0.7, 2017);
        expect(directive.find('button .u-sr-only').text()).toContain('Navigeer naar deze locatie');
    });
});
