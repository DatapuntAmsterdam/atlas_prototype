(function () {
    'use strict';

    angular
        .module('dpMap')
        .constant('ICON_CONFIG', {
            search: {
                iconUrl: 'assets/icons/icon-search.png',
                iconRetinaUrl: 'assets/icons/icon-search-retina.png',
                iconSize: [30, 48],
                iconAnchor: [15, 51]
            },
            detail: {
                iconUrl: 'assets/icons/icon-detail.png',
                iconRetinaUrl: 'assets/icons/icon-detail-retina.png',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            },
            straatbeeld_orientation: {
                iconUrl: 'assets/icons/icon-straatbeeld-orientation.png',
                iconRetinaUrl: 'assets/icons/icon-straatbeeld-orientation-retina.png',
                iconSize: [62, 62],
                iconAnchor: [31, 31]
            },
            straatbeeld_person: {
                iconUrl: 'assets/icons/icon-straatbeeld-person.png',
                iconRetinaUrl: 'assets/icons/icon-straatbeeld-person-retina.png',
                iconSize: [18, 31],
                iconAnchor: [9, 22]
            }
        });
})();