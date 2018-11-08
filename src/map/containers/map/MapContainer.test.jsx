import React from 'react';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';

import MapContainer, { overrideLeafletGetBounds } from './MapContainer';

import piwikTracker from '../../../shared/services/piwik-tracker/piwik-tracker';

jest.mock('../../../shared/services/piwik-tracker/piwik-tracker');

let initialState;

describe('overrideLeafletGetBounds', () => {
  it('should overide the getBounds', () => {
    const bl = { x: 482988, y: -551411 };
    const tr = { x: 484747, y: -552666 };
    const pixelBounds = {
      max: { x: 484747, y: -551411 },
      min: { x: 482988, y: -552666 },
      getBottomLeft: () => bl,
      getTopRight: () => tr
    };

    const sw = { lat: 52.35884827870951, lng: 4.877935872162896 };
    const ne = { lat: 52.36841402615222, lng: 4.8995211251421305 };

    const resultBounds = {
      _northEast: {
        lat: 52.36860534110108,
        lng: 4.899952830201715
      },

      _southWest: {
        lat: 52.35865696376065,
        lng: 4.877504167103311
      }
    };
    const map = {
      getPixelBounds: jest.fn(() => pixelBounds),
      unproject: jest.fn((p) => {
        if (p.x === 482988) return sw;
        return ne;
      })
    };

    overrideLeafletGetBounds(map);
    expect(map.getBounds).toBeDefined();
    const bounds = map.getBounds();
    expect(bounds).toEqual(resultBounds);
  });
});

describe('MapContainer', () => {
  beforeEach(() => {
    initialState = {
      ui: {
        isMapFullscreen: false
      },
      map: {
        drawingMode: 'none'
      }
    };
  });

  it('should render', () => {
    const store = configureMockStore()({ ...initialState });
    const wrapper = shallow(<MapContainer />, { context: { store } }).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with drawingmode: draw', () => {
    const store = configureMockStore()({ ...initialState, map: { drawingMode: 'draw' } });
    const wrapper = shallow(<MapContainer />, { context: { store } }).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it('should set the leaflet instance state', () => {
    const store = configureMockStore()({ ...initialState });
    const wrapper = shallow(<MapContainer />, { context: { store } }).dive();
    wrapper.instance().setLeafletInstance({});
    expect(wrapper.instance().state.leafletInstance).toBeTruthy();
    expect(wrapper.instance().state.leafletInstance.getBounds).toBeDefined();
  });

  it('should hide the fullscreen and send piwik action', () => {
    const store = configureMockStore()({ ...initialState, ui: { isMapFullscreen: true } });
    const wrapper = shallow(<MapContainer />, { context: { store } }).dive();
    wrapper.instance().onToggleFullscreen();
    piwikTracker.mockImplementation(() => jest.fn());
    expect(piwikTracker).toHaveBeenCalled();
    // should not send another piwik event if map is maximized
    wrapper.setProps({ isFullscreen: false });
    wrapper.instance().onToggleFullscreen();
    expect(piwikTracker).toHaveBeenCalledTimes(1);
  });
});
