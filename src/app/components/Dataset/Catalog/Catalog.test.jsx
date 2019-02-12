import React from 'react';
import { shallow } from 'enzyme';
import Catalog from './Catalog';
import * as filters from '../../Filters/Filters';

jest.mock('../../Filters/Filters');

// Todo: DP-6235
describe('Catalog', () => {
  beforeEach(() => {
    filters.aggregateFilter.mockReturnValue([]);
    filters.truncateHtmlAsTextFilter.mockReturnValue('Text...');
  });
  it('should render without failing', () => {
    const component = shallow(
      <Catalog
        content={[{
          'dct:identifier': 1,
          'dcat:keyword': ['tag1', 'tag2'],
          'dcat:distribution': [{
            'ams:distributionType': 'file',
            'dcat:mediaType': 'foo'
          }, {
            'ams:distributionType': 'api',
            'dcat:ams:serviceType': 'foo'
          }]
        }]}
        catalogFilters={{
          formatTypes: [{
            id: 1,
            label: 'foo'
          }],
          serviceTypes: [{
            id: 1,
            label: 'foo'
          }],
          distributionTypes: [{
            id: 1,
            label: 'foo'
          }]
        }}
      />
    );

    expect(component).toMatchSnapshot();
  });
});
