// Note that environment variables on process.env are only available in development if a .env file is present, to easily override the defaults
const environment = {
  DEPLOY_ENV: process.env.DEPLOY_ENV || 'acceptance',
  IIIF_ROOT: process.env.IIIF_ROOT || 'https://acc.images.data.amsterdam.nl/',
  API_ROOT: process.env.API_ROOT || 'https://acc.api.data.amsterdam.nl/',
  CMS_ROOT: process.env.CMS_ROOT || 'https://acc.cms.data.amsterdam.nl/',
  GRAPHQL_ENDPOINT:
    process.env.GRAPHQL_ENDPOINT || 'https://acc.api.data.amsterdam.nl/cms_search/graphql/',
  ROOT: process.env.ROOT || 'http://localhost:3000/',
  KEYCLOAK_URL: process.env.KEYCLOAK_URL || 'https://iam.amsterdam.nl/auth',
  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || 'datapunt-ad-acc',
  KEYCLOAK_CLIENT: process.env.KEYCLOAK_CLIENT || 'data-verkenner',
}

export default environment
