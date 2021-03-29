import { mocked } from 'ts-jest/utils'
import isIgnoredPath from '../../../../store/middleware/isIgnoredPath'
import buildDetailUrl from './buildDetailUrl'

jest.mock('../../../../store/middleware/isIgnoredPath')

const isIgnoredPathMock = mocked(isIgnoredPath)

describe('buildDetailUrl', () => {
  const params = {
    type: 'foo',
    subtype: 'bar',
    id: 'baz',
  }

  beforeEach(() => {
    isIgnoredPathMock.mockReturnValue(false)
  })

  afterEach(() => {
    isIgnoredPathMock.mockClear()
  })

  it('generates a location descriptor for new routes', () => {
    const locationSpy = jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ pathname: '', search: '' } as Location)

    isIgnoredPathMock.mockReturnValue(true)

    expect(buildDetailUrl(params).pathname).toBe('/kaart/foo/bar/baz/')

    locationSpy.mockRestore()
  })

  it('generates a location descriptor for legacy routes', () => {
    const locationSpy = jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ pathname: '', search: '' } as Location)

    isIgnoredPathMock.mockReturnValue(false)

    expect(buildDetailUrl(params).pathname).toBe('/data/foo/bar/baz/')

    locationSpy.mockRestore()
  })

  it('preserves the search query', () => {
    const search = '?foo=bar'
    const locationSpy = jest
      .spyOn(window, 'location', 'get')
      .mockReturnValue({ pathname: '', search } as Location)

    expect(buildDetailUrl(params).search).toBe(search)

    locationSpy.mockRestore()
  })
})
