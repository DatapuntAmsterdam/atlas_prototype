import {
  BackDrop,
  breakpoint,
  constants,
  Hidden,
  SearchBar as SearchBarComponent,
  SearchBarToggle,
  showAboveBackDrop,
  styles,
} from '@datapunt/asc-ui'
import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { SearchCategory } from '../../../header/components/auto-suggest/AutoSuggest'
import CONSTANTS from '../../../shared/config/constants'
import SearchBarFilter from '../SearchBarFilter'

const Z_INDEX_OFFSET = 2 // Set a custom offset

const SearchBarWrapper = styled.div`
  position: relative;
  background: #fff;
  display: flex;

  ${({ expanded }: { expanded: boolean }) =>
    showAboveBackDrop(expanded)({ zIndexOffset: Z_INDEX_OFFSET })}

  ${styles.SelectWrapperStyle} {
    height: ${constants.SEARCH_BAR_HEIGHT}px;
    max-width: 30%;
  }

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: 80%;
  }
`

const StyledSearchBar = styled(SearchBarComponent)`
  width: 100%;
`

type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement> & {
  expanded: boolean
  onOpenSearchBarToggle: (open: boolean) => void
  openSearchBarToggle: boolean
  value: string
  onClear: () => void
  onBlur: () => void
  searchCategory: SearchCategory
  setSearchCategory: Dispatch<SetStateAction<SearchCategory>>
}

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
