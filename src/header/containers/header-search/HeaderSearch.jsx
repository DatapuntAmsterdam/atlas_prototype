/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types'
import React from 'react'
import useSlug from '../../../app/utils/useSlug'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import PARAMETERS from '../../../store/parameters'
import { decodeLayers } from '../../../store/queryParameters'
import { extractIdEndpoint } from '../../../store/redux-first-router/actions'
import AutoSuggest from '../../components/auto-suggest/AutoSuggest'
import { CmsType } from '../../../shared/config/cms.config'
import SearchType from '../../../app/pages/SearchPage/constants'

class HeaderSearch extends React.Component {
  constructor(props) {
    super(props)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onSuggestionSelection = this.onSuggestionSelection.bind(this)
    this.onUserInput = this.onUserInput.bind(this)
  }

  componentDidMount() {
    const { onGetSuggestions, prefillQuery } = this.props

    if (prefillQuery) {
      onGetSuggestions(prefillQuery)
    }
  }

  componentDidUpdate(prevProps) {
    const { isMapActive, onGetSuggestions, pageName, prefillQuery } = this.props

    const doResetQuery = prevProps.isMapActive !== isMapActive || prevProps.pageName !== pageName

    // on navigation, clear auto-suggest
    if (doResetQuery && !prefillQuery) {
      onGetSuggestions()
    }
  }

  // Opens suggestion on mouseclick or enter
  onSuggestionSelection(suggestion) {
    const {
      openDataSuggestion,
      openDatasetSuggestion,
      openEditorialSuggestion,
      openMapSuggestion,
      typedQuery,
      view,
    } = this.props

    // Suggestion of type dataset, formerly known as "catalog"
    if (suggestion.type === SearchType.Dataset) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = useSlug(suggestion.label)

      openDatasetSuggestion({ id, slug, typedQuery })
    } else if (
      // Suggestion coming from the cms
      suggestion.type === CmsType.Article ||
      suggestion.type === CmsType.Publication ||
      suggestion.type === CmsType.Collection ||
      suggestion.type === CmsType.Special
    ) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = useSlug(suggestion.label)

      let subType = ''
      if (suggestion.type === CmsType.Special) {
        ;[, subType] = suggestion.label.match(/\(([^()]*)\)$/)
      }

