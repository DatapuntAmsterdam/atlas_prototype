import React, { Dispatch, SetStateAction } from 'react'
import { Select, Label } from '@datapunt/asc-ui'
import styled from 'styled-components'
import SEARCH_PAGE_CONFIG from '../../pages/SearchPage/config'
import { SearchCategory } from '../../../header/components/auto-suggest/AutoSuggest'

// TODO: Add the screen reader only "styling" to asc-ui
const StyledLabel = styled(Label)`
  border-width: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`

const StyledSelect = styled(Select)`
  border-right: none;
`

type SearchBarFilterProps = {
  searchCategory: SearchCategory
  setSearchCategory: Dispatch<SetStateAction<SearchCategory>>
}

const SearchBarFilter: React.FC<SearchBarFilterProps> = ({ searchCategory, setSearchCategory }) => {
  const AVAILABLE_FILTERS = Object.keys(SEARCH_PAGE_CONFIG).map((key) => {
    const { type, label } = SEARCH_PAGE_CONFIG[key]
    return {
      type,
      label,
    }
  })

  function onSetSearchCategory(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault()
    e.stopPropagation()

    const { value } = e.currentTarget
    setSearchCategory(value)
  }

  return (
    <>
      <StyledLabel htmlFor="category" label="Zoek op categorie" />
      <StyledSelect
        data-testid="SearchBarFilter"
        id="category"
        value={searchCategory}
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
