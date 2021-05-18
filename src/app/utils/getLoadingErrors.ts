import type { GraphQLFormattedError } from 'graphql'
import type { ErrorExtensions } from '../models/graphql'

/**
 * Takes a list of errors and gets the ones that are considered 'loading errors'.
 * A loading error is an error that should prevent the results of a query from being displayed.
 *
 * @param errors The errors to check for loading errors.
 */
export default function getLoadingErrors(errors: GraphQLFormattedError<ErrorExtensions>[]) {
  return errors.filter((error) => error.extensions?.code !== 'UNAUTHORIZED')
}