      openEditorialSuggestion({ id, slug }, suggestion.type, subType)
    } else if (suggestion.type === SearchType.Map) {
      const { searchParams } = new URL(suggestion.uri, window.location.origin)

      openMapSuggestion({
        view: searchParams.get(PARAMETERS.VIEW),
        legend: searchParams.get(PARAMETERS.LEGEND) === 'true',
        layers: decodeLayers(searchParams.get(PARAMETERS.LAYERS)),
      })
    } else {
      openDataSuggestion(
        {
          endpoint: suggestion.uri,
          category: suggestion.category,
          typedQuery,
        },
        view === VIEW_MODE.FULL ? VIEW_MODE.SPLIT : view,
      )
    }
  }

  onFormSubmit(type) {
    const {
      activeSuggestion,
      isDatasetPage,
      isDataPage,
      isArticlePage,
      isPublicationPage,
      isSpecialPage,
      isCollectionPage,
      isMapPage,
      typedQuery,
      onCleanDatasetOverview,
      onDatasetSearch,
      onDataSearch,
      onSearch,
      onArticleSearch,
      onPublicationSearch,
      onSpecialSearch,
      onCollectionSearch,
      onMapSearch,
    } = this.props

    const searchAction = {
      [SearchType.Dataset]: onDatasetSearch,
      [CmsType.Article]: onArticleSearch,
      [CmsType.Publication]: onPublicationSearch,
      [SearchType.Data]: onDataSearch,
      [CmsType.Special]: onSpecialSearch,
      [CmsType.Collection]: onCollectionSearch,
      [SearchType.Map]: onMapSearch,
      [SearchType.Search]: onSearch,
    }

    if (activeSuggestion.index === -1) {
      // Load the search results
      onCleanDatasetOverview() // TODO, refactor: don't clean dataset on search

      const searchType =
        type ||
        (isDatasetPage
          ? SearchType.Dataset
          : isDataPage
          ? SearchType.Data
          : isArticlePage
          ? CmsType.Article
          : isPublicationPage
          ? CmsType.Publication
          : isSpecialPage
          ? CmsType.Special
          : isCollectionPage
          ? CmsType.Collection
          : isMapPage
          ? SearchType.Map
          : SearchType.Search)

      const actionFn = searchAction[searchType]

      if (actionFn) {
        actionFn(typedQuery)
      } else {
        onSearch(typedQuery)
      }
    }
  }

  onUserInput(query) {
    const { onGetSuggestions } = this.props

    onGetSuggestions(query)
  }

  render() {
    const {
      activeSuggestion,
      displayQuery,
      numberOfSuggestions,
      onGetSuggestions,
      onSuggestionActivate,
      suggestions,
      typedQuery,
    } = this.props

    return (
      <AutoSuggest
        activeSuggestion={activeSuggestion}
        highlightQuery={typedQuery}
        legendTitle="Data zoeken"
        numberOfSuggestions={numberOfSuggestions}
        onSubmit={this.onFormSubmit}
        onSuggestionActivate={onSuggestionActivate}
        onSuggestionSelection={this.onSuggestionSelection}
        onTextInput={onGetSuggestions}
        placeHolder="Zoek in datasets, artikelen en publicaties"
        query={displayQuery || typedQuery}
        suggestions={suggestions}
      />
    )
  }
}

HeaderSearch.defaultProps = {
  activeSuggestion: {
    index: -1,
  },
  displayQuery: '',
  numberOfSuggestions: 0,
  pageName: '',
  prefillQuery: '',
  suggestions: [],
  typedQuery: '',
  isDataPage: false,
  isDatasetPage: false,
  isArticlePage: false,
  isPublicationPage: false,
  isSpecialPage: false,
  isCollectionPage: false,
  isMapPage: false,
}

HeaderSearch.propTypes = {
  activeSuggestion: PropTypes.shape({
    category: PropTypes.string,
    index: PropTypes.number,
    label: PropTypes.string,
    uri: PropTypes.string,
  }),
  displayQuery: PropTypes.string,
  view: PropTypes.string.isRequired,
  isDataPage: PropTypes.bool,
  isDatasetPage: PropTypes.bool,
  isArticlePage: PropTypes.bool,
  isPublicationPage: PropTypes.bool,
  isSpecialPage: PropTypes.bool,
  isCollectionPage: PropTypes.bool,
  isMapPage: PropTypes.bool,
  isMapActive: PropTypes.bool.isRequired,
  numberOfSuggestions: PropTypes.number,
  onCleanDatasetOverview: PropTypes.func.isRequired,
  onDatasetSearch: PropTypes.func.isRequired,
  onDataSearch: PropTypes.func.isRequired,
  onArticleSearch: PropTypes.func.isRequired,
  onPublicationSearch: PropTypes.func.isRequired,
  onSpecialSearch: PropTypes.func.isRequired,
  onCollectionSearch: PropTypes.func.isRequired,
  onMapSearch: PropTypes.func.isRequired,
  openDataSuggestion: PropTypes.func.isRequired,
  openDatasetSuggestion: PropTypes.func.isRequired,
  openEditorialSuggestion: PropTypes.func.isRequired,
  openMapSuggestion: PropTypes.func.isRequired,
  onGetSuggestions: PropTypes.func.isRequired,
  onSuggestionActivate: PropTypes.func.isRequired,
  pageName: PropTypes.string,
  prefillQuery: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
  typedQuery: PropTypes.string,
}

export default HeaderSearch
