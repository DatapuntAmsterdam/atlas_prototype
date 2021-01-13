import {
  ligplaats,
  nummeraanduiding,
  standplaats,
  woonplaats,
  verblijfsobject,
  pand,
  openbareRuimte,
} from '../../src/api/bag'
import { monumenten, complexen, situeringen } from '../../src/api/monumenten'
import { object, subject, objectExpand } from '../../src/api/brk'
import { bouwdossier } from '../../src/api/iiif-metadata'

const apiHostname = `^https?://([a-z0-9]+[.])*api.data.amsterdam.nl/`
export const constructApiURLRegex = (path: string) => new RegExp(`${apiHostname}${path}`, 'i')

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

type Intercepts = [Cypress.HttpMethod, RegExp, object, string][]

type Fixture = {
  single: string
  any: string
  many?: string
  path: string
  singleFixture?: object
  listFixture?: object
} & {
  intercepts: Intercepts
}

type APIFixtures = Record<keyof typeof api, Fixture>

type FixtureKey = keyof typeof api

export const fixtureKeys = Object.keys(api) as FixtureKey[]

export const apiFixtures = Object.entries(api).reduce<APIFixtures>((acc, [key, value]) => {
  const singleAlias = `getSingle${value.selector}`
  const anyAlias = `getAny${value.selector}`
  const manyAlias = `getMany${value.selector}`
  const intercepts: Intercepts = [
    [
      'GET',
      constructApiURLRegex(`${value.path}${value?.fixtureId}`),
      value.singleFixture,
      singleAlias,
    ],
    ['GET', constructApiURLRegex(`${value.path}([a-z0-9])`), value.singleFixture, anyAlias],
    ['GET', constructApiURLRegex(`${value.path}(.*)`), value.listFixture, manyAlias],
  ]
  return {
    ...acc,
    [key]: {
      intercepts,
      single: `@${singleAlias}`,
      any: `@${anyAlias}`,
      many: value.listFixture ? `@${manyAlias}` : undefined,
      path: value.path,
      singleFixture: value.singleFixture,
      listFixture: value.listFixture,
    },
  }
}, {} as APIFixtures)

export const interceptApiFixtures = () => {
  Object.values(apiFixtures).forEach(({ intercepts }) => {
    intercepts.forEach(([method, url, response, alias]) => {
      cy.intercept(method as any, url, response).as(alias)
    })
  })
}
