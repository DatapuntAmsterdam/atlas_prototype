import React from 'react';
import { shallow } from 'enzyme';

import MapDetailExplosievenInslag from './MapDetailExplosievenInslag';

describe('MapDetailExplosievenInslag', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const inslag = {
        date: new Date('1980-08-19'),
        label: 'Inslag label',
        remarks: 'Inslag remarks',
        source: 'Inslag source',
        type: 'Inslag type'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailExplosievenInslag
          panoUrl={panoUrl}
          inslag={inslag}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const inslag = {
        date: new Date('1980-08-19'),
        label: 'Inslag label',
        remarks: 'Inslag remarks',
        source: 'Inslag source',
        type: 'Inslag type'
      };
      const wrapper = shallow(
        <MapDetailExplosievenInslag
          inslag={inslag}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
