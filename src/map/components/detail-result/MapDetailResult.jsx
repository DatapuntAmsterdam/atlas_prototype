import React from 'react';
import PropTypes from 'prop-types';

import MapDetailKadastraalObject from './MapDetailKadastraalObject';
import MapDetailBouwblok from './MapDetailBouwblok';
import MapDetailMeetbout from './MapDetailMeetbout';
import MapDetailNapPeilmerk from './MapDetailNapPeilmerk';
import MapDetailInslag from './MapDetailInslag';
import MapDetailMonument from './MapDetailMonument';
import MapDetailVestiging from './MapDetailVestiging';

const endpointTypes = [
  'brk/object', // Kadastraal object
  'gebieden/bouwblok', // Bouwblok
  'handelsregister/vestiging', // Vestiging
  'meetbouten/meetbout', // Meetbout
  'milieuthemas/explosieven/inslagen', // Inslag
  'monumenten/monumenten', // Monument
  'nap/peilmerk' // NAP Peilmerk
];

const MapDetailResult = ({ endpoint, panoUrl, result }) => {
  const endpointType = endpointTypes.find((type) => endpoint.includes(type));

  switch (endpointType) {
    case 'brk/object':
      return (
        <MapDetailKadastraalObject
          panoUrl={panoUrl}
          kadastraalObject={result}
        />
      );
    case 'gebieden/bouwblok':
      return (
        <MapDetailBouwblok
          panoUrl={panoUrl}
          bouwblok={result}
        />
      );
    case 'meetbouten/meetbout':
      return (
        <MapDetailMeetbout
          panoUrl={panoUrl}
          meetbout={result}
        />
      );
    case 'nap/peilmerk':
      return (
        <MapDetailNapPeilmerk
          panoUrl={panoUrl}
          peilmerk={result}
        />
      );
    case 'milieuthemas/explosieven/inslagen':
      return (
        <MapDetailInslag
          panoUrl={panoUrl}
          inslag={result}
        />
      );
    case 'monumenten/monumenten':
      return (
        <MapDetailMonument
          panoUrl={panoUrl}
          monument={result}
        />
      );
    case 'handelsregister/vestiging':
      return (
        <MapDetailVestiging
          panoUrl={panoUrl}
          result={result}
        />
      );
    default:
      return '';
  }
};

MapDetailResult.defaultProps = {
  panoUrl: '',
  result: {}
};

MapDetailResult.propTypes = {
  endpoint: PropTypes.string.isRequired,
  panoUrl: PropTypes.string,
  result: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

export default MapDetailResult;
