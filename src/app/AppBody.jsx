import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import EmbedIframeComponent from './components/EmbedIframe/EmbedIframe';
import GeneralErrorMessage from './components/PanelMessages/ErrorMessage/ErrorMessageContainer';
import ModalComponent from './components/Modal';
import PAGES from './pages';
import { useAppReducer } from './utils/useAppReducer';

const ContentPage = React.lazy(() => import('./pages/ContentPage'));
const Home = React.lazy(() => import('./pages/Home'));
const DataSearchQuery = React.lazy(() => import('./components/DataSearch/DataSearchQuery'));
const QuerySearchPage = React.lazy(() => import('./pages/QuerySearchPage'));
const DatasetPage = React.lazy(() => import('./pages/DatasetPage'));
const ActualityContainer = React.lazy(() => import('./containers/ActualityContainer'));
const DatasetDetailContainer = React.lazy(() => import('./containers/DatasetDetailContainer/DatasetDetailContainer'));
const MapSplitPage = React.lazy(() => import('./pages/MapSplitPage'));

const AppBody = ({
  visibilityError,
  bodyClasses,
  hasMaxWidth,
  homePage,
  currentPage,
  embedPreviewMode,
  isCmsPage
}) => {
  const [state] = useAppReducer('ui');

  const extraBodyClasses = classNames({ 'c-dashboard__body--backdrop': state.nrOfBackdropTriggers });

  return (
    <div className={`c-dashboard__body ${bodyClasses} ${extraBodyClasses}`}>
      {visibilityError &&
      <GeneralErrorMessage {...{ hasMaxWidth, isHomePage: homePage }} />}
      {embedPreviewMode ?
        <EmbedIframeComponent /> :
        <div className="u-grid u-full-height">
          <div className="u-row u-full-height">
            {homePage && <Home showFooter />}

            {(currentPage === PAGES.DATA_QUERY_SEARCH ||
              currentPage === PAGES.SEARCH_DATASETS
            ) && <QuerySearchPage />}

            {/* Todo: DP-6391 */}
            {(currentPage === PAGES.DATA_SEARCH_CATEGORY) && (
              <div className="c-search-results u-grid">
                <DataSearchQuery />
              </div>
            )}

            {(currentPage === PAGES.ACTUALITY) && (
              <ActualityContainer />
            )}

            {(currentPage === PAGES.DATA ||
              currentPage === PAGES.PANORAMA ||
              currentPage === PAGES.DATA_DETAIL ||
              currentPage === PAGES.ADDRESSES ||
              currentPage === PAGES.ESTABLISHMENTS ||
              currentPage === PAGES.DATA_GEO_SEARCH ||
              currentPage === PAGES.CADASTRAL_OBJECTS)
            &&
            <MapSplitPage />
            }

            {currentPage === PAGES.DATASETS && <DatasetPage />}

            {currentPage === PAGES.DATASET_DETAIL && (
              <DatasetDetailContainer />
            )}

            {isCmsPage && (
              <ContentPage />
            )}

            <ModalComponent />
          </div>
        </div>
      }
    </div>
  );
};

AppBody.propTypes = {
  visibilityError: PropTypes.bool.isRequired,
  bodyClasses: PropTypes.string.isRequired,
  hasMaxWidth: PropTypes.bool.isRequired,
  homePage: PropTypes.bool.isRequired,
  currentPage: PropTypes.string.isRequired,
  embedPreviewMode: PropTypes.bool.isRequired,
  isCmsPage: PropTypes.bool.isRequired
};

export default AppBody;
