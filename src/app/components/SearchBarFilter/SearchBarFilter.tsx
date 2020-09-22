import { Label, Select, srOnlyStyle } from '@amsterdam/asc-ui'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { SearchCategory } from '../../../header/components/auto-suggest/AutoSuggest'
import SEARCH_PAGE_CONFIG from '../../pages/SearchPage/config'

const StyledLabel = styled(Label)`
  ${srOnlyStyle}
`

const StyledSelect = styled(Select)`
  border-right: none;
`

type SearchBarFilterOptions = {
  type: SearchCategory
  label: string
}

const AVAILABLE_FILTERS: Array<SearchBarFilterOptions> = Object.values(SEARCH_PAGE_CONFIG).map(
  ({ type, label }) => ({
    type,
    label,
  }),
)

type Props = {
  value: string
  setValue: (value: string) => void
}

export const LOCAL_STORAGE_KEY = 'search_filters'

const SearchBarFilter: React.FC<Props> = ({ value, setValue }) => {
  function onSetSearchCategory(e: React.ChangeEvent<HTMLSelectElement>) {
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
