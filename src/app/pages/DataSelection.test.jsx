import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DataSelection from './DataSelection';
import { getDataSelectionView } from '../../shared/ducks/data-selection/selectors';
import { setView } from '../../shared/ducks/data-selection/actions';
import { VIEWS } from '../../shared/ducks/data-selection/constants';

jest.mock('../../shared/ducks/data-selection/selectors');
jest.mock('../../shared/ducks/data-selection/actions');

const initialState = {
};

describe('DataSelection', () => {
  it(`should render as ${VIEWS.LIST}`, () => {
    getDataSelectionView.mockReturnValue(VIEWS.LIST);
    setView.mockReturnValue(VIEWS.LIST);

    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DataSelection view />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });

  it(`should render as ${VIEWS.MAP}`, () => {
    getDataSelectionView.mockReturnValue(VIEWS.MAP);
    setView.mockReturnValue(VIEWS.MAP);

    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DataSelection view />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });
});
