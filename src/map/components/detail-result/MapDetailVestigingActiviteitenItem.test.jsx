import React from 'react';
import { shallow } from 'enzyme';

import MapDetailVestigingActiviteitenItem from './MapDetailVestigingActiviteitenItem';

describe('MapDetailVestigingActiviteitenItem', () => {
  describe('rendering', () => {
    it('should render two activities', () => {
      const activities = [{
        sbiCode: '01',
        sbiDescription: 'SBI Description 1'
      }, {
        sbiCode: '02',
        sbiDescription: 'SBI Description 2'
      }];
      const wrapper = shallow(
        <MapDetailVestigingActiviteitenItem
          activities={activities}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render one activity', () => {
      const activities = [{
        sbiCode: '01',
        sbiDescription: 'SBI Description 1'
      }];
      const wrapper = shallow(
        <MapDetailVestigingActiviteitenItem
          activities={activities}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no activities', () => {
      const activities = [];
      const wrapper = shallow(
        <MapDetailVestigingActiviteitenItem
          activities={activities}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
