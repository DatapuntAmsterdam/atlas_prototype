import React, { Suspense } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import EmbedIframeComponent from './components/EmbedIframe/EmbedIframe'
import GeneralErrorMessage from './components/PanelMessages/ErrorMessage/ErrorMessageContainer'
import { FeedbackModal, InfoModal } from './components/Modal'
import PAGES, {
  isMapSplitPage,
  isOldCmsPage,
  isEditorialOverviewPage,
  isQuerySearchPage,
} from './pages'
import { useAppReducer } from './utils/useAppReducer'
import LoadingIndicator from '../shared/components/loading-indicator/LoadingIndicator'

const ContentPage = React.lazy(() => import('./pages/ContentPage'))
const Home = React.lazy(() => import('./pages/Home'))
const DataSearchQuery = React.lazy(() => import('./components/DataSearch/DataSearchQuery'))
const QuerySearchPage = React.lazy(() => import('./pages/QuerySearchPage'))
const DatasetPage = React.lazy(() => import('./pages/DatasetPage'))
const ActualityContainer = React.lazy(() => import('./containers/ActualityContainer'))
const DatasetDetailContainer = React.lazy(() =>
  import('./containers/DatasetDetailContainer/DatasetDetailContainer'),
)
const ConstructionFilesContainer = React.lazy(() =>
  import('./containers/ConstructionFilesContainer/ConstructionFilesContainer'),
)
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetailPage'))
const PublicationDetailPage = React.lazy(() => import('./pages/PublicationDetailPage'))
const SpecialDetailPage = React.lazy(() => import('./pages/SpecialDetailPage'))
const EditorialOverviewPage = React.lazy(() => import('./pages/EditorialOverviewPage'))
const MapSplitPage = React.lazy(() => import('./pages/MapSplitPage'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

const AppBody = ({
  visibilityError,
  bodyClasses,
  hasMaxWidth,
  homePage,
  currentPage,
  embedPreviewMode,
}) => {
  const [state] = useAppReducer('ui')

  const extraBodyClasses = classNames({
    'c-dashboard__body--backdrop': state.backdropKeys.length,
  })

  return (
    <Suspense fallback={<LoadingIndicator style={{ top: '200px' }} />}>
      <div className={`c-dashboard__body ${bodyClasses} ${extraBodyClasses}`}>
        {visibilityError && <GeneralErrorMessage {...{ hasMaxWidth, isHomePage: homePage }} />}
        {embedPreviewMode ? (
          <EmbedIframeComponent />
        ) : (
          <div className="u-grid u-full-height">
            <div className="u-row u-full-height">
              {homePage && <Home showFooter />}

              {isQuerySearchPage(currentPage) && <QuerySearchPage />}

              {/* Todo: DP-6391 */}
              {currentPage === PAGES.DATA_SEARCH_CATEGORY && (
                <div className="c-search-results u-grid">
                  <DataSearchQuery />
                </div>
              )}

              {currentPage === PAGES.ACTUALITY && <ActualityContainer />}

              {isMapSplitPage(currentPage) && <MapSplitPage />}

              {currentPage === PAGES.CONSTRUCTION_FILE && <ConstructionFilesContainer />}

              {currentPage === PAGES.DATASET_DETAIL && <DatasetDetailContainer />}
              {currentPage === PAGES.DATASETS && <DatasetPage />}

              {currentPage === PAGES.ARTICLE_DETAIL && <ArticleDetailPage />}
              {currentPage === PAGES.SPECIAL_DETAIL && <SpecialDetailPage />}
              {currentPage === PAGES.PUBLICATION_DETAIL && <PublicationDetailPage />}

              {isEditorialOverviewPage(currentPage) && <EditorialOverviewPage type={currentPage} />}

              {currentPage === PAGES.NOT_FOUND && <NotFound />}
              {isOldCmsPage(currentPage) && <ContentPage />}

              <FeedbackModal id="feedbackModal" />
              <InfoModal id="infoModal" open />
            </div>
          </div>
        )}
      </div>
    </Suspense>
  )
}

AppBody.propTypes = {
  visibilityError: PropTypes.bool.isRequired,
  bodyClasses: PropTypes.string.isRequired,
  hasMaxWidth: PropTypes.bool.isRequired,
  homePage: PropTypes.bool.isRequired,
  currentPage: PropTypes.string.isRequired,
  embedPreviewMode: PropTypes.bool.isRequired,
}

export default AppBody
