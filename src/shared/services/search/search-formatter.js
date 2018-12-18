// Todo: fix / add tests
/* istanbul ignore file */
import SEARCH_CONFIG from './search-config';

function isObject(value) {
  // http://jsperf.com/isobject4
  return value !== null && typeof value === 'object';
}

function formatLabel(item) {
  let label = item._display;

  if (item.type === 'gebied') {
    label = item.naam;
  } else if (item.type === 'bouwblok') {
    label = item.code;
  }

  return label;
}

export function formatLinks(slug, links) {
  const endpointConfig = SEARCH_CONFIG.QUERY_ENDPOINTS
                                      .filter((endpoint) => endpoint.slug === slug)[0];

  return links.map((item) => {
    const subtype = item.subtype || null;
    let subtypeLabel = subtype;

    if (item.subtype && endpointConfig.subtypes) {
      subtypeLabel = endpointConfig.subtypes[item.subtype] || item.subtype;
    }

    return {
      label: formatLabel(item),
      hoofdadres: item.hoofdadres,
      vbo_status: Array.isArray(item.vbo_status) ? item.vbo_status[0] : item.vbo_status,
      endpoint: item._links.self.href,
      subtype,
      subtypeLabel
    };
  });
}

export function formatCategory(slug, endpointSearchResults) {
  const endpointConfig = SEARCH_CONFIG.QUERY_ENDPOINTS
                                      .filter((endpoint) => endpoint.slug === slug)[0];
  const links = (isObject(endpointSearchResults) && endpointSearchResults.results) || [];

  return {
    label_singular: endpointConfig.label_singular,
    label_plural: endpointConfig.label_plural,
    slug: endpointConfig.slug,
    count: (isObject(endpointSearchResults) && endpointSearchResults.count) || 0,
    results: formatLinks(slug, links),
    useIndenting: false,
    authScope: endpointConfig.authScope || null,
    next: (isObject(endpointSearchResults) &&
      endpointSearchResults._links &&
      endpointSearchResults._links.next.href) || null
  };
}

export function formatCategories(allSearchResults, user) {
  return allSearchResults
    .map((endpointSearchResults, index) =>
      formatCategory(SEARCH_CONFIG.QUERY_ENDPOINTS.filter(
        (endpoint) => (
          !endpoint.authScope || user.scopes.includes(endpoint.authScope))
        )[index].slug, endpointSearchResults
      )
    );
}
