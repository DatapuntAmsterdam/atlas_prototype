import { features } from '../../../../src/shared/environment';

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
        const element = document.createElement('dp-data-selection-links');
        element.setAttribute('active-filters', 'activeFilters');

        const scope = $rootScope.$new();
        scope.activeFilters = activeFilters;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('renders a header for BAG, HR and BRK', () => {
        const component = getComponent({});

        expect(component.find('.qa-bag dp-glossary-header').attr('definition')).toBe('NUMMERAANDUIDING');
        expect(component.find('.qa-bag dp-glossary-header').attr('use-plural')).toBe('true');

        expect(component.find('.qa-hr dp-glossary-header').attr('definition')).toBe('VESTIGING');
        expect(component.find('.qa-hr dp-glossary-header').attr('use-plural')).toBe('true');
        if (features.eigendommen) {
            expect(component.find('.qa-brk dp-glossary-header').attr('definition')).toBe('OBJECT');
            expect(component.find('.qa-brk dp-glossary-header').attr('use-plural')).toBe('true');
        }
    });

    it('has links to the TABLE view of data-selection for BAG', () => {
        const activeFilters = { stadsdeel_naam: 'Noord', buurt_naam: 'Ghetto C' };
        const component = getComponent(activeFilters);

        component.find('dp-link button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DATA_SELECTION,
            payload: {
                dataset: 'bag',
                view: 'TABLE',
                filters: activeFilters,
                page: 1
            }
        });
    });

    it('has links to the TABLE view of data-selection for HR', () => {
        const activeFilters = { stadsdeel_naam: 'Noord', buurt_naam: 'Ghetto C' };
        const component = getComponent(activeFilters);

        component.find('dp-link button').click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DATA_SELECTION,
            payload: {
                dataset: 'hr',
                view: 'TABLE',
                filters: activeFilters,
                page: 1
            }
        });
    });

    it('has links to the TABLE view of data-selection for BRK', () => {
        const activeFilters = { stadsdeel_naam: 'Noord', buurt_naam: 'Ghetto C' };
        const component = getComponent(activeFilters);

        if (features.eigendommen) {
            component.find('dp-link button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: {
                    dataset: 'brk',
                    view: 'TABLE',
                    filters: activeFilters,
                    page: 1
                }
            });
        }
    });
});
