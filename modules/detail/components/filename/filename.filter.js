import angular from 'angular'

angular.module('dpDetail').filter('filename', filenameFilter)

function filenameFilter() {
  return function (input) {
    const parts = input.split('/')

    const lastPart = parts[parts.length - 1]

    // Check if the end of the string matches with a dot followed by 3 or 4 letters
    if (lastPart.match(/\.[a-z|A-Z]{3,4}$/)) {
      return lastPart
    }
    return input
  }
}
