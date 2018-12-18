import PAGES from '../pages';

const PAGE_TEMPLATE = {
  home: 'home',
  contentDetail: 'content-detail',
  contentOverview: 'content-overzicht'
};

const PAGE_TYPES = {
  nieuws: 'news',
  help: 'help',
  proclaimer: 'proclaimer',
  bediening: 'snelwegwijs',
  gegevens: 'info',
  over_api: 'apis',
  beleid: 'beleid',
  statistieken: 'statistieken',
  verplaatst: 'verplaatst',
  niet_gevonden: 'nietgevonden'
};

// Help > Bediening > Inloggen deeplink id
export const BEDIENINING_LOGIN_DEEPLINK = 'snelwegwijsitem9';

/**
 * Maps site page to CMS page variables
 */
export const CMS_PAGE_MAPPING = {
  [PAGES.HOME]: {
    template: PAGE_TEMPLATE.home
  },
  [PAGES.NEWS]: {
    template: PAGE_TEMPLATE.contentDetail,
    type: PAGE_TYPES.nieuws,
    item: 'item0'
  },
  [PAGES.HELP]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.help
  },
  [PAGES.PROCLAIMER]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.proclaimer
  },
  [PAGES.CONTROLS]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.bediening
  },
  [PAGES.DATA_INFO]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.gegevens
  },
  [PAGES.ABOUT_API]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.over_api
  },
  [PAGES.PRIVACY_SECURITY]: {
    template: PAGE_TEMPLATE.contentDetail,
    type: PAGE_TYPES.beleid,
    item: 'item0'
  },
  [PAGES.AVAILABILITY_QUALITY]: {
    template: PAGE_TEMPLATE.contentDetail,
    type: PAGE_TYPES.beleid,
    item: 'item1'
  },
  [PAGES.MANAGEMENT]: {
    template: PAGE_TEMPLATE.contentDetail,
    type: PAGE_TYPES.beleid,
    item: 'item2'
  },
  [PAGES.STATISTICS]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.statistieken
  },
  [PAGES.MOVED]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.verplaatst
  },
  [PAGES.NOT_FOUND]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.niet_gevonden
  }
};
