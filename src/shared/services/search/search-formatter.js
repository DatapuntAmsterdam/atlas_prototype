// Todo: fix / add tests
import SEARCH_CONFIG from './search-config'
import isObject from '../../../app/utils/isObject'

function formatLabel(item) {
  // eslint-disable-next-line no-underscore-dangle
  let label = item._display

  if (item.type === 'gebied') {
    label = item.naam
  } else if (item.type === 'bouwblok') {
    label = item.code
  }

  return label
}

export function formatLinks(slug, links) {
  const endpointConfig = SEARCH_CONFIG.QUERY_ENDPOINTS.filter(
    (endpoint) => endpoint.slug === slug,
  )[0]

  return links.map((item) => {
    const subtype = item.subtype || null
    let subtypeLabel = subtype

    if (item.subtype && endpointConfig.subtypes) {
      subtypeLabel = endpointConfig.subtypes[item.subtype] || item.subtype
    }

    return {
      label: formatLabel(item),
      type_adres: item.type_adres,
      vbo_status: Array.isArray(item.vbo_status) ? item.vbo_status[0] : item.vbo_status,
      // eslint-disable-next-line no-underscore-dangle
      endpoint: item._links.self.href,
      subtype,
      subtypeLabel,
    }
  })
}

export function formatCategory(slug, endpointSearchResults) {
  const endpointConfig = SEARCH_CONFIG.QUERY_ENDPOINTS.filter(
    (endpoint) => endpoint.slug === slug,
  )[0]
  const links = (isObject(endpointSearchResults) && endpointSearchResults.results) || []

  return {
    singular: endpointConfig.singular,
    plural: endpointConfig.plural,
    slug: endpointConfig.slug,
    count: (isObject(endpointSearchResults) && endpointSearchResults.count) || 0,
    results: formatLinks(slug, links),
    useIndenting: false,
    authScope: endpointConfig.authScope || null,
    specialAuthScope: endpointConfig.specialAuthScope || null,
    next:
      (isObject(endpointSearchResults) &&
        // eslint-disable-next-line no-underscore-dangle
        endpointSearchResults._links &&
        // eslint-disable-next-line no-underscore-dangle
        endpointSearchResults._links.next.href) ||
      null,
  }
}

export function formatCategories(allSearchResults, user, categorySlug) {
  return allSearchResults.map((endpointSearchResults, index) =>
    formatCategory(
      SEARCH_CONFIG.QUERY_ENDPOINTS.filter((endpoint) =>
        categorySlug
          ? endpoint.slug === categorySlug
          : !endpoint.authScope || user.scopes.includes(endpoint.authScope),
      )[index].slug,
      endpointSearchResults,
    ),
  )
}
