import React from 'react';
import { shallow } from 'enzyme';

import MapDetailAdressenVerblijfsobjectGebruiksdoelenItem from './MapDetailAdressenVerblijfsobjectGebruiksdoelenItem';

describe('MapDetailAdressenVerblijfsobjectGebruiksdoelenItem', () => {
  describe('rendering', () => {
    it('should render no more than five gebruiksdoelen', () => {
      const gebruiksdoelen = [{
        code: '01',
        description: 'Description 1'
      }, {
        code: '02',
        description: 'Description 2',
        descriptionPlus: 'Description 2 Plus'
      }, {
        code: '03',
        description: 'Description 3'
      }, {
        code: '04',
        description: 'Description 4'
      }, {
        code: '05',
        description: 'Description 5',
        descriptionPlus: 'Description 5 Plus'
      }, {
        code: '06',
        description: 'Description 6'
      }];
      const wrapper = shallow(
        <MapDetailAdressenVerblijfsobjectGebruiksdoelenItem
          gebruiksdoelen={gebruiksdoelen}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render exactly five gebruiksdoelen', () => {
      const gebruiksdoelen = [{
        code: '01',
        description: 'Description 1'
      }, {
        code: '02',
        description: 'Description 2',
        descriptionPlus: 'Description 2 Plus'
      }, {
        code: '03',
        description: 'Description 3'
      }, {
        code: '04',
        description: 'Description 4'
      }, {
        code: '05',
        description: 'Description 5',
        descriptionPlus: 'Description 5 Plus'
      }];
      const wrapper = shallow(
        <MapDetailAdressenVerblijfsobjectGebruiksdoelenItem
          gebruiksdoelen={gebruiksdoelen}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render two gebruiksdoelen', () => {
      const gebruiksdoelen = [{
        code: '01',
        description: 'Description 1',
        descriptionPlus: 'Description 1 Plus'
      }, {
        code: '02',
        description: 'Description 2'
      }];
      const wrapper = shallow(
        <MapDetailAdressenVerblijfsobjectGebruiksdoelenItem
          gebruiksdoelen={gebruiksdoelen}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render one gebruiksdoel', () => {
      const gebruiksdoelen = [{
        code: '01',
        description: 'Description 1'
      }];
      const wrapper = shallow(
        <MapDetailAdressenVerblijfsobjectGebruiksdoelenItem
          gebruiksdoelen={gebruiksdoelen}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no gebruiksdoelen', () => {
      const gebruiksdoelen = [];
      const wrapper = shallow(
        <MapDetailAdressenVerblijfsobjectGebruiksdoelenItem
          gebruiksdoelen={gebruiksdoelen}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
