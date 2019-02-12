import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DatasetContainer from './DatasetContainer';
import Dataset from './Dataset';

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

describe('Dataset', () => {
  it('should render the container', () => {
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DatasetContainer />, { context: { store } });
    expect(component).toMatchSnapshot();
  });

  it('should render the component', () => {
    const component = shallow(
      <Dataset
        activeFilters={{}}
        apiSpecification={{}}
        page={1}
        results={{ data: [] }}
        setPage={jest.fn}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
