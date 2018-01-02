import React from 'react';
import { shallow } from 'enzyme';

import MapDetailAdressenVerblijfsobject from './MapDetailAdressenVerblijfsobject';

describe('MapDetailAdressenVerblijfsobject', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const verblijfsobject = {
        eigendomsverhouding: 'Verblijfsobject eigendomsverhouding',
        gebruiksdoelen: [{
          code: '01',
          description: 'Gebruiksdoel description 1'
        }, {
          code: '0400',
          description: 'Gebruiksdoel description 2',
          descriptionPlus: 'Gebruiksdoel description plus'
        }],
        label: 'Verblijfsobject label',
        size: 15,
        type: 'Verblijfsobject type'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailAdressenVerblijfsobject
          panoUrl={panoUrl}
          verblijfsobject={verblijfsobject}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const verblijfsobject = {
        eigendomsverhouding: 'Verblijfsobject eigendomsverhouding',
        gebruiksdoelen: [{
          code: '01',
          description: 'Gebruiksdoel description 1'
        }, {
          code: '0400',
          description: 'Gebruiksdoel description 2',
          descriptionPlus: 'Gebruiksdoel description plus'
        }],
        label: 'Verblijfsobject label',
        size: 15,
        type: 'Verblijfsobject type'
      };
      const wrapper = shallow(
        <MapDetailAdressenVerblijfsobject
          verblijfsobject={verblijfsobject}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with zero value for size', () => {
      const verblijfsobject = {
        eigendomsverhouding: 'Verblijfsobject eigendomsverhouding',
        gebruiksdoelen: [{
          code: '01',
          description: 'Gebruiksdoel description 1'
        }, {
          code: '0400',
          description: 'Gebruiksdoel description 2',
          descriptionPlus: 'Gebruiksdoel description plus'
        }],
        label: 'Verblijfsobject label',
        size: 0,
        type: 'Verblijfsobject type'
      };
      const wrapper = shallow(
        <MapDetailAdressenVerblijfsobject
          verblijfsobject={verblijfsobject}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render size', () => {
      const verblijfsobject = {
        eigendomsverhouding: 'Verblijfsobject eigendomsverhouding',
        gebruiksdoelen: [{
          code: '01',
          description: 'Gebruiksdoel description 1'
        }, {
          code: '0400',
          description: 'Gebruiksdoel description 2',
          descriptionPlus: 'Gebruiksdoel description plus'
        }],
        label: 'Verblijfsobject label',
        type: 'Verblijfsobject type'
      };
      const wrapper = shallow(
        <MapDetailAdressenVerblijfsobject
          verblijfsobject={verblijfsobject}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
