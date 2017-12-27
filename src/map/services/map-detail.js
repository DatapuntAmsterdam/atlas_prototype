import adressenLigplaats from '../../shared/services/adressen/adressen-ligplaats';
import adressenNummeraanduiding from '../../shared/services/adressen/adressen-nummeraanduiding';
import adressenOpenbareRuimte from '../../shared/services/adressen/adressen-openbare-ruimte';
import adressenPand from '../../shared/services/adressen/adressen-pand';
import adressenStandplaats from '../../shared/services/adressen/adressen-standplaats';
import adressenVerblijfsobject from '../../shared/services/adressen/adressen-verblijfsobject';
import explosievenGevrijwaardGebied from '../../shared/services/explosieven/explosieven-gevrijwaard-gebied';
import explosievenInslag from '../../shared/services/explosieven/explosieven-inslag';
import explosievenUitgevoerdOnderzoek from '../../shared/services/explosieven/explosieven-uitgevoerd-onderzoek';
import explosievenVerdachtGebied from '../../shared/services/explosieven/explosieven-verdacht-gebied';
import gebiedenBouwblok from '../../shared/services/gebieden/gebieden-bouwblok';
import gebiedenBuurt from '../../shared/services/gebieden/gebieden-buurt';
import gebiedenGebiedsgerichtWerken from '../../shared/services/gebieden/gebieden-gebiedsgericht-werken';
import gebiedenGrootstedelijk from '../../shared/services/gebieden/gebieden-grootstedelijk';
import gebiedenStadsdeel from '../../shared/services/gebieden/gebieden-stadsdeel';
import gebiedenUnesco from '../../shared/services/gebieden/gebieden-unesco';
import gebiedenWijk from '../../shared/services/gebieden/gebieden-wijk';
import kadastraalObject from '../../shared/services/kadastraal-object/kadastraal-object';
import meetbout from '../../shared/services/meetbout/meetbout';
import monument from '../../shared/services/monument/monument';
import napPeilmerk from '../../shared/services/nap-peilmerk/nap-peilmerk';
import vestiging from '../../shared/services/vestiging/vestiging';

export const endpointTypes = {
  adressenLigplaats: 'bag/ligplaats/',
  adressenNummeraanduiding: 'bag/nummeraanduiding/',
  adressenOpenbareRuimte: 'bag/openbareruimte/',
  adressenPand: 'bag/pand/',
  adressenStandplaats: 'bag/standplaats/',
  adressenVerblijfsobject: 'bag/verblijfsobject/',
  explosievenGevrijwaardGebied: 'milieuthemas/explosieven/gevrijwaardgebied/',
  explosievenInslag: 'milieuthemas/explosieven/inslagen/',
  explosievenUitgevoerdOnderzoek: 'milieuthemas/explosieven/uitgevoerdonderzoek/',
  explosievenVerdachtGebied: 'milieuthemas/explosieven/verdachtgebied/',
  gebiedenBouwblok: 'gebieden/bouwblok/',
  gebiedenBuurt: 'gebieden/buurt/',
  gebiedenGebiedsgerichtWerken: 'gebieden/gebiedsgerichtwerken/',
  gebiedenGrootstedelijk: 'gebieden/grootstedelijkgebied/',
  gebiedenStadsdeel: 'gebieden/stadsdeel/',
  gebiedenUnesco: 'gebieden/unesco/',
  gebiedenWijk: 'gebieden/buurtcombinatie/',
  kadastraalObject: 'brk/object/',
  meetbout: 'meetbouten/meetbout/',
  monument: 'monumenten/monumenten/',
  napPeilmerk: 'nap/peilmerk/',
  vestiging: 'handelsregister/vestiging/'
};

const servicesByEndpointType = {
  [endpointTypes.adressenLigplaats]: { fetch: adressenLigplaats },
  [endpointTypes.adressenNummeraanduiding]: { fetch: adressenNummeraanduiding },
  [endpointTypes.adressenOpenbareRuimte]: { fetch: adressenOpenbareRuimte },
  [endpointTypes.adressenPand]: { fetch: adressenPand },
  [endpointTypes.adressenStandplaats]: { fetch: adressenStandplaats },
  [endpointTypes.adressenVerblijfsobject]: { fetch: adressenVerblijfsobject },
  [endpointTypes.explosievenGevrijwaardGebied]: { fetch: explosievenGevrijwaardGebied },
  [endpointTypes.explosievenInslag]: { fetch: explosievenInslag },
  [endpointTypes.explosievenUitgevoerdOnderzoek]: { fetch: explosievenUitgevoerdOnderzoek },
  [endpointTypes.explosievenVerdachtGebied]: { fetch: explosievenVerdachtGebied },
  [endpointTypes.gebiedenBouwblok]: { fetch: gebiedenBouwblok },
  [endpointTypes.gebiedenBuurt]: { fetch: gebiedenBuurt },
  [endpointTypes.gebiedenGebiedsgerichtWerken]: { fetch: gebiedenGebiedsgerichtWerken },
  [endpointTypes.gebiedenGrootstedelijk]: { fetch: gebiedenGrootstedelijk },
  [endpointTypes.gebiedenStadsdeel]: { fetch: gebiedenStadsdeel },
  [endpointTypes.gebiedenUnesco]: { fetch: gebiedenUnesco },
  [endpointTypes.gebiedenWijk]: { fetch: gebiedenWijk },
  [endpointTypes.kadastraalObject]: { fetch: kadastraalObject },
  [endpointTypes.meetbout]: { fetch: meetbout },
  [endpointTypes.monument]: { fetch: monument },
  [endpointTypes.napPeilmerk]: { fetch: napPeilmerk },
  [endpointTypes.vestiging]: { fetch: vestiging, authScope: 'HR/R' }
};

export default function detail(endpoint, user) {
  const endpointType = Object.keys(servicesByEndpointType).find((type) => endpoint.includes(type));
  const endpointConfig = endpointType && servicesByEndpointType[endpointType];
  const fetchFn = endpointConfig && endpointConfig.fetch;
  const authScope = endpointConfig && endpointConfig.authScope;
  return fetchFn && (!authScope || user.scopes.includes(authScope)) &&
    fetchFn(endpoint);
}
