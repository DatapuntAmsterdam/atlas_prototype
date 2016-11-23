(function () {
    'use strict';

    angular
        .module('dpShared')
        .constant('BASE_LAYERS', [
            {
                slug: 'topografie',
                label: 'Topografie',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/topo_RD/{z}/{x}/{y}.png'
            }, {
                slug: 'luchtfoto_2016',
                label: 'Luchtfoto 2016',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2016_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'luchtfoto_2015',
                label: 'Luchtfoto 2015',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2015_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'luchtfoto_2014',
                label: 'Luchtfoto 2014',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2014_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'luchtfoto_2013',
                label: 'Luchtfoto 2013',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2013_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'luchtfoto_2012',
                label: 'Luchtfoto 2012',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2012_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'luchtfoto_2011',
                label: 'Luchtfoto 2011',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2011_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'luchtfoto_2007',
                label: 'Luchtfoto 2007',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2007_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'luchtfoto_2006',
                label: 'Luchtfoto 2006',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2006_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'luchtfoto_2004',
                label: 'Luchtfoto 2004',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2004_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'luchtfoto_2003',
                label: 'Luchtfoto 2003',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2003_RD/{z}/{x}/{y}.jpeg'
            }
        ]);
})();
