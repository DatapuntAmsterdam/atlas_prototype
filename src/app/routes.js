import PAGES from './pages'

export const ROUTER_NAMESPACE = 'atlasRouter'

export const MAIN_PATHS = {
  ARTICLES: 'artikelen',
  DATA: 'data',
  DATASETS: 'datasets',
  CONTENT: 'content',
  PUBLICATIONS: 'publicaties',
  SPECIALS: 'specials',
}

export const routing = {
  home: {
    title: 'Home',
    path: '/',
    type: `${ROUTER_NAMESPACE}/${PAGES.HOME}`,
    page: PAGES.HOME,
  },
  data: {
    title: 'Data',
    path: `/${MAIN_PATHS.DATA}/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA}`,
    page: PAGES.DATA,
  },
  datasets: {
    title: 'Datasets',
    path: `/${MAIN_PATHS.DATASETS}/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS}`,
    page: PAGES.DATASETS,
  },
  addresses: {
    title: 'Adressen',
    path: `/${MAIN_PATHS.DATA}/bag/adressen/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ADDRESSES}`,
    page: PAGES.ADDRESSES,
  },
  establishments: {
    title: 'Vestigingen',
    path: `/${MAIN_PATHS.DATA}/hr/vestigingen/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ESTABLISHMENTS}`,
    page: PAGES.ESTABLISHMENTS,
  },
  cadastralObjects: {
    title: 'Kadastrale objecten',
    path: `/${MAIN_PATHS.DATA}/brk/kadastrale-objecten/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.CADASTRAL_OBJECTS}`,
    page: PAGES.CADASTRAL_OBJECTS,
  },
  datasetSearch: {
    title: 'Datasets zoekresultaten',
    path: `/${MAIN_PATHS.DATASETS}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASET_SEARCH}`,
    page: PAGES.DATASET_SEARCH,
  },
  datasetDetail: {
    title: 'Dataset',
    path: `/${MAIN_PATHS.DATASETS}/:id/:slug/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASET_DETAIL}`,
    page: PAGES.DATASET_DETAIL,
  },
  dataSearchQuery: {
    title: 'Data zoekresultaten',
    path: `/${MAIN_PATHS.DATA}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH_QUERY}`,
    page: PAGES.DATA_SEARCH_QUERY,
  },
  dataSearchGeo: {
    title: 'Data zoekresultaten op locatie',
    path: `/${MAIN_PATHS.DATA}/geozoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH_GEO}`,
    page: PAGES.DATA_SEARCH_GEO,
  },
  dataSearchCategory: {
    title: 'Data zoekresultaten',
    path: `/${MAIN_PATHS.DATA}/:category/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH_CATEGORY}`,
    page: PAGES.DATA_SEARCH_CATEGORY,
  },
  panorama: {
    title: 'Panoramabeeld',
    path: `/${MAIN_PATHS.DATA}/panorama/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PANORAMA}`,
    page: PAGES.PANORAMA,
  },
  constructionFile: {
    title: 'Bouwdossier',
    path: `/${MAIN_PATHS.DATA}/stadsarchief/bouwdossier/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.CONSTRUCTION_FILE}`,
    useHooks: true, // indicate to skip legacy documentHead and piwik middleware
    page: PAGES.CONSTRUCTION_FILE,
  },
  articleDetail: {
    title: 'Artikel',
    path: `/${MAIN_PATHS.ARTICLES}/artikel/:id/:slug/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ARTICLE_DETAIL}`,
    page: PAGES.ARTICLE_DETAIL,
  },
  articles: {
    title: 'Artikelen',
    path: `/${MAIN_PATHS.ARTICLES}/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ARTICLES}`,
    page: PAGES.ARTICLES,
  },
  nieuws: {
    title: 'Nieuws',
    path: `/${MAIN_PATHS.CONTENT}/nieuws/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.NEWS}`,
    page: PAGES.NEWS,
  },
  help: {
    title: 'Help',
    path: `/${MAIN_PATHS.CONTENT}/help/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.HELP}`,
    page: PAGES.HELP,
  },
  proclaimer: {
    title: 'Proclaimer',
    path: `/${MAIN_PATHS.CONTENT}/proclaimer/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PROCLAIMER}`,
    page: PAGES.PROCLAIMER,
  },
  bediening: {
    title: 'Bediening',
    path: `/${MAIN_PATHS.CONTENT}/bediening/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.CONTROLS}`,
    page: PAGES.CONTROLS,
  },
  gegevens: {
    title: 'Gegevens',
    path: `/${MAIN_PATHS.CONTENT}/gegevens/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_INFO}`,
    page: PAGES.DATA_INFO,
  },
  apis: {
    title: "Api's",
    path: `/${MAIN_PATHS.CONTENT}/apis/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ABOUT_API}`,
    page: PAGES.ABOUT_API,
  },
  actuality: {
    title: 'Actualiteit',
    path: `/${MAIN_PATHS.CONTENT}/actualiteit/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ACTUALITY}`,
    page: PAGES.ACTUALITY,
  },
  privacy_beveiliging: {
    title: 'Privacy en informatiebeveiliging',
    path: `/${MAIN_PATHS.CONTENT}/privacy-en-informatiebeveiliging/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PRIVACY_SECURITY}`,
    page: PAGES.PRIVACY_SECURITY,
  },
  beschikbaar_kwaliteit: {
    title: 'Beschikbaarheid en kwaliteit van de data',
    path: `/${MAIN_PATHS.CONTENT}/beschikbaarheid-en-kwaliteit-data/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.AVAILABILITY_QUALITY}`,
    page: PAGES.AVAILABILITY_QUALITY,
  },
  beheer_werkwijze: {
    title: 'Technisch beheer en werkwijze',
    path: `/${MAIN_PATHS.CONTENT}/technisch-beheer-en-werkwijze/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.MANAGEMENT}`,
    page: PAGES.MANAGEMENT,
  },
  statistieken: {
    title: 'Statistieken',
    path: `/${MAIN_PATHS.CONTENT}/statistieken/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.STATISTICS}`,
    page: PAGES.STATISTICS,
  },
  inloggen: {
    title: 'Inloggen',
    path: `/${MAIN_PATHS.CONTENT}/inloggen/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.LOGIN}`,
    page: PAGES.LOGIN,
  },
  verplaatst: {
    title: 'Pagina verplaatst',
    path: '/verplaatst/',
    type: `${ROUTER_NAMESPACE}/${PAGES.MOVED}`,
    page: PAGES.MOVED,
  },
  niet_gevonden: {
    title: 'Pagina niet gevonden',
    path: '/niet-gevonden/',
    type: `${ROUTER_NAMESPACE}/${PAGES.NOT_FOUND}`,
    page: PAGES.NOT_FOUND,
  },
  dataDetail: {
    title: 'Data detail',
    path: `/${MAIN_PATHS.DATA}/:type/:subtype/:id/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_DETAIL}`,
    page: PAGES.DATA_DETAIL,
  },
  articleSearch: {
    title: 'Artikelen zoekresultaten',
    path: `/${MAIN_PATHS.ARTICLES}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ARTICLE_SEARCH}`,
    page: PAGES.ARTICLE_SEARCH,
  },
  publications: {
    title: 'Publicaties',
    path: `/${MAIN_PATHS.PUBLICATIONS}/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PUBLICATIONS}`,
    page: PAGES.PUBLICATIONS,
  },
  publicationDetail: {
    title: 'Publicatie',
    path: `/${MAIN_PATHS.PUBLICATIONS}/publicatie/:id/:slug/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PUBLICATION_DETAIL}`,
    page: PAGES.PUBLICATION_DETAIL,
  },
  publicationSearch: {
    title: 'Publicaties zoekresultaten',
    path: `/${MAIN_PATHS.PUBLICATIONS}/zoek/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PUBLICATION_SEARCH}`,
    page: PAGES.PUBLICATION_SEARCH,
  },
  specials: {
    title: 'Specials',
    path: `/${MAIN_PATHS.SPECIALS}/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.SPECIALS}`,
    page: PAGES.SPECIALS,
  },
  specialDetail: {
    title: 'Special',
    path: `/${MAIN_PATHS.SPECIALS}/:type/:id/:slug/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.SPECIAL_DETAIL}`,
    page: PAGES.SPECIAL_DETAIL,
  },
}

/**
 * We need to check if the route paths have a trailing slash
 */
Object.values(routing).forEach(value => {
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

export default routes
