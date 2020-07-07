const defaultEnvironment = {
  DEPLOY_ENV: 'development',
  IIIF_ROOT: 'https://acc.images.data.amsterdam.nl/',
  API_ROOT: 'https://acc.api.data.amsterdam.nl/',
  CMS_ROOT: 'https://acc.cms.data.amsterdam.nl/',
  GRAPHQL_ENDPOINT: 'https://acc.api.data.amsterdam.nl/cms_search/graphql/',
  ROOT: 'http://localhost:3000/',
}

type Environment = typeof defaultEnvironment
const environment: Environment = Object.assign(defaultEnvironment, getEnvironmentVariables())

/**
 * Gets the environment variables provided at startup to the Docker container.
 *
 * The values are placed in a script tag in the HTML which contains a JSON representation of the environment.
 */
function getEnvironmentVariables(): { [key: string]: any } {
  const element = document.getElementById('environment')
  const config = element?.textContent ? JSON.parse(element.textContent) : {}
  return config
}

export default environment
