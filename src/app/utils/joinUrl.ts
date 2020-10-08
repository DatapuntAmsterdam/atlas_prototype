const PATH_SEPARATOR = '/'

/**
 * Joins several paths of a URL together into one complete URL.
 *
 * For example:
 * ```ts
 * joinUrl(['http://example.com', 'foo/bar', '10']) // http://example.com/foo/bar/10
 * ```
 *
 * @param paths The paths of the URL to combine.
 * @param trailing If the returned value should have a trailing slash
 */
export default function joinUrl(paths: string[], trailing = false) {
  const normalizedPaths = paths.map((path) => {
    let normalizedPath = path

    while (normalizedPath[0] === PATH_SEPARATOR) {
      normalizedPath = normalizedPath.slice(1)
    }

    while (normalizedPath[normalizedPath.length - 1] === PATH_SEPARATOR) {
      normalizedPath = normalizedPath.slice(0, -1)
    }

    return normalizedPath
  })

  return `${normalizedPaths.join(PATH_SEPARATOR)}${trailing ? PATH_SEPARATOR : ''}`
}
