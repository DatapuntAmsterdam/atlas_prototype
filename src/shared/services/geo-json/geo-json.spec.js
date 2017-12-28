import getCenter from './geo-json';

describe('The geo json service', () => {
  it('returns the coordinates of a point', () => {
    expect(getCenter({ type: 'Point', coordinates: [1, 2] })).toEqual({ x: 1, y: 2 });
    expect(getCenter({ type: 'Point', coordinates: [3.5, 19.1469] })).toEqual({ x: 3.5, y: 19.1469 });
  });

  it('calculates the center of a shape', () => {
    expect(getCenter({ type: 'Polygon', coordinates: [[1, 2], [2, 2], [2, 1], [1, 1]] })).toEqual({ x: 1.5, y: 1.5 });
  });

  it('works recursively', () => {
    expect(getCenter({ type: 'Polygon', coordinates: [[[1, 2], [2, 2]], [[2, 1], [1, 1]]] })).toEqual({ x: 1.5, y: 1.5 });
  });
});
