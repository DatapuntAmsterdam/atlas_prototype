import React from 'react';
import { shallow } from 'enzyme';

import MapDetailExplosievenUitgevoerdOnderzoek from './MapDetailExplosievenUitgevoerdOnderzoek';

describe('MapDetailExplosievenUitgevoerdOnderzoek', () => {
  describe('rendering', () => {
    it('should render everything', () => {
      const uitgevoerdOnderzoek = {
        date: new Date('1919-12-31'),
        label: 'Uitgevoerd onderzoek label',
        onderzoeksgebied: 'Uitgevoerd onderzoek onderzoeksgebied',
        type: 'Uitgevoerd onderzoek type',
        verdachtGebied: 'Uitgevoerd onderzoek verdacht gebied'
      };
      const panoUrl = 'panoUrl';
      const wrapper = shallow(
        <MapDetailExplosievenUitgevoerdOnderzoek
          panoUrl={panoUrl}
          uitgevoerdOnderzoek={uitgevoerdOnderzoek}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without pano url', () => {
      const uitgevoerdOnderzoek = {
        date: new Date('1919-12-31'),
        label: 'Uitgevoerd onderzoek label',
        onderzoeksgebied: 'Uitgevoerd onderzoek onderzoeksgebied',
        type: 'Uitgevoerd onderzoek type',
        verdachtGebied: 'Uitgevoerd onderzoek verdacht gebied'
      };
      const wrapper = shallow(
        <MapDetailExplosievenUitgevoerdOnderzoek
          uitgevoerdOnderzoek={uitgevoerdOnderzoek}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
