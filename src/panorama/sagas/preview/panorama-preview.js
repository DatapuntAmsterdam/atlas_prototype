import { call, put, select, takeLatest } from 'redux-saga/effects'
import { getPanoramaThumbnail } from '../../../api/panorama/thumbnail'
import { FETCH_MAP_DETAIL_SUCCESS } from '../../../map/ducks/detail/constants'
import { FETCH_GEO_SEARCH_RESULTS_REQUEST } from '../../../shared/ducks/data-search/constants'
import { getDataSearchLocation } from '../../../shared/ducks/data-search/selectors'
import {
  fetchPanoramaPreview,
  fetchPanoramaPreviewFailure,
  fetchPanoramaPreviewSuccess,
  FETCH_PANORAMA_PREVIEW_REQUEST,
} from '../../ducks/preview/panorama-preview'

export function* fetchMapPano(action) {
  try {
    const location = action.payload
    const panoramaResult = yield call(
      getPanoramaThumbnail,
      {
        lat: location.latitude,
        lng: location.longitude,
      },
      {
        width: 438,
        radius: 180,
      },
    )

    yield put(fetchPanoramaPreviewSuccess(panoramaResult))
  } catch (error) {
    yield put(fetchPanoramaPreviewFailure(error))
  }
}

export function* getPanoramaPreview() {
  const location = yield select(getDataSearchLocation)
  yield put(fetchPanoramaPreview(location))
}

function* fireFetchPanoPreview(action) {
  const { location } = action.mapDetail
  yield put(fetchPanoramaPreview(location))
}

export default function* watchPanoPreview() {
  yield takeLatest(FETCH_PANORAMA_PREVIEW_REQUEST, fetchMapPano)
  yield takeLatest(FETCH_GEO_SEARCH_RESULTS_REQUEST, getPanoramaPreview)
  yield takeLatest(FETCH_MAP_DETAIL_SUCCESS, fireFetchPanoPreview)
}
