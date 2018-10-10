import shallowCompare from './shallowCompare';

describe('shallowCompare', () => {
  it('should return true if the objects are shallow equal', () => {
    expect(shallowCompare({ foo: 'bar' }, { foo: 'bar' })).toBe(true);
    expect(shallowCompare({ foo: 'bar', baz: 'xxx' }, { foo: 'bar', baz: 'xxx' })).toBe(true);
    expect(shallowCompare({ }, { })).toBe(true);
  });

  it('should return false if the objects are not shallow equal', () => {
    expect(shallowCompare({ foo: 'bar', baz: {} }, { foo: 'bar', baz: {} })).toBe(false);
    expect(shallowCompare({ foo: 'bar', baz: [] }, { foo: 'bar', baz: [] })).toBe(false);
    expect(shallowCompare({ foo: 'bar' }, { foo: 'baz' })).toBe(false);
  });
});
