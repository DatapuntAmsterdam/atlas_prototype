import { renderHook } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'
import { v4 as uuid } from 'uuid'
import useUniqueId from './useUniqueId'

jest.mock('uuid')

const MOCK_UUID = '1111-2222-3333-4444'
const mockedUuid = mocked(uuid)

describe('useUniqueId', () => {
  beforeEach(() => {
    mockedUuid.mockReturnValue(MOCK_UUID)
  })

  afterEach(() => {
    mockedUuid.mockReset()
  })

  it('should generate a unique id without a prefix', () => {
    const { result } = renderHook(() => useUniqueId())
    expect(result.current).toEqual(MOCK_UUID)
  })

  it('should generate a unique id with a prefix', () => {
    const prefix = 'foo'
    const { result } = renderHook(() => useUniqueId(prefix))

    expect(result.current).toEqual(`${prefix}-${MOCK_UUID}`)
  })

  it('should cache generated id between renders', () => {
    mockedUuid.mockReturnValueOnce('THE-FIRST-ID')

    const { result, rerender } = renderHook(() => useUniqueId())
    const firstValue = result.current

    mockedUuid.mockReturnValueOnce('THE-LAST-ID')
    rerender()

    expect(result.current).toEqual(firstValue)
  })

  it('should update the generated id when the prefix changes', () => {
    mockedUuid.mockReturnValueOnce('THE-FIRST-ID')

    let prefix = 'first-prefix'
    const { result, rerender } = renderHook(() => useUniqueId(prefix))

    expect(result.current).toEqual('first-prefix-THE-FIRST-ID')

    mockedUuid.mockReturnValueOnce('THE-LAST-ID')
    prefix = 'last-prefix'
    rerender()

    expect(result.current).toEqual('last-prefix-THE-LAST-ID')
  })
})
