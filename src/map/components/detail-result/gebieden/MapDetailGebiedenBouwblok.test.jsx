import React from 'react';
import { shallow } from 'enzyme';

import MapDetailGebiedenBouwblok from './MapDetailGebiedenBouwblok';

describe('MapDetailGebiedenBouwblok', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const bouwblok = {
        label: 'Bouwblok label'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailGebiedenBouwblok
          panoUrl={panoUrl}
          bouwblok={bouwblok}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const bouwblok = {
        label: 'Bouwblok label'
      };
      const wrapper = shallow(
        <MapDetailGebiedenBouwblok
          bouwblok={bouwblok}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
