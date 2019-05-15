const PAGES = {
  HOME: 'HOME',
  ADDRESSES: 'ADDRESSES',
  ESTABLISHMENTS: 'ESTABLISHMENTS',
  CADASTRAL_OBJECTS: 'CADASTRAL_OBJECTS',
  SEARCH_DATASETS: 'SEARCH_DATASETS',
  PANORAMA: 'PANORAMA',
  DATASETS: 'DATASETS',
  DATASET_DETAIL: 'DATASET_DETAIL',

  DATA: 'DATA',
  DATA_QUERY_SEARCH: 'DATA_QUERY_SEARCH',
  DATA_GEO_SEARCH: 'DATA_GEO_SEARCH',
  DATA_SEARCH_CATEGORY: 'SEARCH_DATA_CATEGORY',
  DATA_DETAIL: 'DATA_DETAIL',

  BOUWDOSSIERS: 'BOUWDOSSIERS',

  // text pages
  NEWS: 'NEWS',
  PROCLAIMER: 'PROCLAIMER',
  ACTUALITY: 'ACTUALITY',
  HELP: 'HELP',
  CONTROLS: 'CONTROLS',
  DATA_INFO: 'DATA_INFO',
  ABOUT_API: 'ABOUT_API',
  LOGIN: 'LOGIN',
  PRIVACY_SECURITY: 'PRIVACY_SECURITY',
  AVAILABILITY_QUALITY: 'AVAILABILITY_QUALITY',
  MANAGEMENT: 'MANAGEMENT',
  STATISTICS: 'STATISTICS',
  MOVED: 'MOVED',
  NOT_FOUND: 'NOT_FOUND'
};

export default PAGES;

export const isCmsPage = (page) =>
  page === PAGES.NEWS ||
  page === PAGES.HELP ||
  page === PAGES.ACTUALITEIT ||
  page === PAGES.PROCLAIMER ||
  page === PAGES.CONTROLS ||
  page === PAGES.CONTROLS ||
  page === PAGES.DATA_INFO ||
  page === PAGES.ABOUT_API ||
  page === PAGES.PRIVACY_SECURITY ||
  page === PAGES.AVAILABILITY_QUALITY ||
  page === PAGES.STATISTICS ||
  page === PAGES.LOGIN ||
  page === PAGES.MOVED ||
  page === PAGES.NOT_FOUND ||
  page === PAGES.MANAGEMENT;
