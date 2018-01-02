import React from 'react';
import { shallow } from 'enzyme';

import MapDetailGebiedenGebiedsgerichtWerken from './MapDetailGebiedenGebiedsgerichtWerken';

describe('MapDetailGebiedenGebiedsgerichtWerken', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const gebiedsgerichtWerken = {
        label: 'Gebiedsgericht werken label'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailGebiedenGebiedsgerichtWerken
          panoUrl={panoUrl}
          gebiedsgerichtWerken={gebiedsgerichtWerken}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const gebiedsgerichtWerken = {
        label: 'Gebiedsgericht werken label'
      };
      const wrapper = shallow(
        <MapDetailGebiedenGebiedsgerichtWerken
          gebiedsgerichtWerken={gebiedsgerichtWerken}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
