import React from 'react';
import { shallow } from 'enzyme';

import MapDetailGebiedenWijk from './MapDetailGebiedenWijk';

describe('MapDetailGebiedenWijk', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const wijk = {
        label: 'Wijk label'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailGebiedenWijk
          panoUrl={panoUrl}
          wijk={wijk}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const wijk = {
        label: 'Wijk label'
      };
      const wrapper = shallow(
        <MapDetailGebiedenWijk
          wijk={wijk}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
