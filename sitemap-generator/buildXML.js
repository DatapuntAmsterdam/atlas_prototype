const fetch = require('isomorphic-fetch')

const API_ENDPOINT = 'https://api.data.amsterdam.nl/cms_search/graphql/'

function useSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

function buildUrlPart(results, urlPart) {
  return results.reduce(
    (acc, result) =>
      result.slug && result.id
        ? `${acc}<url><loc>https://data.amsterdam.nl/${urlPart}/${useSlug(result.slug)}/${
            result.id
          }/</loc><lastmod>${new Date(result.date * 1000).toISOString()}</lastmod></url>`
        : '',
    '',
  )
}

module.exports = async () => {
  const { data } = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
      query CmsSearch($q: String!) {
        articleSearch(q: $q, input: {}){
          results {
            id
            slug
            date
          }
        }
        publicationSearch(q: $q, input: {}){
          results {
            id
            slug
            date
          }
        }
        specialSearch(q: $q, input: {}){
          results {
            id
            slug
            date
          }
        }
        collectionSearch(q: $q, input: {}){
          results {
            id
            slug
            date
          }
        }
      }
    `,
      variables: {
        q: '',
      },
    }),
  }).then((res) => res.json())

  let result =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  const { articleSearch, publicationSearch, specialSearch, collectionSearch } = data || {}

  if (articleSearch && publicationSearch && specialSearch && collectionSearch) {
    result += buildUrlPart(data.articleSearch.results, 'artikelen/artikel')
    result += buildUrlPart(data.publicationSearch.results, 'publicaties/publicatie')
    result += buildUrlPart(data.specialSearch.results, 'specials/special')
    result += buildUrlPart(data.collectionSearch.results, 'collecties/collectie')
  }

  result += '</urlset>'

  return result
}
