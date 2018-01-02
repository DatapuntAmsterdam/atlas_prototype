import React from 'react';
import { shallow } from 'enzyme';

import MapDetailVestigingActiviteitenItem from './MapDetailVestigingActiviteitenItem';

describe('MapDetailVestigingActiviteitenItem', () => {
  describe('rendering', () => {
    it('should render no more than five activities', () => {
      const activities = [{
        sbiCode: '01',
        sbiDescription: 'SBI Description 1'
      }, {
        sbiCode: '02',
        sbiDescription: 'SBI Description 2'
      }, {
        sbiCode: '03',
        sbiDescription: 'SBI Description 3'
      }, {
        sbiCode: '04',
        sbiDescription: 'SBI Description 4'
      }, {
        sbiCode: '05',
        sbiDescription: 'SBI Description 5'
      }, {
        sbiCode: '06',
        sbiDescription: 'SBI Description 6'
      }];
      const wrapper = shallow(
        <MapDetailVestigingActiviteitenItem
          activities={activities}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render exactly five activities', () => {
      const activities = [{
        sbiCode: '01',
        sbiDescription: 'SBI Description 1'
      }, {
        sbiCode: '02',
        sbiDescription: 'SBI Description 2'
      }, {
        sbiCode: '03',
        sbiDescription: 'SBI Description 3'
      }, {
        sbiCode: '04',
        sbiDescription: 'SBI Description 4'
      }, {
        sbiCode: '05',
        sbiDescription: 'SBI Description 5'
      }];
      const wrapper = shallow(
        <MapDetailVestigingActiviteitenItem
          activities={activities}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

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
