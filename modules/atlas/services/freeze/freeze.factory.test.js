describe('The environment factory', () => {
    let freeze;

    beforeEach(() => {
        angular.mock.module('atlas');

        angular.mock.inject(_freeze_ => {
            freeze = _freeze_;
        });
    });

    it('it freezes nested objects', () => {
        const obj = {
            prop: function () {},
            foo: 'bar',
            nested: {
                abc: 'xyz'
            }
        };

        freeze.deepFreeze(obj);

        expect(Object.isFrozen(obj)).toBe(true);
        expect(Object.isFrozen(obj.nested)).toBe(true);

        expect(() => obj.foo = 'sparky').toThrow(
            new TypeError('Attempted to assign to readonly property.')
        );
        expect(() => delete obj.foo).toThrow(
            new TypeError('Unable to delete property.')
        );
        expect(() => obj.qwerty = 'asdf').toThrow(
            new TypeError('Attempted to assign to readonly property.')
        );
    });
});
