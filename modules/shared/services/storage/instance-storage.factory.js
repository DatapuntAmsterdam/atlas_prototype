import angular from 'angular'
import isDefined from '../../../../src/shared/services/is-defined'

angular.module('dpShared').factory('InstanceStorage', InstanceStorageFactory)

function InstanceStorageFactory() {
  /**
   * The InstanceStorage stores key value combinations in a private object
   * The lifetime of the key value combinations is the lifetime of the factory
   */
  class InstanceStorage {
    constructor() {
      this._keys = {}
    }

    /**
     * When passed a key name and value,
     * will add that key to the storage, or update that key's value if it already exists.
     * @param {String} key A string containing the name of the key you want to create/update
     * @param {String} value The value you want to give the key you are creating/updating
     */
    setItem(key, value) {
      this._keys[key] = value
    }

    /**
     * When passed a key name, will return that key's value.
     * The behaviour of sessionStorage and localStorage is mimicked to return null for undefined keys
     * @param {String} key A string containing the name of the key you want to retrieve the value of.
     * @returns {String} value
     */
    getItem(key) {
      const value = this._keys[key]
      return isDefined(value) ? value : null
    }

    /**
     * When passed a key name, will remove that key from the storage
     * @param {String} key A string containing the name of the key you want to remove.
     */
    removeItem(key) {
      delete this._keys[key]
    }
  }

  return InstanceStorage
}
