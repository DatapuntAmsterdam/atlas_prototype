import get from 'lodash.get';
import isUndefined from 'lodash.isundefined';
import queryString from 'querystring';
import createHistory from 'history/createBrowserHistory';

/**
 * ParamsRegistry manages the relations between url parameters, reducers and routes.
 * Since we want to reuse url parameter keys over difference routes and reducers, we can build these
 * by adding routes to each key, that holds only one reducer.
 * Why only one per route per param?
 * Otherwise a dependency will exist between reducers. Example: if we have a url param called "view"
 * that is used in reducers A and B. If in the same route reducer A sets the value of "view",
 * reducer B also updates, as it is in sync with the url param.
 */
class ParamsRegistery {
  static getDefaultReducerSettings(reducerKey, stateKey, overrideOptions = {}) {
    const reducerSettingsKeys = {
      encode: 'encode',
      decode: 'decode',
      selector: 'selector',
      defaultValue: 'defaultValue'
    };
    const { encode, decode, selector, defaultValue } = reducerSettingsKeys;
    const allowedKeys = [encode, decode, defaultValue, selector];

    Object.keys(overrideOptions).forEach((value) => {
      if (!allowedKeys.includes(value)) {
        throw new Error(`Key given to reducer settings is not allowed: "${value}"`);
      }
    });

    return {
      selector: (state) => get(state, `[${reducerKey}][${stateKey}]`),
      decode: (val) => val,
      encode: (val) => val,
      reducerKey,
      stateKey,
      ...overrideOptions
    };
  }

  /**
   *
   * @param routerNamespace
   * @returns {ParamsRegistery}
   *
   * @example
   * const paramsRegistery = new ParamsRegistery('ROUTE_NAMESPACE')
   * paramsRegistery.addParameter('view', (routes) => {
   *     routes
   *     .add('ROUTE_NAMESPACE/search', {
   *         stateKey: 'view',
   *         reducerKey: 'searchReducer'
   *     })
   *     .add('ROUTE_NAMESPACE/about', {
   *         stateKey: 'view',
   *         reducerKey: 'userReducer'
   *     })
   * }).addParameter('anotherParam', ...
   */
  constructor(routerNamespace = 'ROUTER') {
    this.queryParamResult = {};
    this.addParameter = this.addParameter.bind(this);
    this.getStateFromQueries = this.getStateFromQueries.bind(this);
    this.bindRouteToReducerSettings = this.bindRouteToReducerSettings.bind(this);

    this.settings = {
      routerNamespace
    };

    this.separateHistory = createHistory();

    return this;
  }

  addParameter(param, callback) {
    if (this.result[param]) {
      throw new Error(`Parameter is already registered: ${param}`);
    }
    const routeApi = {
      add: (routes, reducerKey, stateKey, reducerObject, addHistory = true) => {
        [...Array.isArray(routes) ? [...routes] : [routes]].forEach((route) => {
          if (!reducerKey || (typeof stateKey === 'undefined')) {
            throw new Error(`Param "${param}" with route "${route}" must contain a reducerKey and stateKey`);
          }
          this.bindRouteToReducerSettings(
            param, route, reducerKey, stateKey, reducerObject, addHistory
          );
        });
        return routeApi;
      }
    };

    callback(routeApi);

    return this;
  }

  /**
   *
   * @param param
   * @param route
   * @param reducerKey
   * @param stateKey
   * @param reducerObject
   * @param addHistory
   */
  bindRouteToReducerSettings(param, route, reducerKey, stateKey, reducerObject, addHistory) {
    let paramRouteReducerSettings = get(this.result, `[${param}].routes`, {});
    if (paramRouteReducerSettings[route]) {
      throw new Error(`Route is already registered for parameter "${param}" with route "${route}"`);
    }

    paramRouteReducerSettings = {
      ...paramRouteReducerSettings,
      [route]: {
        ...ParamsRegistery.getDefaultReducerSettings(reducerKey, stateKey, reducerObject),
        addHistory
      }
    };

    this.result = {
      [param]: {
        ...this.result[param],
        routes: paramRouteReducerSettings
      }
    };
  }

