import reducer from './reducer';

import * as selectors from './selectors';
import {
  fetchPanoramaRequest,
  fetchPanoramaSuccess,
  setPanoramaOrientation,
  setPanoramaTags
} from './actions';
import { PANORAMA_CONFIG } from '../services/panorama-api/panorama-api';

describe('Panorama Reducer', () => {
  beforeAll(() => {
    PANORAMA_CONFIG.default = {
      DEFAULT_FOV: 79
    };
  });

  it('should set the initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual({
      date: null,
      fov: null,
      heading: 0,
      tags: ['mission-bi'],
      hotspots: [],
      image: null,
      isLoading: true,
      detailReference: [],
      pageReference: '',
      location: null,
      targetLocation: null,
      pitch: 0
    });
  });

  describe('fetchPanoramaRequest', () => {
    it('when heading is not in payload, use oldstate heading', () => {
      const inputState = {
        fov: 1,
        pitch: 2,
        date: 'today',
        heading: 179,
        hotspots: ['a', 'b'],
        location: ['lat', 'lon'],
        image: 'http://example.com/example.png'
      };
      const newState = reducer(inputState, fetchPanoramaRequest('abc'));
      expect(newState.heading).toBe(inputState.heading);
    });
  });

  describe('setPanoramaTags', () => {
    it('sets the tags', () => {
      expect(
        reducer({}, setPanoramaTags(['mission-bi', 'mission-2018']))
      ).toEqual({
        tags: ['mission-bi', 'mission-2018']
      });
    });
  });

  describe('setPanorama', () => {
    const payload = {
      date: new Date('2016-05-19T13:04:15.341110Z'),
      hotspots: [{
        id: 'ABC',
        heading: 179,
        distance: 3
      }],
      location: [52, 4],
      image: {
        pattern: 'http://example.com/example/{this}/{that}/{whatever}.png',
        preview: 'http://example.com/example/preview.png'
      }
    };

    let inputState;
    beforeEach(() => {
      inputState = {
        isLoading: true,
        id: 'ABC',
        heading: 123
      };
    });

    it('Adds the payload to the state', () => {
      const newState = reducer(inputState, fetchPanoramaSuccess(payload));
      expect(newState).toEqual(jasmine.objectContaining(payload));
    });

    it('set defaults for pitch, fov when oldstate is unknown', () => {
      const newState = reducer(inputState, fetchPanoramaSuccess(payload));
      expect(newState.pitch).toBe(0);
      expect(newState.fov).toBe(80);
    });

    it('set Pitch and fov to output when oldstate is known', () => {
      inputState.pitch = 1;
      inputState.fov = 2;

      const newState = reducer(inputState, fetchPanoramaSuccess(payload));
      expect(newState.pitch).toBe(1);
      expect(newState.fov).toBe(2);
    });

    it('Sets loading to false', () => {
      const output = reducer(inputState, fetchPanoramaSuccess(payload));
      expect(output.isLoading).toBe(false);
    });
  });

  describe('setPanoramaOrientation', () => {
    it('updates the orientation', () => {
      const inputState = {
        pitch: 1,
        fov: 2
      };
      const payload = {
        heading: 91,
        pitch: 1,
        fov: 2
      };
      const output = reducer(inputState, setPanoramaOrientation(payload));

      expect(output.heading)
        .toEqual(payload.heading);
      expect(output.pitch)
        .toEqual(payload.pitch);
      expect(output.fov)
        .toEqual(payload.fov);
    });
  });
});

// SELECTORS
describe('panorama selectors', () => {
  const panorama = {
    location: [10, 10],
    heading: -134
  };

  describe('getPanorama', () => {
    it('should return panorama from the state', () => {
      const selected = selectors.getPanorama({ panorama });
      expect(selected).toEqual(panorama);
    });
  });

  describe('getPanoramaLocation', () => {
    it('should return the location from the panorama', () => {
      const selected = selectors.getPanoramaLocation.resultFunc(panorama);
      expect(selected).toEqual(panorama.location);
    });

    it('should return an empty string if panorama is empty', () => {
      const selected = selectors.getPanoramaLocation.resultFunc('');
      expect(selected).toEqual([]);
    });
  });

  describe('getPanoramaMarkers', () => {
    const { location, heading } = panorama;
    it('should return an array of with 2 markers', () => {
      const selected = selectors.getPanoramaMarkers.resultFunc(location, heading);
      expect(selected).toEqual([
        {
          position: location,
          type: 'panoramaOrientationType',
          heading
        },
        {
          position: location,
          type: 'panoramaPersonType'
        }
      ]);
    });

    it('should return an empty array if there is no location', () => {
      const selected = selectors.getPanoramaMarkers.resultFunc('', heading);
      expect(selected).toEqual([]);
    });

    it('should return an array of with 2 markers with a default heading of 0 if there is no heading', () => {
      const selected = selectors.getPanoramaMarkers.resultFunc(location, '');
      expect(selected).toEqual([
        {
          position: location,
          type: 'panoramaOrientationType',
          heading: 0
        },
        {
          position: location,
          type: 'panoramaPersonType'
        }
      ]);
    });
  });
});
