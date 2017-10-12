import queryStringParser from './query-string-parser';

describe('The query string parser service', function () {
  it('turns a query string into an object', () => {
    expect(
      queryStringParser('?a=b&one=1&bool=false')
    ).toEqual({
      a: 'b',
      one: '1',
      bool: 'false'
    });
  });

  it('ignores the first character', () => {
    expect(
      queryStringParser('/a=b&one=1&bool=false')
    ).toEqual({
      a: 'b',
      one: '1',
      bool: 'false'
    });
  });

  it('decodes keys and values', () => {
    expect(
      queryStringParser('?a=b%20c&one%2Ftwo=12')
    ).toEqual({
      a: 'b c',
      'one/two': '12'
    });
  });

  it('can handle equal-signs in a value', () => {
    expect(
      queryStringParser('?a=b=c&one=12==&two=&three==&four===44')
    ).toEqual({
      a: 'b=c',
      one: '12==',
      two: '',
      three: '=',
      four: '==44'
    });
  });
});
