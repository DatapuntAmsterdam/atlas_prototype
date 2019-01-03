import { features } from '../../../../src/shared/environment';
import { toDatasetsTableWithFilter } from '../../../../src/store/redux-first-router';
import { DATASET_ROUTE_MAPPER } from '../../../../src/shared/ducks/data-selection/constants';

describe('The dp-data-selection-link component', () => {
    let $compile,
        $rootScope,
        store;

    beforeEach(() => {
        angular.mock.module(
            'dpDetail',
            {
                store: {
                    dispatch: angular.noop
                }
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
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
        expect(store.dispatch).toHaveBeenCalledWith(
            toDatasetsTableWithFilter(DATASET_ROUTE_MAPPER.bag, activeFilters)
        );
    });

    it('has links to the data-selection for HR', () => {
        const activeFilters = { stadsdeel_naam: 'Noord', buurt_naam: 'Ghetto C' };
        const component = getComponent(activeFilters);

        component.find('dp-link button').click();
        expect(store.dispatch).toHaveBeenCalledWith(
            toDatasetsTableWithFilter(DATASET_ROUTE_MAPPER.hr, activeFilters)
        );
    });

    it('has links to the data-selection for BRK', () => {
        const activeFilters = { stadsdeel_naam: 'Noord', buurt_naam: 'Ghetto C' };
        const component = getComponent(activeFilters);
        if (features.eigendommen) {
            component.find('dp-link button').click();
            expect(store.dispatch).toHaveBeenCalledWith(
                toDatasetsTableWithFilter(DATASET_ROUTE_MAPPER.brk, activeFilters)
            );
        }
    });
});
