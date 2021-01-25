import { LocationDescriptorObject } from 'history'
import { generatePath } from 'react-router-dom'
import environment from '../environment'
import { HEADER_LINK_HELP } from '../shared/config/content-links'
import { ViewMode } from '../shared/ducks/ui/ui'
import parameters from '../store/parameters'
import { routing } from './routes'

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

export const toConstructionFile = (
  id: string,
  fileName: string,
  fileUrl: string,
): LocationDescriptorObject => {
  const pathname = generatePath(routing.constructionFile.path, { id })
  const searchParams = new URLSearchParams({
    [parameters.FILE]: fileName,
    [parameters.FILE_URL]: fileUrl,
  })

  return { pathname, search: searchParams.toString() }
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
