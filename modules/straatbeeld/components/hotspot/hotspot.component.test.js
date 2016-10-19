describe('The dp-hotspot directive', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module(
            'dpStraatbeeld',
            {
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _ACTIONS_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });
    });

    function getComponent (sceneId, distance) {
        var directive,
            element,
            scope;

        element = document.createElement('dp-hotspot');
        element.setAttribute('scene-id', 'sceneId');
        element.setAttribute('distance', 'distance');

        scope = $rootScope.$new();
        scope.sceneId = sceneId;
        scope.distance = distance;

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('creates a button with dimensions based on the distance', function () {
        var directive;

        directive = getComponent('ABC', 4);
        expect(directive.find('button').attr('style')).toContain('width: 51px; height: 51px;');

        directive = getComponent('ABC', 10);
        expect(directive.find('button').attr('style')).toContain('width: 21px; height: 21px;');

        directive = getComponent('ABC', 15);
        expect(directive.find('button').attr('style')).toContain('width: 14px; height: 14px;');

        directive = getComponent('ABC', 21);
        expect(directive.find('button').attr('style')).toContain('width: 10px; height: 10px;');
    });

    it('hotspots have a minimum and maximum size as if they in the 4-21 meter range', function () {
        var directive,
            minimumStyle,
            maximumStyle;

        // Minimum size
        directive = getComponent('ABC', 4);
        minimumStyle = directive.find('button').attr('style');

        directive = getComponent('ABC', 3);
        expect(minimumStyle).toBe(directive.find('button').attr('style'));

        // Maximum size
        directive = getComponent('ABC', 21);
        maximumStyle = directive.find('button').attr('style');

        directive = getComponent('ABC', 22);
        expect(maximumStyle).toBe(directive.find('button').attr('style'));
    });

    it('clicking the hotspot will trigger the FETCH_STRAATBEELD action', function () {
        var directive;

        spyOn(store, 'dispatch');

        directive = getComponent('ABC', 20);
        directive.find('button').click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_STRAATBEELD,
            payload: {
                id: 'ABC',
                isInitial: false
            }
        });
    });

    it('has a screen reader fallback text', function () {
        var directive;

        directive = getComponent('ABC', 5);
        expect(directive.find('button .u-sr-only').text()).toContain('Navigeer naar deze locatie');
    });
});
