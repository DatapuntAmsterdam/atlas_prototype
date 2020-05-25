import angular from 'angular'

angular.module('dpShared').factory('localization', localizationFactory)

function localizationFactory() {
  return {
    toLocaleString,
  }

  /**
   * Localizes string if feature is available in browser
   * @param  {number} number  number to localize
   * @param  {locales} locales BCP 47 language tag
   * @param  {Object} options toLocaleString options object
   * @return {string}         localized string representation of number
   */
  function toLocaleString(number, locales, options) {
    if (toLocaleStringSupportsOptions()) {
      return number.toLocaleString(locales, options)
    }
    return number
  }

  /**
   * Feature detection to check if .toLocalString supports locales and options arguments
   * @return {boolean} true if toLocalString arguments are supported
   */
  function toLocaleStringSupportsOptions() {
    // eslint-disable-next-line max-len
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#Checking_for_support_for_locales_and_options_arguments
    return Boolean(
      typeof Intl == 'object' && // eslint-disable-line eqeqeq
        Intl &&
        typeof Intl.NumberFormat == 'function', // eslint-disable-line eqeqeq
    )
  }
}
