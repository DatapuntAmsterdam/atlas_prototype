import React, { useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'
import PAGES from '../../pages'
import TabBar from '../TabBar'
import Tabs from '../Tabs/Tabs'
import Tab from '../Tab/Tab'
import Dataset from '../Dataset'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'
import DataSearchQuery from '../DataSearch/DataSearchQuery'
import {
  toDataSearchQuery,
  toDatasetSearch,
  toArticleSearch,
  toPublicationSearch,
} from '../../../store/redux-first-router/actions'
import EditorialSearch from '../EditorialSearch'
import {
  ArticleSearchContext,
  PublicationSearchContext,
} from '../EditorialSearch/editorialSearchContexts'
import { getByUrl } from '../../../shared/services/api/api'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'
import {
  useArticleSearchDuck,
  usePublicationSearchDuck,
} from '../EditorialSearch/editorialSearchHooks'

const fetchSearchData = async (actions, dispatch, endpoint) => {
  dispatch(actions.request())
  try {
    const payload = await getByUrl(`${SHARED_CONFIG.API_ROOT}cms_search/search/${endpoint}`)
    dispatch(actions.success(payload))
  } catch (e) {
    dispatch(actions.failure())
  }
}

const QuerySearch = ({
  isLoading,
  query,
  numberOfResults,
  currentPage,
  filters,
  user,
  toSearchPage,
}) => {
  // Article
  const {
    reducer: articleReducer,
    initState: articleInitState,
    actions: articleActions,
    selectors: articleSelectors,
  } = useArticleSearchDuck()
  const [articleState, articleDispatch] = useReducer(articleReducer, articleInitState)
  const articleContextValue = useMemo(() => [articleState, articleDispatch], [
    articleState,
    articleDispatch,
  ])

  // Publication
  const {
    reducer: publicationReducer,
    initState: publicationInitState,
    actions: publicationActions,
    selectors: publicationSelectors,
  } = usePublicationSearchDuck()
  const [publicationState, publicationDispatch] = useReducer(
    publicationReducer,
    publicationInitState,
  )
  const publicationContextValue = useMemo(() => [publicationState, publicationDispatch], [
    publicationState,
    publicationDispatch,
  ])

  React.useEffect(() => {
    ;(async () => {
      await Promise.all([
        fetchSearchData(articleActions, articleDispatch, `article?q=${query}`),
        fetchSearchData(publicationActions, publicationDispatch, `publication?q=${query}`),
      ])
    })()
  }, [query])

  return (
    <ArticleSearchContext.Provider value={articleContextValue}>
      <PublicationSearchContext.Provider value={publicationContextValue}>
        <div className="c-data-selection c-dashboard__content">
          {isLoading && <LoadingIndicator />}
          {!isLoading && (
            <div className="qa-data-selection-content">
              <TabBar numberOfResults={numberOfResults}>
                <Tabs currentPage={currentPage}>
                  <Tab
                    label="Data"
                    count={numberOfResults}
                    onClick={() => toSearchPage(toDataSearchQuery, query, filters)}
                    page={PAGES.DATA_SEARCH_QUERY}
                  />
                  <Tab
                    label="Publicaties"
                    count={publicationSelectors.count(publicationState)}
                    onClick={() => toSearchPage(toPublicationSearch, query, filters)}
                    page={PAGES.PUBLICATION_SEARCH}
                  />
                  <Tab
                    label="Datasets"
                    count={numberOfResults}
                    onClick={() => toSearchPage(toDatasetSearch, query, filters)}
                    page={PAGES.DATASET_SEARCH}
                  />
                  <Tab
                    label="Artikelen"
                    count={articleSelectors.count(articleState)}
                    onClick={() => toSearchPage(toArticleSearch, query, filters)}
                    page={PAGES.ARTICLE_SEARCH}
                  />
                </Tabs>
              </TabBar>

              <div className="qa-search-results">
                {currentPage === PAGES.DATA_SEARCH_QUERY && (
                  <DataSearchQuery numberOfResults={numberOfResults} user={user} />
                )}
                {currentPage === PAGES.DATASET_SEARCH && <Dataset />}
                {currentPage === PAGES.ARTICLE_SEARCH && <EditorialSearch type={PAGES.ARTICLES} />}
                {currentPage === PAGES.PUBLICATION_SEARCH && (
                  <EditorialSearch type={PAGES.PUBLICATIONS} />
                )}
              </div>
            </div>
          )}
        </div>
      </PublicationSearchContext.Provider>
    </ArticleSearchContext.Provider>
  )
}
QuerySearch.defaultProps = {
  isLoading: true,
  query: undefined,
}

QuerySearch.propTypes = {
  user: PropTypes.shape({}).isRequired,
  filters: PropTypes.shape({}).isRequired,
  isLoading: PropTypes.bool,
  query: PropTypes.string,
  currentPage: PropTypes.string.isRequired,
  numberOfResults: PropTypes.number.isRequired,
  toSearchPage: PropTypes.func.isRequired,
}

export default QuerySearch
