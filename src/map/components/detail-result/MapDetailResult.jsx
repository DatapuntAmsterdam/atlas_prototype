import React from 'react';
import PropTypes from 'prop-types';

import { endpointTypes } from '../../services/map-detail';

import MapDetailResultHeader from './MapDetailResultHeader';
import MapDetailAdressenLigplaats from './adressen/MapDetailAdressenLigplaats';
import MapDetailAdressenOpenbareRuimte from './adressen/MapDetailAdressenOpenbareRuimte';
import MapDetailAdressenPand from './adressen/MapDetailAdressenPand';
import MapDetailAdressenStandplaats from './adressen/MapDetailAdressenStandplaats';
import MapDetailAdressenVerblijfsobject from './adressen/MapDetailAdressenVerblijfsobject';
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
import MapDetailVestiging from './MapDetailVestiging';

const getEndpointType = (endpoint) => {
  const endpointTypeKey = Object.keys(endpointTypes).find(
    (typeKey) => endpoint.includes(endpointTypes[typeKey])
  );
  return endpointTypes[endpointTypeKey];
};

const renderContent = ({ endpointType, result }) => {
  let content;
  let title;

  switch (endpointType) {
    case endpointTypes.adressenLigplaats:
      title = 'MapDetailAdressenLigplaats';
      content = (
        <MapDetailAdressenLigplaats
          ligplaats={result}
        />
      );
      break;
    case endpointTypes.adressenNummeraanduiding:
    case endpointTypes.adressenVerblijfsobject:
      title = 'Adres';
      content = (
        <MapDetailAdressenVerblijfsobject
          verblijfsobject={result}
        />
      );
      break;
    case endpointTypes.adressenOpenbareRuimte:
      title = 'MapDetailAdressenOpenbareRuimte';
      content = (
        <MapDetailAdressenOpenbareRuimte
          openbareRuimte={result}
        />
      );
      break;
    case endpointTypes.adressenPand:
      title = 'MapDetailAdressenPand';
      content = (
        <MapDetailAdressenPand
          pand={result}
        />
      );
      break;
    case endpointTypes.adressenStandplaats:
      title = 'MapDetailAdressenStandplaats';
      content = (
        <MapDetailAdressenStandplaats
          standplaats={result}
        />
      );
      break;
    case endpointTypes.explosievenGevrijwaardGebied:
      title = 'MapDetailExplosievenGevrijwaardGebied';
      content = (
        <MapDetailExplosievenGevrijwaardGebied
          gevrijwaardGebied={result}
        />
      );
      break;
    case endpointTypes.explosievenInslag:
      title = 'MapDetailExplosievenInslag';
      content = (
        <MapDetailExplosievenInslag
          inslag={result}
        />
      );
      break;
    case endpointTypes.explosievenUitgevoerdOnderzoek:
      title = 'MapDetailExplosievenUitgevoerdOnderzoek';
      content = (
        <MapDetailExplosievenUitgevoerdOnderzoek
          uitgevoerdOnderzoek={result}
        />
      );
      break;
    case endpointTypes.explosievenVerdachtGebied:
      title = 'MapDetailExplosievenVerdachtGebied';
      content = (
        <MapDetailExplosievenVerdachtGebied
          verdachtGebied={result}
        />
      );
      break;
    case endpointTypes.gebiedenBouwblok:
      title = 'MapDetailGebiedenBouwblok';
      content = (
        <MapDetailGebiedenBouwblok
          bouwblok={result}
        />
      );
      break;
    case endpointTypes.gebiedenBuurt:
      title = 'MapDetailGebiedenBuurt';
      content = (
        <MapDetailGebiedenBuurt
          buurt={result}
        />
      );
      break;
    case endpointTypes.gebiedenGebiedsgerichtWerken:
      title = 'MapDetailGebiedenGebiedsgerichtWerken';
      content = (
        <MapDetailGebiedenGebiedsgerichtWerken
          gebiedsgerichtWerken={result}
        />
      );
      break;
    case endpointTypes.gebiedenGrootstedelijk:
      title = 'MapDetailGebiedenGrootstedelijk';
      content = (
        <MapDetailGebiedenGrootstedelijk
          grootstedelijk={result}
        />
      );
      break;
    case endpointTypes.gebiedenStadsdeel:
      title = 'MapDetailGebiedenStadsdeel';
      content = (
        <MapDetailGebiedenStadsdeel
          stadsdeel={result}
        />
      );
      break;
    case endpointTypes.gebiedenUnesco:
      title = 'MapDetailGebiedenUnesco';
      content = (
        <MapDetailGebiedenUnesco
          unesco={result}
        />
      );
      break;
    case endpointTypes.gebiedenWijk:
      title = 'MapDetailGebiedenWijk';
      content = (
        <MapDetailGebiedenWijk
          wijk={result}
        />
      );
      break;
    case endpointTypes.kadastraalObject:
      title = 'MapDetailKadastraalObject';
      content = (
        <MapDetailKadastraalObject
          kadastraalObject={result}
        />
      );
      break;
    case endpointTypes.meetbout:
      title = 'MapDetailMeetbout';
      content = (
        <MapDetailMeetbout
          meetbout={result}
        />
      );
      break;
    case endpointTypes.monument:
      title = 'MapDetailMonument';
      content = (
        <MapDetailMonument
          monument={result}
        />
      );
      break;
    case endpointTypes.napPeilmerk:
      title = 'MapDetailNapPeilmerk';
      content = (
        <MapDetailNapPeilmerk
          peilmerk={result}
        />
      );
      break;
    case endpointTypes.vestiging:
      title = 'MapDetailVestiging';
      content = (
        <MapDetailVestiging
          vestiging={result}
        />
      );
    default:
      return '';
  }
  return {
    content,
    title
  };
};

const MapDetailResult = ({ endpoint, panoUrl, result }) => {
  const endpointType = getEndpointType(endpoint);
  const { content, title } = renderContent({ endpointType, result });

  return (
    <section className="map-detail-result">
      <MapDetailResultHeader
        panoUrl={panoUrl}
        title={title}
        subtitle={result.label}
      />
      { content }
    </section>
  );
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
