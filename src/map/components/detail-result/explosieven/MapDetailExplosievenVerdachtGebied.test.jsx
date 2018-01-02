import React from 'react';
import { shallow } from 'enzyme';

import MapDetailExplosievenVerdachtGebied from './MapDetailExplosievenVerdachtGebied';

describe('MapDetailExplosievenVerdachtGebied', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const verdachtGebied = {
        label: 'Verdacht gebied label',
        remarks: 'Verdacht gebied remarks',
        subType: 'Verdacht gebied sub type',
        type: 'Verdacht gebied type'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailExplosievenVerdachtGebied
          panoUrl={panoUrl}
          verdachtGebied={verdachtGebied}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const verdachtGebied = {
        label: 'Verdacht gebied label',
        remarks: 'Verdacht gebied remarks',
        subType: 'Verdacht gebied sub type',
        type: 'Verdacht gebied type'
      };
      const wrapper = shallow(
        <MapDetailExplosievenVerdachtGebied
          verdachtGebied={verdachtGebied}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
