import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DatasetDetailContainer from './DatasetDetailContainer';

const initialState = {
  detail: {
    isLoading: false
  },
  datasets: {
    datasetApiSpecification: {
      data: {}
    }
  },
  user: {},
  location: {
    payload: {
      id: 2
    }
  }
};

describe('DatasetDetailContainer', () => {
  it('should render', () => {
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DatasetDetailContainer />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });
});
