import { Alert, Link, Paragraph } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import PropTypes from 'prop-types'
import React, { Suspense } from 'react'
import { Helmet } from 'react-helmet'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import { IDS } from '../shared/config/config'
import { toArticleDetail } from '../store/redux-first-router/actions'
import EmbedIframeComponent from './components/EmbedIframe/EmbedIframe'
import ErrorAlert from './components/ErrorAlert/ErrorAlert'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import { FeedbackModal } from './components/Modal'
import NotificationAlert from './components/NotificationAlert/NotificationAlert'
import PAGES, { isMapSplitPage, isSearchPage } from './pages'
import isIE from './utils/isIE'

const HomePage = React.lazy(() => import(/* webpackChunkName: "HomePage" */ './pages/HomePage'))
const ActualityContainer = React.lazy(() =>
  import(/* webpackChunkName: "ActualityContainer" */ './containers/ActualityContainer'),
)
const DatasetDetailContainer = React.lazy(() =>
  import(
    /* webpackChunkName: "DatasetDetailContainer" */ './containers/DatasetDetailContainer/DatasetDetailContainer'
  ),
)
const ConstructionFilesContainer = React.lazy(() =>
  import(
    /* webpackChunkName: "ConstructionFilesContainer" */ './containers/ConstructionFilesContainer/ConstructionFilesContainer'
  ),
)
const ArticleDetailPage = React.lazy(() =>
  import(/* webpackChunkName: "ArticleDetailPage" */ './pages/ArticleDetailPage'),
)
const PublicationDetailPage = React.lazy(() =>
  import(/* webpackChunkName: "PublicationDetailPage" */ './pages/PublicationDetailPage'),
)
const SpecialDetailPage = React.lazy(() =>
  import(/* webpackChunkName: "SpecialDetailPage" */ './pages/SpecialDetailPage'),
)
const CollectionDetailPage = React.lazy(() =>
  import(/* webpackChunkName: "CollectionDetailPage" */ './pages/CollectionDetailPage'),
)
const MapSplitPage = React.lazy(() =>
  import(/* webpackChunkName: "MapSplitPage" */ './pages/MapSplitPage'),
)
const MapContainer = React.lazy(() =>
  import(/* webpackChunkName: "MapContainer" */ './pages/MapPage/MapContainer'),
)
const NotFoundPage = React.lazy(() =>
  import(/* webpackChunkName: "NotFoundPage" */ './pages/NotFoundPage'),
)
const SearchPage = React.lazy(() =>
  import(/* webpackChunkName: "SearchPage" */ './pages/SearchPage/index'),
)

// The Container from @datapunt/asc-ui isnt used here as the margins added do not match the ones in the design
// Tabindex is IE11 fix for skipnavigation focus
const AppContainer = styled.main.attrs({ tabIndex: -1 })`
  flex-grow: 1;
  min-height: 50vh; // IE11: Makes sure the loading indicator is displayed in the Container
`

const StyledAlert = styled(Alert)`
  /* Ensure outline is visible when element is in focus */
  &:focus {
    z-index: 999;
  }
`

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 200px;
`

const AppBody = ({
  visibilityError,
  bodyClasses,
  hasGrid,
  homePage,
  currentPage,
  embedPreviewMode,
}) => {
  const { enableLinkTracking } = useMatomo()
  enableLinkTracking()

  return (
    <>
      <Helmet>
        {/* In case html lang is set (for example EditorialPage),
        it will remove the lang-attribute when that component is unmounted,
        so we need to set the default language on a higher level */}
        <html lang="nl" />
      </Helmet>
      {hasGrid ? (
        <>
          <AppContainer id={IDS.main} className="main-container">
            <NotificationAlert />
            {isIE && (
              <StyledAlert level="attention">
                <Paragraph>
                  <strong>Let op: </strong>Let op: deze website ondersteunt Internet Explorer niet
                  langer. We raden je aan een andere browser te gebruiken.
                </Paragraph>{' '}
                <Link
                  as={RouterLink}
                  to={toArticleDetail(
                    '11206c96-91d6-4f6a-9666-68e577797865',
                    'internet-explorer-binnenkort-niet-meer-ondersteund',
                  )}
                  inList
                  darkBackground
                >
                  Klik voor meer uitleg.
                </Link>
              </StyledAlert>
            )}
            <Suspense fallback={<StyledLoadingSpinner />}>
              {homePage && <HomePage />}
              {currentPage === PAGES.ARTICLE_DETAIL && <ArticleDetailPage />}
              {currentPage === PAGES.SPECIAL_DETAIL && <SpecialDetailPage />}
              {currentPage === PAGES.PUBLICATION_DETAIL && <PublicationDetailPage />}
              {currentPage === PAGES.COLLECTION_DETAIL && <CollectionDetailPage />}
              {currentPage === PAGES.ACTUALITY && <ActualityContainer />}
              {currentPage === PAGES.NOT_FOUND && <NotFoundPage />}

              {isSearchPage(currentPage) && <SearchPage currentPage={currentPage} />}
            </Suspense>
          </AppContainer>
          <FeedbackModal id="feedbackModal" />
        </>
      ) : (
        <>
          <Suspense fallback={<StyledLoadingSpinner />}>
            {currentPage === PAGES.MAP ? (
              <MapContainer />
            ) : (
              <>
                <Helmet>
                  {/* The viewport must be reset for "old" pages that don't incorporate the grid.
        1024 is an arbirtrary number as the browser doesn't actually care about the exact number,
        but only needs to know it's significantly bigger than the actual viewport */}
                  <meta name="viewport" content="width=1024, user-scalable=yes" />
                </Helmet>
                <div className={`c-dashboard__body ${bodyClasses}`}>
                  <NotificationAlert />
                  {visibilityError && <ErrorAlert />}
                  {embedPreviewMode ? (
                    <EmbedIframeComponent />
                  ) : (
                    <div className="u-grid u-full-height u-overflow--y-auto">
                      <div className="u-row u-full-height">
                        {isMapSplitPage(currentPage) && <MapSplitPage />}

                        {currentPage === PAGES.CONSTRUCTION_FILE && <ConstructionFilesContainer />}

                        {currentPage === PAGES.DATASET_DETAIL && <DatasetDetailContainer />}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            <FeedbackModal id="feedbackModal" />
          </Suspense>
        </>
      )}
    </>
  )
}

AppBody.propTypes = {
  visibilityError: PropTypes.bool.isRequired,
  bodyClasses: PropTypes.string.isRequired,
  hasGrid: PropTypes.bool.isRequired,
  homePage: PropTypes.bool.isRequired,
  currentPage: PropTypes.string.isRequired,
  embedPreviewMode: PropTypes.bool.isRequired,
}

export default AppBody
