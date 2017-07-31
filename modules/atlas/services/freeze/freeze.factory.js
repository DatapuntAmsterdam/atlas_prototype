((() => {
    'use strict';

    angular
        .module('atlas')
        .factory('freeze', freezeFactory);

    function freezeFactory () {
        return {
            deepFreeze
        };

        //
        // Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
        // When packager is available (WebPack), consider switching to https://github.com/buunguyen/redux-freeze
        // TODO: tg 4069
        //
        function deepFreeze (obj) {
            // Retrieve the property names defined on obj
            var propNames = Object.getOwnPropertyNames(obj);

            // Freeze properties before freezing self
            propNames.forEach(name => {
                var prop = obj[name];

                // Freeze prop if it is an object
                if (angular.isObject(prop) && prop !== null) {deepFreeze(prop);}
            });

            // Freeze self (no-op if already frozen)
            return Object.freeze(obj);
        }
    }
}))();
