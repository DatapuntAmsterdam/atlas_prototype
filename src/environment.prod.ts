const defaultEnvironment = {
  DEPLOY_ENV: 'production',
  IIIF_ROOT: 'https://images.data.amsterdam.nl/',
  API_ROOT: 'https://api.data.amsterdam.nl/',
  CMS_ROOT: 'https://cms.data.amsterdam.nl/',
  GRAPHQL_ENDPOINT: 'https://api.data.amsterdam.nl/cms_search/graphql/',
  ROOT: 'https://data.amsterdam.nl/',
}

type Environment = typeof defaultEnvironment
const environment: Environment = { ...defaultEnvironment, ...getEnvironmentVariables() }

/**
 * Gets the environment variables provided at startup to the Docker container.
 *
 * The values are placed in a script tag in the HTML which contains a JSON representation of the environment.
 */
function getEnvironmentVariables(): { [key: string]: string } {
  const element = document.getElementById('environment')
  const config = element?.textContent ? JSON.parse(element.textContent) : {}

  return config
}

export default environment
