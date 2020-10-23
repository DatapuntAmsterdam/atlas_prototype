// NOTE!!! Testing both container and component.
import React from 'react'
import configureMockStore from 'redux-mock-store'
import { shallow } from 'enzyme'

import MapPreviewPanelContainer from './MapPreviewPanelContainer'
import {
  getDataSearchLocation,
  getMapPanelResults,
  isSearchLoading,
} from '../../../shared/ducks/data-search/selectors'
import { selectNotClickableVisibleMapLayers } from '../../ducks/panel-layers/map-panel-layers'
import { FETCH_MAP_DETAIL_REQUEST } from '../../ducks/detail/constants'
import { getMapDetail } from '../../ducks/detail/actions'
import { selectLatestMapDetail } from '../../ducks/detail/selectors'
import { getDetailLocation } from '../../../store/redux-first-router/selectors'
import {
  toMapAndPreserveQuery,
  toPanoramaAndPreserveQuery,
  toDataDetail,
} from '../../../store/redux-first-router/actions'
import { isGeoSearch } from '../../../shared/ducks/selection/selection'
import { setViewMode } from '../../../shared/ducks/ui/ui'

jest.mock('../../../shared/ducks/ui/ui')
jest.mock('../../../shared/ducks/data-search/selectors')
jest.mock('../../ducks/panel-layers/map-panel-layers')
jest.mock('../../../shared/ducks/data-search/actions')
jest.mock('../../ducks/detail/actions')
jest.mock('../../ducks/detail/selectors')
jest.mock('../../ducks/map/selectors')
jest.mock('../../../shared/ducks/selection/selection')
jest.mock('../../../store/redux-first-router/selectors')
jest.mock('../../../store/redux-first-router/actions')

describe('MapPreviewPanelContainer', () => {
  const initialState = {
    map: {
      zoom: 8,
      overlays: [],
      selectedLocation: '1,2',
    },
    mapLayers: {
      layers: {
        items: [],
      },
      baseLayers: {
        items: [],
      },
      panelLayers: {
        items: [],
      },
    },
    selection: {
      type: 'MAP',
      location: {
        latitude: '11',
        longitude: '11',
      },
    },
    mapDetail: null,
    detail: null,
    search: null,
    ui: {},
    panorama: {
      preview: undefined,
    },
    user: { name: 'User name' },
  }
  const getSearchState = {
    ...initialState,
    search: {
      location: [1, 0],
      isLoading: true,
    },
  }
  const searchState = {
    ...getSearchState,
    search: {
      location: [1, 0],
      isLoading: false,
    },
    panorama: {
      preview: { url: 'pano-url' },
    },
  }

  beforeEach(() => {
    getMapPanelResults.mockReturnValue([])
    getDataSearchLocation.mockReturnValue({
      latitude: 1,
      longitude: 0,
    })
    getMapDetail.mockImplementation(() => ({ type: FETCH_MAP_DETAIL_REQUEST }))
    getDetailLocation.mockImplementation(() => ['123', '321'])
    toPanoramaAndPreserveQuery.mockImplementation(() => ({ type: 'sometype' }))
    toDataDetail.mockImplementation(() => ({ type: 'sometype' }))
    toMapAndPreserveQuery.mockImplementation(() => ({ type: 'sometype' }))
    setViewMode.mockImplementation(() => ({ type: 'sometype' }))
    selectNotClickableVisibleMapLayers.mockImplementation(() => [])
    isGeoSearch.mockImplementation((state) => !(state.detail && state.detail.endpoint))
    isSearchLoading.mockReturnValue(false)
  })

  afterEach(() => {
    getMapDetail.mockReset()
    selectLatestMapDetail.mockReset()
    selectNotClickableVisibleMapLayers.mockReset()
  })

  it('should maximize the preview panel', () => {
    const store = configureMockStore()(searchState)
    jest.spyOn(store, 'dispatch')
    const wrapper = shallow(<MapPreviewPanelContainer store={store} />)
      .dive()
      .dive()
    wrapper.find('.map-preview-panel__button').at(0).simulate('click')

    // TODO: refactor, add expectations
  })

  it('should close the preview panel', () => {
    const store = configureMockStore()(searchState)
    jest.spyOn(store, 'dispatch')
    const wrapper = shallow(<MapPreviewPanelContainer store={store} />)
      .dive()
      .dive()
    wrapper.find('.map-preview-panel__button').at(1).simulate('click')

    expect(store.dispatch).toHaveBeenCalledWith(toMapAndPreserveQuery())
  })
})
