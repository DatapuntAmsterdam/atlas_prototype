import React from 'react';
import { shallow } from 'enzyme';

import MapDetailGebiedenStadsdeel from './MapDetailGebiedenStadsdeel';

describe('MapDetailGebiedenStadsdeel', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const stadsdeel = {
        label: 'Stadsdeel label'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailGebiedenStadsdeel
          panoUrl={panoUrl}
          stadsdeel={stadsdeel}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const stadsdeel = {
        label: 'Stadsdeel label'
      };
      const wrapper = shallow(
        <MapDetailGebiedenStadsdeel
          stadsdeel={stadsdeel}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
