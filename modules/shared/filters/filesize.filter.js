import angular from 'angular'
import { DEFAULT_LOCALE } from '../../../src/shared/config/locale.config'

const precision = 1 // single decimal
const base = 1024
const log1024 = Math.log(base)
const cutOff = 0.1 * 1024 * 1024 // 0.1 MB
const units = ['bytes', 'KB', 'MB', 'GB', 'TB'] // bytes and KB units not used
const smallestUnit = 2 // index of units, === 'MB'
const largestUnit = units.length - 1 // index of units, === 'TB'

angular.module('dpShared').filter('filesize', filesizeFilter)

filesizeFilter.$inject = ['localization']

function filesizeFilter(localization) {
  return (bytes) => {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-'
    if (bytes < cutOff) {
      return '< 0,1 MB'
    }

    let power = Math.floor(Math.log(bytes) / log1024)

    // Use MB as smallest unit
    // e.g.: Change 200 KB to 0.2 MB
    power = Math.max(power, smallestUnit)

    // Do not exceed highest unit
    power = Math.min(power, largestUnit)

    const number = (bytes / Math.pow(base, power)).toFixed(precision)
    return `${localization.toLocaleString(number, DEFAULT_LOCALE)} ${units[power]}`
  }
}
