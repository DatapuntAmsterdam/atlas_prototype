(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('urlComposer', urlComposerFactory)
        .constant('URL_COMPRESSION', ['ABR', 'B62']);    // ['ABR', 'B62', 'LZS']

    urlComposerFactory.$inject = [
        'URL_COMPRESSION',
        'dpStringCompressor',
        'dpBaseCoder',
        'dpAbbreviator',
        'urlAbbreviations'];

    function urlComposerFactory (
        URL_COMPRESSION,
        dpStringCompressor,
        dpBaseCoder,
        dpAbbreviator,
        urlAbbreviations) {
        const COORDINATES = ['lat', 'lon'];
        const LOCATIONS = ['straatbeeld'];

        const LOCATION_PRECISION = 7;

        let base62Coder = dpBaseCoder.getCoderForBase(62);
        let abbreviator = dpAbbreviator.getAbbreviatorForAbbreviations(urlAbbreviations.abbreviations);

        return {
            getUrl,
            compressParams,
            decompressParams
        };

        function getUrl (params) {
            let key,
                queryString = '';

            compressParams(params);
            for (key in params) {
                if (params.hasOwnProperty(key) && params[key] !== null) {
                    queryString += queryString ? '&' : '?';
                    queryString += `${key}=${params[key]}`;
                }
            }

            return '#' + queryString;
        }

        function compressParams (params) {
            if (URL_COMPRESSION.length > 0) {
                URL_COMPRESSION.forEach(compressor => {
                    let C;
                    switch (compressor) {
                        case 'LZS':
                            Object.keys(params).forEach(key => {
                                let val = params[key];
                                if (angular.isUndefined(val) || val === null) {
                                    delete params[key];
                                }
                            });
                            C = dpStringCompressor.compressFromObject(params);
                            Object.keys(params).forEach(key => delete params[key]);
                            params.C = C;
                            break;
                        case 'B62':
                            COORDINATES.forEach(key => {
                                if (params[key]) {
                                    params[key] = base62Coder.encodeFromString(params[key], LOCATION_PRECISION);
                                }
                            });
                            LOCATIONS.forEach(key => {
                                if (params[key]) {
                                    params[key] = params[key]
                                        .split(',')
                                        .map(c => base62Coder.encodeFromString(c, LOCATION_PRECISION))
                                        .join(',');
                                }
                            });
                            break;
                        case 'ABR':
                            abbreviator.abbreviate(params);
                            break;
                        default:
                            break;
                    }
                });
                params.V = URL_COMPRESSION.join(',');
            }
            return params;
        }

        function decompressParams (params) {
            if (params.V) {
                let urlCompression = params.V.split(',');
                urlCompression.forEach(compressor => {
                    let C;
                    switch (compressor) {
                        case 'LZS':
                            C = dpStringCompressor.decompressToObject(params.C);
                            Object.keys(C).forEach(key => params[key] = C[key]);
                            delete params.C;
                            break;
                        case 'B62':
                            COORDINATES.forEach(key => {
                                if (params[key]) {
                                    params[key] = base62Coder.decode(params[key], LOCATION_PRECISION);
                                }
                            });
                            LOCATIONS.forEach(key => {
                                if (params[key]) {
                                    params[key] = params[key]
                                        .split(',')
                                        .map(s => base62Coder.decode(s, LOCATION_PRECISION))
                                        .join(',');
                                }
                            });
                            break;
                        case 'ABR':
                            abbreviator.deabbreviate(params);
                            break;
                        default:
                            break;
                    }
                });
                delete params.V;
            }
            return params;
        }
    }
})();
