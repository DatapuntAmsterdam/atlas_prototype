import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import DataSelectionTable from './DataSelectionTable';

// Todo: DP-6235
describe('DataSelectionTable', () => {
  it('should render without failing', () => {
    const store = configureMockStore()({});
    const component = shallow(
      <DataSelectionTable
        content={{
          head: ['foo', 'bar'],
          body: [{ content: [], detailEndpoint: 'http://example.com' }]
        }}
      />,
      { context: { store } }
    ).dive();

    expect(component).toMatchSnapshot();
  });
});
