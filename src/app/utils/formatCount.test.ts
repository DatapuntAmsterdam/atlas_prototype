import { DEFAULT_LOCALE } from '../../shared/config/locale.config'
import formatCount from './formatCount'

describe('formatCount', () => {
  const originalToLocaleString = Number.prototype.toLocaleString
  let toLocaleStringMock: jest.Mock

  beforeEach(() => {
    toLocaleStringMock = jest.fn()
    // eslint-disable-next-line no-extend-native
    Number.prototype.toLocaleString = toLocaleStringMock
  })

  afterEach(() => {
    // eslint-disable-next-line no-extend-native
    Number.prototype.toLocaleString = originalToLocaleString
  })

  it('should call toLocaleString with the correct parameters', () => {
    toLocaleStringMock.mockReturnValueOnce('10')

    const result = formatCount(10, { currency: 'foo' }, 'test')

    expect(toLocaleStringMock).toBeCalledWith('test', { currency: 'foo' })
    expect(result).toEqual('10')
  })

  it('should call toLocaleString with default locale', () => {
    toLocaleStringMock.mockReturnValueOnce('10')

    formatCount(10)

    expect(toLocaleStringMock).toBeCalledWith(DEFAULT_LOCALE, undefined)
  })
})
