import { DetailInfo } from '../../types/details'

const PATH_SEPARATOR = '/'

/**
 * Parse a detail URL to get it's type and id.
 *
 * @param detailPath The detail URL to parse.
 */
export default function parseDetailPath(detailPath: string): DetailInfo {
  const parts = detailPath.split(PATH_SEPARATOR).filter((part) => part.length > 0)
  let id = parts.pop() ?? ''

  if (id.startsWith('id')) {
    id = id.slice(2)
  }

  return {
    id,
    type: parts[0],
    subType: parts[1],
  }
}
