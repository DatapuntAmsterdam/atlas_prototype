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
import nummeraanduiding from '../../shared/services/nummeraanduiding/nummeraanduiding';
import openbareRuimte from '../../shared/services/openbare-ruimte/openbare-ruimte';
import pand from '../../shared/services/pand/pand';
import vestiging from '../../shared/services/vestiging/vestiging';

export const endpointTypes = {
  explosievenGevrijwaardGebied: 'milieuthemas/explosieven/gevrijwaardgebied',
  explosievenInslag: 'milieuthemas/explosieven/inslagen',
  explosievenUitgevoerdOnderzoek: 'milieuthemas/explosieven/uitgevoerdonderzoek',
  explosievenVerdachtGebied: 'milieuthemas/explosieven/verdachtgebied',
  gebiedenBouwblok: 'gebieden/bouwblok',
  gebiedenBuurt: 'gebieden/buurt',
  gebiedenGebiedsgerichtWerken: 'gebieden/gebiedsgerichtwerken',
  gebiedenGrootstedelijk: 'gebieden/grootstedelijkgebied',
  gebiedenStadsdeel: 'gebieden/stadsdeel',
  gebiedenUnesco: 'gebieden/unesco',
  gebiedenWijk: 'gebieden/buurtcombinatie',
  kadastraalObject: 'brk/object',
  ligplaats: 'bag/ligplaats',
  meetbout: 'meetbouten/meetbout',
  monument: 'monumenten/monumenten',
  napPeilmerk: 'nap/peilmerk',
  nummeraanduiding: 'bag/nummeraanduiding',
  openbareRuimte: 'bag/openbareruimte',
  pand: 'bag/pand',
  standplaats: 'bag/standplaats',
  verblijfsobject: 'bag/verblijfsobject',
  vestiging: 'handelsregister/vestiging'
};

const servicesByEndpointType = {
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
  [endpointTypes.ligplaats]: { fetch: nummeraanduiding },
  [endpointTypes.meetbout]: { fetch: meetbout },
  [endpointTypes.monument]: { fetch: monument },
  [endpointTypes.napPeilmerk]: { fetch: napPeilmerk },
  [endpointTypes.nummeraanduiding]: { fetch: nummeraanduiding },
  [endpointTypes.openbareRuimte]: { fetch: openbareRuimte },
  [endpointTypes.pand]: { fetch: pand },
  [endpointTypes.standplaats]: { fetch: nummeraanduiding },
  [endpointTypes.verblijfsobject]: { fetch: nummeraanduiding },
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
