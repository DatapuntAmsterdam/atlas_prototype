import get from 'lodash.get';
import { put, takeLatest } from 'redux-saga/effects';
import { routing } from '../../../app/routes';
import { fetchDataSelection } from '../../../header/ducks/search/search';
import ACTIONS from '../../actions';

const initialState = {
  endpoint: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case routing.catalogusDetail.type:
      return {
        detail: action.payload.id
      };
    default:
      return state;
  }
};

export function* fetchCatalogData(action) {
  const query = get(action, 'meta.query', {});
  if (query.filter_theme) {
    yield put({
      type: ACTIONS.APPLY_FILTERS,
      payload: {
        groups: query.filter_theme
      }
    });
  }
  yield put(fetchDataSelection({
    dataset: 'dcatd',
    view: 'CATALOG',
    page: 1
  }));
}

export function* watchCatalogList() {
  yield takeLatest(routing.catalogus.type, fetchCatalogData);
}
