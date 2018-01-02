import React from 'react';
import { shallow } from 'enzyme';

import MapDetailResultItem
  from './MapDetailResultItem';

describe('MapDetailResultItem', () => {
  describe('rendering', () => {
    it('should render label and value', () => {
      const label = 'label';
      const value = 'value';
      const wrapper = shallow(
        <MapDetailResultItem
          label={label}
          value={value}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render empty value', () => {
      const label = 'label';
      const value = '';
      const wrapper = shallow(
        <MapDetailResultItem
          label={label}
          value={value}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render without value', () => {
      const label = 'label';
      const wrapper = shallow(
        <MapDetailResultItem
          label={label}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
