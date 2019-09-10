import formatDate, { dateToString } from './date-formatter'

describe('The date formatter service', () => {
  it('turns a date instance into a date string', () => {
    const date = { toLocaleDateString: jest.fn() }
    date.toLocaleDateString.mockReturnValue('1 december 2020')
    expect(formatDate(date)).toEqual('1 december 2020')
  })

  it('uses the Dutch locale', () => {
    const date = { toLocaleDateString: jest.fn() }
    formatDate(date)
    expect(date.toLocaleDateString).toHaveBeenCalledWith('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  })

  it('only returns the requested fields', () => {
    const date = { toLocaleDateString: jest.fn() }
    formatDate(date, false, false)
    expect(date.toLocaleDateString).toHaveBeenCalledWith('nl-NL', {
      year: 'numeric',
    })
  })

  it('returns aan emty string wehn the date is not valid', () => {
    expect(dateToString('invalid date')).toEqual('')
    expect(dateToString()).toEqual('')
  })

  it('uses the Dutch locale to convert date to string', () => {
    const date = new Date('2018-02-01')
    expect(dateToString(date)).toEqual('01-02-2018')
  })
})
