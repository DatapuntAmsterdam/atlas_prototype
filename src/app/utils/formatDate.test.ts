import { DEFAULT_LOCALE } from '../../shared/config/locale.config'
import formatDate from './formatDate'

describe('formatDate', () => {
  it('formats a date', () => {
    const toLocaleDateStringMock = jest.fn()
    const date = { toLocaleDateString: toLocaleDateStringMock }

    toLocaleDateStringMock.mockReturnValue('1 december 2020')

    expect(formatDate((date as unknown) as Date)).toEqual('1 december 2020')
  })

  it('passes the default locale and options', () => {
    const date = { toLocaleDateString: jest.fn() }

    formatDate((date as unknown) as Date)

    expect(date.toLocaleDateString).toHaveBeenCalledWith(DEFAULT_LOCALE, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  })

  it('passes custom formatting options', () => {
    const date = { toLocaleDateString: jest.fn() }
    const formattingOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
    }

    formatDate((date as unknown) as Date, formattingOptions)

    expect(date.toLocaleDateString).toHaveBeenCalledWith(DEFAULT_LOCALE, formattingOptions)
  })
})
