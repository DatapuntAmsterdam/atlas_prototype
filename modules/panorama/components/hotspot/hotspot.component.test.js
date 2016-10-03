describe('The dp-hotspot directive', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module(
            'dpPanorama',
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

        directive = getComponent(1, 0);
        expect(directive.find('button').attr('style')).toContain('width: 80px; height: 80px;');

        directive = getComponent(1, 11);
        expect(directive.find('button').attr('style')).toContain('width: 30px; height: 30px;');

        directive = getComponent(1, 5.5);
        expect(directive.find('button').attr('style')).toContain('width: 55px; height: 55px;');

       
       
        
    });
    it('Hotspot distance higher than maxdistance should be minSize', function() {
        var directive;

        directive = getComponent(1, 12);
        expect(directive.find('button').attr('style')).toContain('width: 30px; height: 30px;');
    });



    it('buttons have a minimum size regardless of the distance', function () {
        var directive = getComponent(1, 1000);
        expect(directive.find('button').attr('style')).toContain('width: 30px; height: 30px;');
    });

    it('clicking the hotspot will trigger the FETCH_PANORAMA action', function () {
        var directive;

        spyOn(store, 'dispatch');

        directive = getComponent('ABC', 20);
        directive.find('button').click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_PANORAMA,
            payload: { id: 'ABC', isInitial: false }
        });
    });

    it('has a screen reader fallback text', function () {
        var directive;

        directive = getComponent(1, 5);
        expect(directive.find('button .u-sr-only').text()).toContain('Navigeer naar deze locatie');
    });
});
