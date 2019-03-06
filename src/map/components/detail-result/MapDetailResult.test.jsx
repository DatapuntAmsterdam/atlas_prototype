import React from 'react';
import { shallow } from 'enzyme';
import MapDetailResult from './MapDetailResult';

jest.mock('../../services/map-detail');

describe('MapDetailResult', () => {
  it('should render adressen ligplaats', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'bag/ligplaats/',
      label: 'value',
      status: { description: 'description' }
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render adressen nummeraanduiding', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'bag/nummeraanduiding/',
      label: 'value',
      status: { description: 'description' }
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render adressen openbareruimte', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'bag/openbareruimte/',
      label: 'value',
      status: { description: 'description' }
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render adressen pand', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'bag/pand/',
      label: 'value',
      status: { description: 'description' }
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        panoUrl={panoUrl}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render adressen standplaats', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'bag/standplaats/',
      label: 'value',
      status: { description: 'description' }
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render adressen verblijfsobject', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'bag/verblijfsobject/',
      label: 'value',
      status: { description: 'description' }
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render bedrijfsinvesteringszone', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'vsd/biz/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render explosieven gevrijwaard gebied', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'milieuthemas/explosieven/gevrijwaardgebied/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render explosieven inslag', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'milieuthemas/explosieven/inslagen/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render explosieven uitgevoerd onderzoek', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'milieuthemas/explosieven/uitgevoerdonderzoek/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render explosieven verdacht gebied', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'milieuthemas/explosieven/verdachtgebied/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render gebieden bouwblok', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'gebieden/bouwblok/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render gebieden buurt', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'gebieden/buurt/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render gebieden gebiedsgericht-werken', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'gebieden/gebiedsgerichtwerken/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render gebieden grootstedelijk', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'gebieden/grootstedelijkgebied/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render gebieden stadsdeel', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'gebieden/stadsdeel/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render gebieden unesco', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'gebieden/unesco/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render gebieden wijk', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'gebieden/buurtcombinatie/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render grondexploitatie', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'grondexploitatie/project/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render kadastraal object', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'brk/object/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render meetbout', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'meetbouten/meetbout/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render monument', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'monumenten/monumenten/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render nap peilmerk', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'nap/peilmerk/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render oplaadpuntent', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'vsd/oplaadpunten/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render de parkeervak', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'parkeervakken/parkeervakken/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        panoUrl={panoUrl}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render vestiging', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'handelsregister/vestiging/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render winkelgebieden', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'vsd/winkgeb/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render a non existent component', () => {
    const panoUrl = 'panoUrl';
    const result = {
      endpointType: 'non/existent/',
      label: 'value'
    };
    const clickHandler = jest.fn();
    const wrapper = shallow(
      <MapDetailResult
        panoUrl={panoUrl}
        onMaximize={clickHandler}
        onPanoPreviewClick={clickHandler}
        result={result}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
