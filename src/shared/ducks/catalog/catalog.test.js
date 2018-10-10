import { takeLatest, put } from 'redux-saga/effects';
import reducer, { fetchCatalogData, watchCatalogList } from './catalog';
import { routing } from '../../../app/routes';
import { fetchDataSelection } from '../../../header/ducks/search/search';

describe('Catalog Reducer', () => {
  it('should set the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should set the detail id from a route change', () => {
    const id = '123foo';
    const result = reducer({}, { type: routing.catalogusDetail.type, payload: { id } });
    expect(result.detail).toBe(id);
  });

  it('should dispatch fetch data on route change', () => {
    const watchGen = watchCatalogList();
    expect(watchGen.next().value).toEqual(
      takeLatest(routing.catalogus.type, fetchCatalogData)
    );

    const fetchGen = fetchCatalogData();
    expect(fetchGen.next().value).toEqual(
      put(
        fetchDataSelection({
          dataset: 'dcatd',
          view: 'CATALOG',
          page: 1
        })
      )
    );
  });
});
