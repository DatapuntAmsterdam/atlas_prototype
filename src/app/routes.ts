import PAGES from './pages'
import { FEATURE_BETA_MAP, isFeatureEnabled } from './features'

export const ROUTER_NAMESPACE = 'atlasRouter'

export const MAIN_PATHS = {
  ARTICLES: 'artikelen',
  DATA: 'data',
  DATASETS: 'datasets',
  CONTENT: 'content',
  PUBLICATIONS: 'publicaties',
  SPECIALS: 'specials',
  COLLECTIONS: 'dossiers',
  MAPS: 'kaarten',
  MAP: 'kaart',
}

// TODO: Refactor this file once redux-first-router has been removed from the project.
export interface Route {
  title: string
  path: string
  type: string
  page: string
  useHooks?: boolean
}

function typeHelper<K extends PropertyKey>(obj: Record<K, Route>): Record<K, Route> {
  return obj
}

const legacyMapDataPath = isFeatureEnabled(FEATURE_BETA_MAP) ? MAIN_PATHS.MAP : MAIN_PATHS.DATA
const betaMapDataPath = isFeatureEnabled(FEATURE_BETA_MAP) ? MAIN_PATHS.DATA : MAIN_PATHS.MAP

export const routing = typeHelper({
  home: {
    title: 'Home',
    path: '/',
    type: `${ROUTER_NAMESPACE}/${PAGES.HOME}`,
    page: PAGES.HOME,
  },
  data: {
    title: 'Data',
    path: `/${legacyMapDataPath}/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA}`,
    page: PAGES.DATA,
  },
  addresses: {
    title: 'Adressen',
    path: `/${legacyMapDataPath}/bag/adressen/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ADDRESSES}`,
    page: PAGES.ADDRESSES,
  },
  establishments: {
    title: 'Vestigingen',
    path: `/${legacyMapDataPath}/hr/vestigingen/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ESTABLISHMENTS}`,
    page: PAGES.ESTABLISHMENTS,
  },
  cadastralObjects: {
    title: 'Kadastrale objecten',
    path: `/${legacyMapDataPath}/brk/kadastrale-objecten/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.CADASTRAL_OBJECTS}`,
    page: PAGES.CADASTRAL_OBJECTS,
  },
  datasetSearch: {
    title: 'Datasets',
    path: `/${MAIN_PATHS.DATASETS}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASET_SEARCH}`,
    page: PAGES.DATASET_SEARCH,
  },
  datasetDetail: {
    title: 'Dataset',
    path: `/${MAIN_PATHS.DATASETS}/:id/:slug*/`, // slug here is optional by appending "*"
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASET_DETAIL}`,
    page: PAGES.DATASET_DETAIL,
  },
  search: {
    title: 'Alle zoekresultaten',
    path: `/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.SEARCH}`,
    page: PAGES.SEARCH,
  },
  dataSearch: {
    title: 'Data',
    path: `/${MAIN_PATHS.DATA}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH}`,
    page: PAGES.DATA_SEARCH,
  },
  dataSearchGeo: {
    title: 'Data zoekresultaten op locatie',
    path: `/${legacyMapDataPath}/geozoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH_GEO}`,
    page: PAGES.DATA_SEARCH_GEO,
  },
  panorama: {
    title: 'Panoramabeeld',
    path: `/${MAIN_PATHS.DATA}/panorama/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PANORAMA}`,
    page: PAGES.PANORAMA,
  },
  constructionDossier: {
    title: 'Bouwdossier',
    path: `/${MAIN_PATHS.DATA}/bouwdossiers/bouwdossier/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.CONSTRUCTION_DOSSIER}`,
    useHooks: true, // indicate to skip legacy documentHead and piwik middleware
    page: PAGES.CONSTRUCTION_DOSSIER,
  },
  actuality: {
    title: 'Actualiteit',
    path: `/${MAIN_PATHS.CONTENT}/actualiteit/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ACTUALITY}`,
    page: PAGES.ACTUALITY,
  },
  inloggen: {
    title: 'Inloggen',
    path: `/${MAIN_PATHS.CONTENT}/inloggen/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.LOGIN}`,
    page: PAGES.LOGIN,
  },
  notFound: {
    title: 'Pagina niet gevonden',
    path: '/niet-gevonden/',
    type: `${ROUTER_NAMESPACE}/${PAGES.NOT_FOUND}`,
    page: PAGES.NOT_FOUND,
  },
  dataDetail: {
    title: 'Data detail',
    path: `/${legacyMapDataPath}/:type/:subtype/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_DETAIL}`,
    page: PAGES.DATA_DETAIL,
  },
  articleDetail: {
    title: 'Artikel',
    path: `/${MAIN_PATHS.ARTICLES}/artikel/:slug/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ARTICLE_DETAIL}`,
    page: PAGES.ARTICLE_DETAIL,
  },
  articleSearch: {
    title: 'Artikelen',
    path: `/${MAIN_PATHS.ARTICLES}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ARTICLE_SEARCH}`,
    page: PAGES.ARTICLE_SEARCH,
  },
  specialSearch: {
    title: 'Specials',
    path: `/${MAIN_PATHS.SPECIALS}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.SPECIAL_SEARCH}`,
    page: PAGES.SPECIAL_SEARCH,
  },
  publicationDetail: {
    title: 'Publicatie',
    path: `/${MAIN_PATHS.PUBLICATIONS}/publicatie/:slug/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PUBLICATION_DETAIL}`,
    page: PAGES.PUBLICATION_DETAIL,
  },
  publicationSearch: {
    title: 'Publicaties',
    path: `/${MAIN_PATHS.PUBLICATIONS}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PUBLICATION_SEARCH}`,
    page: PAGES.PUBLICATION_SEARCH,
  },
  specialDetail: {
    title: 'Special',
    path: `/${MAIN_PATHS.SPECIALS}/:type/:slug/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.SPECIAL_DETAIL}`,
    page: PAGES.SPECIAL_DETAIL,
  },
  collectionDetail: {
    title: 'Dossier',
    path: `/${MAIN_PATHS.COLLECTIONS}/dossier/:slug/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.COLLECTION_DETAIL}`,
    page: PAGES.COLLECTION_DETAIL,
  },
  collectionSearch: {
    title: 'Dossiers',
    path: `/${MAIN_PATHS.COLLECTIONS}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.COLLECTION_SEARCH}`,
    page: PAGES.COLLECTION_SEARCH,
  },
  mapSearch: {
    title: 'Kaarten',
    path: `/${MAIN_PATHS.MAPS}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.MAP_SEARCH}`,
    page: PAGES.MAP_SEARCH,
  },
  //  Todo: AfterBeta remove these

  data_TEMP: {
    title: 'Data',
    path: `/${betaMapDataPath}/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA}_TEMP`,
    page: PAGES.DATA,
  },
  dataSearchGeo_TEMP: {
    title: 'Data zoekresultaten op locatie',
    path: `/${betaMapDataPath}/geozoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH_GEO}_TEMP`,
    page: PAGES.DATA_SEARCH_GEO,
  },
  dataDetail_TEMP: {
    title: 'Data detail',
    path: `/${betaMapDataPath}/:type/:subtype/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_DETAIL}_TEMP`,
    page: PAGES.DATA_DETAIL,
  },
  panorama_TEMP: {
    title: 'Panoramabeeld',
    path: `/${betaMapDataPath}/panorama/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PANORAMA}_TEMP`,
    page: PAGES.PANORAMA,
  },
  addresses_TEMP: {
    title: 'Adressen',
    path: `/${betaMapDataPath}/bag/adressen/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ADDRESSES}_TEMP`,
    page: PAGES.ADDRESSES,
  },
  establishments_TEMP: {
    title: 'Vestigingen',
    path: `/${betaMapDataPath}/hr/vestigingen/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ESTABLISHMENTS}_TEMP`,
    page: PAGES.ESTABLISHMENTS,
  },
  cadastralObjects_TEMP: {
    title: 'Kadastrale objecten',
    path: `/${betaMapDataPath}/brk/kadastrale-objecten/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.CADASTRAL_OBJECTS}_TEMP`,
    page: PAGES.CADASTRAL_OBJECTS,
  },
})

/**
 * We need to check if the route paths have a trailing slash
 */
Object.values(routing).forEach((value) => {
  if (value.path.substring(value.path.length - 1) !== '/') {
    // eslint-disable-next-line no-console
    console.warn(`Route for "${value.title}" doesn't have trailing slash`)
  }
})

// e.g. { home: '/' }, to be used by redux-first-router/connectRoutes
const routes = Object.keys(routing).reduce((acc, key) => {
  acc[routing[key].type] = routing[key].path
  return acc
}, {})

export const mapSearchPagePaths = [
  routing.search.path,
  routing.dataSearch.path,
  routing.datasetSearch.path,
  routing.articleSearch.path,
  routing.publicationSearch.path,
  routing.specialSearch.path,
  routing.collectionSearch.path,
  routing.mapSearch.path,
]

export const mapSplitPagePaths = [
  routing.dataDetail.path,
  routing.data.path,
  routing.panorama.path,
  routing.addresses.path,
  routing.establishments.path,
  routing.dataSearchGeo.path,
  routing.cadastralObjects.path,
]

export default routes
