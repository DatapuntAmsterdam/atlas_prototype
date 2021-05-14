import queryString from 'querystring'
import { isEmbeddedParam } from '../../../app/pages/MapPage/query-params'
import PARAMETERS from '../../../store/parameters'

const getUrlQuery = () => queryString.decode(window.location.search.slice(1))

const buildUrl = (query) => {
  const urlParams = Object.keys(query).length ? `?${queryString.encode(query)}` : ''
  return `${window.location.origin}${window.location.pathname}${urlParams}`
}

export const getIframeUrl = () => {
  const query = { ...getUrlQuery(), embed: true }
  delete query[PARAMETERS.EMBED_PREVIEW]
  return buildUrl(query)
}

export const getEmbedButtonLink = () => {
  const query = { ...getUrlQuery() }
  delete query[isEmbeddedParam.name]
  return buildUrl(query)
}
