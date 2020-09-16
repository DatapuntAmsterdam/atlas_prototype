import reducer, {
  initialState,
  setSort,
  setFilterValues,
  SearchPageState,
  REDUCER_KEY,
  getSort,
  ActiveFilter,
  getActiveFilters,
  getFilterValues,
  setPage,
  getPage,
} from './SearchPageDucks'

describe('SearchPageDucks', () => {
  describe('reducer', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {} as any)).toEqual(initialState)
    })
  })

  describe('setSort', () => {
    it('should set the sort', () => {
      const state = reducer(undefined, setSort('test'))
      expect(state.sort).toEqual('test')
    })

    it('should clear the sort on empty values', () => {
      let state = reducer(undefined, setSort('test'))
      state = reducer(state, setSort(''))
      expect(state.sort).toEqual(null)
    })
  })

  describe('setPage', () => {
    it('should set the page', () => {
      const state = reducer(undefined, setPage(10))
      expect(state.page).toEqual(10)
    })

    it('should default to the initial state on invalid pages', () => {
      let state = reducer(undefined, setPage(0))
      expect(state.page).toEqual(initialState.page)
      state = reducer(undefined, setPage(-10))
      expect(state.page).toEqual(initialState.page)
    })
  })

  describe('setFilterValues', () => {
    it('should set and sort the filters and their values', () => {
      let state = reducer(undefined, setFilterValues('last', ['f', 'e', 'd']))
      state = reducer(state, setFilterValues('first', ['b', 'a', 'c']))

      expect(state.activeFilters).toEqual([
        { type: 'first', values: ['a', 'b', 'c'] },
        { type: 'last', values: ['d', 'e', 'f'] },
      ])
    })

    it('should update an existing filter with new values', () => {
      let state = reducer(undefined, setFilterValues('test', ['a']))
      state = reducer(state, setFilterValues('test', ['b', 'a']))

      expect(state.activeFilters).toEqual([{ type: 'test', values: ['a', 'b'] }])
    })

    it('should remove filters that no longer have any values', () => {
      let state = reducer(undefined, setFilterValues('test', ['a', 'b', 'c']))
      state = reducer(state, setFilterValues('test', []))

      expect(state.activeFilters).toEqual([])
    })
  })

  describe('getSort', () => {
    it('should get the sort', () => {
      const state = reducer({ sort: 'test' } as SearchPageState, {} as any)
      expect(getSort({ [REDUCER_KEY]: state })).toEqual('test')
    })
  })

  describe('getPage', () => {
    it('should get the page', () => {
      const state = reducer({ page: 10 } as SearchPageState, {} as any)
      expect(getPage({ [REDUCER_KEY]: state })).toEqual(10)
    })
  })

  describe('getActiveFilters', () => {
    it('should get the active filters', () => {
      const activeFilters: ActiveFilter[] = [
        { type: 'foo', values: ['a', 'b', 'c'] },
        { type: 'bar', values: ['d', 'e', 'f'] },
      ]

      const state = reducer({ activeFilters } as SearchPageState, {} as any)

      expect(getActiveFilters({ [REDUCER_KEY]: state })).toEqual(activeFilters)
    })
  })

  describe('getFilterValues', () => {
    it('should get the filter value of a specific type', () => {
      const activeFilters: ActiveFilter[] = [
        { type: 'foo', values: ['a', 'b', 'c'] },
        { type: 'bar', values: ['d', 'e', 'f'] },
      ]

      const state = reducer({ activeFilters } as SearchPageState, {} as any)

      expect(getFilterValues('bar')({ [REDUCER_KEY]: state })).toEqual(['d', 'e', 'f'])
    })

    it('should get empty filter values if no filter exists', () => {
      const activeFilters: ActiveFilter[] = []
      const state = reducer({ activeFilters } as SearchPageState, {} as any)

      expect(getFilterValues('bar')({ [REDUCER_KEY]: state })).toEqual([])
    })
  })
})
