import React from 'react'
import { connect } from 'react-redux'
import { getSearchQueryResults } from '../../../shared/ducks/data-search/selectors'
import DataSearchContainer from './DataSearchContainer'
import MoreResultsWhenLoggedIn from '../PanelMessages/MoreResultsWhenLoggedIn'
import ShareBar from '../ShareBar/ShareBar'

const EXCLUDED_RESULTS = 'kadastrale subjecten, maatschappelijke activiteiten en vestigingen'

const DataSearchQuery = ({ user, numberOfResults, searchResults }) => (
  <div>
    <DataSearchContainer user={user} searchResults={searchResults} />
    {!!numberOfResults && (!user.scopes.includes('HR/R') || !user.scopes.includes('BRK/RS')) && (
      <MoreResultsWhenLoggedIn excludedResults={EXCLUDED_RESULTS} />
    )}
    <div className="u-row">
      <div className="u-col-sm--12">
        <div className="u-margin__top--4">
          <ShareBar />
        </div>
      </div>
    </div>
  </div>
)

const mapStateToProps = state => ({
  searchResults: getSearchQueryResults(state),
})

export default connect(
  mapStateToProps,
  null,
)(DataSearchQuery)
