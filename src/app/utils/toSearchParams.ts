import encodeParam from './encodeParam'
import { UrlParam } from './useParam'

export type UrlParamTuple<T> = [UrlParam<T>, T]

export interface ToSearchParamsOptions {
  initialValue?: ConstructorParameters<typeof URLSearchParams>[0]
}

export default function toSearchParams(
  // TODO: Figure out how we can use generics here and preserve type-checks.
  params: UrlParamTuple<any>[],
  options?: ToSearchParamsOptions,
) {
  const searchParams = new URLSearchParams(options?.initialValue)

  params.forEach(([param, value]) => {
    const encoded = encodeParam(param, value)

    if (encoded !== null) {
      searchParams.set(param.name, encoded)
    } else {
      searchParams.delete(param.name)
    }
  })

  return searchParams
}
