describe('the storage factory', function () {
  let storage
  const keys = {}
  const $windowWithoutStorage = {
    sessionStorage: {
      getItem() {
        throw new Error('getItem does not work')
      },
      setItem(key) {
        keys[key] = 'no session storage'
      },
      removeItem(key) {
        keys[key] = null
      },
    },
  }
  const $windowWithStorage = {
    sessionStorage: {
      getItem(key) {
        return keys[key]
      },
      setItem(key, value) {
        keys[key] = value
      },
      removeItem(key) {
        keys[key] = null
      },
    },
  }

  describe('the general behaviour of the storage factory', function () {
    beforeEach(function () {
      angular.mock.module('dpShared', {
        $window: $windowWithStorage,
      })
      angular.mock.inject(function (_storage_) {
        storage = _storage_
      })
    })

    it('accepts only string key values', function () {
      ;[5, true, {}].forEach((key) => {
        storage.instance.setItem(key, 'value')
        const data = storage.instance.getItem(key)
        expect(data).toBeUndefined()
        storage.instance.removeItem(key)
        expect(data).toBeUndefined()
      })
    })

    it('accepts only string values', function () {
      ;[5, true, {}].forEach((value) => {
        storage.instance.setItem('key', value)
        const data = storage.instance.getItem('key')
        expect(data).toBeNull()
        storage.instance.removeItem('key')
        expect(data).toBeNull()
      })
    })
  })

  describe('with access to sessionStorage', function () {
    beforeEach(function () {
      angular.mock.module('dpShared', {
        $window: $windowWithStorage,
      })
      angular.mock.inject(function (_storage_) {
        storage = _storage_
      })
    })

    it('can set and get an item from the storage', function () {
      ;['instance', 'session', 'local'].forEach((s) => {
        storage[s].setItem('key', 'value')
        const data = storage[s].getItem('key')

        expect(data).toBe('value')
      })
    })

    it('can delete an item from the storage', function () {
      ;['instance', 'session', 'local'].forEach((s) => {
        storage[s].setItem('key', 'value')
        storage[s].removeItem('key')
        const data = storage[s].getItem('key')

        expect(data).toBeNull()
      })
    })
  })

  describe('without access to sessionStorage', function () {
    beforeEach(function () {
      angular.mock.module('dpShared', {
        $window: $windowWithoutStorage,
      })
      angular.mock.inject(function (_storage_) {
        storage = _storage_
      })
    })

    it('can set and get an item from the storage', function () {
      ;['instance', 'session', 'local'].forEach((s) => {
        storage[s].setItem('key', 'value')
        const data = storage[s].getItem('key')

        expect(data).toBe('value')
      })
    })

    it('can delete an item from the storage', function () {
      ;['instance', 'session', 'local'].forEach((s) => {
        storage[s].setItem('key', 'value')
        storage[s].removeItem('key')
        const data = storage[s].getItem('key')

        expect(data).toBeNull()
      })
    })

    it('can store variable with same names with own values in each store', function () {
      storage.session.setItem('aap', 'noot')
      storage.instance.setItem('aap', 'mies')
      storage.local.setItem('aap', 'teun')
      expect(storage.session.getItem('aap')).toBe('noot')
      expect(storage.instance.getItem('aap')).toBe('mies')
      expect(storage.local.getItem('aap')).toBe('teun')
    })
  })
})
