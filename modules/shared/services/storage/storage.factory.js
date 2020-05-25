import angular from 'angular'

angular.module('dpShared').factory('storage', storageFactory)

storageFactory.$inject = ['$window', 'InstanceStorage']

function storageFactory($window, InstanceStorage) {
  // The storage types that is available to the application are:
  // - instance (variables are only available to the current application instance, does not survive a refresh
  // - session (variables are only available to the session, survive a refresh)
  // - local (variables are shared between browser tabs and windows
  // - server (variables are shared between all browsers, not (yet) implemented)

  /**
   * The Storage takes a storageProvider, test if the provider is available, and then uses
   * the provider to store key value combinations
   * If the provider is not available then a new InstanceStorage is created to store the key value combinations
   */
  class Storage {
    constructor(provider) {
      /**
       * Test the provider for validity and return the provider if valid, else return a new InstanceStorage
       * @param storageProvider
       * @returns {Object} a valid storage provider
       * @private
       */
      function _getStorage(storageProvider) {
        let isAvailable
        try {
          storageProvider.setItem('test', 'testvalue')
          const data = storageProvider.getItem('test')
          storageProvider.removeItem('test')
          isAvailable = data === 'testvalue'
        } catch (e) {
          isAvailable = false
        }
        return isAvailable ? storageProvider : new InstanceStorage()
      }

      this._provider = _getStorage(provider)
    }

    /**
     * When passed a key name and value,
     * will add that key to the storage, or update that key's value if it already exists.
     * @param {String} key A string containing the name of the key you want to create/update
     * @param {String} value The value you want to give the key you are creating/updating
     */
    setItem(key, value) {
      if (angular.isString(key) && angular.isString(value)) {
        this._provider.setItem(key, value)
      }
    }

    /**
     * When passed a key name, will return that key's value.
     * @param {String} key A string containing the name of the key you want to retrieve the value of.
     * @returns {String} value
     */
    getItem(key) {
      if (angular.isString(key)) {
        return this._provider.getItem(key)
      }
    }

    /**
     * When passed a key name, will remove that key from the storage
     * @param {String} key A string containing the name of the key you want to remove.
     */
    removeItem(key) {
      if (angular.isString(key)) {
        this._provider.removeItem(key)
      }
    }
  }

  return {
    instance: new Storage(new InstanceStorage()),
    session: new Storage($window.sessionStorage),
    local: new Storage($window.localStorage),
  }
}
