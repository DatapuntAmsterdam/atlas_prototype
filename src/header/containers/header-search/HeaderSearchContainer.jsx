import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  getActiveSuggestions,
  getAutoSuggestSuggestions,
  getDisplayQuery,
  getNumberOfSuggestions,
  getSuggestionsAction,
  getTypedQuery,
  setActiveSuggestionAction,
} from '../../ducks/auto-suggest/auto-suggest'
import { emptyFilters } from '../../../shared/ducks/filters/filters'
import {
  toArticleDetail,
  toDataSearchQuery,
  toDatasetDetail,
  toDatasetSearch,
  toDataSuggestion,
  toPublicationDetail,
} from '../../../store/redux-first-router/actions'
import { isDatasetPage } from '../../../store/redux-first-router/selectors'
import PARAMETERS from '../../../store/parameters'
import { getViewMode, isMapPage } from '../../../shared/ducks/ui/ui'
import HeaderSearch from './HeaderSearch'

const mapStateToProps = state => ({
  activeSuggestion: getActiveSuggestions(state),
  displayQuery: getDisplayQuery(state),
  isDatasetView: isDatasetPage(state),
  view: getViewMode(state),
  isMapActive: isMapPage(state),
  numberOfSuggestions: getNumberOfSuggestions(state),
  pageName: state.page ? state.page.name : '',
  // eslint-disable-next-line no-nested-ternary
  prefillQuery: state.search
    ? state.search.query
    : state.dataSelection
    ? state.dataSelection.query
    : '',
  suggestions: getAutoSuggestSuggestions(state),
  typedQuery: getTypedQuery(state),
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      onCleanDatasetOverview: emptyFilters,
      onGetSuggestions: getSuggestionsAction,
      onSuggestionActivate: setActiveSuggestionAction,
    },
    dispatch,
  ),
  onDatasetSearch: query =>
    dispatch(
      toDatasetSearch(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  onDataSearch: query =>
    dispatch(
      toDataSearchQuery(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  openDataSuggestion: (suggestion, view) => dispatch(toDataSuggestion(suggestion, view)),
  openDatasetSuggestion: suggestion => dispatch(toDatasetDetail(suggestion)),
  openEditorialSuggestion: (suggestion, type) =>
    type === 'article'
      ? dispatch(toArticleDetail(suggestion.id, suggestion.slug))
      : dispatch(toPublicationDetail(suggestion.id, suggestion.slug)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderSearch)
