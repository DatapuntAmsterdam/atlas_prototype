(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .constant('DATA_SELECTION_CONFIG', {
            options: {
                MAX_NUMBER_OF_CLUSTERED_MARKERS: 10000
            },
            datasets: {
                dcatd: {
                    MAX_ITEMS_PER_PAGE: 100,
                    CUSTOM_API: 'dataSelectionApiDcatd',
                    ENDPOINT_METADATA: 'dcatd/openapi',
                    ENDPOINT_PREVIEW: 'dcatd/datasets',
                    ENDPOINT_DETAIL: 'dcatd/datasets',
                    TITLE: 'Dcatd',
                    PRIMARY_KEY: 'dct:identifier',
                    SHOW_FILTER_OPTION_COUNTS: false,
                    FILTERS: [
                        {
                            slug: 'groups',
                            label: 'Thema\'s'
                        }, {
                            slug: 'data_format',
                            label: 'Formaten',
                            formatter: 'lowercase'
                        }, {
                            slug: 'owner',
                            label: 'Gepubliceerd door'
                        }
                    ],
                    CONTENT: {
                        CARDS: [
                            { label: 'Naam', variables: ['dct:title'] },
                            { label: 'Id', variables: ['dct:identifier'] },
                            {
                                label: 'Omschrijving',
                                formatter: 'truncateHtmlAsText',
                                variables: ['dct:description']
                            }
                            // }, {
                            //     label: 'Datum',
                            //     variables: ['metadata_created', 'metadata_modified'],
                            //     formatter: 'modificationDate'
                            // }, {
                            //     label: 'Formaten',
                            //     variables: ['resources.format'],
                            //     formatter: 'aggregate',
                            //     template: 'file-type'
                            // }, {
                            //     label: 'Labels',
                            //     variables: ['tags.display_name'],
                            //     formatter: 'aggregate',
                            //     template: 'tags'
                            // }
                        ]
                    }
                },
                bag: {
                    CUSTOM_API: 'dataSelectionApiDataSelection',
                    MAX_AVAILABLE_PAGES: 100,
                    ENDPOINT_PREVIEW: 'dataselectie/bag/',
                    ENDPOINT_MARKERS: 'dataselectie/bag/geolocation/',
                    ENDPOINT_EXPORT: 'dataselectie/bag/export/',
                    ENDPOINT_DETAIL: 'bag/nummeraanduiding/',
                    PRIMARY_KEY: 'nummeraanduiding_id',
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
                            label: 'Wijk'
                        }, {
                            slug: 'buurt_naam',
                            label: 'Buurt'
                        }, {
                            slug: 'openbare_ruimte',
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
                                variables: ['huisnummer']
                            },
                            {
                                label: 'Let.',
                                variables: ['huisletter']
                            },
                            {
                                label: 'Toev.',
                                variables: ['huisnummer_toevoeging']
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
                                label: 'Wijk',
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
                },
                catalogus: {
                    MAX_ITEMS_PER_PAGE: 100,
                    CUSTOM_API: 'dataSelectionApiCkan',
                    ENDPOINT_PREVIEW: 'catalogus/api/3/action/package_search',
                    ENDPOINT_DETAIL: 'catalogus/api/3/action/package_show',
                    PRIMARY_KEY: 'id',
                    TITLE: 'Catalogus',
                    SHOW_FILTER_OPTION_COUNTS: false,
                    FILTERS: [
                        {
                            slug: 'groups',
                            label: 'Thema\'s'
                        }, {
                            slug: 'res_format',
                            label: 'Formaten',
                            formatter: 'lowercase'
                        }, {
                            slug: 'organization',
                            label: 'Gepubliceerd door'
                        }
                    ],
                    CONTENT: {
                        CARDS: [
                            {
                                label: 'Naam',
                                variables: ['title']
                            }, {
                                label: 'Datum',
                                variables: ['metadata_created', 'metadata_modified'],
                                formatter: 'modificationDate'
                            }, {
                                label: 'Formaten',
                                variables: ['resources.format'],
                                formatter: 'aggregate',
                                template: 'file-type'
                            }, {
                                label: 'Labels',
                                variables: ['tags.display_name'],
                                formatter: 'aggregate',
                                template: 'tags'
                            }, {
                                label: 'Omschrijving',
                                formatter: 'truncateHtmlAsText',
                                variables: ['notes']
                            }
                        ]
                    }
                },
                hr: {
                    CUSTOM_API: 'dataSelectionApiDataSelection',
                    AUTH_SCOPE: 'HR/R',
                    MAX_AVAILABLE_PAGES: 100,
                    ENDPOINT_PREVIEW: 'dataselectie/hr/',
                    ENDPOINT_MARKERS: 'dataselectie/hr/geolocation/',
                    ENDPOINT_EXPORT: 'dataselectie/hr/export/',
                    ENDPOINT_EXPORT_PARAM: 'dataset=ves',
                    ENDPOINT_DETAIL: 'handelsregister/vestiging/',
                    PRIMARY_KEY: 'vestiging_id',
                    TITLE: 'Vestigingen',
                    FILTERS: [
                        {
                            slug: 'sbi_code',
                            label: 'SBI-code'
                        }, {
                            slug: 'sbi_l2',
                            label: 'SBI-L2'
                        }, {
                            slug: 'sbi_l3',
                            label: 'SBI-L3'
                        }, {
                            slug: 'sbi_l4',
                            label: 'SBI-L4'
                        }, {
                            slug: 'sbi_l5',
                            label: 'SBI-L5'
                        }, {
                            slug: 'bijzondere_rechtstoestand',
                            label: 'Bijzondere rechtstoestand'
                        }, {
                            slug: 'stadsdeel_naam',
                            label: 'Stadsdeel'
                        }, {
                            slug: 'ggw_naam',
                            label: 'GGW-gebied'
                        }, {
                            slug: 'buurtcombinatie_naam',
                            label: 'Wijk'
                        }, {
                            slug: 'buurt_naam',
                            label: 'Buurt'
                        }, {
                            slug: 'openbare_ruimte',
                            label: 'Openbare ruimte'
                        }, {
                            slug: 'postcode',
                            label: 'Postcode'
                        }
                    ],
                    CONTENT: {
                        TABLE: [
                            {
                                label: 'KvK-num.',
                                variables: ['kvk_nummer']
                            },
                            {
                                label: 'Handelsnaam',
                                variables: ['handelsnaam', 'bijzondere_rechtstoestand'],
                                template: 'handelsnaam'
                            },
                            {
                                label: 'SBI-code',
                                variables: ['sbi_code']
                            },
                            {
                                label: 'SBI-omschrijving',
                                variables: ['sbi_omschrijving'],
                                template: 'sbi-omschrijving'
                            },
                            {
                                label: 'Bezoekadres',
                                variables: ['bezoekadres_volledig_adres', 'non_mailing'],
                                formatter: 'hrBezoekadres',
                                template: 'bezoekadres'
                            }
                        ],
                        LIST: [
                            {
                                variables: ['handelsnaam']
                            }
                        ]
                    }
                }
            }
        });
})();
