import api from '../../src/api'

type Intercepts = [Cypress.HttpMethod, RegExp, Record<string, unknown>, string][]

type Fixture = {
  single: string
  any: string
  list?: string
  path: string
  singleFixture?: Record<string, unknown>
  listFixture?: Record<string, unknown>
} & {
  intercepts: Intercepts
}

type APIFixtures = Record<keyof typeof api, Fixture>

type FixtureKey = keyof typeof api

const API_HOSTNAME = `^https?://([a-z0-9]+[.])*api.data.amsterdam.nl/`

export const constructApiURLRegex = (path: string): RegExp =>
  new RegExp(`${API_HOSTNAME}${path}`, 'i')

export const fixtureKeys = Object.keys(api) as FixtureKey[]

/**
 * We have 3 type of selectors:
 * single: matches exactly with the fixture ID and returns a single result fixture
 * any: matches any ID and returns a single result fixture.
 * list: matches everything after the url and returns a list result fixture
 */
export const apiFixtures = Object.entries(api).reduce<APIFixtures>((acc, [key, value]) => {
  const alias = `${key.charAt(0).toUpperCase()}${key.slice(1)}`
  const singleAlias = `getSingle${alias}`
  const anyAlias = `getAny${alias}`
  const listAlias = `getList${alias}`
  const intercepts: Intercepts = [
    [
      'GET',
      constructApiURLRegex(`${value.path}${value?.fixtureId ? value?.fixtureId : ''}`),
      value.singleFixture,
      singleAlias,
    ],
    ['GET', constructApiURLRegex(`${value.path}([a-z0-9])`), value.singleFixture, anyAlias],
    ['GET', constructApiURLRegex(`${value.path}(.*)`), value.listFixture, listAlias],
  ]
  return {
    ...acc,
    [key]: {
      intercepts,
      single: `@${singleAlias}`,
      any: `@${anyAlias}`,
      list: value.listFixture ? `@${listAlias}` : undefined,
      path: value.path,
      singleFixture: value.singleFixture,
      listFixture: value.listFixture,
    },
  }
}, {} as APIFixtures)

export const interceptApiFixtures = (): void => {
  Object.values(apiFixtures).forEach(({ intercepts }) => {
    intercepts.forEach(([method, url, response, alias]) => {
      cy.intercept(method as any, url, response).as(alias)
    })
  })
}
