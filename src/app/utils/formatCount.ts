import { DEFAULT_LOCALE } from '../../shared/config/locale.config'

/**
 * Format a number in a user-readable format.
 *
 * @param count The number to format.
 * @param locale The locale to format the number in, defaults to `nl-NL`.
 */
export default function formatCount(
  count: number,
  options?: Intl.NumberFormatOptions,
  locale = DEFAULT_LOCALE,
) {
  return count.toLocaleString(locale, options)
}
