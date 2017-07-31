describe('the storage factory', () => {
    var storage,
        keys = {},
        $windowWithoutStorage = {
            sessionStorage: {
                getItem: function (key) {throw new Error('getItem does not work');},
                setItem: function (key, value) {keys[key] = 'no session storage';},
                removeItem: function (key) {keys[key] = null;}
            }
        },
        $windowWithStorage = {
            sessionStorage: {
                getItem: function (key) {return keys[key];},
                setItem: function (key, value) {keys[key] = value;},
                removeItem: function (key) {keys[key] = null;}
            }
        };

    describe('the general behaviour of the storage factory', () => {
        beforeEach(() => {
            angular.mock.module(
                'dpShared',
                {
                    $window: $windowWithStorage
                }
            );
            angular.mock.inject(_storage_ => {
                storage = _storage_;
            });
        });

        it('accepts only string key values', () => {
            [5, true, {}].forEach(key => {
                storage.instance.setItem(key, 'value');
                const data = storage.instance.getItem(key);
                expect(data).toBeUndefined();
                storage.instance.removeItem(key);
                expect(data).toBeUndefined();
            });
        });

        it('accepts only string values', () => {
            [5, true, {}].forEach(value => {
                storage.instance.setItem('key', value);
                const data = storage.instance.getItem('key');
                expect(data).toBeNull();
                storage.instance.removeItem('key');
                expect(data).toBeNull();
            });
        });
    });

    describe('with access to sessionStorage', () => {
        beforeEach(() => {
            angular.mock.module(
                'dpShared',
                {
                    $window: $windowWithStorage
                }
            );
            angular.mock.inject(_storage_ => {
                storage = _storage_;
            });
        });

        it('can set and get an item from the storage', () => {
            ['instance', 'session', 'local'].forEach(s => {
                storage[s].setItem('key', 'value');
                const data = storage[s].getItem('key');

                expect(data).toBe('value');
            });
        });

        it('can delete an item from the storage', () => {
            ['instance', 'session', 'local'].forEach(s => {
                storage[s].setItem('key', 'value');
                storage[s].removeItem('key');
                const data = storage[s].getItem('key');

                expect(data).toBeNull();
            });
        });
    });

    describe('without access to sessionStorage', () => {
        beforeEach(() => {
            angular.mock.module(
                'dpShared',
                {
                    $window: $windowWithoutStorage
                }
            );
            angular.mock.inject(_storage_ => {
                storage = _storage_;
            });
        });

        it('can set and get an item from the storage', () => {
            ['instance', 'session', 'local'].forEach(s => {
                storage[s].setItem('key', 'value');
                const data = storage[s].getItem('key');

                expect(data).toBe('value');
            });
        });

        it('can delete an item from the storage', () => {
            ['instance', 'session', 'local'].forEach(s => {
                storage[s].setItem('key', 'value');
                storage[s].removeItem('key');
                const data = storage[s].getItem('key');

                expect(data).toBeNull();
            });
        });

        it('can store variable with same names with own values in each store', () => {
            storage.session.setItem('aap', 'noot');
            storage.instance.setItem('aap', 'mies');
            storage.local.setItem('aap', 'teun');
            expect(storage.session.getItem('aap')).toBe('noot');
            expect(storage.instance.getItem('aap')).toBe('mies');
            expect(storage.local.getItem('aap')).toBe('teun');
        });
    });
});
