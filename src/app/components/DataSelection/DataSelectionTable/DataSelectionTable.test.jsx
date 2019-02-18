import React from 'react';
import { shallow } from 'enzyme';
import DataSelectionTable from './DataSelectionTable';
import { getDetailPageData } from '../../../../store/redux-first-router/actions';

jest.mock('../../../../store/redux-first-router/actions');

// Todo: DP-6235
describe('DataSelectionTable', () => {
  it('should render without failing', () => {
    getDetailPageData.mockReturnValue(['type', 'subtype', 'id']);
    const component = shallow(
      <DataSelectionTable
        content={{
          head: ['foo', 'bar'],
          body: [{ content: [], detailEndpoint: 'http://example.com' }]
        }}
      />
    );

    expect(component).toMatchSnapshot();
  });
});
