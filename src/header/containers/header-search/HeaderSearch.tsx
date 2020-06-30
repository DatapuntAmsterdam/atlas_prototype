import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import useSlug from '../../../app/utils/useSlug'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import PARAMETERS from '../../../store/parameters'
import { decodeLayers } from '../../../store/queryParameters'
import { extractIdEndpoint } from '../../../store/redux-first-router/actions'
import { CmsType } from '../../../shared/config/cms.config'
import SearchType from '../../../app/pages/SearchPage/constants'
import SEARCH_PAGE_CONFIG from '../../../app/pages/SearchPage/config'
import SearchBar from '../../../app/components/SearchBar'
import AutoSuggest, {
  SearchCategory,
  Suggestion,
  SuggestionList,
} from '../../components/auto-suggest/AutoSuggest'
import { MORE_RESULTS_INDEX } from '../../services/auto-suggest/auto-suggest'

// TODO: Add the screen reader only "styling" to asc-ui
const StyledLegend = styled.legend`
  border-width: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`

const getSuggestionByIndex = (searchResults: SuggestionList, suggestionIndex: number) =>
  searchResults
    .reduce<Array<Suggestion>>((flatResults, category) => [...flatResults, ...category.content], [])
    .find((flatSuggestion) => flatSuggestion.index === suggestionIndex)

