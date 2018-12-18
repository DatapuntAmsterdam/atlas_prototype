import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DatasetsDetailContainer from '../DatasetDetailContainer';

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
      id: 1
    }
  }
};

describe('DatasetsDetailContainer', () => {
  it('should render', () => {
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DatasetsDetailContainer />, { context: { store } }).dive();
    expect(component).toMatchSnapshot();
  });
});
