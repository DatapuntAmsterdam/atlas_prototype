import React from 'react';
import { shallow } from 'enzyme';

import MapDetailGebiedenUnesco from './MapDetailGebiedenUnesco';

describe('MapDetailGebiedenUnesco', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const unesco = {
        label: 'Unesco label'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailGebiedenUnesco
          panoUrl={panoUrl}
          unesco={unesco}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const unesco = {
        label: 'Unesco label'
      };
      const wrapper = shallow(
        <MapDetailGebiedenUnesco
          unesco={unesco}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
