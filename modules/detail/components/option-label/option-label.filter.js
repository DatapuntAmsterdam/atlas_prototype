(function () {
    'use strict';

    angular
        .module('dpDetail')
        .filter('optionLabel', optionLabelFilter);

    function optionLabelFilter () {
        return function (input, list, namespace) {
            // returns the label of an option from a option list
            // the list array elements contain at list id and label properties
            let prefix = '';
            if (angular.isDefined(namespace)) prefix = `${namespace}:`;
            const index = list.findIndex((item) => (prefix + item.id) === input);
            if (index > -1) {
                return list[index].label;
            } else {
                return input;
            }
        };
    }
})();
