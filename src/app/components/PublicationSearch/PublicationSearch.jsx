/* eslint-disable react/no-array-index-key */
import React from 'react'
import PropTypes from 'prop-types'
import { Heading } from '@datapunt/asc-ui'
import NoResultsForSearchType from '../Messages/NoResultsForSearchType'

const PublicationSearch = ({ numberOfResults }) => {
  if (numberOfResults === 0) {
    return <NoResultsForSearchType message="Tip: maak de zoekcriteria minder specifiek." />
  }
  return (
    <div className="qa-search-results-content">
      <div className="qa-search-result">
        <div>
          <Heading>Search results for publications</Heading>
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
