import PAGES from './pages';

export const ROUTER_NAMESPACE = 'atlasRouter';

const baseRoute = process.env.ASSETS_PATH || '/adrian';
console.log('ASSETS_PATH', process.env.ASSETS_PATH, baseRoute);
// const baseRoute = '/adrian';

export const routing = {
  home: {
    title: 'Home',
    path: `${baseRoute}/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.HOME}`,
    page: PAGES.HOME
  },
  map: {
    title: 'Grote kaart',
    path: `${baseRoute}/kaart`,
    type: `${ROUTER_NAMESPACE}/${PAGES.MAP}`,
    page: PAGES.MAP
  },
  datasets: {
    title: 'Datasets',
    path: `${baseRoute}/datasets`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS}`,
    page: PAGES.DATASETS
  },
  datasetsDetail: {
    title: '',
    path: `${baseRoute}/datasets/detail/:id`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS_DETAIL}`,
    page: PAGES.DATASETS_DETAIL
  },
  addresses: {
    title: '',
    path: `${baseRoute}/datasets/bag/adressen`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ADDRESSES}`,
    page: PAGES.ADDRESSES
  },
  establishments: {
    title: '',
    path: `${baseRoute}/datasets/hr/vestigingen`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ESTABLISHMENTS}`,
    page: PAGES.ESTABLISHMENTS
  },
  cadastralObjects: {
    title: '',
    path: `${baseRoute}/datasets/brk/kadastrale-objecten`,
    type: `${ROUTER_NAMESPACE}/${PAGES.CADASTRAL_OBJECTS}`,
    page: PAGES.CADASTRAL_OBJECTS
  },
  searchDatasets: {
    path: `${baseRoute}/datasets/zoek`,
    type: `${ROUTER_NAMESPACE}/${PAGES.SEARCH_DATASETS}`,
    page: PAGES.SEARCH_DATASETS
  },
  dataSearch: {
    title: 'Data zoeken',
    path: `${baseRoute}/data/`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_SEARCH}`,
    page: PAGES.DATA_SEARCH
  },
  detail: {
    title: '',
    path: `${baseRoute}/map/detail`,
    type: `${ROUTER_NAMESPACE}/${PAGES.KAART_DETAIL}`,
    page: PAGES.KAART_DETAIL
  },
  panorama: {
    title: 'Panorama',
    path: `${baseRoute}/datasets/panorama/:id`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PANORAMA}`,
    page: PAGES.PANORAMA
  },
  nieuws: {
    title: '',
    path: `${baseRoute}/nieuws`,
    type: `${ROUTER_NAMESPACE}/${PAGES.NEWS}`,
    page: PAGES.NEWS
  },
  help: {
    title: '',
    path: `${baseRoute}/help`,
    type: `${ROUTER_NAMESPACE}/${PAGES.HELP}`,
    page: PAGES.HELP
  },
  proclaimer: {
    title: '',
    path: `${baseRoute}/proclaimer`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PROCLAIMER}`,
    page: PAGES.PROCLAIMER
  },

  bediening: {
    title: '',
    path: `${baseRoute}/bediening`,
    type: `${ROUTER_NAMESPACE}/${PAGES.CONTROLS}`,
    page: PAGES.CONTROLS
  },
  gegevens: {
    title: '',
    path: `${baseRoute}/gegevens`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_INFO}`,
    page: PAGES.DATA_INFO
  },
  apis: {
    title: '',
    path: `${baseRoute}/apis`,
    type: `${ROUTER_NAMESPACE}/${PAGES.ABOUT_API}`,
    page: PAGES.ABOUT_API
  },
  privacy_beveiliging: {
    title: '',
    path: `${baseRoute}/privacy-en-informatiebeveiliging`,
    type: `${ROUTER_NAMESPACE}/${PAGES.PRIVACY_SECURITY}`,
    page: PAGES.PRIVACY_SECURITY
  },
  beschikbaar_kwaliteit: {
    title: '',
    path: `${baseRoute}/beschikbaarheid-en-kwaliteit-data`,
    type: `${ROUTER_NAMESPACE}/${PAGES.AVAILABILITY_QUALITY}`,
    page: PAGES.AVAILABILITY_QUALITY
  },
  beheer_werkwijze: {
    title: '',
    path: `${baseRoute}/technisch-beheer-en-werkwijze`,
    type: `${ROUTER_NAMESPACE}/${PAGES.MANAGEMENT}`,
    page: PAGES.MANAGEMENT
  },
  statistieken: {
    title: '',
    path: `${baseRoute}/statistieken`,
    type: `${ROUTER_NAMESPACE}/${PAGES.STATISTICS}`,
    page: PAGES.STATISTICS
  },

  dataDetail: {
    title: 'Data detail',
    path: `${baseRoute}/datasets/:type/:subtype/:id`,
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_DETAIL}`,
    page: PAGES.DATA_DETAIL
  }
};

// e.g. { home: '/' }, to be used by redux-first-router/connectRoutes
const routes = Object.keys(routing).reduce((acc, key) => {
  acc[routing[key].type] = routing[key].path;
  return acc;
}, {});

export default routes;
