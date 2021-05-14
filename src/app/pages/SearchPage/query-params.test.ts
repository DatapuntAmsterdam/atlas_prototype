import {
  ActiveFilter,
  activeFiltersParam,
  pageParam,
  queryParam,
  Sort,
  SortOrder,
  sortParam,
} from './query-params'

describe('activeFiltersParam', () => {
  const encoded = 'date;date:2013|theme;theme:bestuur.theme:verkeer'
  const decoded: ActiveFilter[] = [
    {
      type: 'date',
      values: ['date:2013'],
    },
    {
      type: 'theme',
      values: ['theme:bestuur', 'theme:verkeer'],
    },
  ]

  it('decodes the parameter', () => {
    expect(activeFiltersParam.decode(encoded)).toEqual(decoded)
  })

  it('encodes the parameter', () => {
    expect(activeFiltersParam.encode(decoded)).toEqual(encoded)
  })
})

describe('pageParam', () => {
  const encoded = '12'
  const decoded = 12

  it('decodes the parameter', () => {
    expect(pageParam.decode(encoded)).toEqual(decoded)
  })

  it('encodes the parameter', () => {
    expect(pageParam.encode(decoded)).toEqual(encoded)
  })
})

describe('queryParam', () => {
  const encoded = 'Foo'
  const decoded = 'Foo'

  it('decodes the parameter', () => {
    expect(queryParam.decode(encoded)).toEqual(encoded)
  })

  it('encodes the parameter', () => {
    expect(queryParam.encode(decoded)).toEqual(encoded)
  })
})

describe('sortParam', () => {
  const encoded = 'foo:asc'
  const decoded: Sort = { field: 'foo', order: SortOrder.Ascending }

  it('decodes the parameter', () => {
    expect(sortParam.decode(encoded)).toEqual(decoded)
  })

  it('encodes the parameter', () => {
    expect(sortParam.encode(decoded)).toEqual(encoded)
  })
})
