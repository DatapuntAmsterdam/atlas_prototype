import get from 'lodash.get'
import { put, select } from 'redux-saga/effects'
import { getSearchQuery } from '../../ducks/data-search/selectors'
import PARAMETERS from '../../../store/parameters'
import { fetchArticles, fetchPublications } from '../../ducks/cms'

export function* fetchArticlesEffect(action) {
  const state = yield select()
  const searchText = get(action, `meta.query[${PARAMETERS.QUERY}]`) || getSearchQuery(state)
  yield put(
    fetchArticles({
      searchText,
    }),
  )
}

export function* fetchPublicationsEffect(action) {
  const state = yield select()
  const searchText = get(action, `meta.query[${PARAMETERS.QUERY}]`) || getSearchQuery(state)
  yield put(
    fetchPublications({
      searchText,
    }),
  )
}
