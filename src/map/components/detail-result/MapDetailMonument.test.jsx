import React from 'react';
import { shallow } from 'enzyme';

import MapDetailMonument from './MapDetailMonument';

describe('MapDetailMonument', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const monument = {
        label: 'Monument label',
        number: 'ABC123',
        status: 'Monument status',
        type: 'Monument type'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailMonument
          panoUrl={panoUrl}
          monument={monument}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const monument = {
        label: 'Monument label',
        number: 'ABC123',
        status: 'Monument status',
        type: 'Monument type'
      };
      const wrapper = shallow(
        <MapDetailMonument
          monument={monument}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
