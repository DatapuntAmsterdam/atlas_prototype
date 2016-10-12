(function () {
    'use strict';

    angular
        .module('atlasSearchResults')
        .constant('SEARCH_CONFIG', {
            QUERY_ENDPOINTS: [
                {
                    slug: 'openbareruimte',
                    label_singular: 'Openbare ruimte',
                    label_plural: 'Openbare ruimtes',
                    uri: 'atlas/search/openbareruimte/'
                }, {
                    slug: 'adres',
                    label_singular: 'Adres',
                    label_plural: 'Adressen',
                    uri: 'atlas/search/adres/'
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
                    slug: 'bouwblokken',
                    label_singular: 'Bouwblok',
                    label_plural: 'Bouwblokken',
                    uri: 'atlas/search/bouwblok/'
                }, {
                    slug: 'meetbouten',
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
                    label_singular: 'Standplaats',
                    label_plural: 'Standplaatsen',
                    features: ['bag/standplaats']
                }, {
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
                    ]
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
