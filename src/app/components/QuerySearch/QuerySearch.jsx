import React from 'react'
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
  toArticlesSearch,
  toPublicationsSearch,
} from '../../../store/redux-first-router/actions'
import { ArticleSearchContainer } from '../ArticleSearch'
import { PublicationSearchContainer } from '../PublicationSearch'

const QuerySearch = ({
  isLoading,
  query,
  numberOfResults,
  currentPage,
  filters,
  user,
  toSearchPage,
}) => {
  return (
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
                count={numberOfResults}
                onClick={() => toSearchPage(toPublicationsSearch, query, filters)}
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
                count={numberOfResults}
                onClick={() => toSearchPage(toArticlesSearch, query, filters)}
                page={PAGES.ARTICLE_SEARCH}
              />
            </Tabs>
          </TabBar>
          <div className="qa-search-results">
            {currentPage === PAGES.DATA_SEARCH_QUERY && (
              <DataSearchQuery numberOfResults={numberOfResults} user={user} />
            )}
            {currentPage === PAGES.DATASET_SEARCH && <Dataset />}
            {currentPage === PAGES.ARTICLE_SEARCH && <ArticleSearchContainer />}
            {currentPage === PAGES.PUBLICATION_SEARCH && <PublicationSearchContainer />}
          </div>
        </div>
      )}
    </div>
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
