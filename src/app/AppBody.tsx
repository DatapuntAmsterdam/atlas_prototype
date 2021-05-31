import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { FunctionComponent } from 'react'
import { lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'
import NotificationAlert from './components/NotificationAlert/NotificationAlert'
import { mapSearchPagePaths, routing } from './routes'
import { DataSelectionProvider } from './components/DataSelection/DataSelectionContext'

const HomePage = lazy(() => import(/* webpackChunkName: "HomePage" */ './pages/HomePage'))
const ActualityPage = lazy(
  () => import(/* webpackChunkName: "ActualityPage" */ './pages/ActualityPage'),
)
const DatasetDetailPage = lazy(
  () => import(/* webpackChunkName: "DatasetDetailPage" */ './pages/DatasetDetailPage'),
)
const ConstructionDossierPage = lazy(
  () => import(/* webpackChunkName: "ConstructionDossierPage" */ './pages/ConstructionDossierPage'),
)
const ArticleDetailPage = lazy(
  () => import(/* webpackChunkName: "ArticleDetailPage" */ './pages/ArticleDetailPage'),
)
const PublicationDetailPage = lazy(
  () => import(/* webpackChunkName: "PublicationDetailPage" */ './pages/PublicationDetailPage'),
)
const SpecialDetailPage = lazy(
  () => import(/* webpackChunkName: "SpecialDetailPage" */ './pages/SpecialDetailPage'),
)
const CollectionDetailPage = lazy(
  () => import(/* webpackChunkName: "CollectionDetailPage" */ './pages/CollectionDetailPage'),
)
const MapContainer = lazy(
  () => import(/* webpackChunkName: "MapContainer" */ './pages/MapPage/MapContainer'),
)
const NotFoundPage = lazy(
  () => import(/* webpackChunkName: "NotFoundPage" */ './pages/NotFoundPage'),
)
const SearchPage = lazy(
  () => import(/* webpackChunkName: "SearchPage" */ './pages/SearchPage/index'),
)

// The Container from @amsterdam/asc-ui isnt used here as the margins added do not match the ones in the design
const AppContainer = styled.main`
  flex-grow: 1;
`

const StyledLoadingSpinner = styled(LoadingSpinner)`
  position: absolute;
  top: 200px;
`

export interface AppBodyProps {
  hasGrid: boolean
}

export const APP_CONTAINER_ID = 'main'

const AppBody: FunctionComponent<AppBodyProps> = ({ hasGrid }) => {
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
          <AppContainer id={APP_CONTAINER_ID} className="main-container">
            <NotificationAlert />
            <Suspense fallback={<StyledLoadingSpinner />}>
              <Switch>
                <Route exact path={routing.home.path} component={HomePage} />
                <Route path={routing.articleDetail.path} exact component={ArticleDetailPage} />
                <Route
                  path={routing.publicationDetail.path}
                  exact
                  component={PublicationDetailPage}
                />
                <Route path={routing.specialDetail.path} exact component={SpecialDetailPage} />
                <Route
                  path={routing.collectionDetail.path}
                  exact
                  component={CollectionDetailPage}
                />
                <Route path={routing.actuality.path} exact component={ActualityPage} />
                <Route path={routing.notFound.path} exact component={NotFoundPage} />
                <Route path={mapSearchPagePaths} component={SearchPage} />
              </Switch>
            </Suspense>
          </AppContainer>
        </>
      ) : (
        <>
          <Suspense fallback={<StyledLoadingSpinner />}>
            <DataSelectionProvider>
              <Helmet>
                {/* The viewport must be reset for "old" pages that don't incorporate the grid.
        1024 is an arbirtrary number as the browser doesn't actually care about the exact number,
        but only needs to know it's significantly bigger than the actual viewport */}
                <meta name="viewport" content="width=1024, user-scalable=yes" />
              </Helmet>
              <Switch>
                <Route path={[routing.constructionDossier.path, routing.datasetDetail.path]}>
                  <div className="c-dashboard__body">
                    <NotificationAlert />

                    <div className="u-full-height u-overflow--y-auto">
                      <div className="u-full-height">
                        <Switch>
                          <Route
                            path={routing.constructionDossier.path}
                            exact
                            component={ConstructionDossierPage}
                          />
                          <Route
                            path={routing.datasetDetail.path}
                            exact
                            component={DatasetDetailPage}
                          />
                        </Switch>
                      </div>
                    </div>
                  </div>
                </Route>
                <Route path={[routing.data.path]}>
                  {/* When the mobile map panel is working properly we can disable the meta rule up defined above */}
                  <MapContainer />
                </Route>
              </Switch>
            </DataSelectionProvider>
          </Suspense>
        </>
      )}
    </>
  )
}

export default AppBody
