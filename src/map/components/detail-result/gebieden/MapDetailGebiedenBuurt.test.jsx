import React from 'react';
import { shallow } from 'enzyme';

import MapDetailGebiedenBuurt from './MapDetailGebiedenBuurt';

describe('MapDetailGebiedenBuurt', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const buurt = {
        label: 'Buurt label'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailGebiedenBuurt
          panoUrl={panoUrl}
          buurt={buurt}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const buurt = {
        label: 'Buurt label'
      };
      const wrapper = shallow(
        <MapDetailGebiedenBuurt
          buurt={buurt}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
