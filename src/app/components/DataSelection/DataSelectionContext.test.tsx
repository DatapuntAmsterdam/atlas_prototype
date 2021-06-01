import { renderHook } from '@testing-library/react-hooks'
import { LocationDescriptorObject } from 'history'
import { toEstablishments } from '../../links'
import { routing } from '../../routes'
import { DataSelectionProvider, useDataSelection } from './DataSelectionContext'

const mockSearchValue = ''

const pushMock = jest.fn()
const defaultPathname = routing.addresses.path
let locationMockValue: LocationDescriptorObject = {
  pathname: defaultPathname,
  search: mockSearchValue,
}

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => locationMockValue,
  useHistory: () => ({
    push: pushMock,
  }),
}))

describe('DataSelectionProvider', () => {
  afterEach(() => {
    pushMock.mockClear()
  })

  it('adds a new filter', () => {
    locationMockValue = {
      pathname: defaultPathname,
      search: 'filters={"existing":"filter"}',
    }
    const { result } = renderHook(() => useDataSelection(), {
      wrapper: ({ children }) => <DataSelectionProvider>{children}</DataSelectionProvider>,
    })

    result.current.addFilter({ foo: 'bar' })
    expect(pushMock).toHaveBeenCalledWith({
      pathname: defaultPathname,
      search: `filters=${encodeURIComponent(JSON.stringify({ existing: 'filter', foo: 'bar' }))}`,
    })
  })

  it('removes a filter', () => {
    locationMockValue = {
      pathname: defaultPathname,
      search: 'filters={"existing":"filter","foo":"bar"}',
    }
    const { result } = renderHook(() => useDataSelection(), {
      wrapper: ({ children }) => <DataSelectionProvider>{children}</DataSelectionProvider>,
    })

    result.current.removeFilter('foo')
    expect(pushMock).toHaveBeenCalledWith({
      pathname: defaultPathname,
      search: `filters=${encodeURIComponent(JSON.stringify({ existing: 'filter' }))}`,
    })
  })

  describe('activeFilters value', () => {
    it('returns an array of active filters', () => {
      locationMockValue = {
        pathname: defaultPathname,
        search: 'filters={"woonplaats":"Amsterdam"}',
      }

      const { result } = renderHook(() => useDataSelection(), {
        wrapper: ({ children }) => <DataSelectionProvider>{children}</DataSelectionProvider>,
      })

      expect(result.current.activeFilters).toStrictEqual([
        { key: 'woonplaats', label: 'Woonplaats: Amsterdam', value: 'Amsterdam' },
      ])
    })

    it("omits values that don't match the filters in the dataselection configuration", () => {
      locationMockValue = {
        pathname: defaultPathname,
        search: 'filters={"woonplaats":"Amsterdam", "sbi_code": "[\'1\']"}', // sbi_code can only be used on a "vestigingen" / HR page
      }

      const { result } = renderHook(() => useDataSelection(), {
        wrapper: ({ children }) => <DataSelectionProvider>{children}</DataSelectionProvider>,
      })

      expect(result.current.activeFilters).toStrictEqual([
        { key: 'woonplaats', label: 'Woonplaats: Amsterdam', value: 'Amsterdam' },
      ])
    })

    it('will show an SBI code on the Vestigingen / HR page, and strip out the quotes from the value', () => {
      locationMockValue = {
        ...toEstablishments(),
        search: 'filters={"woonplaats":"Amsterdam", "sbi_code": "[\'1\']"}',
      }

      const { result } = renderHook(() => useDataSelection(), {
        wrapper: ({ children }) => <DataSelectionProvider>{children}</DataSelectionProvider>,
      })

      expect(result.current.activeFilters).toStrictEqual([
        { key: 'woonplaats', label: 'Woonplaats: Amsterdam', value: 'Amsterdam' },
        { key: 'sbi_code', label: 'SBI-code: 1', value: '1' },
      ])
    })

    it('will add a shape filter when polygons are set', () => {
      locationMockValue = {
        ...toEstablishments(),
        search:
          'filters={"woonplaats":"Amsterdam"}&geo={"polygon":[[123,345],[456,678],[123,456]]}',
      }

      const { result } = renderHook(() => useDataSelection(), {
        wrapper: ({ children }) => <DataSelectionProvider>{children}</DataSelectionProvider>,
      })

      expect(result.current.activeFilters).toStrictEqual([
        { key: 'woonplaats', label: 'Woonplaats: Amsterdam', value: 'Amsterdam' },
        {
          key: 'shape',
          label: 'Ingetekende vorm op kaart',
          value: '[[345,123],[678,456],[456,123]]',
        },
      ])
    })
  })
})
