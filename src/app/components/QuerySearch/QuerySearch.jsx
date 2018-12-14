import React from 'react';
import PropTypes from 'prop-types';
import PAGES from '../../pages';
import TabBar from '../TabBar';
import Tabs from '../Tabs/Tabs';
import Tab from '../Tab/Tab';
import Dataset from '../Dataset';
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator';
import { DataSearchQuery } from '../DataSearch';
import MoreResultsWhenLoggedIn from '../PanelMessages/MoreResultsWhenLoggedIn';

const QuerySearch = ({
  isLoading,
  query,
  numberOfDataResults,
  numberOfDatasetResults,
  currentPage,
  toDataPage,
  toDatasetPage,
  user
}) => (
  <div className="c-data-selection c-dashboard__content">
    {(isLoading) && <LoadingIndicator />}
    {!isLoading && (
      <div className="qa-data-selection-content">
        <TabBar
          totalNumberOfResults={numberOfDataResults + numberOfDatasetResults}
          showDatasetsButton={currentPage === PAGES.SEARCH_DATASETS}
        >
          <Tabs
            currentTab={(currentPage === PAGES.DATA_SEARCH) ? 'Data' : 'Datasets'}
          >
            <Tab
              label="Data"
              count={numberOfDataResults}
              onClick={() => toDataPage(query, true)}
            />
            <Tab
              label="Datasets"
              count={numberOfDatasetResults}
              onClick={() => toDatasetPage(query, true)}
            />
          </Tabs>
        </TabBar>
        <div className="qa-search-results">
          {(currentPage === PAGES.DATA_SEARCH &&
            <div>
              <DataSearchQuery />
              {(!!numberOfDataResults && (!user.scopes.includes('HR/R') || !user.scopes.includes('BRK/RS'))) &&
              <MoreResultsWhenLoggedIn />
              }
            </div>
          )}
          {(currentPage === PAGES.SEARCH_DATASETS &&
            <Dataset />
          )}
        </div>
      </div>
    )}
  </div>
);

QuerySearch.defaultProps = {
  isLoading: true,
  query: undefined
};

QuerySearch.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isLoading: PropTypes.bool,
  query: PropTypes.string,
  currentPage: PropTypes.string.isRequired,
  toDatasetPage: PropTypes.func.isRequired,
  toDataPage: PropTypes.func.isRequired,
  numberOfDataResults: PropTypes.number.isRequired,
  numberOfDatasetResults: PropTypes.number.isRequired
};

export default QuerySearch;