type HeaderSearchProps = {
  activeSuggestion: Suggestion
  displayQuery?: string
  view: string
  isMapActive: boolean
  numberOfSuggestions?: number
  onCleanDatasetOverview: Function
  openDataSuggestion: Function
  openDatasetSuggestion: Function
  openEditorialSuggestion: Function
  openMapSuggestion: Function
  onGetSuggestions: Function
  onSuggestionActivate: Function
  prefillQuery?: string
  suggestions?: SuggestionList
  typedQuery: string
  pageType: SearchCategory
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({
  activeSuggestion,
  numberOfSuggestions = 0,
  onGetSuggestions,
  onSuggestionActivate,
  suggestions = [],
  typedQuery,
  openDataSuggestion,
  openDatasetSuggestion,
  openEditorialSuggestion,
  openMapSuggestion,
  view,
  pageType,
  onCleanDatasetOverview,
  prefillQuery = '',
  displayQuery = '',
}) => {
  const dispatch = useDispatch()
  const [openSearchBarToggle, setOpenSearchBarToggle] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchCategory, setSearchCategory] = useState<SearchCategory>(pageType)

  const query = displayQuery || typedQuery

  // Opens suggestion on mouseclick or enter
  function onSuggestionSelection(suggestion: Suggestion) {
    // Suggestion of type dataset, formerly known as "catalog"
    if (suggestion.type === SearchType.Dataset) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = useSlug(suggestion.label)

      openDatasetSuggestion({ id, slug, typedQuery })
    } else if (
      // Suggestion coming from the cms
      suggestion.type === CmsType.Article ||
      suggestion.type === CmsType.Publication ||
      suggestion.type === CmsType.Collection ||
      suggestion.type === CmsType.Special
    ) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = useSlug(suggestion.label)

      let subType = ''
      if (suggestion.type === CmsType.Special) {
        ;[, subType] = suggestion.label.match(/\(([^()]*)\)$/)
      }

      openEditorialSuggestion({ id, slug }, suggestion.type, subType)
    } else if (suggestion.type === SearchType.Map) {
      const { searchParams } = new URL(suggestion.uri, window.location.origin)

      openMapSuggestion({
        view: searchParams.get(PARAMETERS.VIEW),
        legend: searchParams.get(PARAMETERS.LEGEND) === 'true',
        layers: decodeLayers(searchParams.get(PARAMETERS.LAYERS)),
      })
    } else {
      openDataSuggestion(
        {
          endpoint: suggestion.uri,
          category: suggestion.category,
          typedQuery,
        },
        view === VIEW_MODE.FULL ? VIEW_MODE.SPLIT : view,
      )
    }
  }

  function onInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (activeSuggestion?.index > -1) {
      onSuggestionActivate()
    }
    onGetSuggestions(
      e.currentTarget.value,
      searchCategory === SearchType.Search ? null : searchCategory,
    )

    setShowSuggestions(true)
  }

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    handleSubmit()
  }

  function handleSubmit(type: SearchCategory | null = null) {
    if (!activeSuggestion || activeSuggestion?.index === -1) {
      // Load the search results
      onCleanDatasetOverview() // TODO, refactor: don't clean dataset on search

      const searchType = type || searchCategory

      const actionType = Object.values(SEARCH_PAGE_CONFIG).find(
        ({ type: configType }) => searchType === configType,
      )

      if (actionType) {
        const { to } = actionType
        dispatch(
          to(
            {
              [PARAMETERS.QUERY]: typedQuery,
              [PARAMETERS.PAGE]: 1, // reset the page number on search
            },
            false,
            true,
          ),
        )
      }
    }
  }

  function onBlur() {
    setTimeout(() => {
      setShowSuggestions(false)
      setOpenSearchBarToggle(false)
    }, 200)
  }

  function onFocus() {
    if (query.length && !suggestions.length) {
      onGetSuggestions(query, searchCategory === SearchType.Search ? null : searchCategory)
    }
  }

  function onClear() {
    onSuggestionActivate()
    setShowSuggestions(false)
    onGetSuggestions('', null)
  }

  function navigateSuggestions(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.keyCode) {
      // Arrow up
      case 38:
        // By default the up arrow puts the cursor at the
        // beginning of the input, we don't want that!
        e.preventDefault()

        if (!showSuggestions || !numberOfSuggestions) {
          return
        }

        onSuggestionActivate(
          getSuggestionByIndex(suggestions, Math.max(activeSuggestion?.index - 1, -1)),
        )
        break
      // Arrow down
      case 40:
        if (!numberOfSuggestions) {
          return
        }

        onSuggestionActivate(
          getSuggestionByIndex(
            suggestions,
            Math.min(activeSuggestion?.index + 1, numberOfSuggestions - 1),
          ),
        )
        break
      // Escape
      case 27:
        onClear()
        break
      // Enter
      case 13:
        if (activeSuggestion?.index > -1) {
          onSuggestionSelection(activeSuggestion)
        }
        break
      default:
        break
    }
  }

  function handleOnSuggestionSelection(
    suggestion: Suggestion,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    e.preventDefault()
    e.stopPropagation()

    if (suggestion.index === MORE_RESULTS_INDEX) {
      onSuggestionActivate()
      handleSubmit(suggestion.type)
    } else {
      onSuggestionSelection(suggestion)
      clearQuery()
    }

    setOpenSearchBarToggle(false)
  }

  React.useEffect(() => {
    if (prefillQuery) {
      onGetSuggestions(prefillQuery, searchCategory === SearchType.Search ? null : searchCategory)
    }
  }, [onGetSuggestions, prefillQuery, searchCategory])

  const showAutoSuggest = useMemo(() => suggestions.length > 0 && showSuggestions, [
    suggestions,
    showSuggestions,
  ])

  function clearQuery() {
    onSuggestionActivate()
    setShowSuggestions(false)
    onGetSuggestions('', null)
  }

  return (
    <form onSubmit={onFormSubmit} className="auto-suggest" data-test="search-form">
      <StyledLegend className="u-sr-only">Data zoeken</StyledLegend>
      <SearchBar
        {...{
          expanded: showAutoSuggest,
          suggestions,
          onBlur,
          onFocus,
          onChange: onInput,
          onClear,
          onKeyDown: navigateSuggestions,
          value: query || '',
          openSearchBarToggle,
          searchCategory,
          setSearchCategory,
        }}
        onOpenSearchBarToggle={setOpenSearchBarToggle}
      >
        {showAutoSuggest && (
          <AutoSuggest
            suggestions={suggestions}
            activeSuggestion={activeSuggestion}
            onSuggestionSelection={handleOnSuggestionSelection}
            query={typedQuery}
          />
        )}
      </SearchBar>
    </form>
  )
}

export default HeaderSearch
