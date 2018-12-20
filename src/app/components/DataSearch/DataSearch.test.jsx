import React from 'react';
import { shallow } from 'enzyme';
import DataSearch from './DataSearch';

// Todo: DP-6235
describe('DataSearch', () => {
  it('should render without search results', () => {
    const component = shallow(
      <DataSearch
        user={{ scopes: [] }}
        numberOfResults={0}
        category=""
        setSearchCategory={jest.fn}
        fetchDetailPage={jest.fn}
        searchResults={[{}]}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render with search results', () => {
    const component = shallow(
      <DataSearch
        user={{ scopes: [] }}
        numberOfResults={2}
        category=""
        setSearchCategory={jest.fn}
        fetchDetailPage={jest.fn}
        searchResults={[{}]}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
