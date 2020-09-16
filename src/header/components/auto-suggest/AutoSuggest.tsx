import React, { forwardRef, useMemo } from 'react'
import { Button, Paragraph, themeSpacing } from '@datapunt/asc-ui'
import styled from 'styled-components'
import AutoSuggestCategory from './AutoSuggestCategory'
import { CmsType } from '../../../shared/config/cms.config'
import SearchType from '../../../app/pages/SearchPage/constants'
import { LABELS } from '../../services/auto-suggest/auto-suggest'
import useParam from '../../../app/utils/useParam'
import { searchFilterParam } from '../../../app/pages/SearchPage/searchBarFilterParam'
import LoadingSpinner from '../../../app/components/LoadingSpinner/LoadingSpinner'
import { SuggestionList } from '../../containers/header-search/HeaderSearch'

export type SearchCategory = CmsType | SearchType

type AutoSuggestProps = {
  suggestions: SuggestionList
  loading: boolean
  highlightValue: string
}

const NoResults = styled(Paragraph)`
  padding: 0 ${themeSpacing(2)};
  margin: ${themeSpacing(1)} 0;
`

const ResetFilterButton = styled(Button)`
  margin: ${themeSpacing(1)};
`

const AutoSuggest = forwardRef<HTMLDivElement, AutoSuggestProps>(
  ({ suggestions = [], loading, highlightValue }, ref) => {
    const [searchCategory, setSearchFilter] = useParam(searchFilterParam)
    const searchCategoryLabel = useMemo(() => {
      switch (searchCategory) {
        case 'data':
          return 'Data'

        case 'map':
          return 'Kaarten'

        default:
          return LABELS[searchCategory]
      }
    }, [searchCategory])

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
              searchCategory={searchCategory}
            />
          ))}
        {!loading && !suggestions.length && (
          <NoResults>
            Er zijn geen resultaten gevonden{' '}
            {searchCategoryLabel && `in categorie "${searchCategoryLabel}"`}
          </NoResults>
        )}
        {!loading && searchCategory !== SearchType.Search && (
          <ResetFilterButton
            variant="textButton"
            onClick={() => setSearchFilter(SearchType.Search, 'replace')}
          >
            Verwijder filter &quot;{searchCategoryLabel}&quot;
          </ResetFilterButton>
        )}
      </div>
    )
  },
)

export default AutoSuggest
