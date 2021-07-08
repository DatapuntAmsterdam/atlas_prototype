import { srOnlyStyle } from '@amsterdam/asc-ui'
import type { FormEvent, FunctionComponent } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import SearchBar from '../SearchBar'
import { LOCAL_STORAGE_KEY } from '../SearchBarFilter/SearchBarFilter'
import SEARCH_PAGE_CONFIG from '../../pages/SearchPage/config'
import { SearchType } from '../../pages/SearchPage/constants'
import { queryParam } from '../../pages/SearchPage/query-params'
import toSearchParams from '../../utils/toSearchParams'
import { useHeaderSearch } from './HeaderSearchContext'
import useTraverseList from '../../utils/useTraverseList'
import type { AutoSuggestSearchResult } from './services/auto-suggest/auto-suggest'
import autoSuggestSearch, { MIN_QUERY_LENGTH } from './services/auto-suggest/auto-suggest'
import AutoSuggest from './auto-suggest/AutoSuggest'

const StyledLegend = styled.legend`
  ${srOnlyStyle}
`

const ACTIVE_ITEM_CLASS = 'auto-suggest__dropdown-item--active'

const HeaderSearch: FunctionComponent = () => {
  const history = useHistory()

  const { searchInputValue, setSearchInputValue } = useHeaderSearch()

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AutoSuggestSearchResult[]>([])
  const [highlightValue, setHighlightValue] = useState(searchInputValue)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)
  const [searchBarFilterValue, setSearchBarFilterValue] = useState(
    window.localStorage.getItem(LOCAL_STORAGE_KEY) || SearchType.Search,
  )

  const ref = useRef<HTMLDivElement>(null)
  const { keyDown } = useTraverseList(
    ref,
    (activeElement, list) => {
      list.forEach((el) => {
        el.classList.remove(ACTIVE_ITEM_CLASS)
      })
      activeElement.classList.add(ACTIVE_ITEM_CLASS)
      setSearchInputValue(activeElement.innerText)
      setSelectedElement(activeElement)
    },
    {
      rotating: false,
      directChildrenOnly: false,
      horizontally: false,
      skipElementWithClass: 'auto-suggest__dropdown-item--more-results',
    },
  )

  const fetchResults = useCallback(
    (val: string) => {
      setLoading(true)
      setHighlightValue(val)
      autoSuggestSearch({
        query: val,
        type: searchBarFilterValue === SearchType.Search ? undefined : searchBarFilterValue,
      })
        .then((res) => {
          setResults(res)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [searchInputValue, setLoading, setResults, searchBarFilterValue],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value)
    setSelectedElement(null)

    if (e.target.value?.length >= MIN_QUERY_LENGTH) {
      setShowSuggestions(true)
      fetchResults(e.target.value)
    } else {
      setShowSuggestions(false)
    }
  }

  const onChangeDebounced = debounce(onChange, 300, {
    trailing: true,
  })

  const onFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      // If a suggestion is selected use that one, otherwise submit the form
      if (selectedElement) {
        document.querySelector<HTMLAnchorElement>(`.${ACTIVE_ITEM_CLASS}`)?.click()
      } else {
        const config = Object.values(SEARCH_PAGE_CONFIG).find(
          ({ type: configType }) => searchBarFilterValue === configType,
        )

        if (config) {
          history.push({
            ...config.to,
            search: toSearchParams([[queryParam, searchInputValue.trim()]]).toString(),
          })
        }
      }

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement?.blur()
      }
    },
    [searchInputValue, selectedElement, searchBarFilterValue],
  )

  const onBlur = () => {
    // Arbitrary 200 ms timeout here, needed since onBlur is triggered before the user can actually click on a link
    setTimeout(() => {
      setShowSuggestions(false)
    }, 300)
  }

  const onFocus = () => {
    if (searchInputValue.length > 2) {
      setShowSuggestions(true)
      fetchResults(searchInputValue)
    }
  }

  const onClear = () => {
    setShowSuggestions(false)
    setSearchInputValue('')
  }

  return (
    <form onSubmit={onFormSubmit} className="auto-suggest" data-test="search-form">
      <StyledLegend>Data zoeken</StyledLegend>
      <SearchBar
        expanded={showSuggestions}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChangeDebounced}
        onClear={onClear}
        onKeyDown={keyDown}
        value={searchInputValue}
        setSearchBarFilterValue={setSearchBarFilterValue}
        searchBarFilterValue={searchBarFilterValue}
      >
        {showSuggestions && (
          <AutoSuggest
            searchBarFilterValue={searchBarFilterValue}
            setSearchBarFilterValue={setSearchBarFilterValue}
            highlightValue={highlightValue}
            ref={ref}
            loading={loading}
            suggestions={results}
            inputValue={searchInputValue}
          />
        )}
      </SearchBar>
    </form>
  )
}

export default HeaderSearch
