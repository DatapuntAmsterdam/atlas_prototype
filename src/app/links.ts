import { LocationDescriptorObject } from 'history'
import { generatePath } from 'react-router-dom'
import environment from '../environment'
import { HEADER_LINK_HELP } from '../shared/config/content-links'
import { ViewMode } from '../shared/ducks/ui/ui'
import parameters from '../store/parameters'
import { fileNameParam, fileUrlParam } from './pages/ConstructionDossierPage/query-params'
import { MAIN_PATHS, routing } from './routes'
import { FEATURE_BETA_MAP, isFeatureEnabled } from './features'

export const toAddresses = (): LocationDescriptorObject => {
  const searchParams = new URLSearchParams({
    [parameters.VIEW]: ViewMode.Full,
  })

  return {
    pathname: routing.addresses.path,
    search: searchParams.toString(),
  }
}

export const toArticleDetail = (id: string, slug: string): LocationDescriptorObject => ({
  pathname: generatePath(routing.articleDetail.path, { id, slug }),
})

export const toCadastralObjects = (): LocationDescriptorObject => {
  const searchParams = new URLSearchParams({
    [parameters.VIEW]: ViewMode.Full,
  })

  return {
    pathname: routing.cadastralObjects.path,
    search: searchParams.toString(),
  }
}

export const toCollectionDetail = (id: string, slug: string): LocationDescriptorObject => ({
  pathname: generatePath(routing.collectionDetail.path, { id, slug }),
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
  const path =
    window.location.pathname.includes(MAIN_PATHS.MAP) || isFeatureEnabled(FEATURE_BETA_MAP)
      ? routing.dataDetail_TEMP.path
      : routing.dataDetail.path

  return {
    pathname: generatePath(path, { type, subtype, id }),
  }
}

export const toEstablishments = (): LocationDescriptorObject => {
  const searchParams = new URLSearchParams({
    [parameters.VIEW]: ViewMode.Full,
  })

  return {
    pathname: routing.establishments.path,
    search: searchParams.toString(),
  }
}

export const toHelpPage = () =>
  toArticleDetail(HEADER_LINK_HELP.id[environment.DEPLOY_ENV], HEADER_LINK_HELP.slug)

export const toHome = (): LocationDescriptorObject => ({
  pathname: routing.home.path,
})

export const toPublicationDetail = (id: string, slug: string): LocationDescriptorObject => ({
  pathname: generatePath(routing.publicationDetail.path, { id, slug }),
})

export const toSpecialDetail = (
  id: string,
  type: string,
  slug: string,
): LocationDescriptorObject => ({
  pathname: generatePath(routing.specialDetail.path, { id, type, slug }),
})
