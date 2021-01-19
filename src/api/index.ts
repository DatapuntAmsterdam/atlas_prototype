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
  selector: string
  singleFixture: any
  listFixture?: any
  path: string | null
  fixtureId: string | null
}

function typeHelper<K extends PropertyKey>(obj: Record<K, ApiConfig>): Record<K, ApiConfig> {
  return obj
}

const api = typeHelper({
  nummeraanduidingV1: {
    selector: 'nummeraanduidingV1',
    ...nummeraanduidingV1,
  },
  ligplaats: {
    selector: 'ligplaats',
    ...ligplaats,
  },
  nummeraanduiding: {
    selector: 'nummeraanduiding',
    ...nummeraanduiding,
  },
  openbareRuimte: {
    selector: 'openbareRuimte',
    ...openbareRuimte,
  },
  pand: {
    selector: 'pand',
    ...pand,
  },
  standplaats: {
    selector: 'standplaats',
    ...standplaats,
  },
  verblijfsobject: {
    selector: 'verblijfsobject',
    ...verblijfsobject,
  },
  woonplaats: {
    selector: 'woonplaats',
    ...woonplaats,
  },
  object: {
    selector: 'object',
    ...object,
  },
  objectExpand: {
    selector: 'objectExpand',
    ...objectExpand,
  },
  subject: {
    selector: 'subject',
    ...subject,
  },
  datasets: {
    selector: 'datasets',
    ...datasets,
  },
  openapi: {
    selector: 'openapi',
    ...openapi,
  },
  gevrijwaardgebied: {
    selector: 'gevrijwaardgebied',
    ...gevrijwaardgebied,
  },
  inslagen: {
    selector: 'inslagen',
    ...inslagen,
  },
  uitgevoerdonderzoek: {
    selector: 'uitgevoerdonderzoek',
    ...uitgevoerdonderzoek,
  },
  verdachtgebied: {
    selector: 'verdachtgebied',
    ...verdachtgebied,
  },
  fietspaaltjes: {
    selector: 'fietspaaltjes',
    ...fietspaaltjes,
  },
  bouwblok: {
    selector: 'bouwblok',
    ...bouwblok,
  },
  buurtcombinatie: {
    selector: 'buurtcombinatie',
    ...buurtcombinatie,
  },
  gebiedsgerichtwerken: {
    selector: 'gebiedsgerichtwerken',
    ...gebiedsgerichtwerken,
  },
  grootstedelijkgebied: {
    selector: 'grootstedelijkgebied',
    ...grootstedelijkgebied,
  },
  stadsdeel: {
    selector: 'stadsdeel',
    ...stadsdeel,
  },
  unesco: {
    selector: 'unesco',
    ...unesco,
  },
  projecten: {
    selector: 'projecten',
    ...projecten,
  },
  bouwdossier: {
    selector: 'bouwdossier',
    ...bouwdossier,
  },
  meetbout: {
    selector: 'meetbout',
    ...meetbout,
  },
  meting: {
    selector: 'meting',
    ...meting,
  },
  metadata: {
    selector: 'metadata',
    ...metadata,
  },
  complexen: {
    selector: 'complexen',
    ...complexen,
  },
  monumenten: {
    selector: 'monumenten',
    ...monumenten,
  },
  situeringen: {
    selector: 'situeringen',
    ...situeringen,
  },
  peilmerk: {
    selector: 'peilmerk',
    ...peilmerk,
  },
  thumbnail: {
    selector: 'thumbnail',
    ...thumbnail,
  },
  bekendmakingen: {
    selector: 'bekendmakingen',
    ...bekendmakingen,
  },
  biz: {
    selector: 'biz',
    ...biz,
  },
  evenementen: {
    selector: 'evenementen',
    ...evenementen,
  },
  oplaadpunten: {
    selector: 'oplaadpunten',
    ...oplaadpunten,
  },
  parkeerzonesUitzondering: {
    selector: 'parkeerzonesUitzondering',
    ...parkeerzonesUitzondering,
  },
  reclamebelasting: {
    selector: 'reclamebelasting',
    ...reclamebelasting,
  },
  vastgoed: {
    selector: 'vastgoed',
    ...vastgoed,
  },
})
export default api
