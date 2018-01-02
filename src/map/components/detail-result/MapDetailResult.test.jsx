import React from 'react';
import { shallow } from 'enzyme';

import MapDetailResult
  from './MapDetailResult';
import * as mapDetail from '../../services/map-detail';

jest.mock('../../services/map-detail');

describe('MapDetailResult', () => {
  describe('rendering', () => {
    it('should render adressen ligplaats', () => {
      const endpoint = 'bag/ligplaats/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render adressen nummeraanduiding', () => {
      const endpoint = 'bag/nummeraanduiding/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render adressen openbareruimte', () => {
      const endpoint = 'bag/openbareruimte/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render adressen pand', () => {
      const endpoint = 'bag/pand/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render adressen standplaats', () => {
      const endpoint = 'bag/standplaats/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render adressen verblijfsobject', () => {
      const endpoint = 'bag/verblijfsobject/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render explosieven gevrijwaard gebied', () => {
      const endpoint = 'milieuthemas/explosieven/gevrijwaardgebied/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render explosieven inslag', () => {
      const endpoint = 'milieuthemas/explosieven/inslagen/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render explosieven uitgevoerd onderzoek', () => {
      const endpoint = 'milieuthemas/explosieven/uitgevoerdonderzoek/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render explosieven verdacht gebied', () => {
      const endpoint = 'milieuthemas/explosieven/verdachtgebied/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render gebieden bouwblok', () => {
      const endpoint = 'gebieden/bouwblok/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render gebieden buurt', () => {
      const endpoint = 'gebieden/buurt/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render gebieden gebiedsgericht-werken', () => {
      const endpoint = 'gebieden/gebiedsgerichtwerken/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render gebieden grootstedelijk', () => {
      const endpoint = 'gebieden/grootstedelijkgebied/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render gebieden stadsdeel', () => {
      const endpoint = 'gebieden/stadsdeel/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render gebieden unesco', () => {
      const endpoint = 'gebieden/unesco/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render gebieden wijk', () => {
      const endpoint = 'gebieden/buurtcombinatie/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render kadastraal object', () => {
      const endpoint = 'brk/object/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render meetbout', () => {
      const endpoint = 'meetbouten/meetbout/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render monument', () => {
      const endpoint = 'monumenten/monumenten/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render nap peilmerk', () => {
      const endpoint = 'nap/peilmerk/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render vestiging', () => {
      const endpoint = 'handelsregister/vestiging/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render a non existent component', () => {
      const endpoint = 'non/existent/';
      const panoUrl = 'panoUrl';
      const result = { label: 'value' };
      const wrapper = shallow(
        <MapDetailResult
          endpoint={endpoint}
          panoUrl={panoUrl}
          result={result}
        />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
