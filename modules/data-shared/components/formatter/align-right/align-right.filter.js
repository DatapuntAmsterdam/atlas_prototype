(function () {
    'use strict';

    angular
        .module('dpDataShared')
        .filter('alignRight', alignRightFilter);

    alignRightFilter.$inject = ['$document'];

    function alignRightFilter ($document) {
        return function (input) {
            let div = $document[0].createElement('div');

            div.setAttribute('class', 'u-align--right');
            div.innerText = input;

            return div.outerHTML;
        };
    }
})();
