import {
  ligplaats,
  nummeraanduiding,
  openbareRuimte,
  pand,
  standplaats,
  verblijfsobject,
  woonplaats,
} from './bag'
import { complexen, monumenten, situeringen } from './monumenten'
import { object, objectExpand, subject } from './brk'
import { bouwdossier } from './iiif-metadata'

type ApiConfig = {
  selector: string
  singleFixture: any
  listFixture?: any
  path: string
  fixtureId: string
}

function typeHelper<K extends PropertyKey>(obj: Record<K, ApiConfig>): Record<K, ApiConfig> {
  return obj
}

const api = typeHelper({
  ligplaats: {
    selector: 'Ligplaats',
    ...ligplaats,
  },
  nummeraanduiding: {
    selector: 'Nummeraanduiding',
    ...nummeraanduiding,
  },
  standplaats: {
    selector: 'Standplaats',
    ...standplaats,
  },
  woonplaats: {
    selector: 'Woonplaats',
    ...woonplaats,
  },
  verblijfsobject: {
    selector: 'Verblijfsobject',
    ...verblijfsobject,
  },
  pand: {
    selector: 'Pand',
    ...pand,
  },
  openbareRuimte: {
    selector: 'OpenbareRuimte',
    ...openbareRuimte,
  },
  monumenten: {
    selector: 'Monumenten',
    ...monumenten,
  },
  complexen: {
    selector: 'Complexen',
    ...complexen,
  },
  situeringen: {
    selector: 'Situeringen',
    ...situeringen,
  },
  object: {
    selector: 'Object',
    ...object,
  },
  objectExpand: {
    selector: 'ObjectExpand',
    ...objectExpand,
  },
  subject: {
    selector: 'Subject',
    ...subject,
  },
  bouwdossier: {
    selector: 'Bouwdossier',
    ...bouwdossier,
  },
})

export default api
