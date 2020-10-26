import { call, put, select, takeLatest } from 'redux-saga/effects'
import { getUser } from '../../ducks/user/user'
import search from '../../../map/services/map-search/map-search'
import geosearch from '../../services/search/geosearch'
import {
  fetchMapSearchResultsFailure,
  fetchMapSearchResultsRequest,
  fetchMapSearchResultsSuccessList,
  fetchMapSearchResultsSuccessPanel,
} from '../../ducks/data-search/actions'
import { FETCH_GEO_SEARCH_RESULTS_REQUEST } from '../../ducks/data-search/constants'
import { getDataSearchLocation } from '../../ducks/data-search/selectors'
import {
  getNumberOfResults as getNrOfSearchResults,
  getNumberOfResultsPanel,
  replaceBuurtcombinatie,
} from '../../services/search/search'
import { getPage } from '../../../store/redux-first-router/selectors'
import { getMapZoom } from '../../../map/ducks/map/selectors'
import ActiveOverlaysClass from '../../services/active-overlays/active-overlays'
import { waitForAuthentication } from '../user/user'
import { SELECTION_TYPE, setSelection } from '../../ducks/selection/selection'
import { isMapPage } from '../../ducks/ui/ui'
import PAGES from '../../../app/pages'
import { ERROR_TYPES, setGlobalError } from '../../ducks/error/error-message'

// Todo: DP-6390
export function* fetchMapSearchResults() {
  const zoom = yield select(getMapZoom)
  const location = yield select(getDataSearchLocation)
  try {
    yield put(setSelection(SELECTION_TYPE.POINT))
    yield call(waitForAuthentication)
    const user = yield select(getUser)

    if (location) {
      const geoSearchResults = yield call(geosearch, location, user)
      const results = replaceBuurtcombinatie(geoSearchResults)
      yield put(fetchMapSearchResultsSuccessList(results, getNrOfSearchResults(geoSearchResults)))

      const { results: resultsPanel, errors } = yield call(search, location, user)
      yield put(
        fetchMapSearchResultsSuccessPanel(resultsPanel, getNumberOfResultsPanel(resultsPanel)),
      )

      if (errors) {
        yield put(setGlobalError(ERROR_TYPES.GENERAL_ERROR))
      }
    }
  } catch (error) {
    const payload = ActiveOverlaysClass.getOverlaysWarning(zoom)
    yield put(fetchMapSearchResultsFailure(payload))
  }
}

export function* fetchGeoSearchResultsEffect() {
  const location = yield select(getDataSearchLocation)
  const isMap = yield select(isMapPage)
  const page = yield select(getPage)

  if (page === PAGES.DATA_SEARCH_GEO) {
    yield put(fetchMapSearchResultsRequest(location, isMap))
  }
}

export default function* watchDataSearch() {
  yield takeLatest(FETCH_GEO_SEARCH_RESULTS_REQUEST, fetchMapSearchResults)
}
