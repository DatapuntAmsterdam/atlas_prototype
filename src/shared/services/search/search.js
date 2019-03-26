// Todo: fix / add tests
import SEARCH_CONFIG from './search-config';
import { getByUrl } from '../api/api';
import SHARED_CONFIG from '../shared-config/shared-config';
import { formatCategories, formatLinks } from './search-formatter';

function isString(value) {
  return typeof value === 'string';
}

export async function querySearch(query, categorySlug, user) {
  const errorType = 'error';
  const params = { q: query };

  let queryResults = await Promise
    .all(SEARCH_CONFIG.QUERY_ENDPOINTS.map(async (endpoint) => {
      if ((!isString(categorySlug) || categorySlug === endpoint.slug) &&
        endpoint.uri &&
        (!endpoint.authScope || user.scopes.includes(endpoint.authScope))
      ) {
        const options = endpoint.options || {};
        const res = await getByUrl(
          `${SHARED_CONFIG.API_ROOT}${endpoint.uri}`,
          { ...params, ...options }
        );
        return res;
      }
      return undefined;
    }));

  queryResults = queryResults.filter((res) => (res && res.results && res.results.length));

  return {
    results: formatCategories(queryResults, user, categorySlug),
    errors: queryResults.some((queryResult) => (queryResult && queryResult.type === errorType))
  };
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

export const getNumberOfResultsPanel = (results) => (
  results.reduce((acc, { results: subResults }) => (
    acc + (subResults.length)
  ), 0)
);
