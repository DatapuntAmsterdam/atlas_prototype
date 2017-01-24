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
                slug: 'lf2016',
                label: 'Luchtfoto 2016',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2016_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2015',
                label: 'Luchtfoto 2015',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2015_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2014',
                label: 'Luchtfoto 2014',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2014_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2013',
                label: 'Luchtfoto 2013',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2013_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2012',
                label: 'Luchtfoto 2012',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2012_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2011',
                label: 'Luchtfoto 2011',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2011_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2010',
                label: 'Luchtfoto 2010',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2010_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2009',
                label: 'Luchtfoto 2009',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2009_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2008',
                label: 'Luchtfoto 2008',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2008_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2007',
                label: 'Luchtfoto 2007',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2007_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2006',
                label: 'Luchtfoto 2006',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2006_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2005',
                label: 'Luchtfoto 2005',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2005_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2004',
                label: 'Luchtfoto 2004',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2004_RD/{z}/{x}/{y}.jpeg'
            }, {
                slug: 'lf2003',
                label: 'Luchtfoto 2003',
                urlTemplate: 'https://{s}.datapunt.amsterdam.nl/lufo2003_RD/{z}/{x}/{y}.jpeg'
            }
        ]);
})();
