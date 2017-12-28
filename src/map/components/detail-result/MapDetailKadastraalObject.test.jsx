import React from 'react';
import { shallow } from 'enzyme';

import MapDetailKadastraalObject from './MapDetailKadastraalObject';

describe('MapDetailKadastraalObject', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const kadastraalObject = {
        kadastraleGemeente: {
          label: 'Kadastrale gemeente label',
          name: 'Kadastrale gemeente name'
        },
        label: 'Kadastraal object label',
        objectNumber: '123ABC',
        size: 115
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailKadastraalObject
          panoUrl={panoUrl}
          kadastraalObject={kadastraalObject}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without kadastrale gemeente', () => {
      const kadastraalObject = {
        label: 'Kadastraal object label',
        objectNumber: '123ABC',
        size: 115
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailKadastraalObject
          panoUrl={panoUrl}
          kadastraalObject={kadastraalObject}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const kadastraalObject = {
        label: 'Kadastraal object label',
        objectNumber: '123ABC',
        size: 115
      };
      const wrapper = shallow(
        <MapDetailKadastraalObject
          kadastraalObject={kadastraalObject}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with zero value for size', () => {
      const kadastraalObject = {
        label: 'Kadastraal object label',
        objectNumber: '123ABC',
        size: 0
      };
      const wrapper = shallow(
        <MapDetailKadastraalObject
          kadastraalObject={kadastraalObject}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
