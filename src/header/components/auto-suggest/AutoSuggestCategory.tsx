import React from 'react'
import AutoSuggestItem from './AutoSuggestItem'
import { MORE_RESULTS_INDEX } from '../../services/auto-suggest/auto-suggest'
import { Suggestion } from '../../containers/header-search/HeaderSearch'

type Props = {
  category: {
    label: string
    content: Suggestion[]
    totalResults: number
    type: string
  }
  searchCategory: string
  highlightValue: string
}

const AutoSuggestCategory: React.FC<Props> = ({ category, searchCategory, highlightValue }) => {
  const { label, content, totalResults, type } = category

  let suggestions = content

  if (totalResults > content.length) {
    suggestions = [
      ...content,
      {
        label: `Meer resultaten in '${label}'`,
        index: MORE_RESULTS_INDEX,
        type,
        subType: type === 'data' && label.toLowerCase(),
      } as Suggestion,
    ]
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
          />
        ))}
      </ul>
    </div>
  )
}

export default AutoSuggestCategory
