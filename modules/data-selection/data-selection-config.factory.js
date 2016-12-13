(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .factory('dataSelectionConfig', dataSelectionConfigFactory);

    dataSelectionConfigFactory.$inject = ['environment'];

    function dataSelectionConfigFactory (environment) {
        let globalConfig,
            envConfig;

        envConfig = {
            DEVELOPMENT: {
                bag: {
                    ENDPOINT_MARKERS: 'https://api-acc.datapunt.amsterdam.nl/dataselectie/bag/geolocation/',
                    ENDPOINT_EXPORT: 'https://api-acc.datapunt.amsterdam.nl/dataselectie/bag/export/',
                    ENDPOINT_DETAIL: 'https://api-acc.datapunt.amsterdam.nl/bag/nummeraanduiding/'
                }
            },
            PRODUCTION: {
                bag: {
                    ENDPOINT_MARKERS: 'https://api.datapunt.amsterdam.nl/dataselectie/bag/geolocation/',
                    ENDPOINT_EXPORT: 'https://api.datapunt.amsterdam.nl/dataselectie/bag/export/',
                    ENDPOINT_DETAIL: 'https://api.datapunt.amsterdam.nl/bag/nummeraanduiding/'
                }
            }
        };
        globalConfig = {
            catalogus: {
                MAX_ITEMS_PER_PAGE: 10,
                CUSTOM_API: 'dataSelectionApiCkan',
                ENDPOINT_PREVIEW: 'catalogus/api/3/action/package_search',
                PRIMARY_KEY: 'id',
                TITLE: 'Catalogus',
                SHOW_FILTER_OPTION_COUNTS: true,
                FILTERS: [
                    {
                        slug: 'groups',
                        label: 'Thema\'s'
                    }, {
                        slug: 'res_format',
                        label: 'Formaten'
                    }, {
                        slug: 'organization',
                        label: 'Gepubliceerd door'
                    }
                ],
                CONTENT: {
                    TABLE: [
                        {
                            label: 'Naam',
                            variables: ['title']
                        }
                    ]
                }
            },
            bag: {
                HAS_PAGE_LIMIT: true,
                MAX_AVAILABLE_PAGES: 100,
                CUSTOM_API: 'dataSelectionApiDataSelection',
                ENDPOINT_PREVIEW: 'dataselectie/bag/',
                PRIMARY_KEY: 'id',
                TITLE: 'Adressen',
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
                        label: 'Postcode'
                    }
                ],
                CONTENT: {
                    TABLE: [
                        {
                            label: 'Naam openbare ruimte',
                            variables: ['_openbare_ruimte_naam']
                        },
                        {
                            label: 'Num.',
                            variables: ['huisnummer'],
                            formatter: 'alignRight'
                        },
                        {
                            label: 'Let.',
                            variables: ['huisletter'],
                            formatter: 'alignRight'
                        },
                        {
                            label: 'Toev.',
                            variables: ['huisnummer_toevoeging'],
                            formatter: 'alignRight'
                        },
                        {
                            label: 'Postcode',
                            variables: ['postcode']
                        },
                        {
                            label: 'Stadsdeel',
                            variables: ['stadsdeel_naam']
                        },
                        {
                            label: '-code',
                            variables: ['stadsdeel_code']
                        },
                        {
                            label: 'GGW-gebied',
                            variables: ['ggw_naam']
                        },
                        {
                            label: '-code',
                            variables: ['ggw_code']
                        },
                        {
                            label: 'Buurtcombinatie',
                            variables: ['buurtcombinatie_naam']
                        },
                        {
                            label: '-code',
                            variables: ['buurtcombinatie_code']
                        },
                        {
                            label: 'Buurt',
                            variables: ['buurt_naam']
                        },
                        {
                            label: '-code',
                            variables: ['buurt_code']
                        }
                    ],
                    LIST: [
                        {
                            variables: [
                                '_openbare_ruimte_naam',
                                'huisnummer',
                                'huisletter',
                                'huisnummer_toevoeging'
                            ],
                            formatter: 'bagAddress'
                        },
                        {
                            variables: [
                                'ligplaats_id',
                                'standplaats_id'
                            ],
                            formatter: 'nummeraanduidingType'
                        },
                        {
                            variables: [
                                'hoofdadres'
                            ],
                            formatter: 'nevenadres'
                        },
                        {
                            variables: [
                                'status_id'
                            ],
                            formatter: 'verblijfsobjectGevormd'
                        }
                    ]
                }
            }
        };

        return angular.merge(globalConfig, envConfig[environment.NAME]);
    }
})();
