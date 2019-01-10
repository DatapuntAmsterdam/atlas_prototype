import ParamsRegistery from './paramRegistry';

describe('ParamsRegistery singleton', () => {
  let paramsRegistry;

  beforeEach(() => {
    paramsRegistry = new ParamsRegistery();
  });

  describe('Result object', () => {
    it('should return an object with a parameter and 2 routes, each bound to a reducer', () => {
      paramsRegistry
        .addParameter('map', (routes) => {
          routes
            .add('/bar', 'reducerKey', 'foo', {
              decode: jest.fn(),
              encode: jest.fn()
            })
            .add('/foo/bar', 'dataSearch', 'bar');
        });

      const result = paramsRegistry.result;

      const expectation = {
        map: {
          routes: {
            '/bar': {
              decode: jest.fn(),
              encode: jest.fn(),
              reducerKey: 'reducerKey',
              stateKey: 'foo',
              addHistory: true
            },
            '/foo/bar': {
              decode: (val) => val,
              encode: (val) => val,
              reducerKey: 'dataSearch',
              stateKey: 'bar',
              addHistory: true
            }
          }
        }
      };
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectation));
    });

    it('should return an object with 2 parameters with each one route, each bound to a reducer', () => {
      const result = paramsRegistry
        .addParameter('map', (routes) => {
          routes.add('/bar', 'reducerKey', 'foo', {}, false);
        })
        .addParameter('foobar', (routes) => {
          routes.add('/foo', 'reducerKey', 'foo');
        }).result;

      const expectation = {
        map: {
          routes: {
            '/bar': {
              decode: (val) => val,
              encode: (val) => val,
              reducerKey: 'reducerKey',
              stateKey: 'foo',
              addHistory: false
            }
          }
        },
        foobar: {
          routes: {
            '/foo': {
              decode: (val) => val,
              encode: (val) => val,
              reducerKey: 'reducerKey',
              stateKey: 'foo',
              addHistory: true
            }
          }
        }
      };
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectation));
    });

    it('should also accept an array of routes', () => {
      const result = paramsRegistry
        .addParameter('map', (routes) => {
          routes.add(['/bar', '/foo'], 'reducerKey', 'foo', {}, true);
        }).result;
      expect(Object.keys(result.map.routes)).toEqual(['/bar', '/foo']);
    });
  });

  describe('Errors', () => {
    it('should throw an error when there is a duplicate parameter', () => {
      expect(() => paramsRegistry
        .addParameter('map', (routes) => {
          routes.add('/bar', 'reducerKey', 'foo');
        })
        .addParameter('map', (routes) => {
          routes.add('/bara', 'reducerKey2', 'bar');
        })).toThrow('Parameter is already registered: map');
    });

    it('should throw an error when there is a duplicate route', () => {
      expect(() => paramsRegistry
        .addParameter('map', (routes) => {
          routes
            .add('/bar', 'reducerKey', 'foo')
            .add('/bar', 'reducerKey2', 'bar');
        })).toThrow('Route is already registered for parameter "map" with route "/bar"');
    });
  });

  describe('setQueriesFromState method', () => {
    beforeEach(() => {
      paramsRegistry
        .addParameter('map', (routes) => {
          routes
            .add('ROUTER/bar', 'reducerKey', 'foo', {
              defaultValue: '123'
            }, false)
            .add('ROUTER/foo', 'reducerKey2', 'foo');
        })
        .addParameter('anotherParam', (routes) => {
          routes
            .add('ROUTER/bar', 'reducerKey', 'bar', {
              defaultValue: '321'
            });
        });

      paramsRegistry.separateHistory = {
        replace: jest.fn(),
        push: jest.fn()
      };
    });
    it('should call history.replace with the right querystring', () => {
      const state = { reducerKey2: { foo: 'hello!' } };
      paramsRegistry.setQueriesFromState('ROUTER/foo', state);
      expect(paramsRegistry.separateHistory.push).toHaveBeenCalledWith('/?map=hello!');
    });

    it('should call history.push with the right querystring', () => {
      const state = { reducerKey: { foo: 'hello!' } };
      paramsRegistry.setQueriesFromState('ROUTER/bar', state);
      expect(paramsRegistry.separateHistory.replace).toHaveBeenCalledWith('/?map=hello!');
    });

    it('should not set the query if the general defaultValue is set and equal to the encoded value', () => {
      const state = { reducerKey: { foo: '123', bar: 'bla' } };
      paramsRegistry.setQueriesFromState('ROUTER/bar', state);
      expect(paramsRegistry.separateHistory.replace).toHaveBeenCalledWith('/?anotherParam=bla');
    });

    it('should not set the query if the defaultValue per route is set and equal to the encoded value', () => {
      const state = { reducerKey: { foo: '1234', bar: '321' } };
      paramsRegistry.setQueriesFromState('ROUTER/bar', state);
      expect(paramsRegistry.separateHistory.replace).toHaveBeenCalledWith('/?map=1234');
    });
  });

  describe('getStateFromQueries method', () => {
    beforeEach(() => {
      paramsRegistry
        .addParameter('map', (routes) => {
          routes
            .add('ROUTER/bar', 'reducerKey', 'foo')
            .add('ROUTER/foo', 'reducerKey2', 'foo');
        })
        .addParameter('page', (routes) => {
          routes
            .add('ROUTER/bar', 'reducerKey3', 'pageNumber', {
              decode: jest.fn()
            })
            .add('ROUTER/foo', 'reducerKey4', 'fooBar');
        });
    });

    it('should return the state from the action\'s query when on right route in the right reducer', () => {
      expect(paramsRegistry.getStateFromQueries('reducerKey', {
        type: 'ROUTER/bar',
        meta: { query: { map: '123' } }
      })).toEqual({ foo: '123' });

      expect(paramsRegistry.getStateFromQueries('reducerKey4', {
        type: 'ROUTER/foo',
        meta: { query: { page: 1 } }
      })).toEqual({ fooBar: 1 });
    });

    it('should return an empty object when reducer or route don\'t match', () => {
      expect(paramsRegistry.getStateFromQueries('reducerKey3', {
        type: 'ROUTER/bar',
        meta: { query: { map: '123' } }
      })).toEqual({});

      expect(paramsRegistry.getStateFromQueries('reducerKey4', {
        type: 'ROUTER/baz',
        meta: { query: { page: 1 } }
      })).toEqual({});
    });

    it('should call the decode method when it is a match', () => {
      const decodeMock = jest.fn();
      paramsRegistry.addParameter('fu', (routes) => {
        routes
          .add('ROUTER/foo', 'reducerKey4', 'fooBar', {
            decode: decodeMock
          });
      }).getStateFromQueries('reducerKey4', {
        type: 'ROUTER/foo',
        meta: { query: { fu: 'bar' } }
      });
      expect(decodeMock).toHaveBeenCalled();
    });
  });

  describe('reducer settings passed to the route', () => {
    it('should throw an error if reducerKey or stateKey is not given', () => {
      expect(() => paramsRegistry
        .addParameter('foo', (routes) => {
          routes
            .add('/bar');
        })).toThrow('Param "foo" with route "/bar" must contain a reducerKey and stateKe');

      expect(() => paramsRegistry
        .addParameter('foo', (routes) => {
          routes
            .add('/bar', 'reducerKey');
        })).toThrow('Param "foo" with route "/bar" must contain a reducerKey and stateKe');
    });

    it('should not throw an error when reducerKey and stateKey are set', () => {
      expect(() => paramsRegistry
        .addParameter('foo', (routes) => {
          routes
            .add('/bar', 'reducerKey', 'stateKey');
        })).not.toThrow();
    });

    it('should throw an error when an key is set that is other than the allowed keys', () => {
      expect(() => paramsRegistry
        .addParameter('foo', (routes) => {
          routes
            .add('/bar', 'reducerKey', 'stateKey', {
              foo: 'reducerKey'
            });
        })).toThrow('Key given to reducer settings is not allowed: "foo"');
    });
  });
});
