const defaultEnvironment = {
  DEPLOY_ENV: 'acceptance',
  IIIF_ROOT: 'https://acc.images.data.amsterdam.nl/',
  API_ROOT: 'https://acc.api.data.amsterdam.nl/',
  CMS_ROOT: 'https://acc.cms.data.amsterdam.nl/',
  GRAPHQL_ENDPOINT: 'https://acc.api.data.amsterdam.nl/cms_search/graphql/',
  ROOT: 'http://localhost:3000/',
}

export type Environment = typeof defaultEnvironment

const config = (window as Window & typeof globalThis & { CONFIG: Environment }).CONFIG
const environment: Environment = { ...defaultEnvironment, ...config }

export default environment
