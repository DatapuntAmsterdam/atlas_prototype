import React from 'react';
import { shallow } from 'enzyme';
import Dataset from './Dataset';

describe('Dataset', () => {
  const props = {
    activeFilters: {},
    authError: false,
    page: 1,
    results: {
      numberOfRecords: 0
    },
    apiSpecification: {},
    setPage: jest.fn
  };

  it('should render without search results', () => {
    const component = shallow(
      <Dataset {...props} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render with search results', () => {
    const extendedProps = {
      ...props,
      results: {
        ...props.results,
        data: [],
        numberOfRecords: 2
      }
    };
    const component = shallow(
      <Dataset {...extendedProps} />
    );
    expect(component).toMatchSnapshot();
  });
});
