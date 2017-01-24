(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('stateUrlConverter', stateUrlConverterFactory);

    stateUrlConverterFactory.$inject = ['STATE_URL_CONVERSION', 'dpBaseCoder'];

    function stateUrlConverterFactory (STATE_URL_CONVERSION, dpBaseCoder) {
        const URL_ARRAY_SEPARATOR = ':';    // Choose any of -._~:[]@!$'()*+,;`.
        const ARRAY_DENOTATOR = '[]';
        const MAIN_STATE = 'DEFAULT';
        const BOOLEAN_TRUE = 'T';
        const BOOLEAN_FALSE = 'F';
        const TYPENAME = {
            STRING: /^string$/,
            BOOLEAN: /^boolean$/,
            NUMBER: /^number$/,
            BASE62: /^base62$/,
            KEYVALUES: /^keyvalues$/,
            OBJECT: /^object\((\w+:\w+[\[\]]*)(,\w+:\w+[\[\]]*)*\)$/,
            ARRAY: /\[\]$/
        };

        let base62Coder = dpBaseCoder.getCoderForBase(62);  // Code coordinates in base62

        // url-state converters for every possible type

        class StringValue {
            static urlValue (s) { return s; }
            static stateValue (s) { return s; }
        }

        class NumberValue {
            static getNumberValue (n, precision) {
                // eg return 10.1 for 10.123
                return precision === null ? n : dpBaseCoder.toPrecision(n, precision);
            }
            static urlValue (n, precision) { return NumberValue.getNumberValue(n, precision); }
            static stateValue (s, precision) { return NumberValue.getNumberValue(Number(s), precision); }
        }

        class Base62Value {
            static urlValue (n, precision) { return base62Coder.encode(n, precision); }
            static stateValue (s, precision) { return base62Coder.decode(s, precision); }
        }

        class BooleanValue {
            static urlValue (b) { return b ? BOOLEAN_TRUE : BOOLEAN_FALSE; }
            static stateValue (s) { return s === BOOLEAN_TRUE; }
        }

        class KeyValuesValue {
            static urlValue (kv, typeName, asValue, precision, separator) {
                // { key: value, key:value, ... } => key::value:key::value...
                return asValue(Object.keys(kv).map(key => [key, kv[key]]), 'string[][]', precision, separator);
            }
            static stateValue (s, typeName, asValue, precision, separator) {
                // key::value:key::value... => { key: value, key:value, ... }
                return asValue(s, 'string[][]', precision, separator)
                    .reduce((result, [key, keyValue]) => {
                        result[key] = keyValue;
                        return result;
                    }, {});
            }
        }

        class ObjectValue {
            static getKeyTypes (typeName) {
                // object(key:type,key:type,...) => ['key:type', 'key:type', ...]
                return typeName.substring('object('.length, typeName.length - 1).split(',');
            }
            static urlValue (o, typeName, asValue, precision, separator) {
                // { id:anyValue, ... } => anyValue:anyValue:...
                return ObjectValue.getKeyTypes(typeName)
                    .map(keyValue => {
                        let [key, keyType] = keyValue.split(':'); // key:type => key, type
                        return asValue(o[key], keyType, precision, separator + URL_ARRAY_SEPARATOR);
                    })
                    .join(separator);
            }
            static stateValue (s, typeName, asValue, precision, separator) {
                // anyValue:anyValue:... => { id:anyValue, ... }
                let fields = asValue(s, 'string[]', precision, separator); // [ anyValue, anyValue, ...]
                return ObjectValue.getKeyTypes(typeName)
                    .reduce((result, keyAndType, i) => {
                        let [key, keyType] = keyAndType.split(':'); // key:type => key, type
                        result[key] = asValue(fields[i], keyType, precision, separator + URL_ARRAY_SEPARATOR);
                        return result;
                    }, {});
            }
        }

        class ArrayValue {
            static getBaseType (typeName) {
                return typeName.substr(0, typeName.length - ARRAY_DENOTATOR.length);
            }
            static urlValue (a, typeName, asValue, precision, separator) {
                // [ x, y, z, ... ] => x:y:z:...
                let baseType = ArrayValue.getBaseType(typeName);
                return a
                    .map(v => asValue(v, baseType, precision, separator + URL_ARRAY_SEPARATOR))
                    .join(separator);
            }
            static stateValue (s, typeName, asValue, precision, separator) {
                // x:y:z:... => [ x, y, z, ... ]
                let baseType = ArrayValue.getBaseType(typeName);
                // Split the array, replace the split char by a tmp split char because org split char can repeat
                const TMP_SPLIT_CHAR = '|';
                let surroundBy = '([^' + URL_ARRAY_SEPARATOR + '])';
                let splitOn = new RegExp(surroundBy + separator + surroundBy, 'g');
                let splitValue = s.replace(splitOn, '$1' + TMP_SPLIT_CHAR + '$2');
                return splitValue
                    .split(TMP_SPLIT_CHAR)
                    .map(v => asValue(v, baseType, precision, separator + URL_ARRAY_SEPARATOR));
            }
        }

        return {
            state2params,
            state2url,
            params2state,
            getDefaultState
        };

        function getDefaultState () {
            return params2state({}, {});
        }

        function state2url (state) {
            // Convert the url parameters object into a url parameter string
            const params = state2params(state);
            return '#' + Object.keys(params).reduce((result, key) => {
                result += result ? '&' : '?';
                result += `${key}=${(params[key])}`;
                return result;
            }, '');
        }

        function createObject (oldObj, key, params) {
            // create a state object by using its initial value (default {}) and onCreate method if defined
            let initialValues = STATE_URL_CONVERSION.initialValues,
                initialValue = initialValues[key] || {},
                onCreate = STATE_URL_CONVERSION.onCreate[key];

            let newObj = angular.copy(initialValue);
            if (angular.isFunction(onCreate)) {
                newObj = onCreate(oldObj, newObj, params, initialValues);
            }
            return newObj;
        }

        function getFullKey (key) {
            // decompose 'map.viewCenter' in {mainKey: 'map', subKey: 'viewCenter'}
            // or 'isPrintmode' in {mainKey: 'isPrintmode'}
            let dot = key.indexOf('.');
            if (dot >= 0) {
                return {
                    mainKey: key.substr(0, dot),
                    subKey: key.substr(dot + 1)
                };
            } else {
                return {
                    mainKey: key
                };
            }
        }

        function getValueForKey (obj, key) {
            // return 9 for obj={map: {zoom: 9}} and key = 'map.zoom', null when no value available
            // Uses recursion for endless depth
            let {mainKey, subKey} = getFullKey(key);
            if (subKey) {
                return angular.isObject(obj[mainKey]) ? getValueForKey(obj[mainKey], subKey) : null;
            } else {
                return obj[mainKey] || null;
            }
        }

        function setValueForKey (obj, oldObj, key, value) {
            // set obj:{map: {zoom: 9}} to {map: {zoom: 8}} for key 'map.zoom' and value 8
            // the old object is used for createObject() in case of any onCreate method for the state object
            let {mainKey, subKey} = getFullKey(key);
            if (subKey) {
                obj[mainKey] = obj[mainKey] || createObject(oldObj[mainKey], mainKey);
                setValueForKey(obj[mainKey], oldObj[mainKey] || {}, subKey, value);
            } else {
                obj[mainKey] = value;
            }
        }

        function asUrlValue (value, typeName, precision = null, separator = URL_ARRAY_SEPARATOR) {
            // returns the value as a valid url value (URI-encoded string representation)
            let urlValue = '';

            if (typeName.match(TYPENAME.STRING)) {
                urlValue = StringValue.urlValue(value);
            } else if (typeName.match(TYPENAME.NUMBER)) {
                urlValue = NumberValue.urlValue(value, precision);
            } else if (typeName.match(TYPENAME.BASE62)) {
                urlValue = Base62Value.urlValue(value, precision);
            } else if (typeName.match(TYPENAME.BOOLEAN)) {
                urlValue = BooleanValue.urlValue(value);
            } else if (typeName.match(TYPENAME.KEYVALUES)) {
                return KeyValuesValue.urlValue(value, typeName, asUrlValue, precision, separator);
            } else if (typeName.match(TYPENAME.OBJECT)) {
                return ObjectValue.urlValue(value, typeName, asUrlValue, precision, separator);
            } else if (typeName.match(TYPENAME.ARRAY)) {
                return ArrayValue.urlValue(value, typeName, asUrlValue, precision, separator);
            }

            return encodeURI(urlValue.toString());
        }

        function asStateValue (decodedValue, typeName, precision = null, separator = URL_ARRAY_SEPARATOR) {
            // returns the value as a state value by using the URI-decoded string representation
            let value = decodeURI(decodedValue);
            let stateValue = null;

            if (typeName.match(TYPENAME.STRING)) {
                stateValue = StringValue.stateValue(value);
            } else if (typeName.match(TYPENAME.NUMBER)) {
                stateValue = NumberValue.stateValue(value, precision);
            } else if (typeName.match(TYPENAME.BASE62)) {
                stateValue = Base62Value.stateValue(value, precision);
            } else if (typeName.match(TYPENAME.BOOLEAN)) {
                stateValue = BooleanValue.stateValue(value);
            } else if (typeName.match(TYPENAME.KEYVALUES)) {
                return KeyValuesValue.stateValue(value, typeName, asStateValue, precision, separator);
            } else if (typeName.match(TYPENAME.OBJECT)) {
                return ObjectValue.stateValue(value, typeName, asStateValue, precision, separator);
            } else if (typeName.match(TYPENAME.ARRAY)) {
                return ArrayValue.stateValue(value, typeName, asStateValue, precision, separator);
            }

            return stateValue;
        }

        function state2params (state) {
            // Converts a state to a params object that is stored in the url
            return Object.keys(STATE_URL_CONVERSION.stateVariables).reduce((result, key) => {
                let attribute = STATE_URL_CONVERSION.stateVariables[key];
                let value = getValueForKey(state, attribute.name);
                if (value !== null) {
                    // store value in url
                    if (angular.isFunction(attribute.getValue)) {
                        value = attribute.getValue(value);
                    }
                    value = asUrlValue(value, attribute.type, attribute.precision);
                    if (value) {
                        result[key] = value;
                    }
                }
                return result;
            }, {});
        }

        function params2state (oldState, params) {
            // Converts a params object (payload or url value) to a new state object
            let newState = createObject (oldState, MAIN_STATE, params);

            newState = Object.keys(STATE_URL_CONVERSION.stateVariables).reduce((result, key) => {
                let attribute = STATE_URL_CONVERSION.stateVariables[key];
                let value = params[key];
                if (angular.isDefined(value)) {
                    // store value in state
                    value = asStateValue(value, attribute.type, attribute.precision);
                    if (angular.isFunction(attribute.setValue)) {
                        value = attribute.setValue(value);
                    }
                    if (value !== null) {
                        setValueForKey(result, oldState, attribute.name, value);
                    }
                }
                return result;
            }, newState);

            // Set any missing state objects to null
            Object.keys(STATE_URL_CONVERSION.initialValues).forEach(key => {
                if (key !== MAIN_STATE && !angular.isObject(newState[key])) {
                    newState[key] = null;
                }
            });

            // Execute the post processing methods
            Object.keys(STATE_URL_CONVERSION.post).forEach(key => {
                if (angular.isObject(newState[key])) {
                    STATE_URL_CONVERSION.post[key](oldState[key], newState[key]);
                }
            });

            return newState;
        }
    }
})();
