import React from 'react';
import { shallow } from 'enzyme';

import MapDetailExplosievenGevrijwaardGebied from './MapDetailExplosievenGevrijwaardGebied';

describe('MapDetailExplosievenGevrijwaardGebied', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const gevrijwaardGebied = {
        date: new Date('1919-12-31'),
        label: 'Gevrijwaard gebied label',
        remarks: 'Gevrijwaard gebied remarks',
        source: 'Gevrijwaard gebied source',
        type: 'Gevrijwaard gebied type'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailExplosievenGevrijwaardGebied
          panoUrl={panoUrl}
          gevrijwaardGebied={gevrijwaardGebied}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const gevrijwaardGebied = {
        date: new Date('1919-12-31'),
        label: 'Gevrijwaard gebied label',
        remarks: 'Gevrijwaard gebied remarks',
        source: 'Gevrijwaard gebied source',
        type: 'Gevrijwaard gebied type'
      };
      const wrapper = shallow(
        <MapDetailExplosievenGevrijwaardGebied
          gevrijwaardGebied={gevrijwaardGebied}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
