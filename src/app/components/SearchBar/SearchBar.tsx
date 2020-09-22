import {
  BackDrop,
  breakpoint,
  constants,
  Hidden,
  SearchBar as SearchBarComponent,
  SearchBarToggle,
  showAboveBackDrop,
  styles,
} from '@amsterdam/asc-ui'
import React from 'react'
import styled from 'styled-components'
import { IDS } from '../../../shared/config/config'
import CONSTANTS from '../../../shared/config/constants'
import SearchBarFilter from '../SearchBarFilter'

const Z_INDEX_OFFSET = 2 // Set a custom offset

// Todo: fix z-index issue with overlay in ASC eventually
const StyledSearchBarToggle = styled(SearchBarToggle)`
  z-index: 23;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
`

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
  value: string
  onClear: () => void
  onBlur: () => void
  setSearchBarFilterValue: (value: string) => void
  searchBarFilterValue: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  expanded,
  onBlur,
  onFocus,
  onChange,
  onClear,
  onKeyDown,
  value,
  children,
  setSearchBarFilterValue,
  searchBarFilterValue,
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
    id: IDS.searchbar,
    'data-test': 'search-input',
    placeholder: placeHolder,
  }

  return (
    <>
      <SearchBarWrapper expanded={expanded}>
        <Hidden maxBreakpoint="tabletM">
          <SearchBarFilter setValue={setSearchBarFilterValue} value={searchBarFilterValue} />
        </Hidden>
        <StyledSearchBar
          showAt="tabletM"
          data-testid="StyledSearchBar"
          inputProps={inputProps}
          {...searchBarProps}
          aria-haspopup="true"
          aria-expanded={expanded}
          label={placeHolder}
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

      <StyledSearchBarToggle
        title={inputProps.placeholder}
        hideAt="tabletM"
        inputProps={inputProps}
        searchBarProps={searchBarProps}
        aria-haspopup="true"
        aria-expanded={expanded}
        hasBackDrop
        label={placeHolder}
      >
        {children}
      </StyledSearchBarToggle>
    </>
  )
}

export default SearchBar
