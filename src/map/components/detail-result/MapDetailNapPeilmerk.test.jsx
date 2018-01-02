import React from 'react';
import { shallow } from 'enzyme';

import MapDetailNapPeilmerk from './MapDetailNapPeilmerk';

describe('MapDetailNapPeilmerk', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const peilmerk = {
        description: 'Peilmerk description',
        height: '123',
        label: 'Peilmerk label',
        year: 1919
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailNapPeilmerk
          panoUrl={panoUrl}
          peilmerk={peilmerk}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const peilmerk = {
        description: 'Peilmerk description',
        height: '0',
        label: 'Peilmerk label',
        year: 1919
      };
      const wrapper = shallow(
        <MapDetailNapPeilmerk
          peilmerk={peilmerk}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render empty height', () => {
      const peilmerk = {
        description: 'Peilmerk description',
        height: '',
        label: 'Peilmerk label',
        year: 1919
      };
      const wrapper = shallow(
        <MapDetailNapPeilmerk
          peilmerk={peilmerk}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render without height', () => {
      const peilmerk = {
        description: 'Peilmerk description',
        height: '',
        label: 'Peilmerk label',
        year: 1919
      };
      const wrapper = shallow(
        <MapDetailNapPeilmerk
          peilmerk={peilmerk}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
