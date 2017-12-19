import React from 'react';
import PropTypes from 'prop-types';

import MapDetailBouwblok from './MapDetailBouwblok';
import MapDetailBuurt from './MapDetailBuurt';
import MapDetailGebiedsgerichtWerken from './MapDetailGebiedsgerichtWerken';
import MapDetailExplosievenGevrijwaardGebied from './MapDetailExplosievenGevrijwaardGebied';
import MapDetailExplosievenUitgevoerdOnderzoek from './MapDetailExplosievenUitgevoerdOnderzoek';
import MapDetailExplosievenVerdachtGebied from './MapDetailExplosievenVerdachtGebied';
import MapDetailExplosievenInslag from './MapDetailExplosievenInslag';
import MapDetailKadastraalObject from './MapDetailKadastraalObject';
import MapDetailMeetbout from './MapDetailMeetbout';
import MapDetailMonument from './MapDetailMonument';
import MapDetailNapPeilmerk from './MapDetailNapPeilmerk';
import MapDetailNummeraanduiding from './MapDetailNummeraanduiding';
import MapDetailOpenbareRuimte from './MapDetailOpenbareRuimte';
import MapDetailPand from './MapDetailPand';
import MapDetailVestiging from './MapDetailVestiging';

const endpointTypes = [
  'bag/ligplaats', // Ligplaats
  'bag/nummeraanduiding', // Verblijfsobject
  'bag/openbareruimte', // Openbare ruimte
  'bag/pand', // Pand
  'bag/standplaats', // Standplaats
  'bag/verblijfsobject', // Also verblijfsobject (different endpoint)
  'brk/object', // Kadastraal object
  'gebieden/bouwblok', // Bouwblok
  'gebieden/buurt', // Buurt
  'gebieden/gebiedsgerichtwerken', // Gebiedsgericht werken
  'handelsregister/vestiging', // Vestiging
  'meetbouten/meetbout', // Meetbout
  'milieuthemas/explosieven/gevrijwaardgebied', // Explosieven - Gevrijwaard gebied
  'milieuthemas/explosieven/uitgevoerdonderzoek', // Explosieven - Uitgevoerd onderzoek
  'milieuthemas/explosieven/verdachtgebied', // Explosieven - Verdacht gebied
  'milieuthemas/explosieven/inslagen', // Explosieven - Inslag
  'monumenten/monumenten', // Monument
  'nap/peilmerk' // NAP Peilmerk
];

const MapDetailResult = ({ endpoint, panoUrl, result }) => {
  const endpointType = endpointTypes.find((type) => endpoint.includes(type));

  switch (endpointType) {
    case 'bag/ligplaats':
    case 'bag/nummeraanduiding':
    case 'bag/standplaats':
    case 'bag/verblijfsobject':
      return (
        <MapDetailNummeraanduiding
          panoUrl={panoUrl}
          nummeraanduiding={result}
        />
      );
    case 'bag/openbareruimte':
      return (
        <MapDetailOpenbareRuimte
          panoUrl={panoUrl}
          openbareRuimte={result}
        />
      );
    case 'bag/pand':
      return (
        <MapDetailPand
          panoUrl={panoUrl}
          pand={result}
        />
      );
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
    case 'gebieden/buurt':
      return (
        <MapDetailBuurt
          panoUrl={panoUrl}
          buurt={result}
        />
      );
    case 'gebieden/gebiedsgerichtwerken':
      return (
        <MapDetailGebiedsgerichtWerken
          panoUrl={panoUrl}
          gebiedsgerichtWerken={result}
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
    case 'milieuthemas/explosieven/gevrijwaardgebied':
      return (
        <MapDetailExplosievenGevrijwaardGebied
          panoUrl={panoUrl}
          gevrijwaardGebied={result}
        />
      );
    case 'milieuthemas/explosieven/inslagen':
      return (
        <MapDetailExplosievenInslag
          panoUrl={panoUrl}
          inslag={result}
        />
      );
    case 'milieuthemas/explosieven/uitgevoerdonderzoek':
      return (
        <MapDetailExplosievenUitgevoerdOnderzoek
          panoUrl={panoUrl}
          uitgevoerdOnderzoek={result}
        />
      );
    case 'milieuthemas/explosieven/verdachtgebied':
      return (
        <MapDetailExplosievenVerdachtGebied
          panoUrl={panoUrl}
          verdachtGebied={result}
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
