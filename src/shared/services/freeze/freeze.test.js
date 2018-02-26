import deepFreeze from './freeze';

it('it freezes nested objects', () => {
  const obj = {
    prop() {},
    foo: 'bar',
    nested: {
      abc: 'xyz'
    }
  };

  deepFreeze(obj);

  expect(Object.isFrozen(obj)).toBe(true);
  expect(Object.isFrozen(obj.nested)).toBe(true);

  expect(() => obj.foo = 'sparky').toThrow(TypeError); // eslint-disable-line no-return-assign

  expect(() => delete obj.foo).toThrow(TypeError); // eslint-disable-line no-return-assign

  expect(() => obj.qwerty = 'asdf').toThrow(TypeError); // eslint-disable-line no-return-assign
});
