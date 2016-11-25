(function () {
    'use strict';

    angular
        .module('atlas')
        .config(locationDecorator)
        .constant('URL_COMPRESSION', ['ABR', 'B62']);    // ['ABR', 'B62', 'LZS']

    locationDecorator.$inject = ['$provide'];

    function locationDecorator ($provide) {
        $provide.decorator('$location', urlCompressor);

        urlCompressor.$inject = [
            '$delegate',
            'URL_COMPRESSION',
            'dpStringCompressor',
            'dpBaseCoder',
            'dpAbbreviator',
            'urlAbbreviations'];

        function urlCompressor (
            $delegate,
            URL_COMPRESSION,
            dpStringCompressor,
            dpBaseCoder,
            dpAbbreviator,
            urlAbbreviations) {
            let orgSearch = $delegate.search;

            const LOCATION_PRECISION = 7;

            let base62Coder = dpBaseCoder.getCoderForBase(62);
            let abbreviator = dpAbbreviator.getAbbreviatorForAbbreviations(urlAbbreviations.abbreviations);

            function compressUrl (params) {
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
                                ['lat', 'lon'].forEach(key => {
                                    if (params[key]) {
                                        params[key] = base62Coder.encodeFromString(params[key], LOCATION_PRECISION);
                                    }
                                });
                                ['straatbeeld'].forEach(key => {
                                    if (params[key]) {
                                        params.straatbeeld = params.straatbeeld
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

            function uncompressUrl (params) {
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
                                ['lat', 'lon'].forEach(key => {
                                    if (params[key]) {
                                        params[key] = base62Coder.decode(params[key], LOCATION_PRECISION);
                                    }
                                });
                                ['straatbeeld'].forEach(key => {
                                    if (params[key]) {
                                        params.straatbeeld = params.straatbeeld
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

            $delegate.search = function mySearch (...a) {
                if (a.length === 0) {
                    return uncompressUrl(orgSearch.apply($delegate, a));
                } else {
                    compressUrl(a[0]);
                    return orgSearch.apply($delegate, a);
                }
            };

            return $delegate;
        }
    }
})();
