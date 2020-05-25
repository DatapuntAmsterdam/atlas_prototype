import { DEFAULT_LOCALE } from '../../config/locale.config'

/**
 * Converts a date object to a Dutch date string.
 *
 * E.g.: `2020-12-01` => '1 januari 2020'
 *
 * @param {Date} date The Date instance.
 * @returns {string} The Dutch date string.
 */
export default function formatDate(date, day = true, month = true, year = true) {
  return (
    date &&
    date.toLocaleDateString(DEFAULT_LOCALE, {
      ...(day && { day: 'numeric' }),
      ...(month && { month: 'long' }),
      ...(year && { year: 'numeric' }),
    })
  )
}

function isValidDate(date) {
  return (
    date && Object.prototype.toString.call(date) === '[object Date]' && !Number.isNaN(Number(date))
  )
}

export function dateToString(date) {
  if (!isValidDate(date)) return ''
  const day = `0${date.getDate()}`.slice(-2)
  const month = `0${date.getMonth() + 1}`.slice(-2)
  return date && `${day}-${month}-${date.getFullYear()}`
}
