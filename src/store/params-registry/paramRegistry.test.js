/**
 * @jest-environment jsdom-global
 */

import ParamsRegistry from './paramRegistry'

describe('ParamsRegistry singleton', () => {
  let paramsRegistry

  beforeEach(() => {
    ParamsRegistry.destroy()
    paramsRegistry = new ParamsRegistry()
  })

  Object.defineProperty(window.location, 'location', {
    writable: true,
    value: '?njakns=famk&snakjs=2',
  })

  describe('Result object', () => {
    it('should return an object with a parameter and 2 routes, each bound to a reducer', () => {
      paramsRegistry.addParameter('map', (routes) => {
        routes
          .add('/bar', 'reducerKey', 'foo', {
            decode: jest.fn(),
            encode: jest.fn(),
          })
          .add('/foo/bar', 'dataQuerySearch', 'bar')
      })

      const { result } = paramsRegistry

      const expectation = {
        map: {
          routes: {
            '/bar': {
              decode: jest.fn(),
              encode: jest.fn(),
              reducerKey: 'reducerKey',
              stateKey: 'foo',
              addHistory: true,
            },
            '/foo/bar': {
              decode: (val) => val,
              encode: (val) => val,
              reducerKey: 'dataQuerySearch',
              stateKey: 'bar',
              addHistory: true,
            },
          },
        },
      }
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectation))
    })

    it('should return an object with 2 parameters with each one route, each bound to a reducer', () => {
      const { result } = paramsRegistry
        .addParameter('map', (routes) => {
          routes.add('/bar', 'reducerKey', 'foo', {}, false)
        })
        .addParameter('foobar', (routes) => {
          routes.add('/foo', 'reducerKey', 'foo')
        })

      const expectation = {
        map: {
          routes: {
            '/bar': {
              decode: (val) => val,
              encode: (val) => val,
              reducerKey: 'reducerKey',
              stateKey: 'foo',
              addHistory: false,
            },
          },
        },
        foobar: {
          routes: {
            '/foo': {
              decode: (val) => val,
              encode: (val) => val,
              reducerKey: 'reducerKey',
              stateKey: 'foo',
              addHistory: true,
            },
          },
        },
      }
      expect(JSON.stringify(result)).toEqual(JSON.stringify(expectation))
    })

    it('should also accept an array of routes', () => {
      const { result } = paramsRegistry.addParameter('map', (routes) => {
        routes.add(['/bar', '/foo'], 'reducerKey', 'foo', {}, true)
      })
      expect(Object.keys(result.map.routes)).toEqual(['/bar', '/foo'])
    })
  })

  describe('static orderQuery', () => {
    it('should return an object with keys in alphabetical order', () => {
      const result = JSON.stringify(ParamsRegistry.orderQuery({ h: 3, a: 1, c: 2 }))
      const expectation = JSON.stringify({ a: 1, c: 2, h: 3 })
      expect(result).toMatch(expectation)
    })
  })

  describe('Errors', () => {
    it('should throw an error when there is a duplicate parameter', () => {
      expect(() =>
        paramsRegistry
          .addParameter('map', (routes) => {
            routes.add('/bar', 'reducerKey', 'foo')
          })
          .addParameter('map', (routes) => {
            routes.add('/bara', 'reducerKey2', 'bar')
          }),
      ).toThrow('Parameter is already registered: map')
    })

    it('should throw an error when there is a duplicate route', () => {
      expect(() =>
        paramsRegistry.addParameter('map', (routes) => {
          routes.add('/bar', 'reducerKey', 'foo').add('/bar', 'reducerKey2', 'bar')
        }),
      ).toThrow('Route is already registered for parameter "map" with route "/bar"')
    })
  })

  describe('setQueriesFromState method', () => {
    beforeEach(() => {
      paramsRegistry
        .addParameter('map', (routes) => {
          routes
            .add(
              'ROUTER/bar',
              'reducerKey',
              'foo',
              {
                defaultValue: 123,
              },
              false,
            )
            .add('ROUTER/foo', 'reducerKey2', 'foo')
        })
        .addParameter('anotherParam', (routes) => {
          routes.add('ROUTER/bar', 'reducerKey', 'bar', {
            defaultValue: 321,
          })
        })

      paramsRegistry.history = {
        replace: jest.fn(),
        push: jest.fn(),
      }
    })

    const getResult = (state, route = 'ROUTER/bar') => {
      paramsRegistry.setQueriesFromState(route, state, {
        type: 'OTHER_TYPE_THAN_ROUTE/bazz',
      })
    }

    it('should call history.push with the right querystring', () => {
      getResult({ reducerKey: { foo: 'hello!' } })
      expect(paramsRegistry.history.replace).toHaveBeenCalledWith('/?map=hello!')
    })

    it('should return undefined if action type is not a route', () => {
      const result = paramsRegistry.setQueriesFromState(
        'ROUTER/bar',
        {},
        {
          type: 'ROUTER/bazz',
        },
      )

      expect(result).toBeUndefined()
    })
  })

  describe('getStateFromQueries method', () => {
    beforeEach(() => {
      paramsRegistry
        .addParameter('map', (routes) => {
          routes.add('ROUTER/bar', 'reducerKey', 'foo').add('ROUTER/foo', 'reducerKey2', 'foo')
        })
        .addParameter('page', (routes) => {
          routes
            .add('ROUTER/bar', 'reducerKey3', 'pageNumber', {
              decode: jest.fn(),
            })
            .add('ROUTER/foo', 'reducerKey4', 'fooBar')
        })
    })

    it("should return the state from the action's query when on right route in the right reducer", () => {
      expect(
        paramsRegistry.getStateFromQueries('reducerKey', {
          type: 'ROUTER/bar',
          meta: { query: { map: '123' } },
        }),
      ).toEqual({ foo: 123 })

      expect(
        paramsRegistry.getStateFromQueries('reducerKey4', {
          type: 'ROUTER/foo',
          meta: { query: { page: 1 } },
        }),
      ).toEqual({ fooBar: 1 })
    })

    it("should return an empty object when reducer or route don't match", () => {
      expect(
        paramsRegistry.getStateFromQueries('reducerKey3', {
          type: 'ROUTER/bar',
          meta: { query: { map: 123 } },
        }),
      ).toEqual({})

      expect(
        paramsRegistry.getStateFromQueries('reducerKey4', {
          type: 'ROUTER/baz',
          meta: { query: { page: 1 } },
        }),
      ).toEqual({})
    })

    it('should call the decode method when it is a match', () => {
      const decodeMock = jest.fn()
      paramsRegistry
        .addParameter('fu', (routes) => {
          routes.add('ROUTER/foo', 'reducerKey4', 'fooBar', {
            decode: decodeMock,
          })
        })
        .getStateFromQueries('reducerKey4', {
          type: 'ROUTER/foo',
          meta: { query: { fu: 'bar' } },
        })
      expect(decodeMock).toHaveBeenCalled()
    })
  })

  describe('reducer settings passed to the route', () => {
    it('should throw an error when an key is set that is other than the allowed keys', () => {
      expect(() =>
        paramsRegistry.addParameter('foo', (routes) => {
          routes.add('/bar', 'reducerKey', 'stateKey', {
            foo: 'reducerKey',
          })
        }),
      ).toThrow('Key given to reducer settings is not allowed: "foo"')
    })
  })

  describe('removeParamsWithDefaultValue', () => {
    beforeEach(() => {
      paramsRegistry
        .addParameter('zoom', (routes) => {
          routes.add(
            'ROUTER/bar',
            'reducerKey',
            'zoom',
            {
              defaultValue: 12,
            },
            false,
          )
        })
        .addParameter('page', (routes) => {
          routes.add('ROUTER/bar', 'reducerKey2', 'page')
        })
    })

    it('should return an object without the parameters with a default value', () => {
      const expectation2 = paramsRegistry.removeParamsWithDefaultValue(
        {
          zoom: 12,
          page: 1,
        },
        'ROUTER/bar',
      )
      expect(JSON.toString(expectation2)).toBe(JSON.toString({ page: 1 }))
    })
  })

  describe('getParametersForRoute', () => {
    beforeEach(() => {
      paramsRegistry
        .addParameter('zoom', (routes) => {
          routes.add(
            'ROUTER/bar',
            'reducerKey',
            'zoom',
            {
              defaultValue: 12,
            },
            false,
          )
        })
        .addParameter('page', (routes) => {
          routes.add('ROUTER/bar', 'reducerKey2', 'page')
        })
    })

    it('should return an object with parameters per route, encoded', () => {
      const expectation2 = paramsRegistry.getParametersForRoute(
        {
          zoom: 12,
          page: 1,
        },
        'ROUTER/bar',
      )
      expect(JSON.toString(expectation2)).toBe(JSON.toString({ page: 1 }))
    })
  })
})
