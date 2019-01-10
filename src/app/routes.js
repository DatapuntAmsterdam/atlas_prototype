import PAGES from './pages';

export const ROUTER_NAMESPACE = 'atlasRouter';

export const routing = {
  home: {
    title: 'Home',
    path: '/',
    type: `${ROUTER_NAMESPACE}/${PAGES.HOME}`,
    page: PAGES.HOME
  },
  map: {
    title: 'Grote kaart',
    path: '/kaart',
    type: `${ROUTER_NAMESPACE}/${PAGES.MAP}`,
    page: PAGES.MAP
  },
  datasets: {
    title: 'Datasets',
    path: '/datasets',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS}`,
    page: PAGES.DATASETS
  },
  addresses: {
    title: '',
    path: '/data/bag/adressen',
    type: `${ROUTER_NAMESPACE}/${PAGES.ADDRESSES}`,
    page: PAGES.ADDRESSES
  },
  establishments: {
    title: '',
    path: '/data/hr/vestigingen',
    type: `${ROUTER_NAMESPACE}/${PAGES.ESTABLISHMENTS}`,
    page: PAGES.ESTABLISHMENTS
  },
  cadastralObjects: {
    title: '',
    path: '/data/brk/kadastrale-objecten',
    type: `${ROUTER_NAMESPACE}/${PAGES.CADASTRAL_OBJECTS}`,
    page: PAGES.CADASTRAL_OBJECTS
  },
  searchDatasets: {
    path: '/datasets/zoek',
    type: `${ROUTER_NAMESPACE}/${PAGES.SEARCH_DATASETS}`,
    page: PAGES.SEARCH_DATASETS
  },
  datasetsDetail: {
    title: '',
    path: '/datasets/:id',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS_DETAIL}`,
    page: PAGES.DATASETS_DETAIL
  },
  dataSearch: {
    title: 'Data zoeken',
    path: '/data/zoek',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH}`,
    page: PAGES.DATA_SEARCH
  },
  dataSearchCategory: {
    title: 'Data zoeken',
    path: '/data/:category',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH_CATEGORY}`,
    page: PAGES.DATA_SEARCH_CATEGORY
  },
  panorama: {
    title: 'Panorama',
    path: '/data/panorama/:id',
    type: `${ROUTER_NAMESPACE}/${PAGES.PANORAMA}`,
    page: PAGES.PANORAMA
  },
  nieuws: {
    title: '',
    path: '/nieuws',
    type: `${ROUTER_NAMESPACE}/${PAGES.NEWS}`,
    page: PAGES.NEWS
  },
  help: {
    title: '',
    path: '/help',
    type: `${ROUTER_NAMESPACE}/${PAGES.HELP}`,
    page: PAGES.HELP
  },
  proclaimer: {
    title: '',
    path: '/proclaimer',
    type: `${ROUTER_NAMESPACE}/${PAGES.PROCLAIMER}`,
    page: PAGES.PROCLAIMER
  },

  bediening: {
    title: '',
    path: '/bediening',
    type: `${ROUTER_NAMESPACE}/${PAGES.CONTROLS}`,
    page: PAGES.CONTROLS
  },
  gegevens: {
    title: '',
    path: '/gegevens',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_INFO}`,
    page: PAGES.DATA_INFO
  },
  apis: {
    title: '',
    path: '/apis',
    type: `${ROUTER_NAMESPACE}/${PAGES.ABOUT_API}`,
    page: PAGES.ABOUT_API
  },
  privacy_beveiliging: {
    title: '',
    path: '/privacy-en-informatiebeveiliging',
    type: `${ROUTER_NAMESPACE}/${PAGES.PRIVACY_SECURITY}`,
    page: PAGES.PRIVACY_SECURITY
  },
  beschikbaar_kwaliteit: {
    title: '',
    path: '/beschikbaarheid-en-kwaliteit-data',
    type: `${ROUTER_NAMESPACE}/${PAGES.AVAILABILITY_QUALITY}`,
    page: PAGES.AVAILABILITY_QUALITY
  },
  beheer_werkwijze: {
    title: '',
    path: '/technisch-beheer-en-werkwijze',
    type: `${ROUTER_NAMESPACE}/${PAGES.MANAGEMENT}`,
    page: PAGES.MANAGEMENT
  },
  statistieken: {
    title: '',
    path: '/statistieken',
    type: `${ROUTER_NAMESPACE}/${PAGES.STATISTICS}`,
    page: PAGES.STATISTICS
  },
  verplaatst: {
    title: '',
    path: '/verplaatst',
    type: `${ROUTER_NAMESPACE}/${PAGES.MOVED}`,
    page: PAGES.MOVED
  },
  niet_gevonden: {
    title: '',
    path: '/niet-gevonden',
    type: `${ROUTER_NAMESPACE}/${PAGES.NOT_FOUND}`,
    page: PAGES.NOT_FOUND
  },
  dataDetail: {
    title: 'Data detail',
    path: '/data/:type/:subtype/:id',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_DETAIL}`,
    page: PAGES.DATA_DETAIL
  }
};

export const ROUTE_ACTIONS = Object
  .keys(routing)
  .reduce((acc, key) => ([...acc, routing[key].type]), []);

// e.g. { home: '/' }, to be used by redux-first-router/connectRoutes
const routes = Object.keys(routing).reduce((acc, key) => {
  acc[routing[key].type] = routing[key].path;
  return acc;
}, {});

export default routes;
