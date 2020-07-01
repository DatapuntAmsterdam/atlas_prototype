export interface DetailUrlParams {
  id: string
  type: string
}

const PATH_SEPARATOR = '/'

/**
 * Parse a detail URL to get it's type and id.
 *
 * @param detailPath The detail URL to parse.
 */
export function parseDetailPath(detailPath: string): DetailUrlParams {
  const parts = detailPath.split(PATH_SEPARATOR).filter((part) => part.length > 0)
  let id = parts.pop() ?? ''

  if (id.startsWith('id')) {
    id = id.slice(2)
  }

  return {
    id,
    type: parts.join(PATH_SEPARATOR),
  }
}
