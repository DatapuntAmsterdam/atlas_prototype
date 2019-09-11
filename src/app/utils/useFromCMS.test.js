import { renderHook } from '@testing-library/react-hooks'
import useFromCMS from './useFromCMS'
import { getByUrl } from '../../shared/services/api/api'
import cmsNormalizer from '../../shared/services/cms/cms-normalizer'

jest.mock('../../shared/services/api/api')
jest.mock('../../shared/services/cms/cms-normalizer')
jest.useFakeTimers()

describe('useFromCMS', () => {
  const id = 3

  const { replace } = window.location
  const mockData = {
    drupal_internal__nid: 100,
  }

  beforeEach(() => {
    Object.defineProperty(window.location, 'replace', {
      configurable: true,
    })
    window.location.replace = jest.fn()

    getByUrl.mockReturnValueOnce(Promise.resolve(mockData))
    cmsNormalizer.mockReturnValueOnce(Promise.resolve({ data: [mockData] }))
  })

  afterEach(() => {
    getByUrl.mockReset()
    cmsNormalizer.mockReset()
    window.location.replace = replace
  })

  const mockCMSconfig = {
    TEST: {
      endpoint: () => `https://test.url/api`,
      fields: ['field_slug'],
    },
  }

  it('should have correct initial values', async () => {
    const { result } = renderHook(() => useFromCMS(mockCMSconfig.TEST, id))

    expect(result.current.loading).toBe(true)
    expect(result.current.results).toBeNull()
  })

  it('should return results when fetchData is called', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFromCMS(mockCMSconfig.TEST))

    expect(result.current.loading).toBe(true)
    expect(result.current.results).toBeNull()

    // call the fetchData function
    result.current.fetchData()
    expect(getByUrl).toHaveBeenCalledWith('https://test.url/api')

    // wait until it resolves
    await waitForNextUpdate()

    expect(result.current.loading).toBe(false)
    expect(result.current.results).toEqual({ data: [mockData] })
  })

  it('should redirect to no found page when the data is not available', async () => {
    getByUrl.mockReset()
    getByUrl.mockReturnValueOnce(Promise.reject(mockData))

    const { result, waitForNextUpdate } = renderHook(() => useFromCMS(mockCMSconfig.TEST, id))
    expect(result.current.loading).toBe(true)
    expect(result.current.results).toBeNull()

    // call the fetchData function
    result.current.fetchData()
    expect(getByUrl).toHaveBeenCalledWith('https://test.url/api')

    await waitForNextUpdate()

    expect(result.current.loading).toBe(false)
    expect(result.current.results).toBeNull()
    expect(window.location.replace).toHaveBeenCalledTimes(1)
  })
})
