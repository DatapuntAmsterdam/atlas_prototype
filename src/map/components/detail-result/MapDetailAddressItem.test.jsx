import React from 'react';
import { shallow } from 'enzyme';

import MapDetailAddressItem from './MapDetailAddressItem';

describe('MapDetailAddressItem', () => {
  describe('rendering', () => {
    it('should render without huisnummertoevoeging', () => {
      const label = 'Address label';
      const values = {
        huisnummer: 1515,
        plaats: 'Amsterdam',
        postcode: '1012MT',
        straatnaam: 'Nieuwendijk'
      };
      const wrapper = shallow(
        <MapDetailAddressItem
          label={label}
          values={values}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with huisnummertoevoeging', () => {
      const label = 'Address label';
      const values = {
        huisnummer: 1515,
        huisnummertoevoeging: 'bis',
        plaats: 'Amsterdam',
        postcode: '1012MT',
        straatnaam: 'Nieuwendijk'
      };
      const wrapper = shallow(
        <MapDetailAddressItem
          label={label}
          values={values}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
