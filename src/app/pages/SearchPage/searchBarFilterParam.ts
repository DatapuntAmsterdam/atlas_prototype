import { UrlParam } from '../../utils/useParam'
import { SearchCategory } from '../../../header/components/auto-suggest/AutoSuggest'
import SearchType from './constants'

const searchFilterParam: UrlParam<SearchCategory> = {
  name: 'searchFilter',
  defaultValue: SearchType.Search,
  decode: (value) => value as SearchCategory,
  encode: (value) => value,
}

const searchQueryParam: UrlParam<string> = {
  name: 'term',
  defaultValue: '',
  decode: (value) => value,
  encode: (value) => value,
}

export { searchQueryParam, searchFilterParam }
