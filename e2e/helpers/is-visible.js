'use strict';

module.exports = function (mainComponent) {
    return function () {
        return mainComponent.getAttribute('class').then(function (className) {
            return className.match(/ng-hide/) === null;
        });
    };
};
