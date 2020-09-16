import { CmsType } from '../../../shared/config/cms.config'
import {
  toArticleSearch,
  toCollectionSearch,
  toDataSearch,
  toDatasetSearch,
  toMapSearch,
  toPublicationSearch,
  toSearch,
  toSpecialSearch,
} from '../../../store/redux-first-router/actions'
import EditorialResults from '../../components/EditorialResults'
import { routing } from '../../routes'
import DataSearchResults from './DataSearchResults'
import DatasetSearchResults from './DatasetSearchResults'
import {
  articleSearchQuery,
  collectionSearchQuery,
  dataSearchQuery,
  datasetSearchQuery,
  mapSearchQuery,
  publicationSearchQuery,
  searchQuery,
  specialSearchQuery,
} from './documents.graphql'
import MapSearchResults from './MapSearchResults'
import SearchType from './constants'

export const MAX_RESULTS = 50
export const DEFAULT_LIMIT = 10

export const DATA_FILTERS = 'dataTypes'

// This object is used to define the sort order of the search page
const SEARCH_TYPES_CONFIG = {
  [routing.collectionSearch.page]: {
    resolver: 'collectionSearch',
    query: collectionSearchQuery,
    to: toCollectionSearch,
    path: routing.collectionSearch.path,
    label: routing.collectionSearch.title,
    type: CmsType.Collection,
    component: EditorialResults,
    hideOverviewHeading: false,
  },
  [routing.specialSearch.page]: {
    resolver: 'specialSearch',
    query: specialSearchQuery,
    to: toSpecialSearch,
    path: routing.specialSearch.path,
    label: routing.specialSearch.title,
    type: CmsType.Special,
    component: EditorialResults,
    hideOverviewHeading: false,
  },
  [routing.mapSearch.page]: {
    resolver: 'mapSearch',
    query: mapSearchQuery,
    to: toMapSearch,
    path: routing.mapSearch.path,
    label: routing.mapSearch.title,
    type: SearchType.Map,
    component: MapSearchResults,
    hideOverviewHeading: true,
  },
  [routing.dataSearch.page]: {
    resolver: 'dataSearch',
    query: dataSearchQuery,
    to: toDataSearch,
    path: routing.dataSearch.path,
    label: routing.dataSearch.title,
    type: SearchType.Data,
    component: DataSearchResults,
    hideOverviewHeading: false,
  },
  [routing.datasetSearch.page]: {
    resolver: 'datasetSearch',
    query: datasetSearchQuery,
    to: toDatasetSearch,
    path: routing.datasetSearch.path,
    label: routing.datasetSearch.title,
    type: SearchType.Dataset,
    component: DatasetSearchResults,
    hideOverviewHeading: false,
  },
  [routing.publicationSearch.page]: {
    resolver: 'publicationSearch',
    query: publicationSearchQuery,
    to: toPublicationSearch,
    path: routing.publicationSearch.path,
    label: routing.publicationSearch.title,
    type: CmsType.Publication,
    component: EditorialResults,
    hideOverviewHeading: false,
  },
  [routing.articleSearch.page]: {
    resolver: 'articleSearch',
    query: articleSearchQuery,
    to: toArticleSearch,
    path: routing.articleSearch.path,
    label: routing.articleSearch.title,
    type: CmsType.Article,
    component: EditorialResults,
    hideOverviewHeading: false,
  },
}

export const EDITORIAL_SEARCH_PAGES = [
  routing.publicationSearch.page,
  routing.specialSearch.page,
  routing.articleSearch.page,
  routing.collectionSearch.page,
]

export default {
  [routing.search.page]: {
    // The all search results page calls the resolver for each search type
    resolver: Object.values(SEARCH_TYPES_CONFIG).map(({ resolver }) => resolver),
    to: toSearch,
    query: searchQuery,
    path: routing.search.path,
    label: routing.search.title,
    type: SearchType.Search,
    hideOverviewHeading: false,
  },
  ...SEARCH_TYPES_CONFIG,
}
