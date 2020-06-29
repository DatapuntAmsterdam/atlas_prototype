import React from 'react'
import PropTypes from 'prop-types'
import AutoSuggestItem from './AutoSuggestItem'
import { MORE_RESULTS_INDEX } from '../../services/auto-suggest/auto-suggest'

const AutoSuggestCategory = ({ category, activeSuggestion, query, onSuggestionSelection }) => {
  const { label, content, totalResults, type } = category

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
