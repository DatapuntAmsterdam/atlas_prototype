import ENVIROMENT from '../../environment';

export const globalConfig = {
  RADIUS: 50, // Thumbnail search radius
  THUMBNAIL_WIDTH: 240,
  STRAATBEELD_THUMB_URL: 'panorama/thumbnail/',
  AUTH_HEADER_PREFIX: 'Bearer ',
  // Allows sanity checking input of root keys based on white listing
  ROOT_KEYS: ['API_ROOT']
};

export const environmentConfig = {
  PRODUCTION: {
    API_ROOT: 'https://api.data.amsterdam.nl/'
  },
  PRE_PRODUCTION: {
    API_ROOT: 'https://api.data.amsterdam.nl/'
  },
  ACCEPTATION: {
    API_ROOT: 'https://acc.api.data.amsterdam.nl/'
  },
  DEVELOPMENT: {
    API_ROOT: 'https://acc.api.data.amsterdam.nl/'
  }
};

const SHARED_CONFIG = {
  ...globalConfig,
  ...environmentConfig[ENVIROMENT]
};

export default SHARED_CONFIG;
