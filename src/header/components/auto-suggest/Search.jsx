import React from 'react'
import PropTypes from 'prop-types'
import { SearchBar, SearchBarToggle } from '@datapunt/asc-ui'
import { useAppReducer } from '../../../app/utils/useAppReducer'

const Search = ({
  showSuggestions,
  suggestions,
  searchBarProps,
  openSearchBarToggle,
  onOpenSearchBarToggle,
  inputProps,
}) => {
  const [, actions] = useAppReducer('ui')

  const onOpenSearchToggle = open => {
    onOpenSearchBarToggle(open)

    actions.setBackDrop({
      payload: {
        open,
        key: 'search',
      },
    })
  }

  const showBackdrop = !!(showSuggestions && suggestions.length)

  React.useEffect(() => {
    actions.setBackDrop({
      payload: {
        open: showBackdrop,
        key: 'search',
      },
    })
  }, [showBackdrop])

  return (
    <React.Fragment>
      <SearchBar showAt="tabletM" inputProps={inputProps} {...searchBarProps} />
      <SearchBarToggle
        hideAt="tabletM"
        onOpen={onOpenSearchToggle}
        open={openSearchBarToggle}
        inputProps={inputProps}
        searchBarProps={searchBarProps}
      />
    </React.Fragment>
  )
}

Search.propTypes = {
  showSuggestions: PropTypes.bool.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchBarProps: PropTypes.shape({}).isRequired,
  inputProps: PropTypes.shape({}).isRequired,
  onOpenSearchBarToggle: PropTypes.func.isRequired,
  openSearchBarToggle: PropTypes.bool.isRequired,
}

export default Search
