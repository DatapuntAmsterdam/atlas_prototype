import React from 'react';
import { shallow } from 'enzyme';

import MapDetailAdressenStandplaats from './MapDetailAdressenStandplaats';

describe('MapDetailAdressenStandplaats', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const standplaats = {
        label: 'Standplaats label',
        status: 'Standplaats status'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailAdressenStandplaats
          panoUrl={panoUrl}
          standplaats={standplaats}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const standplaats = {
        label: 'Standplaats label',
        status: 'Standplaats status'
      };
      const wrapper = shallow(
        <MapDetailAdressenStandplaats
          standplaats={standplaats}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
