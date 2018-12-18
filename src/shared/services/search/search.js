// Todo: fix / add tests
/* istanbul ignore file */
import SEARCH_CONFIG from './search-config';
import { getByUrl } from '../api/api';
import SHARED_CONFIG from '../shared-config/shared-config';
import { formatCategories, formatCategory, formatLinks } from './search-formatter';

function isString(value) {
  return typeof value === 'string';
}

// Todo: user.scopes.includes(endpoint.authScope)
export function search(query, categorySlug, user) {
  const queries = [];
  const params = { q: query };
  SEARCH_CONFIG.QUERY_ENDPOINTS.forEach((endpoint) => {
    if ((!isString(categorySlug) || categorySlug === endpoint.slug) &&
      endpoint.uri &&
      (!endpoint.authScope || user.scopes.includes(endpoint.authScope))
    ) {
      const options = endpoint.options || {};
      queries.push(
        getByUrl(
          `${SHARED_CONFIG.API_ROOT}${endpoint.uri}`,
          { ...params, ...options }
        ).then((data) => data, () => [])
      );
    }
  });

  if (isString(categorySlug)) {
    // A single category
    return Promise.all(queries).then((searchResults) =>
      [formatCategory(categorySlug, searchResults[0])]
    );
  }
  // All search results
  return Promise.all(queries).then((results) => formatCategories(results, user));
}

export function loadMore(category) {
  return getByUrl(category.next)
    .then((nextPageData) => {
      // Don't change the input, create a new variable
      const output = {};

      output.slug = category.slug;
      output.count = nextPageData.count;
      output.results = category.results.concat(
        formatLinks(category.slug, nextPageData.results)
      );

      if (output.count > output.results.length) {
        output.next = nextPageData._links.next.href;
      } else {
        output.next = null;
      }

      return output;
    });
}

// @TODO remove the exception when backend uses correct sub type name tg-3551
export function replaceBuurtcombinatie(searchResults) {
  const results = [...searchResults];
  results.forEach((result) => {
    result.results.forEach((item) => {
      if (item.subtype === 'buurtcombinatie') {
        item.subtypeLabel = 'wijk'; // eslint-disable-line no-param-reassign
      }
    });
  });

  return results;
}

export function hasLoadMore(category, searchResults, isLoadMoreLoading) {
  return isString(category) &&
    searchResults[0].count > searchResults[0].results.length &&
    !isLoadMoreLoading;
}

export function getNumberOfResults(searchResults) {
  return searchResults.reduce((previous, current) => (
    previous + current.count +
    (current.subResults
      ? current.subResults.reduce((subPrevious, subCurrent) => (
        subPrevious + subCurrent.count
      ), 0)
      : 0)
  ), 0);
}
