import React from 'react'
import PropTypes from 'prop-types'
import { toDetailFromEndpoint } from '../../../store/redux-first-router/actions'
import SearchListItem from '../SearchListItem/SearchListItem'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'

const SearchList = ({ categoryResults, limit }) => {
  const results =
    categoryResults && categoryResults.results
      ? categoryResults.results.map((result) => ({
          ...result,
          linkTo: toDetailFromEndpoint(result.endpoint, VIEW_MODE.SPLIT),
        }))
      : []

  return (
    <div className="qa-search-results-list">
      <ul className="o-list">
        {results.slice(0, limit).map((result, i) => (
          <SearchListItem
            key={`${result.label}-${i}`} // eslint-disable-line react/no-array-index-key
            {...{
              category: categoryResults,
              result,
            }}
          />
        ))}
      </ul>
    </div>
  )
}

SearchList.propTypes = {
  categoryResults: PropTypes.shape({}).isRequired,
  userScopes: PropTypes.arrayOf(PropTypes.string).isRequired,
  limit: PropTypes.number.isRequired,
}

export default SearchList
