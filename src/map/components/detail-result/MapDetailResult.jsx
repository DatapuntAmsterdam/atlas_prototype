import React from 'react';
import PropTypes from 'prop-types';

import { endpointTypes } from '../../services/map-detail';
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

const MapDetailResult = ({ endpoint, panoUrl, result }) => {
  const endpointTypeKey = Object.keys(endpointTypes).find((typeKey) => endpoint.includes(endpointTypes[typeKey]));
  const endpointType = endpointTypes[endpointTypeKey];

  switch (endpointType) {
    case endpointTypes.explosievenGevrijwaardGebied:
      return (
        <MapDetailExplosievenGevrijwaardGebied
          panoUrl={panoUrl}
          gevrijwaardGebied={result}
        />
      );
    case endpointTypes.explosievenInslag:
      return (
        <MapDetailExplosievenInslag
          panoUrl={panoUrl}
          inslag={result}
        />
      );
    case endpointTypes.explosievenUitgevoerdOnderzoek:
      return (
        <MapDetailExplosievenUitgevoerdOnderzoek
          panoUrl={panoUrl}
          uitgevoerdOnderzoek={result}
        />
      );
    case endpointTypes.explosievenVerdachtGebied:
      return (
        <MapDetailExplosievenVerdachtGebied
          panoUrl={panoUrl}
          verdachtGebied={result}
        />
      );
    case endpointTypes.gebiedenBouwblok:
      return (
        <MapDetailGebiedenBouwblok
          panoUrl={panoUrl}
          bouwblok={result}
        />
      );
    case endpointTypes.gebiedenBuurt:
      return (
        <MapDetailGebiedenBuurt
          panoUrl={panoUrl}
          buurt={result}
        />
      );
    case endpointTypes.gebiedenGebiedsgerichtWerken:
      return (
        <MapDetailGebiedenGebiedsgerichtWerken
          panoUrl={panoUrl}
          gebiedsgerichtWerken={result}
        />
      );
    case endpointTypes.gebiedenGrootstedelijk:
      return (
        <MapDetailGebiedenGrootstedelijk
          panoUrl={panoUrl}
          grootstedelijk={result}
        />
      );
    case endpointTypes.gebiedenStadsdeel:
      return (
        <MapDetailGebiedenStadsdeel
          panoUrl={panoUrl}
          stadsdeel={result}
        />
      );
    case endpointTypes.gebiedenUnesco:
      return (
        <MapDetailGebiedenUnesco
          panoUrl={panoUrl}
          unesco={result}
        />
      );
    case endpointTypes.gebiedenWijk:
      return (
        <MapDetailGebiedenWijk
          panoUrl={panoUrl}
          wijk={result}
        />
      );
    case endpointTypes.kadastraalObject:
      return (
        <MapDetailKadastraalObject
          panoUrl={panoUrl}
          kadastraalObject={result}
        />
      );
    case endpointTypes.ligplaats:
    case endpointTypes.nummeraanduiding:
    case endpointTypes.standplaats:
    case endpointTypes.verblijfsobject:
      return (
        <MapDetailNummeraanduiding
          panoUrl={panoUrl}
          nummeraanduiding={result}
        />
      );
    case endpointTypes.meetbout:
      return (
        <MapDetailMeetbout
          panoUrl={panoUrl}
          meetbout={result}
        />
      );
    case endpointTypes.monument:
      return (
        <MapDetailMonument
          panoUrl={panoUrl}
          monument={result}
        />
      );
    case endpointTypes.napPeilmerk:
      return (
        <MapDetailNapPeilmerk
          panoUrl={panoUrl}
          peilmerk={result}
        />
      );
    case endpointTypes.openbareRuimte:
      return (
        <MapDetailOpenbareRuimte
          panoUrl={panoUrl}
          openbareRuimte={result}
        />
      );
    case endpointTypes.pand:
      return (
        <MapDetailPand
          panoUrl={panoUrl}
          pand={result}
        />
      );
    case endpointTypes.vestiging:
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
