import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router'
import SearchBar from '../../../app/components/SearchBar'
import SearchType from '../../../app/pages/SearchPage/constants'
import AutoSuggest, { SearchCategory } from '../../components/auto-suggest/AutoSuggest'
import useParam from '../../../app/utils/useParam'
import {
  searchFilterParam,
  searchQueryParam,
} from '../../../app/pages/SearchPage/searchBarFilterParam'
import search, { MIN_QUERY_LENGTH } from '../../services/auto-suggest/auto-suggest'
import useTraverseList from '../../../app/utils/useTraverseList'
import SEARCH_PAGE_CONFIG from '../../../app/pages/SearchPage/config'

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

export type Suggestion = {
  category: string
  index: number
  label: string
  uri: string
  type: SearchCategory
  subType?: string
}

export type SuggestionList = Array<{
  label: string
  totalResults: number
  content: Array<Suggestion>
  type: string
}>

const ACTIVE_ITEM_CLASS = 'auto-suggest__dropdown-item--active'

const HeaderSearch: React.FC = () => {
  const history = useHistory()

  const [searchCategory] = useParam(searchFilterParam)
  const [searchQuery, setSearchQuery] = useParam(searchQueryParam)

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SuggestionList>([])
  const [inputValue, setInputValue] = useState(searchQuery || '')
  const [highlightValue, setHighlightValue] = useState(searchQuery || '')
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)

  const ref = useRef<HTMLDivElement>(null)
  const { keyDown } = useTraverseList(
    ref,
    (activeElement, list) => {
      list.forEach((el) => {
        el.classList.remove(ACTIVE_ITEM_CLASS)
      })
      activeElement.classList.add(ACTIVE_ITEM_CLASS)
      setInputValue(activeElement.innerText)
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
      search({
        query: val,
        type: searchCategory === SearchType.Search ? null : searchCategory,
      })
        .then((res) => {
          setResults(res.data as SuggestionList)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [inputValue, setLoading, setResults, searchCategory],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setSelectedElement(null)

    if (e.target.value?.length > MIN_QUERY_LENGTH) {
      setShowSuggestions(true)
      fetchResults(e.target.value)
    } else {
      setShowSuggestions(false)
    }
  }

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // If a suggestion is selected use that one, otherwise submit the form
    if (selectedElement) {
      document.querySelector<HTMLAnchorElement>(`.${ACTIVE_ITEM_CLASS}`)?.click()
    } else {
      const queryString = {
        term: inputValue.trim(),
        searchFilter: searchCategory,
      }
      const query = new URLSearchParams(
        Object.entries(queryString).reduce(
          (acc, [key, value]) => (value ? { ...acc, [key]: value } : acc),
          {},
        ),
      )
      const actionType = Object.values(SEARCH_PAGE_CONFIG).find(
        ({ type: configType }) => searchCategory === configType,
      )
      if (actionType) {
        history.push({ pathname: actionType.path, search: query ? `?${query}` : '' })
      }
    }

    // @ts-ignore
    document.activeElement?.blur()
  }

  const onBlur = () => {
    // Arbitrary 200 ms timeout here, needed since onBlur is triggered before the user can actually click on a link
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  const onFocus = () => {
    if (inputValue.length > 2) {
      setShowSuggestions(true)
      fetchResults(inputValue)
    }
  }

  const onClear = () => {
    setShowSuggestions(false)
    setSearchQuery('')
    setInputValue('')
  }

  return (
    <form onSubmit={onFormSubmit} className="auto-suggest" data-test="search-form">
      <StyledLegend className="u-sr-only">Data zoeken</StyledLegend>
      <SearchBar
        expanded={showSuggestions}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        onClear={onClear}
        onKeyDown={keyDown}
        value={inputValue}
      >
        {showSuggestions && (
          <AutoSuggest
            highlightValue={highlightValue}
            ref={ref}
            loading={loading}
            suggestions={results}
          />
        )}
      </SearchBar>
    </form>
  )
}

export default HeaderSearch
