describe('The dp-homepage component', () => {
    let $compile,
        $rootScope,
        store,
        ACTIONS;

    beforeEach(() => {
        angular.mock.module(
            'dpPage',
            {
                store: {
                    dispatch: angular.noop
                }
            },
            $provide => {
                $provide.constant('HOMEPAGE_CONFIG', {
                    PANORAMA: {
                        id: 'abc789',
                        heading: 45
                    }
                });
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _ACTIONS_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(store, 'dispatch');
    });

    function getComponent () {
        const element = document.createElement('dp-homepage');
        const scope = $rootScope.$new();

        const component = $compile(element)(scope);
        $rootScope.$apply();

        return component;
    }

    it('clicking on straatbeeld will dispatch FETCH_STRAATBEELD_BY_ID', () => {
        const component = getComponent();
        component.find('.qa-straatbeeld-link button').click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_STRAATBEELD_BY_ID,
            payload: jasmine.objectContaining({
                id: 'abc789',
                heading: 45,
                isInitial: true, // isInitial has to be true to make sure a new history entry is added
                isFullscreen: false
            })
        });
    });
});
