/* eslint-disable react/no-array-index-key */
import React from 'react'
import PropTypes from 'prop-types'
import NoResultsForSearchType from '../Messages/NoResultsForSearchType'

const PublicationSearch = ({ numberOfResults }) => {
  if (numberOfResults === 0) {
    return <NoResultsForSearchType message="Tip: maak de zoekcriteria minder specifiek." />
  }
  return (
    <div className="qa-search-results-content">
      <div className="qa-search-result">
        <div>
          <h1>Search results for publications</h1>
        </div>
      </div>
    </div>
  )
}

PublicationSearch.defaultProps = {
  numberOfResults: 0,
}

PublicationSearch.propTypes = {
  numberOfResults: PropTypes.number,
}

export default PublicationSearch
