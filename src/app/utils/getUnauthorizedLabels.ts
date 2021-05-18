import type { GraphQLFormattedError } from 'graphql'
import type { ErrorExtensions } from '../models/graphql'

export default function getUnauthorizedLabels(errors: GraphQLFormattedError<ErrorExtensions>[]) {
  return errors.reduce(
    (labels, { extensions }) =>
      extensions?.code === 'UNAUTHORIZED'
        ? [...labels, extensions.label.toLocaleLowerCase()]
        : labels,
    [] as string[],
  )
}
