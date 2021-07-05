import { Button, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import { forwardRef, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner'
import { toSearch } from '../../../links'
import { SearchType } from '../../../pages/SearchPage/constants'
import { queryParam } from '../../../pages/SearchPage/query-params'
import toSearchParams from '../../../utils/toSearchParams'
import type { CmsType } from '../../../../shared/config/cms.config'
import type { AutoSuggestSearchResult } from '../services/auto-suggest/auto-suggest'
import { LABELS } from '../services/auto-suggest/auto-suggest'
import AutoSuggestCategory from './AutoSuggestCategory'

export type SearchCategory = CmsType | SearchType

const NoResults = styled(Paragraph)`
  padding: 0 ${themeSpacing(2)};
  margin: ${themeSpacing(1)} 0;
`

const ResetFilterButton = styled(Button)`
  margin: ${themeSpacing(2)};
`

export interface AutoSuggestProps {
  suggestions: AutoSuggestSearchResult[]
  loading: boolean
  highlightValue: string
  setSearchBarFilterValue: (value: string) => void
  searchBarFilterValue: string
  inputValue: string
}

const AutoSuggest = forwardRef<HTMLDivElement, AutoSuggestProps>(
  (
    {
      suggestions = [],
      loading,
      highlightValue,
      setSearchBarFilterValue,
      searchBarFilterValue,
      inputValue,
    },
    ref,
  ) => {
    const history = useHistory()
    const searchCategoryLabel = useMemo(() => {
      switch (searchBarFilterValue) {
        case 'data':
          return 'Data'

        case 'map':
          return 'Kaarten'

        default:
          return LABELS[searchBarFilterValue]
      }
    }, [searchBarFilterValue])

    return (
      <div className="auto-suggest__dropdown" ref={ref}>
        {loading && <LoadingSpinner />}
        {!!suggestions?.length && <h3 className="auto-suggest__tip">Enkele suggesties</h3>}
        {!loading &&
          suggestions.map((category) => (
            <AutoSuggestCategory
              key={category.label}
              highlightValue={highlightValue}
              category={category}
              inputValue={inputValue}
            />
          ))}
        {!loading && !suggestions.length && (
          <NoResults>
            Er zijn geen resultaten gevonden{' '}
            {searchCategoryLabel && `in categorie "${searchCategoryLabel as string}"`}
          </NoResults>
        )}
        {!loading && searchBarFilterValue !== SearchType.Search && (
          <ResetFilterButton
            variant="textButton"
            onClick={() => {
              // Side effect: clear the searchbar filter and navigate to main search page
              setSearchBarFilterValue(SearchType.Search)
              history.push({
                ...toSearch(),
                search: toSearchParams([[queryParam, inputValue]]).toString(),
              })
            }}
          >
            Alle zoekresultaten weergeven
          </ResetFilterButton>
        )}
      </div>
    )
  },
)

export default AutoSuggest
