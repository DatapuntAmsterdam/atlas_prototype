import type { UrlParam } from '../../utils/useParam'

export interface ActiveFilter {
  type: string
  values: string[]
}

const FILTER_DELIMITER = '|'
const TYPE_DELIMITER = ';'
const VALUE_DELIMITER = '.'

export const activeFiltersParam: UrlParam<ActiveFilter[]> = {
  name: 'filters',
  defaultValue: [],
  decode: (value) => {
    return value.split(FILTER_DELIMITER).map((rawActiveFilter) => {
      const [type, rawValues] = rawActiveFilter.split(TYPE_DELIMITER)
      const values = rawValues.split(VALUE_DELIMITER)

      return {
        type,
        values,
      }
    })
  },
  encode: (value) => {
    return value
      .map(({ type, values }) => [type, values.join(VALUE_DELIMITER)].join(TYPE_DELIMITER))
      .join(FILTER_DELIMITER)
  },
}

export const pageParam: UrlParam<number> = {
  name: 'pagina',
  defaultValue: 1,
  decode: (value) => parseInt(value, 10),
  encode: (value) => value.toString(),
}

export const queryParam: UrlParam<string> = {
  name: 'term',
  defaultValue: '',
  decode: (value) => value,
  encode: (value) => value,
}

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

export interface Sort {
  field: string
  order: SortOrder
}

const SORT_DELIMITER = ':'

export const sortParam: UrlParam<Sort | null> = {
  name: 'sortering',
  defaultValue: null,
  decode: (value) => {
    const [field, direction] = value.split(SORT_DELIMITER)

    return {
      field,
      order: direction as SortOrder,
    }
  },
  encode: (value) => [value.field, value.order].join(SORT_DELIMITER),
}
