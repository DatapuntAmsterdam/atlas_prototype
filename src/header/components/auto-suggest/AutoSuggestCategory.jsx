import React from 'react';
import PropTypes from 'prop-types';
import AutoSuggestItem from './AutoSuggestItem';

const MAX_NUMBER_RESULTS = 3;

// Todo: Please consider rewriting the way we keep track on the active (selected) item in the
// autosuggest result list. Now we use an (arbitrary) high number for more results button ("..."),
// so this wont conflict with the activeSuggestion indexes.
export const MORE_RESULTS_INDEX = 999;

const AutoSuggestCategory = (props) => {
  const { category, activeSuggestion, query, onSuggestionSelection } = props;

  let suggestions = category.content;
  if (category.total_results > MAX_NUMBER_RESULTS) {
    suggestions = [...category.content, { label: '...', index: MORE_RESULTS_INDEX }];
  }

  return (
    <div className="auto-suggest__dropdown-category">
      <h4 className="auto-suggest__dropdown-category__heading qa-auto-suggest-header">
        {category.label}
      </h4>
      <ul>
        {suggestions.map((suggestion) => (
          <AutoSuggestItem
            key={suggestion.label + suggestion.index}
            isActive={activeSuggestion && activeSuggestion.index === suggestion.index}
            onSuggestionSelection={(e) => {
              onSuggestionSelection(suggestion, e);
            }}
            content={suggestion.label}
            query={query}
          />
        ))}
      </ul>
    </div>
  );
};

AutoSuggestCategory.defaultProps = {};

AutoSuggestCategory.propTypes = {
  activeSuggestion: PropTypes.shape({}).isRequired,
  category: PropTypes.shape({}).isRequired,
  onSuggestionSelection: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired
};

export default AutoSuggestCategory;
