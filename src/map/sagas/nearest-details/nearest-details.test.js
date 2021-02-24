import { expectSaga, testSaga } from 'redux-saga-test-plan'

import watchFetchNearestDetails, { fetchNearestDetails } from './nearest-details'

import fetchNearestDetail from '../../services/nearest-detail/nearest-detail'
import { REQUEST_NEAREST_DETAILS } from '../../../shared/ducks/data-search/constants'
import { goToGeoSearch } from '../map-click/map-click'

import { ViewMode, getViewMode } from '../../../shared/ducks/ui/ui'

jest.mock('../../../shared/ducks/ui/ui')

describe('watchFetchNearestDetails', () => {
  const action = { type: REQUEST_NEAREST_DETAILS }

  it('should watch REQUEST_NEAREST_DETAILS and call fetchPanelLayers', () => {
    testSaga(watchFetchNearestDetails)
      .next()
      .takeLatestEffect(REQUEST_NEAREST_DETAILS, fetchNearestDetails)
      .next(action)
      .next()
      .isDone()
  })
})

describe('fetchNearestDetails', () => {
  const action = {
    payload: {
      location: {
        latitude: 2,
        longitude: 1,
      },
      layers: [],
      zoom: 12,
      view: 'kaart',
    },
  }

  it('should call fetchNearestDetails and dispatch the correct actions if uri is returned', () => {
    getViewMode.mockReturnValueOnce(ViewMode.Map)
    return expectSaga(fetchNearestDetails, action)
      .provide({
        call(effect, next) {
          if (effect.fn === fetchNearestDetail) {
            return { uri: 'uri', id: '123' }
          }
          return next()
        },
      })
      .call(fetchNearestDetail, action.payload.location, [], 12)
      .run()
  })

  it('should call fetchNearestDetails and dispatch setGeolocation', () =>
    expectSaga(fetchNearestDetails, action)
      .provide({
        call(effect, next) {
          if (effect.fn === fetchNearestDetail) {
            return ''
          }
          return next()
        },
      })
      .call(goToGeoSearch, action.payload.location)
      .run())

  it('should throw error and dispatch setGeolocation', () => {
    const error = new Error('My Error')
    testSaga(fetchNearestDetails, action)
      .next()
      .throw(error)
      .call(goToGeoSearch, action.payload.location)
      .next()
      .isDone()
  })
})
