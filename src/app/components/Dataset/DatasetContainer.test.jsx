import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DatasetContainer from './DatasetContainer';

const initialState = {
  datasets: {
    datasetData: {
      page: 1,
      result: {}
    },
    datasetApiSpecification: {
      data: {}
    }
  },
  filter: {
    filters: {}
  }
};

describe('DatasetContainer', () => {
  it('should render', () => {
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DatasetContainer />, { context: { store } });
    expect(component).toMatchSnapshot();
  });
});
