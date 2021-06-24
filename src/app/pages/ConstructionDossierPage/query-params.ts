import type { UrlParam } from '../../utils/useParam'

export const authTokenParam: UrlParam<string | null> = {
  name: 'auth',
  defaultValue: null,
  decode: (value) => value,
  encode: (value) => value,
}

export const documentCodeParam: UrlParam<string | null> = {
  name: 'documentCode',
  defaultValue: null,
  decode: (value) => value,
  encode: (value) => value,
}

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
