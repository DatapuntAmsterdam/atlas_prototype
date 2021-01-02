import { LocationDescriptor } from 'history'
import { generatePath } from 'react-router-dom'
import { ViewMode } from '../shared/ducks/ui/ui'
import parameters from '../store/parameters'
import { routing } from './routes'

export const toConstructionFile = (
  id: string,
  fileName: string,
  fileUrl: string,
): LocationDescriptor => {
  const pathname = generatePath(routing.constructionFile.path, { id })
  const searchParams = new URLSearchParams({
    [parameters.FILE]: fileName,
    [parameters.FILE_URL]: fileUrl,
  })

  return { pathname, search: searchParams.toString() }
}

export const toAddresses = (): LocationDescriptor => {
  const searchParams = new URLSearchParams({
    [parameters.VIEW]: ViewMode.Full,
  })

  return {
    pathname: routing.addresses.path,
    search: searchParams.toString(),
  }
}

export const toCadastralObjects = (): LocationDescriptor => {
  const searchParams = new URLSearchParams({
    [parameters.VIEW]: ViewMode.Full,
  })

  return {
    pathname: routing.cadastralObjects.path,
    search: searchParams.toString(),
  }
}

export const toEstablishments = (): LocationDescriptor => {
  const searchParams = new URLSearchParams({
    [parameters.VIEW]: ViewMode.Full,
  })

  return {
    pathname: routing.establishments.path,
    search: searchParams.toString(),
  }
}
