import React from 'react'
import AutoSuggestCategory from './AutoSuggestCategory'
import { CmsType } from '../../../shared/config/cms.config'
import SearchType from '../../../app/pages/SearchPage/constants'

export type SearchCategory = CmsType | SearchType

export type Suggestion = {
  category: string
  index: number
  label: string
  uri: string
  type: SearchCategory
}

export type SuggestionList = Array<{
  label: string
  totalResults: number
  content: Array<Suggestion>
  type: string
}>

type AutoSuggestProps = {
  activeSuggestion: Suggestion
  suggestions: SuggestionList
  onSuggestionSelection: (suggestion: Suggestion, e: React.KeyboardEvent<HTMLInputElement>) => void
  query: string
}

const AutoSuggest: React.FC<AutoSuggestProps> = ({
  suggestions,
  activeSuggestion,
  onSuggestionSelection,
  query,
}) => (
  // TODO: get rid of SCSS here
  <div className="auto-suggest__dropdown">
    <h3 className="auto-suggest__tip">Enkele suggesties</h3>
    {suggestions.map((category) => (
      <AutoSuggestCategory
        activeSuggestion={activeSuggestion}
        category={category}
        key={category.label}
        onSuggestionSelection={onSuggestionSelection}
        query={query}
      />
    ))}
  </div>
)

export default AutoSuggest
