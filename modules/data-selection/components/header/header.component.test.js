import { setDataset } from '../../../../src/shared/ducks/data-selection/actions'
import * as dataSelectionConfig from '../../../../src/shared/services/data-selection/data-selection-config'

describe('The dp-data-selection-header', () => {
  const anonymousUser = {
    authenticated: false,
    scopes: [],
  }

  let $compile
  let $rootScope
  let store
  let component
  let config
  let mockedViewInput
  let mockedInputTable
  let mockedInputTableAuth
  let mockedInputList
  let mockedInputCatalog

  beforeEach(() => {
    config = {
      datasets: {
        bag: {
          MAX_AVAILABLE_PAGES: 50,
          TITLE: 'BAG Adressen',
          TITLE_TAB: 'BAG Adressen',
          SHOW_NUMBER_OF_RECORDS: true,
        },
        brk: {
          MAX_AVAILABLE_PAGES: 50,
          TITLE: 'Kadastrale objecten',
          TITLE_TAB: 'Kadastrale objecten',
          SHOW_NUMBER_OF_RECORDS: false,
        },
        hr: {
          MAX_AVAILABLE_PAGES: 50,
          TITLE: 'HR Vestigingen',
          TITLE_TAB: 'HR Vestigingen',
          SHOW_NUMBER_OF_RECORDS: false,
        },
        dcatd: {
          MAX_AVAILABLE_PAGES: 50,
          TITLE: 'Datasets',
          TITLE_TAB: 'Datasets',
          SHOW_NUMBER_OF_RECORDS: true,
        },
      },
    }

    angular.mock.module(
      'dpDataSelection',
      {
        store: {
          dispatch: angular.noop,
        },
      },
      function ($provide) {
        $provide.factory('dpDataSelectionToggleViewButtonDirective', () => {
          return {}
        })

        $provide.factory('dpDataSelectionDownloadButtonDirective', () => {
          return {}
        })

        $provide.factory('dpDataSelectionActiveFiltersDirective', () => {
          return {}
        })
      },
    )

    // eslint-disable-next-line no-import-assign
    dataSelectionConfig.default = config

    angular.mock.inject((_$compile_, _$rootScope_, _store_) => {
      $compile = _$compile_
      $rootScope = _$rootScope_
      store = _store_
    })

    mockedInputTable = {
      dataset: 'bag',
      view: 'TABLE',
      state: {
        geometryFilter: {
          markers: [],
          description: 'geometryFilter description',
        },
      },
      filters: {
        fake_filter: 'abc',
      },
      numberOfRecords: null,
      showHeader: true,
    }

    mockedInputTableAuth = {
      ...mockedInputTable,
      user: {
        authenticated: true,
        scopes: ['HR/R'],
      },
    }

    mockedInputList = {
      dataset: 'hr',
      view: 'LIST',
      state: {
        geometryFilter: {
          markers: [],
          description: 'geometryFilter description',
        },
      },
      filters: {
        fake_filter: 'abc',
      },
      numberOfRecords: null,
      showHeader: true,
    }

    mockedInputCatalog = {
      dataset: 'dcatd',
      view: 'CATALOG',
      state: {
        geometryFilter: {
          markers: [],
          description: 'geometryFilter description',
        },
        page: 1,
      },
      filters: {
        fake_filter: 'abc',
      },
      numberOfRecords: null,
      showHeader: true,
    }

    spyOn(store, 'dispatch')
  })

  function getComponent(mockedInput) {
    const element = document.createElement('dp-data-selection-header')
    element.setAttribute('user', 'user')
    element.setAttribute('state', 'state')
    element.setAttribute('filters', 'filters')
    element.setAttribute('available-filters', 'availableFilters')
    element.setAttribute('number-of-records', 'numberOfRecords')
    element.setAttribute('show-header', 'showHeader')
    element.setAttribute('dataset', 'dataset')
    element.setAttribute('view', 'view')

    const scope = $rootScope.$new()
    scope.user = mockedInput.user || anonymousUser
    scope.state = mockedInput.state
    scope.filters = mockedInput.filters
    scope.availableFilters = {}
    scope.numberOfRecords = mockedInput.numberOfRecords
    scope.showHeader = mockedInput.showHeader
    scope.dataset = mockedInput.dataset
    scope.view = mockedInput.view
    const compiledComponent = $compile(element)(scope)
    scope.$apply()

    return compiledComponent
  }

  it('should not show the header if showHeader is not true', () => {
    mockedInputTable.showHeader = false
    component = getComponent(mockedInputTable)
    expect(component.find('.qa-header').length).toBe(0)
  })

  describe('The buttons (download and toggle view)', () => {
    it('are available in the TABLE view', () => {
      component = getComponent(mockedInputTable)
      expect(component.find('.qa-buttons').length).toBe(1)
    })

    it('are available in the LIST view', () => {
      component = getComponent(mockedInputList)
      expect(component.find('.qa-buttons').length).toBe(1)
    })

    it('are never available in the CATALOG view', () => {
      component = getComponent(mockedInputCatalog)
      expect(component.find('.qa-buttons').length).toBe(0)
    })
  })

  describe('the download button', () => {
    it('is hidden when there are no results', () => {
      mockedInputTable.numberOfRecords = 1
      component = getComponent(mockedInputTable)
      expect(component.find('.qa-download-button').length).toBe(1)

      mockedInputTable.numberOfRecords = 0
      component = getComponent(mockedInputTable)
      expect(component.find('.qa-download-button').length).toBe(0)
    })

    it('is hidden when in LIST view', () => {
      mockedInputTable.numberOfRecords = 1
      component = getComponent(mockedInputTable)
      expect(component.find('.qa-download-button').length).toBe(1)

      component = getComponent(mockedInputList)
      expect(component.find('.qa-download-button').length).toBe(0)
    })

    it('is hidden when the authentication level is not met', () => {
      // An authentication level is set
      config.datasets.bag.AUTH_SCOPE = 'HR/R'

      mockedInputTableAuth.numberOfRecords = 1
      component = getComponent(mockedInputTableAuth)
      expect(component.find('.qa-download-button').length).toBe(1)

      // This time there are no records however
      mockedInputTableAuth.numberOfRecords = 0
      component = getComponent(mockedInputTableAuth)
      expect(component.find('.qa-download-button').length).toBe(0)
    })
  })

  describe('the header title', function () {
    it('in TABLE view shows the name followed by the number of results', () => {
      mockedInputTable.numberOfRecords = 1234
      component = getComponent(mockedInputTable)

      // Avec thousand separator
      expect(component.find('.qa-title').text()).toContain('BAG Adressen')
      expect(component.find('.qa-title').text()).toContain('(1.234)')
    })

    it("in CATALOG view shows the number of results followed using 'Datasets(number)'", () => {
      // Singular
      mockedInputCatalog.numberOfRecords = 10
      component = getComponent(mockedInputCatalog)
      expect(component.find('.qa-title').text().trim()).toBe('Datasets (10)')

      // Plural, with thousand separator
      mockedInputCatalog.numberOfRecords = 1234
      component = getComponent(mockedInputCatalog)
      expect(component.find('.qa-title').text().trim()).toBe('Datasets (1.234)')
    })

    it("in LIST view shows just the string 'Resultaten'", () => {
      // No results
      mockedInputList.numberOfRecords = 0
      component = getComponent(mockedInputList)
      expect(component.find('.qa-title').text().trim()).toBe('Resultaten')

      // 1 Result
      mockedInputList.numberOfRecords = 1
      component = getComponent(mockedInputList)
      expect(component.find('.qa-title').text().trim()).toBe('Resultaten')

      // Multiple results
      mockedInputList.numberOfRecords = 1234
      component = getComponent(mockedInputList)
      expect(component.find('.qa-title').text().trim()).toBe('Resultaten')
    })
  })
  ;['TABLE', 'CATALOG'].forEach((viewName) => {
    beforeEach(function () {
      mockedViewInput = viewName === 'TABLE' ? mockedInputTable : mockedInputCatalog
    })

    describe(`in ${viewName} view`, () => {
      beforeEach(() => {
        mockedViewInput.numberOfRecords = 1234
      })

      it('shows the title', () => {
        component = getComponent(mockedViewInput)

        expect(component.find('.qa-title').length).toBe(1)
      })

      it("doesn't show tabs", function () {
        component = getComponent(mockedViewInput)

        expect(component.find('.qa-tabs').length).toBe(0)
      })
    })
  })

  describe('in LIST view', () => {
    it('shows the buttons and title', () => {
      component = getComponent(mockedInputList)

      expect(component.find('.qa-buttons').length).toBe(1)
      expect(component.find('.qa-title').length).toBe(1)
    })

    it('shows the tabs', function () {
      component = getComponent(mockedInputList)

      expect(component.find('.qa-tabs').length).toBe(1)
    })
  })

  describe('the tabs in LIST view', () => {
    it('use the TITLE_TAB values from DATA_SELECTION_CONFIG', () => {
      component = getComponent(mockedInputList)

      expect(component.find('.qa-tabs li:nth-child(1)').text().trim()).toBe('BAG Adressen')
      expect(component.find('.qa-tabs li:nth-child(2)').text().trim()).toContain('HR Vestigingen')
    })

    it('inactive tabs are links to the first page of other datasets', () => {
      mockedInputList.dataset = 'hr'
      mockedInputList.state.page = 123
      component = getComponent(mockedInputList)

      component.find('.qa-tabs li:nth-child(1) dp-link .o-tabs__tab--link').click()
      expect(store.dispatch).toHaveBeenCalledWith(setDataset('bag'))
    })

    it('active tabs are just text (instead of a link)', () => {
      mockedInputList.dataset = 'hr'
      mockedInputList.state.page = 123
      component = getComponent(mockedInputList)
      expect(store.dispatch).not.toHaveBeenCalled()

      expect(component.find('.qa-tabs li:nth-child(2) dp-link .o-tabs__tab--text').length).toBe(0)
      expect(component.find('.qa-tabs li:nth-child(2) .o-tabs__tab--active').length).toBe(1)
    })

    it('shows the number of results in the tab heading for the active dataset', () => {
      // It shows the number of results for the active tab only
      mockedInputList.numberOfRecords = 12345
      component = getComponent(mockedInputList)

      expect(component.find('.qa-tabs li:nth-child(1)').text().trim()).toBe('BAG Adressen')
      expect(component.find('.qa-tabs li:nth-child(2)').text().trim()).toBe('HR Vestigingen')

      // When BAG is active
      mockedInputList.dataset = 'bag'
      component = getComponent(mockedInputList)

      expect(component.find('.qa-tabs li:nth-child(1)').text()).toContain('BAG Adressen')
      expect(component.find('.qa-tabs li:nth-child(1)').text()).toContain(' (12.345)')
      expect(component.find('.qa-tabs li:nth-child(2)').text().trim()).toBe('HR Vestigingen')
    })

    it('it does not show the number of results in the tab heading when not available', () => {
      mockedInputList.numberOfRecords = null
      component = getComponent(mockedInputList)

      expect(component.find('.qa-tabs li:nth-child(1)').text().trim()).toBe('BAG Adressen')
      expect(component.find('.qa-tabs li:nth-child(2)').text().trim()).toBe('HR Vestigingen')
    })
  })
})
