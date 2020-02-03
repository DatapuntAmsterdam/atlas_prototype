import {
  articleSearchQuery,
  dataSearchQuery,
  datasetSearchQuery,
  publicationSearchQuery,
  specialSearchQuery,
  searchQuery,
} from './graphql.config'
import {
  toSearch,
  toPublicationSearch,
  toArticleSearch,
  toSpecialSearch,
  toDataSearch,
  toDatasetSearch,
  toPublications,
  toArticles,
  toSpecials,
  toDatasets,
} from '../../../store/redux-first-router/actions'
import { routing } from '../../routes'
import { TYPES as EDITORIAL_TYPES } from '../../../shared/config/cms.config'

export const MAX_RESULTS = 50
export const DEFAULT_LIMIT = 10

export const DATA_FILTERS = 'types'

export const TYPES = {
  SEARCH: 'search',
  DATA: 'data',
  DATASET: 'dataset',
}

export const QUERY_TYPES = {
  [routing.specialSearch.page]: 'specialSearch',
  [routing.dataSearch.page]: 'dataSearch',
  [routing.publicationSearch.page]: 'publicationSearch',
  [routing.datasetSearch.page]: 'datasetSearch',
  [routing.articleSearch.page]: 'articleSearch',
}

export const EDITORIAL_SEARCH_PAGES = [
  routing.publications.page,
  routing.publicationSearch.page,
  routing.specials.page,
  routing.specialSearch.page,
  routing.articles.page,
  routing.articleSearch.page,
]

export const DATASET_SEARCH_PAGES = [routing.datasets.page, routing.datasetSearch.page]
export const DATA_SEARCH_PAGES = [routing.dataSearch.page]
export const CMS_SEARCH_PAGES = [
  routing.articleSearch.page,
  routing.specialSearch.page,
  routing.publicationSearch.page,
]

export default {
  [routing.search.page]: {
    resolver: Object.values(QUERY_TYPES),
    to: toSearch,
    query: searchQuery,
    label: routing.search.title,
    type: TYPES.SEARCH,
  },
  [routing.publicationSearch.page]: {
    resolver: QUERY_TYPES[routing.publicationSearch.page],
    query: publicationSearchQuery,
    to: toPublicationSearch,
    label: routing.publications.title,
    type: EDITORIAL_TYPES.PUBLICATION,
  },
  [routing.publications.page]: {
    resolver: QUERY_TYPES[routing.publicationSearch.page],
    query: publicationSearchQuery,
    to: toPublications,
    label: routing.publications.title,
    type: EDITORIAL_TYPES.PUBLICATION,
  },
  [routing.articleSearch.page]: {
    resolver: QUERY_TYPES[routing.articleSearch.page],
    query: articleSearchQuery,
    to: toArticleSearch,
    label: routing.articles.title,
    type: EDITORIAL_TYPES.ARTICLE,
  },
  [routing.articles.page]: {
    resolver: QUERY_TYPES[routing.articleSearch.page],
    query: articleSearchQuery,
    to: toArticles,
    label: routing.articles.title,
    type: EDITORIAL_TYPES.ARTICLE,
  },
  [routing.specialSearch.page]: {
    resolver: QUERY_TYPES[routing.specialSearch.page],
    query: specialSearchQuery,
    to: toSpecialSearch,
    label: routing.specials.title,
    type: EDITORIAL_TYPES.SPECIAL,
  },
  [routing.specials.page]: {
    resolver: QUERY_TYPES[routing.specialSearch.page],
    query: specialSearchQuery,
    to: toSpecials,
    label: routing.specials.title,
    type: EDITORIAL_TYPES.SPECIAL,
  },
  [routing.dataSearch.page]: {
    resolver: QUERY_TYPES[routing.dataSearch.page],
    query: dataSearchQuery,
    to: toDataSearch,
    label: routing.data.title,
    type: TYPES.DATA,
  },
  [routing.datasetSearch.page]: {
    resolver: QUERY_TYPES[routing.datasetSearch.page],
    query: datasetSearchQuery,
    to: toDatasetSearch,
    label: routing.datasets.title,
    type: TYPES.DATASET,
  },
  [routing.datasets.page]: {
    resolver: QUERY_TYPES[routing.datasetSearch.page],
    query: datasetSearchQuery,
    to: toDatasets,
    label: routing.datasets.title,
    type: TYPES.DATASET,
  },
}
