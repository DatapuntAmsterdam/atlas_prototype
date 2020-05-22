const PAGES = {
  HOME: 'HOME',
  ADDRESSES: 'ADDRESSES',
  ESTABLISHMENTS: 'ESTABLISHMENTS',
  CADASTRAL_OBJECTS: 'CADASTRAL_OBJECTS',
  PANORAMA: 'PANORAMA',

  DATASET_DETAIL: 'DATASET_DETAIL',
  DATASET_SEARCH: 'DATASET_SEARCH',

  DATA: 'DATA',
  DATA_DETAIL: 'DATA_DETAIL',
  DATA_SEARCH: 'DATA_SEARCH',
  DATA_SEARCH_GEO: 'DATA_SEARCH_GEO',
  DATA_SEARCH_CATEGORY: 'SEARCH_DATA_CATEGORY',

  SEARCH: 'SEARCH',

  CONSTRUCTION_FILE: 'CONSTRUCTION_FILE',

  // cms pages
  ARTICLE_DETAIL: 'ARTICLE_DETAIL',
  ARTICLE_SEARCH: 'ARTICLE_SEARCH',
  SPECIAL_SEARCH: 'SPECIALS_SEARCH',
  SPECIAL_DETAIL: 'SPECIAL_DETAIL',
  PUBLICATION_DETAIL: 'PUBLICATION_DETAIL',
  PUBLICATION_SEARCH: 'PUBLICATION_SEARCH',
  COLLECTION_DETAIL: 'COLLECTION_DETAIL',
  COLLECTION_SEARCH: 'COLLECTION_SEARCH',

  // map pages
  MAP: 'MAP',
  MAP_SEARCH: 'MAP_SEARCH',

  // text pages
  ACTUALITY: 'ACTUALITY',
  LOGIN: 'LOGIN',

  NOT_FOUND: 'NOT_FOUND',
}

export default PAGES

export const isContentPage = (page: string) =>
  page === PAGES.ACTUALITY || page === PAGES.LOGIN || page === PAGES.NOT_FOUND

export const isEditorialDetailPage = (page: string) =>
  page === PAGES.ARTICLE_DETAIL ||
  page === PAGES.PUBLICATION_DETAIL ||
  page === PAGES.SPECIAL_DETAIL ||
  page === PAGES.COLLECTION_DETAIL

export const isMapSplitPage = (page: string) =>
  page === PAGES.DATA ||
  page === PAGES.PANORAMA ||
  page === PAGES.DATA_DETAIL ||
  page === PAGES.ADDRESSES ||
  page === PAGES.ESTABLISHMENTS ||
  page === PAGES.DATA_SEARCH_GEO ||
  page === PAGES.CADASTRAL_OBJECTS

export const isSearchPage = (page: string) =>
  page === PAGES.SEARCH ||
  page === PAGES.DATA_SEARCH ||
  page === PAGES.DATASET_SEARCH ||
  page === PAGES.ARTICLE_SEARCH ||
  page === PAGES.PUBLICATION_SEARCH ||
  page === PAGES.SPECIAL_SEARCH ||
  page === PAGES.COLLECTION_SEARCH ||
  page === PAGES.MAP_SEARCH

export const isAllResultsPage = (page: string) => page === PAGES.SEARCH
export const isDataSearchPage = (page: string) => page === PAGES.DATA_SEARCH
export const isMapSearchPage = (page: string) => page === PAGES.MAP_SEARCH
