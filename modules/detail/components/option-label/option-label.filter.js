import angular from 'angular'
import isDefined from '../../../../src/shared/services/is-defined'

angular.module('dpDetail').filter('optionLabel', optionLabelFilter)

function optionLabelFilter() {
  return function (input, list, namespace) {
    // returns the label of an option from an option list
    // the list array elements contain at least the id and label properties
    const prefix = isDefined(namespace) ? `${namespace}:` : ''
    const index = list && list.findIndex((item) => prefix + item.id === input)
    return index > -1 ? list[index].label : input
  }
}
