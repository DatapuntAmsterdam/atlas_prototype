import { generatePath } from 'react-router-dom'
import type { LocationDescriptorObject } from 'history'
import environment from '../environment'
import { HEADER_LINK_HELP } from '../shared/config/content-links'
import { fileNameParam, fileUrlParam } from './pages/ConstructionDossierPage/query-params'
import { ViewMode, viewParam } from './pages/MapPage/query-params'
import { routing } from './routes'
import toSearchParams from './utils/toSearchParams'

export const toAddresses = (): LocationDescriptorObject => ({
  pathname: routing.addresses.path,
  search: toSearchParams([[viewParam, ViewMode.Full]]).toString(),
})

export const toArticleDetail = (id: string, slug: string): LocationDescriptorObject => ({
  pathname: generatePath(routing.articleDetail.path, { id, slug }),
})

export const toArticleSearch = (): LocationDescriptorObject => ({
  pathname: routing.articleSearch.path,
})

export const toCadastralObjects = (): LocationDescriptorObject => ({
  pathname: routing.cadastralObjects.path,
  search: toSearchParams([[viewParam, ViewMode.Full]]).toString(),
})

export const toCollectionDetail = (id: string, slug: string): LocationDescriptorObject => ({
  pathname: generatePath(routing.collectionDetail.path, { id, slug }),
})

export const toCollectionSearch = (): LocationDescriptorObject => ({
  pathname: routing.collectionSearch.path,
})

export const toConstructionDossier = (
  id: string,
  fileName?: string,
  fileUrl?: string,
): LocationDescriptorObject => {
  const pathname = generatePath(routing.constructionDossier.path, { id })
  const searchParams = new URLSearchParams()

  if (fileName) {
    searchParams.set(fileNameParam.name, fileName)
  }

  if (fileUrl) {
    searchParams.set(fileUrlParam.name, fileUrl)
  }

  return { pathname, search: searchParams.toString() }
}

export interface DataDetailParams {
  type: string
  subtype: string
  id: string
}

export const toDataDetail = ({ type, subtype, id }: DataDetailParams): LocationDescriptorObject => {
  return {
    pathname: generatePath(routing.dataDetail.path, { type, subtype, id }),
  }
}

export const toDataSearch = (): LocationDescriptorObject => ({
  pathname: routing.dataSearch.path,
})

export interface DatasetDetailParams {
  id: string
  slug: string
}

export const toDatasetDetail = ({ id, slug }: DatasetDetailParams): LocationDescriptorObject => ({
  pathname: generatePath(routing.datasetDetail.path, { id, slug }),
})

export const toDatasetSearch = (): LocationDescriptorObject => ({
  pathname: routing.datasetSearch.path,
})

export const toEstablishments = (): LocationDescriptorObject => ({
  pathname: routing.establishments.path,
  search: toSearchParams([[viewParam, ViewMode.Full]]).toString(),
})

// TODO: Rename this method to match the name of the route.
export const toGeoSearch = (): LocationDescriptorObject => ({
  pathname: routing.dataSearchGeo.path,
})

export const toHelpPage = () =>
  toArticleDetail(HEADER_LINK_HELP.id[environment.DEPLOY_ENV], HEADER_LINK_HELP.slug)

export const toHome = (): LocationDescriptorObject => ({
  pathname: routing.home.path,
})

export const toMapSearch = (): LocationDescriptorObject => ({
  pathname: routing.mapSearch.path,
})

export const toNotFound = (): LocationDescriptorObject => ({
  pathname: routing.notFound.path,
})

export const toPublicationDetail = (id: string, slug: string): LocationDescriptorObject => ({
  pathname: generatePath(routing.publicationDetail.path, { id, slug }),
})

export const toPublicationSearch = (): LocationDescriptorObject => ({
  pathname: routing.publicationSearch.path,
})

export const toSearch = (): LocationDescriptorObject => ({
  pathname: routing.search.path,
})

export const toSpecialDetail = (
  id: string,
  type: string,
  slug: string,
): LocationDescriptorObject => ({
  pathname: generatePath(routing.specialDetail.path, { id, type, slug }),
})

export const toSpecialSearch = (): LocationDescriptorObject => ({
  pathname: routing.specialSearch.path,
})
