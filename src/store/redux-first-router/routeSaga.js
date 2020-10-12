import { all, call, takeEvery } from 'redux-saga/effects'
import { routing } from '../../app/routes'
import { fetchFetchPanoramaEffect } from '../../panorama/sagas/panorama'
import { fetchGeoSearchResultsEffect } from '../../shared/sagas/data-search/data-search'
import { fetchDataSelectionEffect } from '../../shared/sagas/data-selection/data-selection'
import { fetchDatasetEffect } from '../../shared/sagas/dataset/dataset'
import { fetchDetailEffect } from '../../map/sagas/detail/map-detail'

const routeSagaMapping = [
  [routing.panorama.type, fetchFetchPanoramaEffect],
  [routing.dataSearchGeo.type, fetchGeoSearchResultsEffect],
  [routing.addresses.type, fetchDataSelectionEffect],
  [routing.establishments.type, fetchDataSelectionEffect],
  [routing.cadastralObjects.type, fetchDataSelectionEffect],
  [routing.datasetDetail.type, fetchDatasetEffect],
  [routing.dataDetail.type, fetchDetailEffect],
]

const yieldOnFirstAction = (sideEffect) =>
  function* gen(action) {
    const { skipSaga, isFirstAction, forceSaga } = action.meta || {}
    if (!skipSaga && (isFirstAction || forceSaga)) {
      yield call(sideEffect, action)
    }
  }

export default function* routeSaga() {
  yield all(
    routeSagaMapping.map(([route, effect]) => takeEvery([route], yieldOnFirstAction(effect))),
  )
}
