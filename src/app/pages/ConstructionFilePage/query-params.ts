import { UrlParam } from '../../utils/useParam'

export const fileNameParam: UrlParam<string | null> = {
  name: 'bestand',
  defaultValue: null,
  decode: (value) => value,
  encode: (value) => value,
}

export const fileUrlParam: UrlParam<string | null> = {
  name: 'bestandUrl',
  defaultValue: null,
  decode: (value) => value,
  encode: (value) => value,
}
