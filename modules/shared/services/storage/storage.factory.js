(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('storage', storageFactory);

    storageFactory.$inject = ['$window'];

    function storageFactory ($window) {
        let storageAvailable = testStorage(),
            keys = {};

        return {
            setItem,
            getItem,
            removeItem
        };

        function testStorage () {
            try {
                $window.sessionStorage.setItem('test', 'testvalue');
                let data = $window.sessionStorage.getItem('test');
                $window.sessionStorage.removeItem('test');

                return data === 'testvalue';
            } catch (e) {
                return false;
            }
        }

        function setItem (key, value) {
            if (storageAvailable) {
                $window.sessionStorage.setItem(key, value);
            } else {
                keys[key] = value;
            }
        }

        function getItem (key) {
            if (storageAvailable) {
                return $window.sessionStorage.getItem(key);
            } else {
                return keys[key];
            }
        }

        function removeItem (key) {
            if (storageAvailable) {
                $window.sessionStorage.removeItem(key);
            } else {
                delete keys[key];
            }
        }
    }
})();
