import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { fetchMapPano } from './panorama-preview';
import {
  fetchPanoramaPreviewFailure,
  fetchPanoramaPreviewSuccess
} from '../../ducks/preview/panorama-preview';
import panoPreview from '../../services/preview/panorama-preview';

describe('fetchMapPano', () => {
  it('should dispatch the correct action', () => (
    expectSaga(fetchMapPano, { location: '' })
      .provide({
        call(effect, next) {
          return effect.fn === panoPreview ? 'payload' : next();
        }
      })
      .put(fetchPanoramaPreviewSuccess('payload'))
      .run()
  ));

  it('should throw error and put error', () => {
    const error = new Error('My Error');
    testSaga(fetchMapPano, {})
      .next()
      .throw(error)
      .put(fetchPanoramaPreviewFailure(error))
      .next()
      .isDone();
  });
});
