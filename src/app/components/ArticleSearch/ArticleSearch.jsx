/* eslint-disable react/no-array-index-key */
import React from 'react'
import PropTypes from 'prop-types'
import { Heading } from '@datapunt/asc-ui'
import NoResultsForSearchType from '../Messages/NoResultsForSearchType'

const ArticleSearch = ({ numberOfResults }) => {
  if (numberOfResults === 0) {
    return <NoResultsForSearchType message="Tip: maak de zoekcriteria minder specifiek." />
  }
  return (
    <div className="qa-search-results-content">
      <div className="qa-search-result">
        <div>
          <Heading>Search results for articles</Heading>
        </div>
      </div>
    </div>
  )
}

ArticleSearch.defaultProps = {
  numberOfResults: 0,
}

ArticleSearch.propTypes = {
  numberOfResults: PropTypes.number,
}

export default ArticleSearch
