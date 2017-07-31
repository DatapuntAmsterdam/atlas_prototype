((() => {
    'use strict';

    angular
        .module('dpShared')
        .factory('userSettings', userSettingsFactory);

    userSettingsFactory.$inject = ['USER_SETTINGS', 'storage', 'Setting'];

    function userSettingsFactory (USER_SETTINGS, storage, Setting) {
        /**
         * Return a setting for each key
         * This allows for compile time checking of settings and prevents:
         * - magic strings  eg userSettings.set('token', ...)
         * - constant definitions, eg userSettingsConstants = { 'token': ... }
         * - runtime checks eg if angular.isString(key)...
         */
        return Object.keys(USER_SETTINGS).reduce((result, key) => {
            result[key] = new Setting(
                key,
                storage[USER_SETTINGS[key].storage],
                USER_SETTINGS[key].default
            );
            return result;
        }, {});
    }
}))();
