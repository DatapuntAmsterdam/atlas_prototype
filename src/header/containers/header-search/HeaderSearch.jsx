import React from 'react';
import PropTypes from 'prop-types';

import AutoSuggest from '../../components/auto-suggest/AutoSuggest';
import { extractIdEndpoint } from '../../../store/redux-first-router/actions';
import { VIEW_MODE } from '../../../shared/ducks/ui/ui';

class HeaderSearch extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSuggestionSelection = this.onSuggestionSelection.bind(this);
    this.onUserInput = this.onUserInput.bind(this);
  }

  componentDidMount() {
    const { onGetSuggestions, prefillQuery } = this.props;

    if (prefillQuery) {
      onGetSuggestions(prefillQuery);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      isMapActive,
      onGetSuggestions,
      pageName,
      prefillQuery
    } = this.props;

    const doResetQuery =
      prevProps.isMapActive !== isMapActive ||
      prevProps.pageName !== pageName;

    // on navigation, clear auto-suggest
    if (doResetQuery && !prefillQuery) {
      onGetSuggestions();
    }
  }

  // Opens suggestion on mouseclick or enter
  onSuggestionSelection(suggestion, shouldOpenInNewWindow) {
    const {
      openDataSuggestion,
      openDatasetSuggestion,
      typedQuery,
      view
    } = this.props;

    if (shouldOpenInNewWindow) {
      // const newWindow = window.open(`${window.location.href}`, '_blank');
      // // setting uri to the window, as window.postMessage does not work for some reason
      // // (webpack overrides the data it seems)
      // newWindow.window.suggestionToLoadUri = suggestion.uri;
    }

    if (suggestion.uri.match(/^dcatd\//)) {
      // Suggestion of type dataset, formerly known as "catalog"
      const id = extractIdEndpoint(suggestion.uri);
      openDatasetSuggestion({ id, typedQuery });
    } else {
      openDataSuggestion({
        endpoint: suggestion.uri, category: suggestion.category, typedQuery
      }, (view === VIEW_MODE.FULL) ? VIEW_MODE.SPLIT : view);
    }
  }

  onFormSubmit() {
    const {
      activeSuggestion,
      isDatasetView,
      typedQuery,
      onCleanDatasetOverview,
      onDatasetSearch,
      onDataSearch
    } = this.props;

    if (activeSuggestion.index === -1) {
      // Load the search results
      onCleanDatasetOverview(); // TODO, refactor: don't clean dataset on search
      if (isDatasetView) {
        onDatasetSearch(typedQuery);
      } else {
        onDataSearch(typedQuery);
      }
    }
  }

  onUserInput(query) {
    const {
      onGetSuggestions
    } = this.props;

    onGetSuggestions(query);
  }

  render() {
    const {
      activeSuggestion,
      displayQuery,
      numberOfSuggestions,
      onGetSuggestions,
      onSuggestionActivate,
      suggestions,
      typedQuery
    } = this.props;

    return (
      <AutoSuggest
        activeSuggestion={activeSuggestion}
        highlightQuery={typedQuery}
        legendTitle={'Data zoeken'}
        numberOfSuggestions={numberOfSuggestions}
        onSubmit={this.onFormSubmit}
        onSuggestionActivate={onSuggestionActivate}
        onSuggestionSelection={this.onSuggestionSelection}
        onTextInput={onGetSuggestions}
        placeHolder={'Zoek data op adres, gebied, etc. Of datasets op trefwoord.'}
        query={displayQuery || typedQuery}
        suggestions={suggestions}
      />
    );
  }
}

HeaderSearch.defaultProps = {
  activeSuggestion: {
    index: -1
  },
  displayQuery: '',
  isDatasetView: false,
  numberOfSuggestions: 0,
  pageName: '',
  prefillQuery: '',
  suggestions: [],
  typedQuery: ''
};

HeaderSearch.propTypes = {
  activeSuggestion: PropTypes.shape({
    category: PropTypes.string,
    index: PropTypes.number,
    label: PropTypes.string,
    uri: PropTypes.string
  }),
  displayQuery: PropTypes.string,
  view: PropTypes.string.isRequired,
  isDatasetView: PropTypes.bool,
  isMapActive: PropTypes.bool.isRequired,
  numberOfSuggestions: PropTypes.number,
  onCleanDatasetOverview: PropTypes.func.isRequired,
  onDatasetSearch: PropTypes.func.isRequired,
  onDataSearch: PropTypes.func.isRequired,
  openDataSuggestion: PropTypes.func.isRequired,
  openDatasetSuggestion: PropTypes.func.isRequired,
  onGetSuggestions: PropTypes.func.isRequired,
  onSuggestionActivate: PropTypes.func.isRequired,
  pageName: PropTypes.string,
  prefillQuery: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
  typedQuery: PropTypes.string
};

export default HeaderSearch;
