import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { getPanoramaThumbnail } from '../../../api/panorama/thumbnail'
import {
  fetchPanoramaPreviewFailure,
  fetchPanoramaPreviewSuccess,
} from '../../ducks/preview/panorama-preview'
import { fetchMapPano } from './panorama-preview'

describe('fetchMapPano', () => {
  it('should dispatch the correct action', () =>
    expectSaga(fetchMapPano, { payload: { latitude: 10, longitude: 30 } })
      .provide({
        call(effect, next) {
          return effect.fn === getPanoramaThumbnail ? 'payload' : next()
        },
      })
      .put(fetchPanoramaPreviewSuccess('payload'))
      .run())

  it('should throw error and put error', () => {
    const error = new Error('My Error')
    testSaga(fetchMapPano, { payload: { latitude: 10, longitude: 30 } })
      .next()
      .throw(error)
      .put(fetchPanoramaPreviewFailure(error))
      .next()
      .isDone()
  })
})
