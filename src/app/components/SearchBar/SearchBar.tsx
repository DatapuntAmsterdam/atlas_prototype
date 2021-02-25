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
import { FunctionComponent, InputHTMLAttributes, useState } from 'react'
import styled, { css } from 'styled-components'
import { BACKDROP_OPACITY } from '../../../shared/config/constants'
import SearchBarFilter from '../SearchBarFilter'

const Z_INDEX_OFFSET = 2 // Set a custom offset

// TODO: Fix z-index issue with overlay in ASC eventually
const StyledSearchBarToggle = styled(SearchBarToggle)<{ searchIsVisible: boolean }>`
  z-index: 23;
  position: absolute;

  ${({ searchIsVisible }) =>
    searchIsVisible &&
    css`
      left: 0;
    `}

  right: 0;
  top: 0;

  & > button {
    margin-right: 50px;
  }
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

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  expanded: boolean
  value: string
  onClear: () => void
  onBlur: () => void
  setSearchBarFilterValue: (value: string) => void
  searchBarFilterValue: string
}

export const SEARCH_BAR_INPUT_ID = 'auto-suggest__input'

const SearchBar: FunctionComponent<SearchBarProps> = ({
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
  const [searchIsVisible, setSearchVisible] = useState(false)
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
    id: SEARCH_BAR_INPUT_ID,
    'data-test': 'search-input',
    placeholder: placeHolder,
  }

  const toggleWidth = (isOpen: boolean) => {
    setSearchVisible(isOpen)
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
          backdropOpacity={BACKDROP_OPACITY}
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
        searchIsVisible={searchIsVisible}
        hasBackDrop
        label={placeHolder}
        onOpen={toggleWidth}
      >
        {children}
      </StyledSearchBarToggle>
    </>
  )
}

export default SearchBar
