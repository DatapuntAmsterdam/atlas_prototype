(function () {
    'use strict';

    angular
        .module('dpSearchResults')
        .constant('SEARCH_CONFIG', {
            QUERY_ENDPOINTS: [
                {
                    // The slug variable is used to indentify this category in list.component.js
                    slug: 'openbareruimte',
                    label_singular: 'Openbare ruimte',
                    label_plural: 'Openbare ruimtes',
                    uri: 'atlas/search/openbareruimte/'
                }, {
                    // The slug variable is used to indentify this category in list.component.js
                    slug: 'adres',
                    label_singular: 'Adres',
                    label_plural: 'Adressen',
                    uri: 'atlas/search/adres/'
                }, {
                    slug: 'vestiging',
                    label_singular: 'Vestiging',
                    label_plural: 'Vestigingen',
                    uri: 'handelsregister/search/vestiging/'
                }, {
                    slug: 'mac',
                    label_singular: 'Maatschappelijke activiteit',
                    label_plural: 'Maatschappelijke activiteiten',
                    uri: 'handelsregister/search/maatschappelijkeactiviteit/'
                }, {
                    slug: 'object',
                    label_singular: 'Kadastraal object',
                    label_plural: 'Kadastrale objecten',
                    uri: 'atlas/search/kadastraalobject/'
                }, {
                    slug: 'subject',
                    label_singular: 'Kadastraal subject',
                    label_plural: 'Kadastrale subjecten',
                    uri: 'atlas/search/kadastraalsubject/'
                }, {
                    // The slug variable is used to indentify this category in list.component.js
                    slug: 'gebied',
                    label_singular: 'Gebied',
                    label_plural: 'Gebieden',
                    uri: 'atlas/search/gebied/',
                    subtypes: {
                        grootstedelijk: 'grootstedelijk gebied',
                        gebiedsgerichtwerken: 'gebiedsgericht werken'
                    }
                }, {
                    slug: 'meetbout',
                    label_singular: 'Meetbout',
                    label_plural: 'Meetbouten',
                    uri: 'meetbouten/search/'
                }
            ],
            COORDINATES_ENDPOINTS: [
                {
                    uri: 'geosearch/nap/',
                    radius: 25
                }, {
                    uri: 'geosearch/atlas/',
                    radius: null
                }
            ],
            COORDINATES_HIERARCHY: [
                {
                    // The slug variable is used to indentify this category in list.component.js
                    slug: 'openbareruimte',
                    label_singular: 'Openbare ruimte',
                    label_plural: 'Openbare ruimtes',
                    features: ['bag/openbareruimte']
                }, {
                    // The slug variable is used to indentify this category in geosearch.factory.js
                    slug: 'pand',
                    label_singular: 'Pand',
                    label_plural: 'Panden',
                    features: ['bag/pand']
                }, {
                    // The slug variable is used to indentify this category in geosearch.factory.js
                    slug: 'standplaats',
                    label_singular: 'Standplaats',
                    label_plural: 'Standplaatsen',
                    features: ['bag/standplaats']
                }, {
                    // The slug variable is used to indentify this category in geosearch.factory.js
                    slug: 'ligplaats',
                    label_singular: 'Ligplaats',
                    label_plural: 'Ligplaatsen',
                    features: ['bag/ligplaats']
                }, {
                    label_singular: 'Kadastraal object',
                    label_plural: 'Kadastrale objecten',
                    features: ['kadaster/kadastraal_object']
                }, {
                    label_singular: 'Gemeentelijke beperking',
                    label_plural: 'Gemeentelijke beperkingen',
                    features: ['wkpb/beperking']
                }, {
                    // The slug variable is used to indentify this category in list.component.js
                    slug: 'gebied',
                    label_singular: 'Gebied',
                    label_plural: 'Gebieden',
                    features: [
                        'gebieden/grootstedelijkgebied',
                        'gebieden/unesco',
                        'gebieden/stadsdeel',
                        'gebieden/gebiedsgerichtwerken',
                        'gebieden/buurtcombinatie',
                        'gebieden/buurt',
                        'gebieden/bouwblok'
                    ],
                    subtypes: {
                        grootstedelijkgebied: 'grootstedelijk gebied',
                        gebiedsgerichtwerken: 'gebiedsgericht werken'
                    }
                }, {
                    label_singular: 'Meetbout',
                    label_plural: 'Meetbouten',
                    features: ['meetbouten/meetbout']
                }, {
                    label_singular: 'NAP Peilmerk',
                    label_plural: 'NAP Peilmerken',
                    features: ['nap/peilmerk']
                }
            ]
        });
})();
