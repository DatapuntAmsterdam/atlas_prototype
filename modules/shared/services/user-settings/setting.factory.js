((() => {
    'use strict';

    angular
        .module('dpShared')
        .factory('Setting', SettingFactory);

    function SettingFactory () {
        class Setting {
            /**
             * @param {String} key the name of the setting
             * @param {storage} storageProvider the storage where to store its value
             * @param {String} defaultValue the default value to return when no value is available
             */
            constructor (key, storageProvider, defaultValue) {
                this._key = key;
                this._storage = storageProvider;
                this._defaultValue = defaultValue;
            }
            set value (value) {
                this._storage.setItem(this._key, value);
            }
            get value () {
                const keyValue = this._storage.getItem(this._key);
                return keyValue === null ? this._defaultValue : keyValue;
            }
            remove () {
                this._storage.removeItem(this._key);
            }
        }

        return Setting;
    }
}))();
