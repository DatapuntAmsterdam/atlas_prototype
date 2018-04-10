import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getSuggestions,
  setActiveSuggestion,
} from '../../ducks/auto-suggest/auto-suggest';
import { fetchDetail } from '../../../reducers/details';
import { fetchDataSelection, fetchSearchResultsByQuery } from '../../../reducers/search';
import emptyFilters from '../../../shared/ducks/filters/filters';

import AutoSuggest from '../../components/auto-suggest/AutoSuggest';
import piwikTracker from '../../../shared/services/piwik-tracker/piwik-tracker';
import getSharedConfig from '../../../shared/services/shared-config/shared-config';

const mapStateToProps = (state) => ({
  activeSuggestion: state.autoSuggest.activeSuggestion,
  isDatasetView: state.dataSelection && state.dataSelection.view === 'CARDS',
  numberOfSuggestions: state.autoSuggest.suggestions ? state.autoSuggest.suggestions.count : 0,
  displayQuery: state.autoSuggest.displayQuery,
  typedQuery: state.autoSuggest.typedQuery,
  suggestions: state.autoSuggest.suggestions ? state.autoSuggest.suggestions.data : [],
  prefillQuery: state.search ? state.search.query : state.dataSelection ? state.dataSelection.query : '',
  isMapFullscreen: state.ui ? state.ui.isMapFullscreen : false,
  pageName: state.page ? state.page.name : ''
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onCleanDatasetOverview: emptyFilters,
  onDatasetSearch: fetchDataSelection,
  onDetailLoad: fetchDetail,
  onSearch: fetchSearchResultsByQuery,
  onSuggestionActivate: setActiveSuggestion,
  onGetSuggestions: getSuggestions,
}, dispatch);

class HeaderSearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onSuggestionSelection = this.onSuggestionSelection.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onUserInput = this.onUserInput.bind(this);
    this.onSuggestionActivate = this.onSuggestionActivate.bind(this);

    if (window.opener && window.suggestionToLoadUri) {
      // if user is sent here with a ctrl+click action
      // open the detail page
      this.openDetailOnLoad();
    }
  }

  componentDidMount() {
    const { prefillQuery, onGetSuggestions } = this.props;
    if (prefillQuery) {
      onGetSuggestions(prefillQuery);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      onGetSuggestions,
      isMapFullscreen,
      pageName,
      prefillQuery
    } = this.props;

    const doResetQuery =
      prevProps.isMapFullscreen !== isMapFullscreen ||
      prevProps.pageName !== pageName;

    if (doResetQuery && !prefillQuery) {
      onGetSuggestions();
    }
  }

  onSuggestionActivate(suggestion) {
    const { onSuggestionActivate, typedQuery, onGetSuggestions } = this.props;

    if (suggestion && suggestion.index === -1) {
      onGetSuggestions(typedQuery);
    }
    onSuggestionActivate(suggestion);
  }

  onSuggestionSelection(suggestion, shouldOpenInNewWindow) {
    const {
      onDetailLoad,
      typedQuery
    } = this.props;
    piwikTracker(['trackEvent', 'auto-suggest', suggestion.category, typedQuery]);

    if (shouldOpenInNewWindow) {
      const newWindow = window.open(`${window.location.href}`, '_blank');
      // setting uri to the window, as window.postMessage does not work for some reason
      // (webpack overrides the data it seems)
      newWindow.window.suggestionToLoadUri = suggestion.uri;
    } else {
      onDetailLoad(`${getSharedConfig().API_ROOT}${suggestion.uri}`);
    }
  }

  onFormSubmit() {
    const {
      activeSuggestion,
      isDatasetView,
      numberOfSuggestions,
      onCleanDatasetOverview,
      onDatasetSearch,
      onSearch,
      typedQuery
    } = this.props;

    piwikTracker(['trackSiteSearch', typedQuery, isDatasetView ? 'datasets' : 'data', numberOfSuggestions]);

    if (activeSuggestion.index === -1) {
      // Load the search results
      onCleanDatasetOverview();
      if (isDatasetView) {
        onDatasetSearch(typedQuery);
      } else {
        onSearch(typedQuery);
      }
    }
  }

  onUserInput(query) {
    const { onGetSuggestions } = this.props;

    onGetSuggestions(query);
  }

  openDetailOnLoad() {
    const { onDetailLoad } = this.props;
    // if user is sent here with a ctrl+click action
    // open the detail page
    const suggestionUri = window.suggestionToLoadUri;
    onDetailLoad(`${getSharedConfig().API_ROOT}${suggestionUri}`);
    window.suggestionToLoadUri = undefined;
  }

  render() {
    const {
      activeSuggestion,
      numberOfSuggestions,
      typedQuery,
      displayQuery,
      suggestions
    } = this.props;

    return (
      <AutoSuggest
        activeSuggestion={activeSuggestion}
        legendTitle={'Data zoeken'}
        numberOfSuggestions={numberOfSuggestions}
        onSubmit={this.onFormSubmit}
        onSuggestionActivate={this.onSuggestionActivate}
        onSuggestionSelection={this.onSuggestionSelection}
        onTextInput={this.onUserInput}
        placeHolder={'Zoek data op adres, postcode, kadastrale aanduiding, etc. Of datasets op trefwoord.'}
        query={displayQuery || typedQuery}
        highlightQuery={typedQuery}
        suggestions={suggestions}
      />
    );
  }
}

HeaderSearchContainer.contextTypes = {
  store: PropTypes.object.isRequired
};

HeaderSearchContainer.defaultProps = {
  activeSuggestion: {},
  displayQuery: '',
  isDatasetView: false,
  numberOfSuggestions: 0,
  prefillQuery: '',
  suggestions: [],
  typedQuery: '',
  pageName: ''
};

HeaderSearchContainer.propTypes = {
  activeSuggestion: PropTypes.shape({
    category: PropTypes.string,
    index: PropTypes.number,
    label: PropTypes.string,
    uri: PropTypes.string
  }),
  displayQuery: PropTypes.string,
  isDatasetView: PropTypes.bool,
  numberOfSuggestions: PropTypes.number,
  onCleanDatasetOverview: PropTypes.func.isRequired,
  onDatasetSearch: PropTypes.func.isRequired,
  onDetailLoad: PropTypes.func.isRequired,
  onGetSuggestions: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSuggestionActivate: PropTypes.func.isRequired,
  isMapFullscreen: PropTypes.bool.isRequired,
  prefillQuery: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
  typedQuery: PropTypes.string,
  pageName: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSearchContainer);
