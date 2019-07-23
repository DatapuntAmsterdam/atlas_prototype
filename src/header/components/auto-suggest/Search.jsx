import React from 'react';
import PropTypes from 'prop-types';
import { SearchBar, SearchBarToggle } from '@datapunt/asc-ui';
import { useAppReducer } from '../../../app/utils/useAppReducer';

const Search = ({
  showSuggestions,
  suggestions,
  searchBarProps,
  openSearchBarToggle,
  onOpenSearchBarToggle
}) => {
  const [, actions] = useAppReducer('ui');

  const onOpenSearchToggle = (open) => {
    onOpenSearchBarToggle(open);
    actions.setBackDrop({
      payload: open
    });
  };

  const showBackdrop = !!(showSuggestions && suggestions.length);

  React.useEffect(() => {
    actions.setBackDrop({
      payload: showBackdrop
    });
  }, [showBackdrop]);

  return (
    <React.Fragment>
      <SearchBar
        showAt="tabletM"
        {...searchBarProps}
      />
      <SearchBarToggle
        hideAt="tabletM"
        onOpen={onOpenSearchToggle}
        open={openSearchBarToggle}
        {...searchBarProps}
      />
    </React.Fragment>
  );
};

Search.propTypes = {
  showSuggestions: PropTypes.bool.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
  legendTitle: PropTypes.string.isRequired,
  searchBarProps: PropTypes.shape({}).isRequired,
  activeSuggestion: PropTypes.shape({}).isRequired,
  highlightQuery: PropTypes.string.isRequired,
  onSuggestionSelection: PropTypes.func.isRequired,
  onOpenSearchBarToggle: PropTypes.func.isRequired,
  openSearchBarToggle: PropTypes.bool.isRequired
};

export default Search;
