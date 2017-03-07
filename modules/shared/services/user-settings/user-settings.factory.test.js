describe('the user settings factory', function () {
    const GET_ITEM_VALUE = 'value';

    let userSettings,
        storage;

    beforeEach(function () {
        var storageMethods = {
            value: null,
            setItem: () => this.value = GET_ITEM_VALUE,
            getItem: () => this.value,
            removeItem: () => this.value = null
        };

        angular.mock.module(
            'dpShared',
            {
                storage: {
                    instance: angular.copy(storageMethods),
                    session: angular.copy(storageMethods),
                    local: angular.copy(storageMethods)
                }
            }
        );

        angular.mock.inject(function (_userSettings_, _storage_) {
            userSettings = _userSettings_;
            storage = _storage_;
        });

        [storage.instance, storage.session, storage.local]
            .forEach(s => ['setItem', 'getItem', 'removeItem']
                .forEach(m => spyOn(s, m).and.callThrough()
            ));
    });

    it('stores settings in the corresponding storage', function () {
        [
            {key: 'token', type: 'session', whenNoValue: undefined},
            {key: 'fullscreenStraatbeeld', type: 'local', whenNoValue: true.toString()}
        ].forEach(({key, type, whenNoValue}) => {
            let value;
            // Remove value
            userSettings[key].remove();
            expect(storage[type].removeItem).toHaveBeenCalledWith(key);
            value = userSettings[key].value;
            // Default value
            expect(value).toBe(whenNoValue);
            // Set value
            value = 'aap';
            userSettings[key].value = value;
            expect(storage[type].setItem).toHaveBeenCalledWith(key, value);
            // Get value
            value = userSettings[key].value;
            expect(storage[type].getItem).toHaveBeenCalledWith(key);
            expect(value).toBe(GET_ITEM_VALUE);
        });
    });
});
