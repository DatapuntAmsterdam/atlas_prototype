describe('The dp-cards-header component', () => {
    let $compile,
        $rootScope,
        store,
        ACTIONS;

    beforeEach(() => {
        angular.mock.module(
            'dpHeader',
            {
                store: {
                    dispatch: angular.noop
                }
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

    function getComponent (query) {
        let component,
            element,
            scope;

        element = document.createElement('dp-cards-header');
        element.setAttribute('query', query);

        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('clears the search query when navigating back to \'home\'', () => {
        let component = getComponent('verkeer');

        component.find('.qa-link-to-home').click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DATA_SELECTION,
            payload: jasmine.objectContaining({
                query: null
            })
        });
    });
});
