import { addFilter, removeFilter } from '../../../../src/shared/ducks/filters/filters'
import * as dataSelectionConfig from '../../../../src/shared/services/data-selection/data-selection-config'

describe('The dp-sbi-filter component', () => {
  let $compile
  let $rootScope
  let store
  let availableFilters

  beforeEach(() => {
    // eslint-disable-next-line no-import-assign
    dataSelectionConfig.default = {
      datasets: {
        my_special_dataset: {
          FILTERS: [
            {
              slug: 'sbi_code',
            },
            {
              slug: 'sbi_l1',
            },
            {
              slug: 'sbi_l2',
            },
          ],
        },
      },
    }

    angular.mock.module('dpDataSelection', {
      store: {
        dispatch: () => {},
      },
    })

    angular.mock.inject(function (_$compile_, _$rootScope_, _store_) {
      $compile = _$compile_
      $rootScope = _$rootScope_
      store = _store_
    })

    availableFilters = [
      {
        slug: 'sbi_code',
        label: 'SBI-code',
        options: [],
        numberOfOptions: 0,
      },
      {
        slug: 'sbi_l2',
        label: 'SBI-code',
        options: [
          {
            label: 'de eerste van level 1',
            id: '01: landbouw',
          },
          {
            label: 'de tweede van level 1',
            id: '03: visserij',
          },
          {
            label: 'de derde van level 1',
            id: '07: vastgoed',
          },
          {
            label: 'de vierde van level 1',
            id: '31: disco',
          },
          {
            label: 'de vijfde van level 1',
            id: '42: zinvanhetleven',
          },
          {
            label: 'de zesde van level 1',
            id: '54: grondverzet',
          },
          {
            label: 'de zevende van level 1',
            id: '69: lekker',
          },
        ],
        numberOfOptions: 8,
      },
      {
        slug: 'sbi_l3',
        label: 'SBI-code',
        options: [
          {
            label: 'Optie van het Beest',
            id: '666-optievanhetbeest',
          },
        ],
        numberOfOptions: 1,
      },
      {
        slug: 'sbi_l4',
        label: 'SBI-code',
        options: [
          {
            label: 'Optie van de drieeenheid',
            id: '333-drieeenheid',
          },
        ],
        numberOfOptions: 1,
      },
    ]

    spyOn(store, 'dispatch')
  })

  function getComponent(activeFilters = {}) {
    const element = document.createElement('dp-sbi-filter')

    element.setAttribute('available-filters', 'availableFilters')
    element.setAttribute('active-filters', 'activeFilters')

    const scope = $rootScope.$new()
    scope.availableFilters = availableFilters
    scope.activeFilters = activeFilters

    const component = $compile(element)(scope)
    scope.$apply()

    return component
  }

  describe('shows the sbi-filter', () => {
    it('the form', () => {
      const component = getComponent()

      expect(component.find('.qa-sbi-filter-form-input').length).toBe(1)
      expect(component.find('.qa-sbi-filter-form-input').val()).toBe('')

      expect(component.find('.qa-sbi-filter-form-sumbit').length).toBe(1)
      expect(component.find('.qa-sbi-filter-form-sumbit').text()).toBe('Selecteer')
    })

    it('the filter list', () => {
      const component = getComponent()

      expect(component.find('.qa-sbi-filter').length).toBe(1)
      expect(component.find('.qa-sbi-filter h1').text()).toBe('')

      // sbi filter
      expect(component.find('.qa-sbi-filter h2').eq(0).text()).toBe('SBI-code')
      expect(component.find('.qa-sbi-filter ul').eq(0).find('li').length).toBe(9)

      expect(component.find('.qa-sbi-filter ul').eq(0).find('li button').eq(0).text()).toContain(
        'de eerste van level 1',
      )

      expect(component.find('.qa-sbi-filter ul').eq(0).find('li button').eq(8).text()).toContain(
        'Optie van de drieeenheid',
      )
    })

    it('filter list with limit of 10 items then click show more and click show less', () => {
      availableFilters[1].options.push({
        label: 'de negende van level 1',
      })
      availableFilters[1].options.push({
        label: 'de tiende van level 1',
      })
      availableFilters[1].numberOfOptions = availableFilters[1].options.length

      const component = getComponent()

      // maximum number of items
      expect(component.find('.qa-sbi-filter ul').eq(0).find('li').length).toBe(10)

      expect(component.find('.qa-show-more-button').length).toBe(1)

      // Click the show more button
      component.find('.qa-show-more-button').click()
      $rootScope.$apply()

      expect(component.find('.qa-sbi-filter ul').eq(0).find('li').length).toBe(11)

      // Click the show less button
      component.find('.qa-show-more-button').click()
      $rootScope.$apply()

      expect(component.find('.qa-sbi-filter ul').eq(0).find('li').length).toBe(10)
    })
  })

  describe('it dispatches an action when a filter has been selected', () => {
    it('when selecting the first filter; one filter is communicated', () => {
      const component = getComponent()

      component.find('.qa-sbi-filter ul').eq(0).find('li button').eq(0).click()

      expect(store.dispatch).toHaveBeenCalledWith(
        addFilter({
          sbi_code: "['01']",
        }),
      )
    })

    it('when adding another filter; all filter will be updated', () => {
      const activeFilters = {
        sbi_code: "['01']",
      }
      const component = getComponent(activeFilters)

      component.find('.qa-sbi-filter ul').eq(0).find('li button').eq(4).click()

      expect(store.dispatch).toHaveBeenCalledWith(
        addFilter({
          sbi_code: "['42']",
        }),
      )
    })
  })

  describe('it dispatches an action when filter form was used', () => {
    it('when using input field to send 1 sbi-code', () => {
      const component = getComponent()

      component.find('.qa-sbi-filter-form-input').val('888').triggerHandler('change')

      expect(store.dispatch).toHaveBeenCalledWith(
        addFilter({
          sbi_code: "['888']",
        }),
      )
    })

    it('when using input field to send multiple sbi-codes', () => {
      const component = getComponent()

      component.find('.qa-sbi-filter-form-input').val('   9999   ,  44,3').triggerHandler('change')

      expect(store.dispatch).toHaveBeenCalledWith(
        addFilter({
          sbi_code: "['9999', '44', '3']",
        }),
      )
    })

    it('when using input field to send empty the sbi-code', () => {
      const activeFilters = {
        sbi_code: "['01']",
      }
      const component = getComponent(activeFilters)

      component.find('.qa-sbi-filter-form-input').val('').triggerHandler('change')
      expect(store.dispatch).toHaveBeenCalledWith(removeFilter('sbi_code'))
    })
  })
})