  setQueriesFromState(locationType, state) {
    let addHistory = true;
    const query = Object.entries(this.result).reduce((acc, [parameter, paramObject]) => {
      const reducerObject = get(paramObject, `[routes][${locationType}]`, null);
      if (reducerObject) {
        const encodedValue = reducerObject.encode(reducerObject.selector(state));

        // We need to set addHistory to true if even one route needs to change the history
        if (addHistory && (reducerObject && !reducerObject.addHistory)) {
          addHistory = false;
        }
        let newQuery = {};

        // we need to use JSON.stringify here to also check if arrays and objects are equal
        const isDefaultValue = !!(
          reducerObject && (
            JSON.stringify(reducerObject.decode(encodedValue)) ===
            JSON.stringify(reducerObject.defaultValue)
          )
        );
        if (
          encodedValue &&
          !isDefaultValue
        ) {
          newQuery = { [parameter]: encodedValue };
        }
        return {
          ...acc,
          ...newQuery
        };
      }

      return acc;
    }, {});
    const orderedQuery = Object.entries(query).sort().reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value
    }), {});

    const searchQuery = queryString.stringify(orderedQuery);
    const currentPath = window.location.pathname;

    // the history should be changed only when the url string is changed
    // this check prevents recording history changes on every action.
    const recordHistory = searchQuery !== window.location.search.substring(1);
    if (recordHistory) {
      // NOTE: changing history using different history wrapper than the one used in
      // redux-first-router! We need to work with a different history object to prevent
      // redux-first-router from reacting to query changes. If we were to use the same
      // history object, a route change would fire for every query change.
      if (addHistory) {
        this.separateHistory.push(`${currentPath}?${searchQuery}`);
      } else {
        this.separateHistory.replace(`${currentPath}?${searchQuery}`);
      }
    }

    return searchQuery;
  }

  /**
   * Used by reducers to retrieve the state from action.meta.query.
   * @param reducerKey
   * @param action
   * @returns {*}
   */
  getStateFromQueries(reducerKey, action) {
    return ((action.type && action.type.startsWith(this.settings.routerNamespace)) ?
      Object.entries(this.result).reduce((acc, [parameter, object]) => {
        const reducerObject = get(object, `routes[${action.type}]`);

        if (reducerObject && reducerObject.reducerKey === reducerKey) {
          const urlParam = get(action, `meta.query[${parameter}]`);
          const decodedValue = reducerObject.decode(urlParam);
          return (reducerObject.reducerKey === reducerKey) ? {
            ...acc,
            [reducerObject.stateKey]: isUndefined(decodedValue) ?
              reducerObject.defaultValue :
              decodedValue
          } : acc;
        }
        const reducerObj = Object
          .values(object.routes)
          .find((obj) => obj.reducerKey === reducerKey);

        return {
          ...acc,
          ...reducerObj ? { [reducerObj.stateKey]: reducerObj.defaultValue } : {}
        };
      }, {}) : {});
  }

  /**
   * If we need to go to a route and also set a new URL param, this method can be used to retrieve
   * the values for that specific route
   * @param parameters
   * @param route
   * @param encode Tell if we should encode the parameters values
   * @returns {*}
   */
  getParametersForRoute(parameters, route, encode = true) {
    return Object.entries(parameters).reduce((acc, [parameter, value]) => {
      const encodeFn = get(this.result, `${parameter}.routes[${route}].encode`, (val) => val);
      const valueToSet = encode ? encodeFn(value) : value;
      return encodeFn ? {
        ...acc,
        [parameter]: valueToSet
      } : acc;
    }, {});
  }

  set result(result) {
    this.queryParamResult = {
      ...this.queryParamResult,
      ...result
    };
  }

  get result() {
    return this.queryParamResult;
  }
}

export default ParamsRegistery;
