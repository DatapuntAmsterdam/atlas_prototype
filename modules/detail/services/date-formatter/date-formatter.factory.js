import angular from 'angular'
import dateFormatter from '../../../../src/detail/services/date-formatter/date-formatter'

angular.module('dpDetail').factory('dateFormatter', dateFormatterFactory)

function dateFormatterFactory() {
  return dateFormatter
}
