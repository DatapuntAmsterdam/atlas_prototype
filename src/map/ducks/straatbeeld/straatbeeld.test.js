import {
  FETCH_STRAATBEELD_BY_ID,
  getStraatbeeld,
  getStraatbeeldLocation,
  getStraatbeeldHeading,
  getStraatbeeldMarkers,
  fetchStraatbeeldById
} from './straatbeeld';

// SELECTORS
describe('straatbeeld selectors', () => {
  const straatbeeld = {
    location: [10, 10],
    heading: -134
  };
  describe('getStraatbeeld', () => {
    it('should return straatbeeld from the state', () => {
      const selected = getStraatbeeld({ straatbeeld });
      expect(selected).toEqual(straatbeeld);
    });
  });

  describe('getStraatbeeldLocation', () => {
    it('should return the location from the straatbeeld', () => {
      const selected = getStraatbeeldLocation.resultFunc(straatbeeld);
      expect(selected).toEqual(straatbeeld.location);
    });

    it('should return an empty string if straatbeeld is empty', () => {
      const selected = getStraatbeeldLocation.resultFunc('');
      expect(selected).toEqual('');
    });
  });

  describe('getStraatbeeldHeading', () => {
    it('should return the location from the straatbeeld', () => {
      const selected = getStraatbeeldHeading.resultFunc(straatbeeld);
      expect(selected).toEqual(straatbeeld.heading);
    });

    it('should return an empty string if straatbeeld is empty', () => {
      const selected = getStraatbeeldHeading.resultFunc('');
      expect(selected).toEqual('');
    });
  });

  describe('getStraatbeeldMarkers', () => {
    const { location, heading } = straatbeeld;
    it('should return an array of with 2 markers', () => {
      const selected = getStraatbeeldMarkers.resultFunc(location, heading);
      expect(selected).toEqual([
        {
          position: location,
          type: 'straatbeeldOrientationType',
          heading
        },
        {
          position: location,
          type: 'straatbeeldPersonType'
        }
      ]);
    });

    it('should return an empty array if there is no location', () => {
      const selected = getStraatbeeldMarkers.resultFunc('', heading);
      expect(selected).toEqual([]);
    });

    it('should return an array of with 2 markers with a default heading of 0 if there is no heading', () => {
      const selected = getStraatbeeldMarkers.resultFunc(location, '');
      expect(selected).toEqual([
        {
          position: location,
          type: 'straatbeeldOrientationType',
          heading: 0
        },
        {
          position: location,
          type: 'straatbeeldPersonType'
        }
      ]);
    });
  });
});


// ACTION CREATORS
describe('actions', () => {
  describe('fetchMapBaseLayers', () => {
    it('should create an action to request straatbeeld by id', () => {
      const expectedAction = {
        type: FETCH_STRAATBEELD_BY_ID,
        payload: {
          id: 'id',
          heading: -130
        }
      };
      expect(fetchStraatbeeldById(expectedAction.payload)).toEqual(expectedAction);
    });
  });
});
