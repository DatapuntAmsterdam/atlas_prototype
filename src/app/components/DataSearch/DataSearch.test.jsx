import React from 'react';
import { shallow } from 'enzyme';
import DataSearch from './DataSearch';

jest.mock('../../../shared/ducks/detail/constants', () => ({
  DETAIL_VIEW: {
    MAP_DETAIL: 'foo'
  }
}));

describe('DataSearch', () => {
  const props = {
    userAuthenticated: false,
    userScopes: [],
    numberOfResults: 0,
    category: '',
    setSearchCategory: jest.fn,
    toDetail: jest.fn,
    searchResults: [{}],
    searchQuery: 'foo'
  };

  it('should render without search results', () => {
    const component = shallow(
      <DataSearch {...props} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render with search results', () => {
    const extendedProps = {
      ...props,
      numberOfResults: 2
    };
    const component = shallow(
      <DataSearch {...extendedProps} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should fetch more search results on button click', () => {
    const toDetailMock = jest.fn();
    const extendedProps = {
      ...props,
      numberOfResults: 20,
      toDetail: toDetailMock,
      searchResults: [{
        label_plural: 'foo',
        count: 20,
        more: {
          endpoint: 'https://something.com'
        }
      }],
      searchQuery: 'foo'
    };
    const component = shallow(
      <DataSearch {...extendedProps} />
    );

    component.find('button.qa-show-more').at(0).simulate('click');
    expect(toDetailMock).toHaveBeenCalledWith('https://something.com', 'foo');
  });

  it('should fetch all search results on button click', () => {
    const setSearchCategoryMock = jest.fn();
    const extendedProps = {
      ...props,
      numberOfResults: 20,
      setSearchCategory: setSearchCategoryMock,
      searchResults: [{
        label_plural: 'foo',
        count: 20,
        slug: 'foo'
      }],
      searchQuery: 'foo'
    };
    const component = shallow(
      <DataSearch {...extendedProps} />
    );

    component.find('button.qa-show-more').at(0).simulate('click');
    expect(setSearchCategoryMock).toHaveBeenCalledWith('foo', 'foo');
  });
});
