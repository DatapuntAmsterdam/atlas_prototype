import { DEFAULT_LOCALE } from '../../shared/config/locale.config'

const defaultOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}

/**
 * Format a date object or date string to a human-readable version.
 *
 * @param date The date to format.
 * @param options The options for formatting the date, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat.
 */
export default function formatDate(date: Date, options = defaultOptions) {
  return date.toLocaleDateString(DEFAULT_LOCALE, options)
}
