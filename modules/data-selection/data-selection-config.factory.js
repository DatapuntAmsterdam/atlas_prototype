(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .factory('dataSelectionConfig', dataSelectionConfigFactory);

    dataSelectionConfigFactory.$inject = ['environment'];

    function dataSelectionConfigFactory (environment) {
        var globalConfig,
            envConfig;

        envConfig = {
            DEVELOPMENT: {
                bag: {
                    ENDPOINT_PREVIEW: 'https://api-acc.datapunt.amsterdam.nl/zelfbediening/bag/',
                    ENDPOINT_EXPORT: 'https://api-acc.datapunt.amsterdam.nl/zelfbediening/bag/export/',
                    ENDPOINT_DETAIL: 'https://api-acc.datapunt.amsterdam.nl/bag/nummeraanduiding/'
                }
            },
            PRODUCTION: {
                bag: {
                    ENDPOINT_PREVIEW: 'https://api.datapunt.amsterdam.nl/zelfbediening/bag/',
                    ENDPOINT_EXPORT: 'https://api.datapunt.amsterdam.nl/zelfbediening/bag/export/',
                    ENDPOINT_DETAIL: 'https://api.datapunt.amsterdam.nl/bag/nummeraanduiding/'
                }
            }
        };
        globalConfig = {
            MAX_AVAILABLE_PAGES: 100,
            bag: {
                PRIMARY_KEY: 'id',
                FILTERS: [
                    {
                        slug: 'stadsdeel_naam',
                        label: 'Stadsdeel'
                    }, {
                        slug: 'ggw_naam',
                        label: 'GGW-gebied'
                    }, {
                        slug: 'buurtcombinatie_naam',
                        label: 'Buurtcombinatie'
                    }, {
                        slug: 'buurt_naam',
                        label: 'Buurt'
                    }, {
                        slug: 'naam',
                        label: 'Openbare ruimte'
                    }, {
                        slug: 'postcode',
                        label: 'Postcode',
                        format: {
                            filters: ['postcode']
                        }
                    }
                ],
                FIELDS: [
                    {
                        slug: '_openbare_ruimte_naam',
                        label: 'Naam openbare ruimte'
                    },
                    {
                        slug: 'huisnummer',
                        label: 'Num.',
                        format: {
                            align: 'right'
                        }
                    },
                    {
                        slug: 'huisletter',
                        label: 'Let.',
                        format: {
                            align: 'right'
                        }
                    },
                    {
                        slug: 'huisnummer_toevoeging',
                        label: 'Toev.',
                        format: {
                            align: 'right'
                        }
                    },
                    {
                        slug: 'postcode',
                        label: 'Postcode',
                        format: {
                            filters: ['postcode']
                        }
                    },
                    {
                        slug: 'stadsdeel_naam',
                        label: 'Stadsdeel'
                    },
                    {
                        slug: 'stadsdeel_code',
                        label: '-code'
                    },
                    {
                        slug: 'ggw_naam',
                        label: 'GGW-gebied'
                    },
                    {
                        slug: 'ggw_code',
                        label: '-code'
                    },
                    {
                        slug: 'buurtcombinatie_naam',
                        label: 'Buurtcombinatie'
                    },
                    {
                        slug: 'buurtcombinatie_code',
                        label: '-code'
                    },
                    {
                        slug: 'buurt_naam',
                        label: 'Buurt'
                    },
                    {
                        slug: 'buurt_code',
                        label: '-code'
                    }
                ]
            }
        };
        return angular.merge(globalConfig, envConfig[environment.NAME]);
    }
})();