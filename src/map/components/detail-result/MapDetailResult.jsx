import React from 'react';
import PropTypes from 'prop-types';

import MapDetailExplosievenGevrijwaardGebied from './explosieven/MapDetailExplosievenGevrijwaardGebied';
import MapDetailExplosievenInslag from './explosieven/MapDetailExplosievenInslag';
import MapDetailExplosievenUitgevoerdOnderzoek from './explosieven/MapDetailExplosievenUitgevoerdOnderzoek';
import MapDetailExplosievenVerdachtGebied from './explosieven/MapDetailExplosievenVerdachtGebied';
import MapDetailGebiedenBouwblok from './gebieden/MapDetailGebiedenBouwblok';
import MapDetailGebiedenBuurt from './gebieden/MapDetailGebiedenBuurt';
import MapDetailGebiedenGebiedsgerichtWerken from './gebieden/MapDetailGebiedenGebiedsgerichtWerken';
import MapDetailGebiedenGrootstedelijk from './gebieden/MapDetailGebiedenGrootstedelijk';
import MapDetailGebiedenStadsdeel from './gebieden/MapDetailGebiedenStadsdeel';
import MapDetailGebiedenUnesco from './gebieden/MapDetailGebiedenUnesco';
import MapDetailGebiedenWijk from './gebieden/MapDetailGebiedenWijk';
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
  'gebieden/buurtcombinatie', // Wijk (buurtcombinatie)
  'gebieden/buurt', // Buurt
  'gebieden/gebiedsgerichtwerken', // Gebiedsgericht werken
  'gebieden/grootstedelijkgebied', // Grootstedelijk gebied
  'gebieden/stadsdeel', // Stadsdeel
  'gebieden/unesco', // Unesco
  'handelsregister/vestiging', // Vestiging
  'meetbouten/meetbout', // Meetbout
  'milieuthemas/explosieven/gevrijwaardgebied', // Explosieven - Gevrijwaard gebied
  'milieuthemas/explosieven/inslagen', // Explosieven - Inslag
  'milieuthemas/explosieven/uitgevoerdonderzoek', // Explosieven - Uitgevoerd onderzoek
  'milieuthemas/explosieven/verdachtgebied', // Explosieven - Verdacht gebied
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
        <MapDetailGebiedenBouwblok
          panoUrl={panoUrl}
          bouwblok={result}
        />
      );
    case 'gebieden/buurtcombinatie':
      return (
        <MapDetailGebiedenWijk
          panoUrl={panoUrl}
          wijk={result}
        />
      );
    case 'gebieden/buurt':
      return (
        <MapDetailGebiedenBuurt
          panoUrl={panoUrl}
          buurt={result}
        />
      );
    case 'gebieden/gebiedsgerichtwerken':
      return (
        <MapDetailGebiedenGebiedsgerichtWerken
          panoUrl={panoUrl}
          gebiedsgerichtWerken={result}
        />
      );
    case 'gebieden/grootstedelijkgebied':
      return (
        <MapDetailGebiedenGrootstedelijk
          panoUrl={panoUrl}
          grootstedelijk={result}
        />
      );
    case 'gebieden/stadsdeel':
      return (
        <MapDetailGebiedenStadsdeel
          panoUrl={panoUrl}
          stadsdeel={result}
        />
      );
    case 'gebieden/unesco':
      return (
        <MapDetailGebiedenUnesco
          panoUrl={panoUrl}
          unesco={result}
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
