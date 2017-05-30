(function () {
    'use strict';

    angular
        .module('dpPage')
        .constant('CATALOGUS_THEMES_CONFIG', [
            {
                name: 'Verkeer en infrastructuur',
                slug: 'verkeer-infrastructuur',
                icon: 'parkeren-beheer'
            }, {
                name: 'Toerisme en cultuur',
                slug: 'toerisme-cultuur',
                icon: 'toerisme'
            }, {
                name: 'Geografie',
                slug: 'geografie',
                icon: 'kaart'
            }, {
                name: 'Bevolking',
                slug: 'bevolking',
                icon: 'bevolking'
            }, {
                name: 'Openbare ruimte en groen',
                slug: 'openbare-ruimte-groen',
                icon: 'openbare-ruimte'
            }, {
                name: 'Stedelijke ontwikkeling',
                slug: 'stedelijke-ontwikkeling',
                icon: 'stedelijke-ontwikkeling'
            }, {
                name: 'Zorg en welzijn',
                slug: 'zorg-welzijn',
                icon: 'gezondheid-zorg-welzijn'
            }, {
                name: 'Energie',
                slug: 'energie',
                icon: 'energie'
            }, {
                name: 'Wonen en leefomgeving',
                slug: 'wonen-leefomgeving',
                icon: 'wonen-leefomgeving'
            }, {
                name: 'Werk en inkomen',
                slug: 'werk-inkomen',
                icon: 'werk-en-inkomen'
            },
            {
                name: 'Dienstverlening',
                slug: 'dienstverlening',
                icon: 'dienstverlening'
            },
            {
                name: 'Educatie, jeugd en diversiteit',
                slug: 'educatie-jeugd-diversiteit',
                icon: 'educatie-jeugd-diversiteit'
            }
        ]);
})();
