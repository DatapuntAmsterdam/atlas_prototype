import angular from 'angular'

angular.module('dpDetail').factory('dateConverter', dateConverterFactory)

dateConverterFactory.$inject = ['d3']

function dateConverterFactory(d3) {
  return {
    ymdToDate,
  }

  function ymdToDate(input) {
    const parseDate = d3.time.format('%Y-%m-%d').parse

    return parseDate(input)
  }
}
