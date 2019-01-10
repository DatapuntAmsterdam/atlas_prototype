import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import DataSearchContainer from './DataSearchContainer';

const initialState = {
  dataSearch: {
    numberOfResults: 0,
    query: 'foo'
  },
  user: {
    authenticated: false,
    scopes: []
  }
};

describe('DataSearchContainer', () => {
  it('should render', () => {
    const store = configureMockStore()({ ...initialState });
    const component = shallow(<DataSearchContainer searchResults={[]} />, { context: { store } });
    expect(component).toMatchSnapshot();
  });
});
