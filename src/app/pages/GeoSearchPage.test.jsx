import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import GeoSearchPage from './GeoSearchPage';
import { VIEWS } from '../../shared/ducks/data-search/constants';
import { getView } from '../../shared/ducks/data-search/selectors';
import { setView } from '../../shared/ducks/data-search/actions';

jest.mock('../../shared/ducks/data-search/selectors');
jest.mock('../../shared/ducks/data-search/actions');
jest.mock('../../store/redux-first-router/actions');

// jest.mock();

const initialState = {
};

describe('GeoSearchPage', () => {
  it(`should render the split screen when the view = ${VIEWS.LIST}`, () => {
    getView.mockReturnValue(VIEWS.LIST);
    setView.mockReturnValue(VIEWS.LIST);

    const store = configureMockStore()({ ...initialState });
    const component = shallow(<GeoSearchPage />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });

  it(`should render the MapContainer when the view = ${VIEWS.MAP}`, () => {
    getView.mockReturnValue(VIEWS.MAP);
    setView.mockReturnValue(VIEWS.MAP);

    const store = configureMockStore()({ ...initialState });
    const component = shallow(<GeoSearchPage />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });
});
