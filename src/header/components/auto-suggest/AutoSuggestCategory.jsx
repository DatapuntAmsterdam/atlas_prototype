import React from 'react'
import PropTypes from 'prop-types'
import AutoSuggestItem from './AutoSuggestItem'

// Todo: Please consider rewriting the way we keep track on the active (selected) item in the
// autosuggest result list. Now we use an (arbitrary) high number for more results button ("..."),
// so this wont conflict with the activeSuggestion indexes.
export const MORE_RESULTS_INDEX = 999

const AutoSuggestCategory = ({ category, activeSuggestion, query, onSuggestionSelection }) => {
  const { label, content, total_results: totalResults, type } = category

  let suggestions = content

  if (totalResults > content.length) {
    suggestions = [...content, { label: '...', index: MORE_RESULTS_INDEX, type }]
  }

  return (
    <div className="auto-suggest__dropdown-category">
      <h4 className="auto-suggest__dropdown-category__heading qa-auto-suggest-header">{label}</h4>
      <ul>
        {suggestions.map((suggestion) => (
          <AutoSuggestItem
            key={suggestion.label + suggestion.index}
            isActive={activeSuggestion && activeSuggestion.index === suggestion.index}
            onSuggestionSelection={(e) => {
              onSuggestionSelection(suggestion, e)
            }}
            content={suggestion.label}
            query={query}
          />
        ))}
      </ul>
    </div>
  )
}

AutoSuggestCategory.defaultProps = {}

AutoSuggestCategory.propTypes = {
  activeSuggestion: PropTypes.shape({}).isRequired,
  category: PropTypes.shape({}).isRequired,
  onSuggestionSelection: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
}

export default AutoSuggestCategory
