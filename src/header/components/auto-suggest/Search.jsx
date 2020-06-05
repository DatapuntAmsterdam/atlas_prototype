import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  SearchBar,
  SearchBarToggle,
  BackDrop,
  breakpoint,
  showAboveBackDrop,
} from '@datapunt/asc-ui'
import CONSTANTS from '../../../shared/config/constants'

const Z_INDEX_OFFSET = 2 // Set a custom offset

const StyledSearchBar = styled(SearchBar)`
  position: relative;
  background: #FFF;

  ${({ expanded }) => showAboveBackDrop(expanded)({ zIndexOffset: Z_INDEX_OFFSET })}

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: 80%;
  }
`

const Search = ({
  expanded,
  onBlur,
  searchBarProps,
  openSearchBarToggle,
  onOpenSearchBarToggle,
  inputProps,
  children,
}) => {
  const onOpenSearchToggle = (open) => {
    onOpenSearchBarToggle(open)
  }

  return (
    <>
      <StyledSearchBar
        showAt="tabletM"
        data-testid="StyledSearchBar"
        inputProps={inputProps}
        {...searchBarProps}
        aria-haspopup="true"
        aria-expanded={expanded}
        expanded={expanded}
      >
        {children}
      </StyledSearchBar>
      {expanded && (
        <BackDrop
          backdropOpacity={CONSTANTS.BACKDROP_OPACITY}
          data-testid="backDrop"
          expanded={expanded}
          onClick={onBlur}
          zIndexOffset={Z_INDEX_OFFSET}
        />
      )}

      <SearchBarToggle
        title={inputProps.placeholder}
        hideAt="tabletM"
        onOpen={onOpenSearchToggle}
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

Search.propTypes = {
  expanded: PropTypes.bool.isRequired,
  searchBarProps: PropTypes.shape({}).isRequired,
  inputProps: PropTypes.shape({}).isRequired,
  onOpenSearchBarToggle: PropTypes.func.isRequired,
  openSearchBarToggle: PropTypes.bool.isRequired,
}

export default Search
