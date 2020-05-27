import { DOWNLOAD_DATA_SELECTION } from '../../../../../src/shared/ducks/data-selection/constants'
import * as dataSelectionConfig from '../../../../../src/shared/services/data-selection/data-selection-config'
import isDefined from '../../../../../src/shared/services/is-defined'

describe('The dp-data-selection-download-button component', function () {
  let $compile
  let $q
  let $rootScope
  let store
  let api

  const config = {
    datasets: {
      dataset_a: {
        ENDPOINT: 'datasets/a/',
        ENDPOINT_EXPORT: 'datasets/a/download/',
        FILTERS: [
          {
            slug: 'filter_a',
          },
          {
            slug: 'filter_b',
          },
        ],
        TITLE: 'foo',
      },
      dataset_b: {
        ENDPOINT: 'datasets/b/',
        ENDPOINT_EXPORT: 'datasets/b/download/',
        ENDPOINT_EXPORT_PARAM: 'dataset=ves',
        FILTERS: [
          {
            slug: 'filter_a',
          },
          {
            slug: 'filter_b',
          },
        ],
      },
    },
  }

  beforeEach(function () {
    angular.mock.module('dpDataSelection', {
      store: {
        dispatch: angular.noop,
      },
    })

    // eslint-disable-next-line no-import-assign
    dataSelectionConfig.default = config

    angular.mock.inject(function (_$compile_, _$q_, _$rootScope_, _store_, _api_) {
      $compile = _$compile_
      $q = _$q_
      $rootScope = _$rootScope_
      store = _store_
      api = _api_
    })

    spyOn(store, 'dispatch')
    spyOn(api, 'createUrlWithToken').and.callFake($q.resolve) // wrap url in promise
  })

  function getComponent(dataset, activeFilters, geometryMarkers) {
    const element = document.createElement('dp-data-selection-download-button')
    element.setAttribute('dataset', dataset)
    element.setAttribute('active-filters', 'activeFilters')

    if (isDefined(geometryMarkers)) {
      element.setAttribute('geometry-filter', 'geometryFilter')
    }

    const scope = $rootScope.$new()
    scope.activeFilters = activeFilters

    scope.geometryFilter = { markers: geometryMarkers, description: 'hello' }

    const component = $compile(element)(scope)
    scope.$digest()

    return component
  }

  it('will generate a download link for the current dataset', function () {
    const component = getComponent('dataset_a', {})

    expect(component.find('a').attr('href')).toContain('/datasets/a/download/')
  })

  it('will filters as parameters to the download link', function () {
    let component

    // With one active filter
    component = getComponent('dataset_a', {
      filter_b: 'eenofanderewaarde',
    })

    expect(component.find('a').attr('href')).toContain(
      '/datasets/a/download/?filter_b=eenofanderewaarde',
    )

    // With two active filters
    component = getComponent('dataset_a', {
      filter_a: 'ingeschakeld',
      filter_b: 'eenofanderewaarde',
    })

    expect(component.find('a').attr('href')).toContain(
      '/datasets/a/download/?filter_a=ingeschakeld&filter_b=eenofanderewaarde',
    )
  })

  it('uses URL encoding for the values of the active filters', function () {
    // With one active filter
    const component = getComponent('dataset_a', {
      filter_a: 'äéë',
      filter_b: 'Waarde met spaties',
    })

    expect(component.find('a').attr('href')).toContain(
      '/datasets/a/download/?filter_a=%C3%A4%C3%A9%C3%AB&' + 'filter_b=Waarde%20met%20spaties',
    )
    expect(component.find('a').attr('href')).toContain('filter_a=%C3%A4%C3%A9%C3%AB')
    expect(component.find('a').attr('href')).toContain('filter_b=Waarde%20met%20spaties')
  })

  it('updates the download URL when the dataset or activeFilters change', () => {
    let component

    const dataset = 'dataset_a'
    const activeFilters = {
      filter_a: 'hoi',
    }

    const markers = [
      [2, 3],
      [4, 5],
    ]

    component = getComponent(dataset, activeFilters)
    const scope = component.isolateScope()

    expect(component.find('a').attr('href')).toContain('/datasets/a/download/?filter_a=hoi')

    // Change the dataset and activeFilters
    scope.vm.dataset = 'dataset_b'
    delete scope.vm.activeFilters.filter_a
    scope.vm.activeFilters.filter_b = 'hallo'
    component.isolateScope().$digest()

    expect(component.find('a').attr('href')).toContain(
      '/datasets/b/download/?filter_b=hallo&dataset=ves',
    )

    component = getComponent(dataset, activeFilters, markers)

    component.isolateScope().$digest()

    expect(component.find('a').attr('href')).toContain(
      '/datasets/a/download/?filter_b=hallo&shape=[[3,2],[5,4]]',
    )
  })

  it('enriches the download url with the access token', () => {
    api.createUrlWithToken.and.returnValue($q.resolve('tokenUrl'))
    const component = getComponent('dataset_a', {
      filter_a: 'äéë',
    })
    expect(component.find('a').attr('href')).toBe('tokenUrl')
  })

  it('dispatches an action that is tracked by matomo', function () {
    const component = getComponent('dataset_a', {})
    component.find('a').click()

    expect(store.dispatch).toHaveBeenCalledWith({
      type: DOWNLOAD_DATA_SELECTION,
      meta: { tracking: 'foo' },
    })
  })
})
