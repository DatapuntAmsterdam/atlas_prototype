import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { composeProviders } from 'redux-saga-test-plan/providers'
import { getImageDataByLocation } from '../../../panorama/services/panorama-api/panorama-api'
import { requestNearestDetails } from '../../../shared/ducks/data-search/actions'
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection'
import { getViewMode, isEmbedded, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { getPage } from '../../../store/redux-first-router/selectors'
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/constants'
import { getMapZoom } from '../../ducks/map/selectors'
import {
  getActiveMapLayers,
  getLayers,
  getMapPanelLayers,
} from '../../ducks/panel-layers/map-panel-layers'
import watchMapClick, { goToGeoSearch, switchClickAction } from './map-click'

describe('watchMapClick', () => {
  const action = { type: SET_MAP_CLICK_LOCATION }

  it('should watch "SET_MAP_CLICK_LOCATION" and call switchClickAction', () => {
    testSaga(watchMapClick)
      .next()
      .takeLatestEffect(SET_MAP_CLICK_LOCATION, switchClickAction)
      .next(action)
      .isDone()
  })
})

describe('switchClickAction', () => {
  const payload = {
    location: {
      latitude: 52.11,
      longitude: 4.11,
    },
  }

  const mockMapLayers = [
    {
      id: 'kot',
      url: 'maps/brk?service=wms',
      layers: ['kadastraal_object', 'kadastraal_object_label'],
      detailUrl: 'geosearch/search/',
      detailParams: {
        item: 'kadastraal_object',
      },
      detailIsShape: true,
    },
  ]

  const mockPanelLayers = [
    {
      category: 'Geografie: onroerende zaken',
      maxZoom: 16,
      minZoom: 8,
      legendItems: [{ id: 'bgem', noDetail: true }],
      noDetail: true,
      title: 'Kadastrale perceelsgrenzen',
      url: '/maps/brk?version=1.3.0&service=WMS',
    },
    {
      category: 'Verkeer en infrastructuur',
      id: 'pv',
      noDetail: true,
      layers: ['alle_parkeervakken'],
      legendItems: [
        {
          selectable: false,
          title: 'Fiscaal',
        },
      ],
      maxZoom: 16,
      minZoom: 10,
      title: 'Parkeervakken - Fiscale indeling',
      url: '/maps/parkeervakken?version=1.3.0&service=WMS',
    },
  ]

  const matchingPanelLayer = {
    id: 'kot',
    maxZoom: 16,
    minZoom: 8,
    legendItems: [{ id: 'kot', noDetail: true }],
    noDetail: true,
    title: 'Kadastrale perceelsgrenzen',
    url: '/maps/brk?version=1.3.0&service=WMS',
  }

  const mapPanelLayersWithSelection = [...mockPanelLayers, matchingPanelLayer]

  const providePage = ({ selector }, next) => (selector === getPage ? null : next())
  const provideViewMode = ({ selector }, next) => (selector === getViewMode ? 'split' : next())
  const provideDataSelectionView = ({ selector }, next) =>
    selector === getViewMode ? null : next()

  const provideMapLayers = ({ selector }, next) =>
    selector === getActiveMapLayers || selector === getLayers ? mockMapLayers : next()

  const provideMapZoom = ({ selector }, next) => (selector === getMapZoom ? 8 : next())

  const provideEmbed = ({ selector }, next) => (selector === isEmbedded ? false : next())

  const provideSelectionTypePoint = ({ selector }, next) =>
    selector === getSelectionType ? SELECTION_TYPE.POINT : next()

  const provideSelectionTypePanorama = ({ selector }, next) =>
    selector === getSelectionType ? SELECTION_TYPE.PANORAMA : next()

  // Skipped as this test failes randomly. Need to be fixed: https://datapunt.atlassian.net/browse/DP-7282
  it.skip('should dispatch the REQUEST_NEAREST_DETAILS when the panorama is not enabled', () => {
    const provideMapPanelLayers = ({ selector }, next) =>
      selector === getMapPanelLayers ? mapPanelLayersWithSelection : next()
    return expectSaga(switchClickAction, { payload })
      .provide({
        select: composeProviders(
          providePage,
          provideDataSelectionView,
          provideMapLayers,
          provideMapZoom,
          provideViewMode,
          provideMapPanelLayers,
          provideSelectionTypePoint,
          provideEmbed,
        ),
      })
      .put(
        requestNearestDetails({
          location: payload.location,
          layers: [...mockMapLayers],
          zoom: 8,
          view: VIEW_MODE.SPLIT,
        }),
      )
      .run()
  })

  it('should dispatch setGeolocation when the panorama is not enabled and there is no panelLayer found ', () => {
    const provideMapPanelLayers = ({ selector }, next) =>
      selector === getActiveMapLayers || selector === getLayers ? [] : next()

    return expectSaga(switchClickAction, { payload })
      .provide({
        select: composeProviders(
          providePage,
          provideDataSelectionView,
          provideViewMode,
          provideMapZoom,
          provideMapPanelLayers,
          provideSelectionTypePoint,
          provideEmbed,
        ),
      })
      .call(goToGeoSearch, payload.location)
      .run()
  })

  it('should get panorama by location when in pano mode', () => {
    const provideCallGetImageDataByLocation = ({ fn }, next) => {
      if (fn === getImageDataByLocation) {
        return {
          id: '123',
          location: Object.keys(payload.location).map((key) => payload.location[key]),
        }
      }
      return next()
    }

    return expectSaga(switchClickAction, { payload })
      .provide({
        select: composeProviders(provideSelectionTypePanorama),
        call: provideCallGetImageDataByLocation,
      })
      .run()
  })
})
