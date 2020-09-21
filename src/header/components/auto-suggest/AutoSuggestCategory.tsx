import React from 'react'
import {
  AutoSuggestSearchContent,
  AutoSuggestSearchResult,
  MORE_RESULTS_INDEX,
} from '../../services/auto-suggest/auto-suggest'
import AutoSuggestItem from './AutoSuggestItem'

type Props = {
  category: AutoSuggestSearchResult
  searchCategory: string
  highlightValue: string
  inputValue?: string
}

const AutoSuggestCategory: React.FC<Props> = ({
  category,
  searchCategory,
  highlightValue,
  inputValue,
}) => {
  const { label, content, totalResults, type } = category

  let suggestions = content

  if (totalResults > content.length) {
    // TODO: This should not be an actual suggestion, rather just an extra element on the list.
    const moreResultsSuggestion: AutoSuggestSearchContent = {
      category: '',
      uri: '',
      label: `Meer resultaten in '${label}'`,
      index: MORE_RESULTS_INDEX,
      type,
      subType: (type === 'data' && label.toLowerCase()) || undefined,
    }

    suggestions = [...content, moreResultsSuggestion]
  }
  return (
    <div className="auto-suggest__dropdown-category">
      <h4 className="auto-suggest__dropdown-category__heading qa-auto-suggest-header">{label}</h4>
      <ul>
        {suggestions.map((suggestion) => (
          <AutoSuggestItem
            key={suggestion.label + suggestion.index}
            suggestion={suggestion}
            content={suggestion.label}
            searchCategory={searchCategory}
            highlightValue={highlightValue}
            inputValue={inputValue}
            label={label}
          />
        ))}
      </ul>
    </div>
  )
}

export default AutoSuggestCategory
