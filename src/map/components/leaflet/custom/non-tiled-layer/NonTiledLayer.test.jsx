import React from 'react';
import { shallow } from 'enzyme';
import NonTiledLayer from './NonTiledLayer';

function renderComponent() {
  return shallow(
    <NonTiledLayer
      url="url"
      params={{ test: '123' }}
    />, {
      context: {
        layerContainer: {
          addLayer: jest.fn()
        }
      }
    }
  );
}

describe('NonTiledLayer', () => {
  const props = {
    opacity: 100,
    url: 'https://pano.amsterdam.nl',
    params: {
      mission_type: 'bi',
      mission_year: 2017
    }
  };

  it('should render everything', () => {
    const wrapper = renderComponent();
    wrapper.instance().createLeafletElement({ props });

    expect(wrapper).toMatchSnapshot();
  });

  it('should rerender everything when props change', () => {
    const wrapper = renderComponent();
    const setParamsMock = jest.fn();

    wrapper.instance().leafletElement = {
      setParams: setParamsMock,
      setOpacity: jest.fn(),
      setUrl: jest.fn(),
      wmsParams: {}
    };

    wrapper.instance().updateLeafletElement({ props }, { props });
    expect(setParamsMock).not.toHaveBeenCalled();

    wrapper.instance().updateLeafletElement({ props }, { ...props, params: { mission_type: 'WOZ', mission_year: 2018 } });
    expect(setParamsMock).toHaveBeenCalled();
  });
});
