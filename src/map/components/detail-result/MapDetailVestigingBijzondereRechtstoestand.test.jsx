import React from 'react';
import { shallow } from 'enzyme';

import MapDetailVestigingBijzondereRechtstoestand
  from './MapDetailVestigingBijzondereRechtstoestand';

describe('MapDetailVestigingBijzondereRechtstoestand', () => {
  describe('rendering', () => {
    it('should render nothing special', () => {
      const values = {
        faillissement: false,
        status: 'Something'
      };
      const wrapper = shallow(
        <MapDetailVestigingBijzondereRechtstoestand
          values={values}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render faillissement', () => {
      const values = {
        faillissement: true
      };
      const wrapper = shallow(
        <MapDetailVestigingBijzondereRechtstoestand
          values={values}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render in surseance van betaling when `Voorlopig`', () => {
      const values = {
        status: 'Voorlopig'
      };
      const wrapper = shallow(
        <MapDetailVestigingBijzondereRechtstoestand
          values={values}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render in surseance van betaling when `Definitief`', () => {
      const values = {
        status: 'Definitief'
      };
      const wrapper = shallow(
        <MapDetailVestigingBijzondereRechtstoestand
          values={values}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
