import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DataSelection from './DataSelection';
import { DATASETS } from '../../../shared/ducks/data-selection/constants';
import { VIEW_MODE } from '../../../shared/ducks/ui/ui';

const initialState = {
  filter: { filters: {} },
  user: {
    scopes: []
  },
  ui: {
    viewMode: 'split'
  },
  dataSelection: {
    isLoading: false,
    markers: [],
    geometryFilter: {
      markers: []
    },
    dataset: DATASETS.BAG,
    view: VIEW_MODE.FULL,
    authError: false,
    errorMessage: '',
    page: 1,
    results: {
      numberOfRecords: 10
    }
  }
};

describe('DataSelection', () => {
  it(`should render as ${VIEW_MODE.FULL}`, () => {
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DataSelection />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });

  it(`should render as ${VIEW_MODE.SPLIT}`, () => {
    const state = {
      ...initialState,
      dataSelection: {
        ...initialState.dataSelection,
        view: VIEW_MODE.SPLIT
      }
    };
    const store = configureMockStore()({ ...state });
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

  it('should show authorization message if user has no permission', () => {
    const state = {
      ...initialState,
      dataSelection: {
        ...initialState.dataSelection,
        authError: true
      }
    };
    const store = configureMockStore()({ ...state });
    const component = shallow(<DataSelection />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });
});
