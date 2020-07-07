/* eslint-disable no-nested-ternary */
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { CmsType } from '../../../shared/config/cms.config'
import { emptyFilters } from '../../../shared/ducks/filters/filters'
import { getViewMode, isMapActive } from '../../../shared/ducks/ui/ui'
import {
  toArticleDetail,
  toCollectionDetail,
  toDatasetDetail,
  toDataSuggestion,
  toMapWithLegendOpen,
  toPublicationDetail,
  toSpecialDetail,
} from '../../../store/redux-first-router/actions'
import { getPage } from '../../../store/redux-first-router/selectors'
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
import SearchType from '../../../app/pages/SearchPage/constants'
import PAGES from '../../../app/pages'

const mapStateToProps = (state) => ({
  activeSuggestion: getActiveSuggestions(state),
  displayQuery: getDisplayQuery(state),
  view: getViewMode(state),
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
  pageType: isMapActive(state)
    ? SearchType.Data
    : getPage(state) === PAGES.DATA_SEARCH
    ? SearchType.Data
    : getPage(state) === PAGES.DATASET_SEARCH
    ? SearchType.Dataset
    : getPage(state) === PAGES.ARTICLE_SEARCH
    ? CmsType.Article
    : getPage(state) === PAGES.PUBLICATION_SEARCH
    ? CmsType.Publication
    : getPage(state) === PAGES.SPECIAL_SEARCH
    ? CmsType.Special
    : getPage(state) === PAGES.COLLECTION_SEARCH
    ? CmsType.Collection
    : getPage(state) === PAGES.MAP_SEARCH
    ? SearchType.Map
    : null,
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
