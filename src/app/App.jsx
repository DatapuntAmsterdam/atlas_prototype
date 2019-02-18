import React from 'react';
import classNames from 'classnames';
import { AngularWrapper } from 'react-angular';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ContentPage from './pages/ContentPage';
import PAGES, { isCmsPage as pageIsCmsPage } from './pages';
import './_app.scss';
import DatasetDetailContainer from './containers/DatasetDetailContainer/DatasetDetailContainer';
import {
  isEmbedded,
  isEmbedPreview,
  isPrintMode,
  isPrintModeLandscape,
  isPrintOrEmbedMode
} from '../shared/ducks/ui/ui';
import { hasGlobalError } from '../shared/ducks/error/error-message';
import Home from './pages/Home';
import { getUser } from '../shared/ducks/user/user';
import { getPage, isHomepage } from '../store/redux-first-router/selectors';
import EmbedIframeComponent from './components/EmbedIframe/EmbedIframe';
import QuerySearchPage from './pages/QuerySearchPage';
import DatasetPage from './pages/DatasetPage';
import { DataSearchQuery } from './components/DataSearch';
import MapSplitPage from './pages/MapSplitPage';
import ActualityContainer from './containers/ActualityContainer';
import GeneralErrorMessage from './components/PanelMessages/ErrorMessage/ErrorMessageContainer';

// TodoReactMigration: implement logic
const App = ({
  isFullHeight,
  visibilityError,
  homePage,
  currentPage,
  embedMode,
  printMode,
  embedPreviewMode,
  printModeLandscape,
  printOrEmbedMode,
  user
}) => {
  const isCmsPage = pageIsCmsPage(currentPage);
  const hasMaxWidth = homePage || isCmsPage;

  const rootClasses = classNames({
    'c-dashboard--max-width': hasMaxWidth,
    'c-dashboard--full-height': isFullHeight,
    'c-dashboard--homepage': homePage
  });
  const bodyClasses = classNames({
    'c-dashboard__body--error': visibilityError
  });

  // Todo: preferably don't modify html class, now needed since these classes add height: auto to
  // html and body
  const printAndEmbedClasses = [
    'is-print-mode', 'is-print-mode--landscape', 'is-embed', 'is-embed-preview'
  ];
  const printEmbedModeClasses = classNames({
    [printAndEmbedClasses[0]]: printMode,
    [printAndEmbedClasses[1]]: printModeLandscape, // Todo: implement
    [printAndEmbedClasses[2]]: embedMode,
    [printAndEmbedClasses[3]]: embedPreviewMode
  });

  document.documentElement.classList.remove(...printAndEmbedClasses);
  if (printEmbedModeClasses) {
    document.documentElement.classList.add(...printEmbedModeClasses.split(' '));
  }

  // Todo: don't use page types, this will be used
  const pageTypeClass = currentPage.toLowerCase().replace('_', '-');

  return (
    <div
      className={`c-dashboard c-dashboard--page-type-${pageTypeClass} ${rootClasses}`}
    >
      {!embedMode &&
      <AngularWrapper
        moduleName={'dpHeaderWrapper'}
        component="dpHeader"
        dependencies={['atlas']}
        bindings={{
          isHomePage: homePage,
          hasMaxWidth,
          user,
          isPrintMode: printMode,
          isEmbedPreview: embedPreviewMode,
          isPrintOrEmbedOrPreview: printOrEmbedMode
        }}
      />
      }
      <div className={`c-dashboard__body ${bodyClasses}`}>
        {visibilityError && <GeneralErrorMessage {...{ hasMaxWidth, isHomePage: homePage }} />}
        {embedPreviewMode ?
          <EmbedIframeComponent /> :
          <div className="u-grid u-full-height">
            <div className="u-row u-full-height">
              {homePage && <Home showFooter />}

              {(currentPage === PAGES.DATA_QUERY_SEARCH || currentPage === PAGES.SEARCH_DATASETS) &&
              <QuerySearchPage />
              }

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
              && <MapSplitPage />
              }

              {currentPage === PAGES.DATASETS && <DatasetPage />}

              {currentPage === PAGES.DATASET_DETAIL && (
                <DatasetDetailContainer />
              )}

              {isCmsPage && (
                <ContentPage />
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
};

App.defaultProps = {
  isFullHeight: false,
  visibilityError: false
};

App.propTypes = {
  isFullHeight: PropTypes.bool,
  currentPage: PropTypes.string.isRequired,
  visibilityError: PropTypes.bool, // vm.visibility.error
  embedMode: PropTypes.bool.isRequired,
  homePage: PropTypes.bool.isRequired,
  printMode: PropTypes.bool.isRequired,
  printOrEmbedMode: PropTypes.bool.isRequired,
  printModeLandscape: PropTypes.bool.isRequired,
  embedPreviewMode: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = (state) => ({
  currentPage: getPage(state),
  embedMode: isEmbedded(state),
  homePage: isHomepage(state),
  printMode: isPrintMode(state),
  printModeLandscape: isPrintModeLandscape(state),
  embedPreviewMode: isEmbedPreview(state),
  printOrEmbedMode: isPrintOrEmbedMode(state),
  user: getUser(state),
  visibilityError: hasGlobalError(state)
});

const AppContainer = connect(mapStateToProps, null)(App);

export default AppContainer;
