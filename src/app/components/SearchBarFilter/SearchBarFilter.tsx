import React from 'react'
import { Label, Select } from '@datapunt/asc-ui'
import styled from 'styled-components'
import SEARCH_PAGE_CONFIG from '../../pages/SearchPage/config'
import { SearchCategory } from '../../../header/components/auto-suggest/AutoSuggest'
import useParam from '../../utils/useParam'
import { searchFilterParam } from '../../pages/SearchPage/searchBarFilterParam'

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

const SearchBarFilter: React.FC = () => {
  const [selectedValue, setSelectedValue] = useParam(searchFilterParam)

  function onSetSearchCategory(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault()
    e.stopPropagation()

    const value = e.currentTarget.value as SearchCategory
    if (value !== selectedValue) {
      setSelectedValue(value, 'replace')
    }
  }
  return (
    <>
      <StyledLabel htmlFor="category" label="Zoek op categorie" />
      <StyledSelect
        data-testid="SearchBarFilter"
        id="category"
        value={selectedValue || ''}
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
