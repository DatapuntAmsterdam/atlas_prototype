import React from 'react';
import { shallow } from 'enzyme';

import MapDetailAdressenLigplaats from './MapDetailAdressenLigplaats';

describe('MapDetailAdressenLigplaats', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const ligplaats = {
        label: 'Ligplaats label',
        status: 'Ligplaats status'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailAdressenLigplaats
          panoUrl={panoUrl}
          ligplaats={ligplaats}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const ligplaats = {
        label: 'Ligplaats label',
        status: 'Ligplaats status'
      };
      const wrapper = shallow(
        <MapDetailAdressenLigplaats
          ligplaats={ligplaats}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
