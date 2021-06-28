import encodeParam from './encodeParam'
import type { UrlParam } from './useParam'

/** A tuple containing a UrlParam and it's associated value. */
export type ParamValueTuple<T> = [UrlParam<T>, T]

/**
 * Encodes a set of parameters into a record of encoded values, parameters which have a default value will be omitted if the provided value is the same.
 *
 * ```ts
 * const params = encodeParams(
 *   [numberParam, 42],
 *   [booleanParam, false],
 *   [stringParam, 'Hello World'],
 * )
 * ```
 *
 * @param params The parameters to encode into a record.
 */
export default function encodeParams<T extends any[]>(
  ...params: { [K in keyof T]: ParamValueTuple<T[K]> }
) {
  return Object.fromEntries(
    params.flatMap(([param, value]) => {
      const encoded = encodeParam(param, value)

      if (encoded !== null) {
        return [[param.name, encoded]]
      }

      return []
    }),
  )
}
