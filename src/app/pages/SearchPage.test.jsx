import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import { getDataSearchLocation } from '../../shared/ducks/data-search/selectors';
import { preserveQuery } from '../../store/redux-first-router/actions';
import SearchPage from './SearchPage';

jest.mock('../../shared/ducks/data-search/selectors');
jest.mock('../../store/redux-first-router/actions');

// jest.mock();

const initialState = {
};

describe('SearchPage', () => {
  it('shows map search results if no query is provided', () => {
    getDataSearchLocation.mockReturnValue([123, 321]);
    preserveQuery.mockReturnValue(jest.fn());
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<SearchPage />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });

  it('shows text search result if query is provided', () => {
    getDataSearchLocation.mockReturnValue(undefined);
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<SearchPage />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });
});
