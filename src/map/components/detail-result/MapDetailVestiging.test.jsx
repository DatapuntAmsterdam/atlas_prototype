import React from 'react';
import { shallow } from 'enzyme';

import MapDetailVestiging from './MapDetailVestiging';

describe('MapDetailVestiging', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const vestiging = {
        activities: [{
          sbiCode: '01',
          sbiDescription: 'SBI Description 1'
        }, {
          sbiCode: '02',
          sbiDescription: 'SBI Description 2'
        }],
        bijzondereRechtstoestand: { status: 'Bijzondere rechtstoestand' },
        kvkNumber: '123456',
        label: 'Vestiging label',
        visitingAddress: { plaats: 'Amsterdam' }
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailVestiging
          panoUrl={panoUrl}
          vestiging={vestiging}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const vestiging = {
        activities: [{
          sbiCode: '01',
          sbiDescription: 'SBI Description 1'
        }, {
          sbiCode: '02',
          sbiDescription: 'SBI Description 2'
        }],
        bijzondereRechtstoestand: { status: 'Bijzondere rechtstoestand' },
        kvkNumber: '123456',
        label: 'Vestiging label',
        visitingAddress: { plaats: 'Amsterdam' }
      };
      const wrapper = shallow(
        <MapDetailVestiging
          vestiging={vestiging}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without label', () => {
      const vestiging = {
        activities: [{
          sbiCode: '01',
          sbiDescription: 'SBI Description 1'
        }, {
          sbiCode: '02',
          sbiDescription: 'SBI Description 2'
        }],
        bijzondereRechtstoestand: { status: 'Bijzondere rechtstoestand' },
        kvkNumber: '123456',
        visitingAddress: { plaats: 'Amsterdam' }
      };
      const wrapper = shallow(
        <MapDetailVestiging
          vestiging={vestiging}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
