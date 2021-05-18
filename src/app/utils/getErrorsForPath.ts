import type { GraphQLFormattedError } from 'graphql'

/**
 * Searches a list of errors for a matching path.
 *
 * @param errors The list of errors to be searched.
 * @param path The path to match the errors to.
 * @param exact Whether the paths needs to match exactly or just partially.
 */
export default function getErrorsForPath<T>(
  errors: GraphQLFormattedError<T>[],
  path: (string | number)[],
  exact = false,
): GraphQLFormattedError<T>[] {
  return errors.filter((error) => {
    // Ignore errors that do not have a path.
    if (error.path === undefined) {
      return false
    }

    const errorPath = error.path ?? []

    // Ignore non-exact matching error paths.
    if (exact && errorPath.length !== path.length) {
      return false
    }

    // Check if error path matches provided path.
    return path.every((key, index) => errorPath[index] === key)
  })
}
