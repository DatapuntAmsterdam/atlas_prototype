((() => {
    'use strict';

    angular
        .module('dpMap')
        .constant('ICON_CONFIG', {
            search: {
                iconUrl: 'assets/images/map/search.svg',
                iconSize: [48, 77],
                iconAnchor: [23, 65]
            },
            detail: {
                iconUrl: 'assets/images/map/detail.svg',
                iconSize: [21, 21],
                iconAnchor: [10, 10]
            },
            straatbeeld_orientation: {
                iconUrl: 'assets/images/map/straatbeeld-orientation.svg',
                iconSize: [70, 70],
                iconAnchor: [35, 35]
            },
            straatbeeld_person: {
                iconUrl: 'assets/images/map/straatbeeld-person.svg',
                iconSize: [18, 31],
                iconAnchor: [9, 22]
            }
        });
}))();
