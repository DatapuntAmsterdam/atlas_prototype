import { Link } from 'react-router-dom'
import type { LocationDescriptorObject } from 'history'
import type { FunctionComponent } from 'react'
import SEARCH_PAGE_CONFIG from '../../../pages/SearchPage/config'
import { activeFiltersParam, pageParam, queryParam } from '../../../pages/SearchPage/query-params'
import toSearchParams from '../../../utils/toSearchParams'
import type { AutoSuggestSearchResult } from '../services/auto-suggest/auto-suggest'
import AutoSuggestItem from './AutoSuggestItem'

export interface AutoSuggestCategoryProps {
  category: AutoSuggestSearchResult
  highlightValue: string
  inputValue: string
}

const AutoSuggestCategory: FunctionComponent<AutoSuggestCategoryProps> = ({
  category,
  highlightValue,
  inputValue,
}) => {
  const { type, label, content, totalResults } = category
  // Todo: Make sure we get a type back from typeahead instead of transforming the label
  // These types should also match the types in cms_search
  const subType = (type === 'data' && label.replace(' ', '_').toLowerCase()) || undefined
  const moreResultsLink =
    totalResults > content.length ? getMoreResultsLink(type, inputValue, subType) : null

  return (
    <div className="auto-suggest__dropdown-category">
      <h4 className="auto-suggest__dropdown-category__heading qa-auto-suggest-header">{label}</h4>
      <ul>
        {content.map((suggestion) => (
          <AutoSuggestItem
            key={`${suggestion.label}${suggestion.index}`}
            suggestion={suggestion}
            content={suggestion.label}
            highlightValue={highlightValue}
            inputValue={inputValue}
            label={label}
          />
        ))}
        {moreResultsLink && (
          <li>
            <Link
              className="auto-suggest__dropdown-item auto-suggest__dropdown-item--more-results"
              to={moreResultsLink}
            >
              Meer resultaten in &apos;{label}&apos;
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

function getMoreResultsLink(
  type: string,
  inputValue: string,
  subType?: string,
): LocationDescriptorObject | null {
  const config = Object.values(SEARCH_PAGE_CONFIG).find(
    ({ type: configType }) => type === configType,
  )

  if (!config) {
    return null
  }

  return {
    ...config.to,
    search: toSearchParams([
      [queryParam, inputValue],
      [pageParam, pageParam.defaultValue],
      [activeFiltersParam, subType ? [{ type: 'dataTypes', values: [subType] }] : []],
    ]).toString(),
  }
}

export default AutoSuggestCategory
