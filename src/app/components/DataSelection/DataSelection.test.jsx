import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DataSelection from './DataSelection';
import { DATASETS, VIEWS } from '../../../shared/ducks/data-selection/constants';

const initialState = {
  filters: {},
  user: {
    scopes: []
  },
  dataSelection: {
    isLoading: false,
    markers: [],
    geometryFilter: {
      markers: []
    },
    dataset: DATASETS.BAG,
    view: VIEWS.TABLE,
    authError: false,
    errorMessage: '',
    page: 1
  }
};

describe('DataSelection', () => {
  it('should render', () => {
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DataSelection />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });

  it('should render LoadingIndicator', () => {
    const state = {
      ...initialState,
      dataSelection: {
        ...initialState.dataSelection,
        isLoading: true
      }
    };
    const store = configureMockStore()({ ...state });
    const component = shallow(<DataSelection />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });
});
