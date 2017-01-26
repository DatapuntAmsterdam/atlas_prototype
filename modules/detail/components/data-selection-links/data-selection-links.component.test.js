describe('The dp-data-selection-link component', () => {
    let $compile,
        $rootScope,
        store,
        ACTIONS;

    beforeEach(() => {
        angular.mock.module(
            'dpDetail',
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

    function getComponent (activeFilters) {
        let component,
            element,
            scope;

        element = document.createElement('dp-data-selection-links');
        element.setAttribute('active-filters', 'activeFilters');

        scope = $rootScope.$new();
        scope.activeFilters = activeFilters;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('renders a header for both BAG and HR', () => {
        const component = getComponent({});

        expect(component.find('.qa-bag dp-stelselpedia-header').attr('definition')).toBe('NUMMERAANDUIDING');
        expect(component.find('.qa-bag dp-stelselpedia-header').attr('use-plural')).toBe('true');

        expect(component.find('.qa-hr dp-stelselpedia-header').attr('definition')).toBe('VESTIGING');
        expect(component.find('.qa-hr dp-stelselpedia-header').attr('use-plural')).toBe('true');
    });

    it('has links to the LIST view of data-selection for both BAG and HR', () => {
        const activeFilters = {stadsdeel_naam: 'Noord', buurt_naam: 'Ghetto C'};
        let component = getComponent(activeFilters);

        component.find('dp-link button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DATA_SELECTION,
            payload: {
                dataset: 'bag',
                view: 'LIST',
                filters: activeFilters,
                page: 1
            }
        });

        store.dispatch.calls.reset();

        component.find('dp-link button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DATA_SELECTION,
            payload: {
                dataset: 'hr',
                view: 'LIST',
                filters: activeFilters,
                page: 1
            }
        });
    });
});
