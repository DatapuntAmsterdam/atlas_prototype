import React from 'react';
import PropTypes from 'prop-types';
import { AngularWrapper } from 'react-angular';
import Footer from '../components/Footer/Footer';
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
  statistieken: 'statistieken'
};

/**
 * Maps site page to CMS page variables
 */
export const CMS_PAGE_MAPPING = {
  [PAGES.HOME]: {
    template: PAGE_TEMPLATE.home
  },
  [PAGES.NIEUWS]: {
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
  [PAGES.BEDIENING]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.bediening
  },
  [PAGES.GEGEVENS]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.gegevens
  },
  [PAGES.OVER_API]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.over_api
  },
  [PAGES.PRIVACY_BEVEILIGING]: {
    template: PAGE_TEMPLATE.contentDetail,
    type: PAGE_TYPES.beleid,
    item: 'item0'
  },
  [PAGES.BESCHIKBAAR_KWALITEIT]: {
    template: PAGE_TEMPLATE.contentDetail,
    type: PAGE_TYPES.beleid,
    item: 'item1'
  },
  [PAGES.BEHEER_WERKWIJZE]: {
    template: PAGE_TEMPLATE.contentDetail,
    type: PAGE_TYPES.beleid,
    item: 'item2'
  },
  [PAGES.STATISTIEKEN]: {
    template: PAGE_TEMPLATE.contentOverview,
    type: PAGE_TYPES.statistieken
  }
};

const ContentPage = ({ name, item, type, columnSizes, showFooter }) => (
  <div
    style={{ display: (columnSizes.right) ? 'block' : 'none' }}
    className={`c-dashboard__column c-dashboard__content u-col-sm--${columnSizes.right} qa-dashboard__column--right`}
  >
    <div className="c-dashboard__page o-max-width">
      <div className="c-dashboard__page-inner o-max-width__inner u-gutter">
        <div className="qa-page">
          <AngularWrapper
            moduleName="dpPageWrapper"
            component={'dpPage'}
            dependencies={['atlas']}
            interpolateBindings={{
              name,
              type,
              item
            }}
          />
        </div>
      </div>
      {showFooter &&
      <Footer />
      }
    </div>
  </div>
);

ContentPage.defaultProps = {
  type: '',
  showFooter: false,
  item: []
};

ContentPage.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  item: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  showFooter: PropTypes.bool,
  columnSizes: PropTypes.shape({
    right: PropTypes.number,
    middle: PropTypes.number
  }).isRequired
};

export default ContentPage;
