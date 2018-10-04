import PAGES from './pages';

export const ROUTER_NAMESPACE = 'atlasRouter';

export const routing = {
  home: {
    location: '/',
    type: `${ROUTER_NAMESPACE}/${PAGES.HOME}`,
    page: PAGES.HOME
  },
  map: {
    location: '/map',
    type: `${ROUTER_NAMESPACE}/${PAGES.KAART}`,
    page: PAGES.KAART
  },
  adressen: {
    location: '/adressen',
    type: `${ROUTER_NAMESPACE}/${PAGES.ADRESSEN}`,
    page: PAGES.ADRESSEN
  },
  vestigingen: {
    location: '/vestigingen',
    type: `${ROUTER_NAMESPACE}/${PAGES.VESTIGINGEN}`,
    page: PAGES.VESTIGINGEN
  },
  dataset: {
    location: '/dataset',
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS}`,
    page: PAGES.DATASETS
  },
  detail: {
    location: '/map/detail',
    type: `${ROUTER_NAMESPACE}/${PAGES.KAART_DETAIL}`,
    page: PAGES.KAART_DETAIL
  },

  nieuws: {
    location: '/nieuws',
    type: `${ROUTER_NAMESPACE}/${PAGES.NIEUWS}`,
    page: PAGES.NIEUWS
  },
  help: {
    location: '/help',
    type: `${ROUTER_NAMESPACE}/${PAGES.HELP}`,
    page: PAGES.HELP
  },
  proclaimer: {
    location: '/proclaimer',
    type: `${ROUTER_NAMESPACE}/${PAGES.PROCLAIMER}`,
    page: PAGES.PROCLAIMER
  },

  bediening: {
    location: '/bediening',
    type: `${ROUTER_NAMESPACE}/${PAGES.BEDIENING}`,
    page: PAGES.BEDIENING
  },
  gegevens: {
    location: '/gegevens',
    type: `${ROUTER_NAMESPACE}/${PAGES.GEGEVENS}`,
    page: PAGES.GEGEVENS
  },
  apis: {
    location: '/apis',
    type: `${ROUTER_NAMESPACE}/${PAGES.OVER_API}`,
    page: PAGES.OVER_API
  },
  privacy_beveiliging: {
    location: '/privacy-en-informatiebeveiliging',
    type: `${ROUTER_NAMESPACE}/${PAGES.PRIVACY_BEVEILIGING}`,
    page: PAGES.PRIVACY_BEVEILIGING
  },
  beschikbaar_kwaliteit: {
    location: '/beschikbaarheid-en-kwaliteit-data',
    type: `${ROUTER_NAMESPACE}/${PAGES.BESCHIKBAAR_KWALITEIT}`,
    page: PAGES.BESCHIKBAAR_KWALITEIT
  },
  beheer_werkwijze: {
    location: '/technisch-beheer-en-werkwijze',
    type: `${ROUTER_NAMESPACE}/${PAGES.BEHEER_WERKWIJZE}`,
    page: PAGES.BEHEER_WERKWIJZE
  },
  statistieken: {
    location: '/statistieken',
    type: `${ROUTER_NAMESPACE}/${PAGES.STATISTIEKEN}`,
    page: PAGES.STATISTIEKEN
  }
};

// e.g. { home: '/' }, to be used by redux-first-router/connectRoutes
const routes = Object.keys(routing).reduce((acc, key) => {
  acc[routing[key].type] = routing[key].location;
  return acc;
}, {});

export default routes;
