import * as nummeraanduidingV1 from './bag/v1/nummeraanduiding-v1'
import * as ligplaats from './bag/v1.1/ligplaats'
import * as nummeraanduiding from './bag/v1.1/nummeraanduiding'
import * as openbareRuimte from './bag/v1.1/openbare-ruimte'
import * as pand from './bag/v1.1/pand'
import * as standplaats from './bag/v1.1/standplaats'
import * as verblijfsobject from './bag/v1.1/verblijfsobject'
import * as woonplaats from './bag/v1.1/woonplaats'
import * as object from './brk/object'
import * as objectExpand from './brk/object-expand'
import * as subject from './brk/subject'
import * as datasets from './dcatd/datasets'
import * as openapi from './dcatd/openapi'
import * as gevrijwaardgebied from './explosieven/gevrijwaardgebied'
import * as inslagen from './explosieven/inslagen'
import * as uitgevoerdonderzoek from './explosieven/uitgevoerdonderzoek'
import * as verdachtgebied from './explosieven/verdachtgebied'
import * as fietspaaltjes from './fietspaaltjes/fietspaaltjes'
import * as bouwblok from './gebieden/bouwblok'
import * as buurtcombinatie from './gebieden/buurtcombinatie'
import * as gebiedsgerichtwerken from './gebieden/gebiedsgerichtwerken'
import * as grootstedelijkgebied from './gebieden/grootstedelijkgebied'
import * as stadsdeel from './gebieden/stadsdeel'
import * as unesco from './gebieden/unesco'
import * as projecten from './grex/projecten'
import * as bouwdossier from './iiif-metadata/bouwdossier'
import * as meetbout from './meetbouten/meetbout'
import * as meting from './meetbouten/meting'
import * as metadata from './metadata'
import * as complexen from './monumenten/complexen'
import * as monumenten from './monumenten/monumenten'
import * as situeringen from './monumenten/situeringen'
import * as peilmerk from './nap/peilmerk'
import * as thumbnail from './panorama/thumbnail'
import * as bekendmakingen from './vsd/bekendmakingen'
import * as biz from './vsd/biz'
import * as evenementen from './vsd/evenementen'
import * as oplaadpunten from './vsd/oplaadpunten'
import * as parkeerzonesUitzondering from './vsd/parkeerzones-uitzondering'
import * as reclamebelasting from './vsd/reclamebelasting'
import * as vastgoed from './vsd/vastgoed'

type ApiConfig = {
  singleFixture: any
  listFixture?: any
  path: string | null
  fixtureId: string | null
}

function typeHelper<K extends PropertyKey>(obj: Record<K, ApiConfig>): Record<K, ApiConfig> {
  return obj
}

const api = typeHelper({
  nummeraanduidingV1,
  ligplaats,
  nummeraanduiding,
  openbareRuimte,
  pand,
  standplaats,
  verblijfsobject,
  woonplaats,
  object,
  objectExpand,
  subject,
  datasets,
  openapi,
  gevrijwaardgebied,
  inslagen,
  uitgevoerdonderzoek,
  verdachtgebied,
  fietspaaltjes,
  bouwblok,
  buurtcombinatie,
  gebiedsgerichtwerken,
  grootstedelijkgebied,
  stadsdeel,
  unesco,
  projecten,
  bouwdossier,
  meetbout,
  meting,
  metadata,
  complexen,
  monumenten,
  situeringen,
  peilmerk,
  thumbnail,
  bekendmakingen,
  biz,
  evenementen,
  oplaadpunten,
  parkeerzonesUitzondering,
  reclamebelasting,
  vastgoed,
})

export default api
