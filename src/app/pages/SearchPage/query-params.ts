import { UrlParam } from '../../utils/useParam'

const searchQueryParam: UrlParam<string> = {
  name: 'term',
  defaultValue: '',
  decode: (value) => value,
  encode: (value) => value,
}

// eslint-disable-next-line import/prefer-default-export
export { searchQueryParam }
