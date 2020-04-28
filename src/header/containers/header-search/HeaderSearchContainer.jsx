import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CmsType } from '../../../shared/config/cms.config'
import { emptyFilters } from '../../../shared/ducks/filters/filters'
import { getViewMode, isMapPage } from '../../../shared/ducks/ui/ui'
import PARAMETERS from '../../../store/parameters'
import {
  toArticleDetail,
  toArticleSearch,
  toCollectionDetail,
  toCollectionSearch,
  toDataSearch,
  toDatasetDetail,
  toDatasetSearch,
  toDataSuggestion,
  toMapSearch,
  toMapWithLegendOpen,
  toPublicationDetail,
  toPublicationSearch,
  toSearch,
  toSpecialSearch,
  toSpecialDetail,
} from '../../../store/redux-first-router/actions'
import {
  isArticlePage,
  isCollectionPage,
  isDataPage,
  isDatasetPage,
  isPublicationPage,
  isSpecialPage,
  isMapPage as isMapSearchPage,
} from '../../../store/redux-first-router/selectors'
import {
  getActiveSuggestions,
  getAutoSuggestSuggestions,
  getDisplayQuery,
  getNumberOfSuggestions,
  getSuggestionsAction,
  getTypedQuery,
  setActiveSuggestionAction,
} from '../../ducks/auto-suggest/auto-suggest'
import HeaderSearch from './HeaderSearch'

const mapStateToProps = (state) => ({
  activeSuggestion: getActiveSuggestions(state),
  displayQuery: getDisplayQuery(state),
  isDataPage: isDataPage(state),
  isDatasetPage: isDatasetPage(state),
  isArticlePage: isArticlePage(state),
  isPublicationPage: isPublicationPage(state),
  isSpecialPage: isSpecialPage(state),
  isCollectionPage: isCollectionPage(state),
  isMapPage: isMapPage(state) || isMapSearchPage(state),
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

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      onCleanDatasetOverview: emptyFilters,
      onGetSuggestions: getSuggestionsAction,
      onSuggestionActivate: setActiveSuggestionAction,
    },
    dispatch,
  ),
  onSearch: (query) =>
    dispatch(
      toSearch(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  onDatasetSearch: (query) =>
    dispatch(
      toDatasetSearch(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  onDataSearch: (query) =>
    dispatch(
      toDataSearch(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  onArticleSearch: (query) =>
    dispatch(
      toArticleSearch(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  onPublicationSearch: (query) =>
    dispatch(
      toPublicationSearch(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  onSpecialSearch: (query) =>
    dispatch(
      toSpecialSearch(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  onCollectionSearch: (query) =>
    dispatch(
      toCollectionSearch(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  onMapSearch: (query) =>
    dispatch(
      toMapSearch(
        {
          [PARAMETERS.QUERY]: query,
        },
        false,
        true,
      ),
    ),
  openDataSuggestion: (suggestion, view) => dispatch(toDataSuggestion(suggestion, view)),
  openDatasetSuggestion: (suggestion) => dispatch(toDatasetDetail(suggestion)),
  openEditorialSuggestion: (suggestion, type, subType) => {
    switch (type) {
      case CmsType.Article:
        return dispatch(toArticleDetail(suggestion.id, suggestion.slug))
      case CmsType.Collection:
        return dispatch(toCollectionDetail(suggestion.id, suggestion.slug))
      case CmsType.Publication:
        return dispatch(toPublicationDetail(suggestion.id, suggestion.slug))
      case CmsType.Special:
        return dispatch(toSpecialDetail(suggestion.id, subType, suggestion.slug))
      default:
        throw new Error(`Unable to open editorial suggestion, unknown type '${type}'.`)
    }
  },
  openMapSuggestion: (suggestion) => dispatch(toMapWithLegendOpen(suggestion.layers)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSearch)
