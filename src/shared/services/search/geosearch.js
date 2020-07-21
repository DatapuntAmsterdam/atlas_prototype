/* eslint-disable no-underscore-dangle,no-param-reassign */
import identity from 'lodash.identity'
import { fetchWithToken } from '../api/api'
import geosearchFormatter from './geosearch-formatter'
import SEARCH_CONFIG from './search-config'
import { formatCategory } from './search-formatter'
import environment from '../../../environment'

function isNumber(value) {
  return typeof value === 'number'
}

function getPandData(geosearchResults) {
  const pandCategories = geosearchResults.filter((category) => category.slug === 'pand')
  const pandCategory = pandCategories.length ? pandCategories[0] : null
  const pandCategoryIndex = pandCategory ? geosearchResults.indexOf(pandCategory) : null
  const pandEndpoint = pandCategory ? pandCategory.results[0].endpoint : null

  return [pandCategoryIndex, pandEndpoint]
}

function getPlaatsData(geosearchResults) {
  const plaatsCategories = geosearchResults.filter(
    (category) => ['standplaats', 'ligplaats'].indexOf(category.slug) > -1,
  )
  const plaatsCategory = plaatsCategories.length ? plaatsCategories[0] : null
  const plaatsCategoryIndex = plaatsCategory ? geosearchResults.indexOf(plaatsCategory) : null
  const plaatsEndpoint = plaatsCategory ? plaatsCategory.results[0].endpoint : null

  return [plaatsCategoryIndex, plaatsEndpoint]
}

function getRelatedObjects(geosearchResults, user) {
  return new Promise((resolve) => {
    const [pandCategoryIndex, pandEndpoint] = getPandData(geosearchResults)
    const [plaatsCategoryIndex, plaatsEndpoint] = getPlaatsData(geosearchResults)

    if (plaatsEndpoint && user.scopes.includes('HR/R')) {
      // Only fetching 'vestigingen' for a standplaats/ligplaats, so
      // we check for employee status here already
      fetchWithToken(plaatsEndpoint).then((plaats) => {
        const vestigingenUri = `${environment.API_ROOT}handelsregister/vestiging/?nummeraanduiding=${plaats.hoofdadres.landelijk_id}`

        fetchWithToken(vestigingenUri).then((vestigingen) => {
          const formatted =
            vestigingen && vestigingen.count ? formatCategory('vestiging', vestigingen) : null
          const labelLigplaats = plaats.ligplaatsidentificatie ? ' binnen deze ligplaats' : null
          const labelStandplaats = plaats.standplaatsidentificatie
            ? ' binnen deze standplaats'
            : null
          const label = labelLigplaats || labelStandplaats || ''

          const extended = formatted
            ? {
                ...formatted,
                more: {
                  label: `Bekijk alle ${formatted.count} vestigingen ${label}`,
                  endpoint: plaats._links.self.href,
                },
              }
            : null
          const geosearchResultsCopy = [...geosearchResults]

          if (extended) {
            // Splice modifies the existing Array, we don't want our input to change hence the copy
            geosearchResultsCopy.splice(plaatsCategoryIndex + 1, 0, extended)
          }

          resolve(geosearchResultsCopy)
        })
      })
    } else if (pandEndpoint) {
      // pand matched, remove monumenten from top results
      geosearchResults = geosearchResults.filter((item) => item.slug !== 'monument')
      fetchWithToken(pandEndpoint).then((pand) => {
        const vestigingenUri = `handelsregister/vestiging/?pand=${pand.pandidentificatie}`

        const requests = [
          fetchWithToken(pand._adressen.href).then((objecten) => {
            // In verblijfsobjecten the status field is really a vbo_status field
            // Rename this field to allow for tranparant processing of the search results
            objecten.results.forEach((result) => {
              result.vbo_status = result.vbo_status || result.status
            })
            const formatted = objecten && objecten.count ? formatCategory('adres', objecten) : null
            const extended = formatted
              ? {
                  ...formatted,
                  more: {
                    label: `Bekijk alle ${formatted.count} adressen binnen dit pand`,
                    endpoint: pand._links.self.href,
                  },
                }
              : null
            return extended
          }),
          fetchWithToken(pand._monumenten.href).then((objecten) =>
            objecten && objecten.count ? formatCategory('monument', objecten) : null,
          ),
        ]

        if (user.scopes.includes('HR/R')) {
          requests.push(
            fetchWithToken(`${environment.API_ROOT}${vestigingenUri}`).then((vestigingen) => {
              const formatted =
                vestigingen && vestigingen.count ? formatCategory('vestiging', vestigingen) : null
              const extended = formatted
                ? {
                    ...formatted,
                    authScope: formatted.authScope,
                    more: {
                      label: `Bekijk alle ${formatted.count} vestigingen binnen dit pand`,
                      endpoint: pand._links.self.href,
                    },
                  }
                : null
              return extended
            }),
          )
        }

        Promise.all(requests).then((results) => {
          const geosearchResultsCopy = [...geosearchResults]
          const filteredResults = results.filter(identity)

          if (filteredResults.length) {
            geosearchResultsCopy[pandCategoryIndex].subResults = filteredResults
          }

          resolve(geosearchResultsCopy)
        })
      })
    } else {
      resolve(geosearchResults)
    }
  })
}

export default function geosearch(location, user) {
  const allRequests = []

  SEARCH_CONFIG.COORDINATES_ENDPOINTS.forEach((endpoint) => {
    const isInScope = endpoint.authScope && user.scopes && user.scopes.includes(endpoint.authScope)

    if (!endpoint.authScope || isInScope) {
      const searchParams = {
        ...endpoint.params,
        lat: Array.isArray(location) ? location[0] : location.latitude,
        lon: Array.isArray(location) ? location[1] : location.longitude,
      }

      if (isNumber(endpoint.radius)) {
        searchParams.radius = endpoint.radius
      }

      const request = fetchWithToken(
        `${environment.API_ROOT}${endpoint.uri}`,
        searchParams,
        false,
        true,
      ).catch(() => ({ features: [] })) // empty features on failure of api call
      allRequests.push(request)
    }
  })

  return Promise.all(allRequests)
    .then(geosearchFormatter)
    .then((results) => getRelatedObjects(results, user))
}
