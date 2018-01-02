import React from 'react';
import { shallow } from 'enzyme';

import MapDetailResultDateItem
  from './MapDetailResultDateItem';

describe('MapDetailResultDateItem', () => {
  describe('rendering', () => {
    it('should render label and date', () => {
      const label = 'label';
      const date = new Date('1980-09-21');
      const wrapper = shallow(
        <MapDetailResultDateItem
          label={label}
          date={date}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render future date', () => {
      const label = 'label';
      const date = new Date('2029-12-01');
      const wrapper = shallow(
        <MapDetailResultDateItem
          label={label}
          date={date}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
