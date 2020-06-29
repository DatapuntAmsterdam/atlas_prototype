import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import {
  SearchBar as SearchBarComponent,
  SearchBarToggle,
  BackDrop,
  breakpoint,
  showAboveBackDrop,
  styles,
  Hidden,
} from '@datapunt/asc-ui'
import CONSTANTS from '../../../shared/config/constants'
import SearchBarFilter from '../SearchBarFilter'
import { SearchCategory } from '../../../header/components/auto-suggest/AutoSuggest'

const Z_INDEX_OFFSET = 2 // Set a custom offset

const SearchBarWrapper = styled.div`
  position: relative;
  background: #fff;
  display: flex;

  ${({ expanded }: { expanded: boolean }) =>
    showAboveBackDrop(expanded)({ zIndexOffset: Z_INDEX_OFFSET })}

  ${styles.SelectWrapperStyle} {
    height: 36px; // TODO: find out why height from the select is 40px and the searchfield is 36px... And where this should be changed
    max-width: 30%;
  }

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: 80%;
  }
`

const StyledSearchBar = styled(SearchBarComponent)`
  width: 100%;
`

type SearchBarProps = {
  expanded: boolean
  onOpenSearchBarToggle: Function
  openSearchBarToggle: boolean
  value: string
  onClear: () => void
  searchCategory: SearchCategory
  setSearchCategory: Dispatch<SetStateAction<SearchCategory>>
} & React.InputHTMLAttributes<HTMLInputElement>

const SearchBar: React.FC<SearchBarProps> = ({
  expanded,
  onBlur,
  onFocus,
  onChange,
  onClear,
  onKeyDown,
  value,
  openSearchBarToggle,
  onOpenSearchBarToggle,
  children,
  searchCategory,
  setSearchCategory,
}) => {
  const searchBarProps = {
    onBlur,
    onFocus,
    onChange,
    onClear,
    onKeyDown,
    value,
  }

  const placeHolder = 'Zoek in datasets, artikelen en publicaties'
  const inputProps = {
    autoCapitalize: 'off',
    autoComplete: 'off',
    autoCorrect: 'off',
    id: 'auto-suggest__input',
    'data-test': 'search-input',
    placeholder: placeHolder,
    label: placeHolder,
  }

  return (
    <>
      <SearchBarWrapper expanded={expanded}>
        <Hidden maxBreakpoint="tabletM">
          <SearchBarFilter searchCategory={searchCategory} setSearchCategory={setSearchCategory} />
        </Hidden>
        <StyledSearchBar
          showAt="tabletM"
          data-testid="StyledSearchBar"
          inputProps={inputProps}
          {...searchBarProps}
          aria-haspopup="true"
          aria-expanded={expanded}
        >
          {children}
        </StyledSearchBar>
      </SearchBarWrapper>
      {expanded && (
        <BackDrop
          backdropOpacity={CONSTANTS.BACKDROP_OPACITY}
          data-testid="backDrop"
          onClick={onBlur}
          zIndexOffset={Z_INDEX_OFFSET}
        />
      )}

      <SearchBarToggle
        title={inputProps.placeholder}
        hideAt="tabletM"
        onOpen={onOpenSearchBarToggle}
        open={openSearchBarToggle}
        inputProps={inputProps}
        searchBarProps={searchBarProps}
        aria-haspopup="true"
        aria-expanded={expanded}
        hasBackDrop
      >
        {children}
      </SearchBarToggle>
    </>
  )
}

export default SearchBar
