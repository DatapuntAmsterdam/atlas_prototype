describe('The atlas-straatbeeld-thumbnail component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                detailConfig: {
                    STRAATBEELD_THUMB_URL: 'http://fake.straatbeeld.url/path/'
                },
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

    it('loads a thumbnail based on a location', function () {
        var component = getComponent([52.369, 4.963]);

        expect(component.find('img').attr('src'))
            .toBe('http://fake.straatbeeld.url/path/?lat=52.369&lon=4.963&width=240&height=135');
    });

    it('wraps the thumbnail inside a button that triggers FETCH_STRAATBEELD', function () {
        var component = getComponent([52.369, 4.963]);

        expect(component.find('button img')).toBeDefined();
        expect(component.find('button').length).toBe(1);
        expect(component.find('img').length).toBe(1);

        expect(component.find('button').click());

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_STRAATBEELD,
            payload: [52.369, 4.963]
        });
    });
});