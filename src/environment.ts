import isIE from './app/utils/isIE'

const defaultEnvironment = {
  DEPLOY_ENV: 'development',
  IIIF_ROOT: 'https://acc.images.data.amsterdam.nl/',
  API_ROOT: 'https://acc.api.data.amsterdam.nl/',
  CMS_ROOT: 'https://acc.cms.data.amsterdam.nl/',
  GRAPHQL_ENDPOINT: 'https://acc.api.data.amsterdam.nl/cms_search/graphql/',
  ROOT: 'http://localhost:3000/',
}

type Environment = typeof defaultEnvironment
const environment: Environment = { ...defaultEnvironment, ...getEnvironmentVariables() }

/**
 * Gets the environment variables provided at startup to the Docker container.
 *
 * The values are placed in a script tag in the HTML which contains a JSON representation of the environment.
 */
function getEnvironmentVariables(): { [key: string]: any } {
  // TODO: For some reason IE won't read the environment variables, we need to fix this.
  if (isIE) {
    return {
      DEPLOY_ENV: 'production',
      IIIF_ROOT: 'https://images.data.amsterdam.nl/',
      API_ROOT: 'https://api.data.amsterdam.nl/',
      GRAPHQL_ENDPOINT: 'https://api.data.amsterdam.nl/cms_search/graphql/',
      ROOT: 'https://data.amsterdam.nl/',
      CMS_ROOT: 'https://cms.data.amsterdam.nl/',
    }
  }

  const element = document.getElementById('environment')
  const config = element?.textContent ? JSON.parse(element.textContent) : {}
  return config
}

export default environment
