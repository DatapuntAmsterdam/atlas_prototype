import { mocked } from 'ts-jest/utils'
import type { FeatureCollection, Geometry } from 'geojson'
import { fetchWithToken } from '../../../../../../shared/services/api/api'
import { getScopes, isAuthenticated } from '../../../../../../shared/services/auth/auth'
import * as address from '../adressen-nummeraanduiding/adressen-nummeraanduiding'
import * as vestiging from '../vestiging/vestiging'
import search, { fetchRelatedForUser, MapFeatureProperties } from './map-search'

jest.mock('../../../../../../shared/services/api/api')
jest.mock('../../../../../../shared/services/auth/auth')
jest.mock('../adressen-nummeraanduiding/adressen-nummeraanduiding')
jest.mock('../monument/monument')
jest.mock('../vestiging/vestiging')

const mockedIsAuthenticated = mocked(isAuthenticated)
const mockedGetScopes = mocked(getScopes)

describe('mapSearch service', () => {
  beforeEach(() => {
    mockedIsAuthenticated.mockReturnValue(true)
    mockedGetScopes.mockReturnValue(['HR/R'])
  })

  describe('search action', () => {
    it('should return results from search for bommen', async () => {
      // @ts-ignore
      fetchWithToken.mockReturnValue(
        Promise.resolve({
          features: [
            {
              properties: {
                type: 'bommenkaart/verdachtgebied', // not in map-search
              },
            },
          ],
        }),
      )

      mockedIsAuthenticated.mockReturnValue(false)
      mockedGetScopes.mockReturnValue([])

      const data = await search({ lat: 1, lng: 0 })

      expect(data.results).toEqual([
        {
          categoryLabel: 'Explosief',
          categoryLabelPlural: 'Explosieven',
          results: Array(15).fill({
            // !!!!IMPORTANT: UPDATE WITH +1 WHEN ADDING NEW GEOSEARCH
            categoryLabel: 'Explosief',
            categoryLabelPlural: 'Explosieven',
            label: undefined,
            parent: undefined,
            statusLabel: 'verdacht gebied',
            type: 'bommenkaart/verdachtgebied',
            uri: undefined,
          }),
          subCategories: [],
          type: 'bommenkaart/verdachtgebied',
        },
      ])
    })

    it('should return results and ignore the failing calls (http 500 errors)', async () => {
      // @ts-ignore
      fetchWithToken.mockImplementation((url) => {
        if (url.indexOf('/nap/') > 0) {
          return Promise.reject()
        }
        return Promise.resolve({
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [123, 321],
              },
              properties: {
                type: 'bommenkaart/verdachtgebied', // not in map-search
              },
            },
          ],
        })
      })

      mockedIsAuthenticated.mockReturnValue(false)
      mockedGetScopes.mockReturnValue([])

      const data = await search({ lat: 1, lng: 0 })

      expect(data.results).toEqual([
        {
          categoryLabel: 'Explosief',
          categoryLabelPlural: 'Explosieven',
          results: Array(14).fill({
            // !!!!IMPORTANT: UPDATE WITH +1 WHEN ADDING NEW GEOSEARCH
            categoryLabel: 'Explosief',
            categoryLabelPlural: 'Explosieven',
            label: undefined,
            parent: undefined,
            statusLabel: 'verdacht gebied',
            type: 'bommenkaart/verdachtgebied',
            uri: undefined,
          }),
          subCategories: [],
          type: 'bommenkaart/verdachtgebied',
        },
      ])
    })

    it('should return results based on user scope', async () => {
      const data = await search({ lat: 1, lng: 0 })

      expect(data.results[0].results.length).toBe(14) // !!!!IMPORTANT: UPDATE WITH +1 WHEN ADDING NEW GEOSEARCH
    })
  })

  describe('fetchRelatedForUser', () => {
    it('should return just the base features when no user related features found', async () => {
      const data: FeatureCollection<Geometry, MapFeatureProperties> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [123, 321],
            },
            properties: {
              id: '123',
              type: 'bommenkaart/verdachtgebied', // not in map-search
            },
          },
        ],
      }
      const results = await fetchRelatedForUser()(data)
      expect(results).toEqual(data.features)
    })

    it('should return just the base features when user related features found but user is not authorized', async () => {
      mockedGetScopes.mockReturnValue(['CAT/W', 'CAT/R'])

      const data: FeatureCollection<Geometry, MapFeatureProperties> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [123, 321],
            },
            properties: {
              id: '123',
              type: 'bommenkaart/verdachtgebied', // not in map-search
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [123, 321],
            },
            properties: {
              id: '0363020012061429',
              type: 'bag/ligplaats',
            },
          },
        ],
      }
      const results = await fetchRelatedForUser()(data)
      expect(results).toEqual(data.features)
    })

    it('should return the user related features for the standplaats', async () => {
      const vestigingResult = {
        _links: {
          self: {
            href: 'https://acc.api.data.amsterdam.nl/bag/nummeraanduiding/0363200012109853/',
          },
        },
        _display: 'Singel 177',
        landelijk_id: '0363200012109853',
        hoofdadres: true,
        vbo_status: { code: '33', omschrijving: 'Plaats aangewezen' },
        dataset: 'bag',
      }
      // @ts-ignore
      address.fetchHoofdadresByStandplaatsId.mockImplementation(() => Promise.resolve({ id: 2000 }))
      // @ts-ignore
      vestiging.fetchByAddressId.mockImplementation(() => Promise.resolve([vestigingResult]))
      const data: FeatureCollection<Geometry, MapFeatureProperties> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [123, 321],
            },
            properties: {
              id: '0363020012061429',
              type: 'bag/standplaats',
              // uri: 'https://acc.api.data.amsterdam.nl/bag/ligplaats/0363020012061429/',
            },
          },
        ],
      }
      const results = await fetchRelatedForUser()(data)
      expect(results).toEqual([
        ...data.features,
        {
          ...vestigingResult,
          properties: {
            // eslint-disable-next-line no-underscore-dangle
            uri: vestigingResult._links.self.href,
            // eslint-disable-next-line no-underscore-dangle
            display: vestigingResult._display,
            type: 'vestiging',
            parent: 'bag/standplaats',
          },
        },
      ])
    })

    it('should return the user related features for the ligplaats', async () => {
      const vestigingResult = {
        _links: {
          self: {
            href: 'https://acc.api.data.amsterdam.nl/bag/nummeraanduiding/0363200012109853/',
          },
        },
        _display: 'Singel 177',
        landelijk_id: '0363200012109853',
        hoofdadres: true,
        vbo_status: { code: '33', omschrijving: 'Plaats aangewezen' },
        dataset: 'bag',
      }
      // @ts-ignore
      address.fetchHoofdadresByLigplaatsId.mockImplementation(() => Promise.resolve({ id: 1000 }))
      // @ts-ignore
      vestiging.fetchByAddressId.mockImplementation(() => Promise.resolve([vestigingResult]))
      const data: FeatureCollection<Geometry, MapFeatureProperties> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [123, 321],
            },
            properties: {
              id: '0363020012061429',
              type: 'bag/ligplaats',
              // uri: 'https://acc.api.data.amsterdam.nl/bag/ligplaats/0363020012061429/',
            },
          },
        ],
      }
      const results = await fetchRelatedForUser()(data)
      expect(results).toEqual([
        ...data.features,
        {
          ...vestigingResult,
          properties: {
            // eslint-disable-next-line no-underscore-dangle
            uri: vestigingResult._links.self.href,
            // eslint-disable-next-line no-underscore-dangle
            display: vestigingResult._display,
            type: 'vestiging',
            parent: 'bag/ligplaats',
          },
        },
      ])
    })
  })
})
