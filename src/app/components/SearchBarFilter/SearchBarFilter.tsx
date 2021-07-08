import { Label, Select, srOnlyStyle } from '@amsterdam/asc-ui'
import { useEffect } from 'react'
import styled from 'styled-components'
import type { FunctionComponent, ChangeEvent } from 'react'
import type { SearchCategory } from '../Header/auto-suggest/AutoSuggest'
import SEARCH_PAGE_CONFIG from '../../pages/SearchPage/config'

const StyledLabel = styled(Label)`
  ${srOnlyStyle}
`

const StyledSelect = styled(Select)`
  border-right: none;
`

interface SearchBarFilterOptions {
  type: SearchCategory
  label: string
}

const AVAILABLE_FILTERS: Array<SearchBarFilterOptions> = Object.values(SEARCH_PAGE_CONFIG).map(
  ({ type, label }) => ({
    type,
    label,
  }),
)

export interface SearchBarFilterProps {
  value: string
  setValue: (value: string) => void
}

export const LOCAL_STORAGE_KEY = 'search_filters'

const SearchBarFilter: FunctionComponent<SearchBarFilterProps> = ({ value, setValue }) => {
  function onSetSearchCategory(e: ChangeEvent<HTMLSelectElement>) {
    e.preventDefault()
    e.stopPropagation()

    setValue(e.currentTarget.value as SearchCategory)
  }

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, value)
  }, [value])

  return (
    <>
      <StyledLabel htmlFor="category" label="Zoek op categorie" />
      <StyledSelect
        data-testid="SearchBarFilter"
        id="category"
        value={value}
        onChange={onSetSearchCategory}
      >
        {AVAILABLE_FILTERS.map(({ type, label }) => {
          return (
            <option key={type} value={type}>
              {label}
            </option>
          )
        })}
      </StyledSelect>
    </>
  )
}

export default SearchBarFilter
