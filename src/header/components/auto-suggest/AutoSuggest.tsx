import { Button, Paragraph, themeSpacing } from '@datapunt/asc-ui'
import React, { forwardRef, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpinner from '../../../app/components/LoadingSpinner/LoadingSpinner'
import SearchType from '../../../app/pages/SearchPage/constants'
import { CmsType } from '../../../shared/config/cms.config'
import { LABELS } from '../../services/auto-suggest/auto-suggest'
import { SuggestionList } from '../HeaderSearch'
import AutoSuggestCategory from './AutoSuggestCategory'
import { routing } from '../../../app/routes'
import { searchQueryParam } from '../../../app/pages/SearchPage/query-params'

export type SearchCategory = CmsType | SearchType

type AutoSuggestProps = {
  suggestions: SuggestionList
  loading: boolean
  highlightValue: string
  setSearchBarFilterValue: (value: string) => void
  searchBarFilterValue: string
  inputValue?: string
}

const NoResults = styled(Paragraph)`
  padding: 0 ${themeSpacing(2)};
  margin: ${themeSpacing(1)} 0;
`

const ResetFilterButton = styled(Button)`
  margin: ${themeSpacing(1)};
`

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
              searchCategory={searchBarFilterValue}
            />
          ))}
        {!loading && !suggestions.length && (
          <NoResults>
            Er zijn geen resultaten gevonden{' '}
            {searchCategoryLabel && `in categorie "${searchCategoryLabel}"`}
          </NoResults>
        )}
        {!loading && searchBarFilterValue !== SearchType.Search && (
          <ResetFilterButton
            variant="textButton"
            onClick={() => {
              // Side effect: clear the searchbar filter and navigate to main search page
              setSearchBarFilterValue(SearchType.Search)
              history.push({
                pathname: routing.search.path,
                search: `${searchQueryParam.name}=${inputValue}`,
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
