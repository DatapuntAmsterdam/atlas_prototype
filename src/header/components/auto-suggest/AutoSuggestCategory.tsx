import { LocationDescriptorObject } from 'history'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import SEARCH_PAGE_CONFIG from '../../../app/pages/SearchPage/config'
import PARAMETERS from '../../../store/parameters'
import { AutoSuggestSearchResult } from '../../services/auto-suggest/auto-suggest'
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
            key={suggestion.label + suggestion.index}
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
  const actionType = Object.values(SEARCH_PAGE_CONFIG).find(
    ({ type: configType }) => type === configType,
  )

  if (!actionType) {
    return null
  }

  const { path } = actionType

  return {
    pathname: path,
    search: new URLSearchParams({
      [PARAMETERS.QUERY]: `${inputValue}`,
      [PARAMETERS.PAGE]: '1',
      ...(subType
        ? {
            [PARAMETERS.FILTERS]: `dataTypes;${subType}`,
          }
        : {}),
    }).toString(),
  }
}

export default AutoSuggestCategory
