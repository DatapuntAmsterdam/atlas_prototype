import { testSaga } from 'redux-saga-test-plan';
import { mapBoundsEffect, requestMarkersEffect } from './data-selection';
import { isDataSelectionPage } from '../../../store/redux-first-router/selectors';
import { fetchMarkersRequest, fetchMarkersSuccess } from '../../ducks/data-selection/actions';
import { getFiltersWithoutShape } from '../../ducks/filters/filters';
import { getDataset, getGeomarkersShape } from '../../ducks/data-selection/selectors';
import { getMapBoundingBox, getMapZoom } from '../../../map/ducks/map/map-selectors';
import { getMarkers } from '../../services/data-selection/data-selection-api';

describe('data-selection sagas', () => {
  describe('mapBoundsEffect', () => {
    it('should only fetch markers if user on dataselection page', () => {
      testSaga(mapBoundsEffect, {})
        .next()
        .select(isDataSelectionPage)
        .next(true)
        .put(fetchMarkersRequest())
        .next()
        .isDone();

      testSaga(mapBoundsEffect, {})
        .next()
        .select(isDataSelectionPage)
        .next(false)
        .isDone();
    });
  });

  describe('requestMarkersEffect', () => {
    it('should successfully fetch markers', () => {
      testSaga(requestMarkersEffect, {})
        .next()
        .select(getFiltersWithoutShape)
        .next({})
        .select(getDataset)
        .next('bag')
        .select(getGeomarkersShape)
        .next({})
        .select(getMapBoundingBox)
        .next([])
        .select(getMapZoom)
        .next(10)
        .call(getMarkers, 'bag', { shape: {} }, 10, [])
        .next('result')
        .put(fetchMarkersSuccess('result'))
        .next()
        .isDone();
    });
  });
});
