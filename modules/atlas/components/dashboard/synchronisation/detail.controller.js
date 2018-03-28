(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('DetailController', DetailController);

    DetailController.$inject = ['store'];

    function DetailController (store) {
        var vm = this;

        store.subscribe(update);
        update();

        function update () {
            var state = store.getState();

            vm.endpoint = state.detail && state.detail.endpoint;
            vm.reload = state.detail && state.detail.reload;
            vm.isLoading = state.detail && state.detail.isLoading;
            vm.isMapHighlight = state.map && state.map.highlight;
            // vm.dcatFilters = state.dataSelection && state.dataSelection.dcatFilters;
            vm.dcatFilters = state.detail && {
                groupTypes: [{
                    'id': 'bestuur-en-organisatie',
                    'label': 'Bestuur en organisatie'
                }, {
                    'id': 'bevolking',
                    'label': 'Bevolking'
                }, {
                    'id': 'dienstverlening',
                    'label': 'Dienstverlening'
                }, {
                    'id': 'economie-haven',
                    'label': 'Economie & Haven'
                }, {
                    'id': 'educatie-jeugd-diversiteit',
                    'label': 'Educatie, Jeugd & Diversiteit'
                }, {
                    'id': 'energie',
                    'label': 'Energie'
                }, {
                    'id': 'geografie',
                    'label': 'Geografie'
                }, {
                    'id': 'milieu-water',
                    'label': 'Milieu & Water'
                }, {
                    'id': 'openbare-orde-veiligheid',
                    'label': 'Openbare orde & veiligheid'
                }, {
                    'id': 'openbare-ruimte-groen',
                    'label': 'Openbare ruimte & groen'
                }, {
                    'id': 'sport-recreatie',
                    'label': 'Sport & recreatie'
                }, {
                    'id': 'stedelijke-ontwikkeling',
                    'label': 'Stedelijke ontwikkeling'
                }, {
                    'id': 'toerisme-cultuur',
                    'label': 'Toerisme & cultuur'
                }, {
                    'id': 'verkeer-infrastructuur',
                    'label': 'Verkeer & Infrastructuur'
                }, {
                    'id': 'verkiezingen',
                    'label': 'Verkiezingen'
                }, {
                    'id': 'werk-inkomen',
                    'label': 'Werk & Inkomen'
                }, {
                    'id': 'wonen-leefomgeving',
                    'label': 'Wonen & leefomgeving'
                }, {
                    'id': 'zorg-welzijn',
                    'label': 'Zorg & welzijn'
                }],
                formatTypes: [{
                    'id': 'n/a',
                    'label': ''
                }, {
                    'id': 'text/csv',
                    'label': 'CSV'
                }, {
                    'id': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'label': 'DOCX'
                }, {
                    'id': 'application/vnd.ms-excel',
                    'label': 'MS Excel'
                }, {
                    'id': 'application/vnd.geo+json',
                    'label': 'GeoJSON'
                }, {
                    'id': 'application/gml+xml',
                    'label': 'GML'
                }, {
                    'id': 'text/html',
                    'label': 'HTML'
                }, {
                    'id': 'application/json',
                    'label': 'JSON'
                }, {
                    'id': 'application/pdf',
                    'label': 'PDF'
                }, {
                    'id': 'image/png',
                    'label': 'PNG'
                }, {
                    'id': 'application/zip; format="shp"',
                    'label': 'SHP'
                }, {
                    'id': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'label': 'XLSX'
                }, {
                    'id': 'application/xml',
                    'label': 'XML'
                }, {
                    'id': 'application/octet-stream',
                    'label': 'Anders'
                }],
                ownerTypes: [{
                    'id': 'AEB Amsterdam',
                    'label': 'AEB Amsterdam'
                }, {
                    'id': 'Amsterdam Economic Board',
                    'label': 'Amsterdam Economic Board'
                }, {
                    'id': 'Amsterdam Marketing',
                    'label': 'Amsterdam Marketing'
                }, {
                    'id': 'Amsterdam Museum',
                    'label': 'Amsterdam Museum'
                }, {
                    'id': 'Athlon Car Lease',
                    'label': 'Athlon Car Lease'
                }, {
                    'id': 'Brandweer Amsterdam-Amstelland',
                    'label': 'Brandweer Amsterdam-Amstelland'
                }, {
                    'id': 'CBS',
                    'label': 'CBS'
                }, {
                    'id': 'CIBG',
                    'label': 'CIBG'
                }, {
                    'id': 'Cliëntenbelang',
                    'label': 'Cliëntenbelang'
                }, {
                    'id': 'Cultuurcompagnie Noord-Holland',
                    'label': 'Cultuurcompagnie Noord-Holland'
                }, {
                    'id': 'GGD Amsterdam',
                    'label': 'GGD Amsterdam'
                }, {
                    'id': 'GOVI',
                    'label': 'GOVI'
                }, {
                    'id': 'Gemeente Amsterdam',
                    'label': 'Gemeente Amsterdam'
                }, {
                    'id': 'Gemeente Amsterdam, Basisinformatie',
                    'label': 'Gemeente Amsterdam, Basisinformatie'
                }, {
                    'id': 'Gemeente Amsterdam, Bestuur en Organisatie',
                    'label': 'Gemeente Amsterdam, Bestuur en Organisatie'
                }, {
                    'id': 'Gemeente Amsterdam, Economie',
                    'label': 'Gemeente Amsterdam, Economie'
                }, {
                    'id': 'Gemeente Amsterdam, Grond en Ontwikkeling',
                    'label': 'Gemeente Amsterdam, Grond en Ontwikkeling'
                }, {
                    'id': 'Gemeente Amsterdam, Monumenten en Archeologie',
                    'label': 'Gemeente Amsterdam, Monumenten en Archeologie'
                }, {
                    'id': 'Gemeente Amsterdam, Onderwijs, Jeugd en Zorg',
                    'label': 'Gemeente Amsterdam, Onderwijs, Jeugd en Zorg'
                }, {
                    'id': 'Gemeente Amsterdam, Onderzoek, Informatie en Statistiek',
                    'label': 'Gemeente Amsterdam, Onderzoek, Informatie en Statistiek'
                }, {
                    'id': 'Gemeente Amsterdam, Projectmanagementbureau',
                    'label': 'Gemeente Amsterdam, Projectmanagementbureau'
                }, {
                    'id': 'Gemeente Amsterdam, Ruimte en Duurzaamheid',
                    'label': 'Gemeente Amsterdam, Ruimte en Duurzaamheid'
                }, {
                    'id': 'Gemeente Amsterdam, Sport en Bos',
                    'label': 'Gemeente Amsterdam, Sport en Bos'
                }, {
                    'id': 'Gemeente Amsterdam, Stadsarchief',
                    'label': 'Gemeente Amsterdam, Stadsarchief'
                }, {
                    'id': 'Gemeente Amsterdam, Stadsdeel Centrum',
                    'label': 'Gemeente Amsterdam, Stadsdeel Centrum'
                }, {
                    'id': 'Gemeente Amsterdam, Stadsdeel West',
                    'label': 'Gemeente Amsterdam, Stadsdeel West'
                }, {
                    'id': 'Gemeente Amsterdam, Verkeer en Openbare Ruimte',
                    'label': 'Gemeente Amsterdam, Verkeer en Openbare Ruimte'
                }, {
                    'id': 'Gemeente Amsterdam, Wonen',
                    'label': 'Gemeente Amsterdam, Wonen'
                }, {
                    'id': 'Gemeente Amsterdam, programma Afval Keten',
                    'label': 'Gemeente Amsterdam, programma Afval Keten'
                }, {
                    'id': 'Gemeente Amsterdam, stadsdeel Zuidoost',
                    'label': 'Gemeente Amsterdam, stadsdeel Zuidoost'
                }, {
                    'id': 'JeKuntMeer.nl',
                    'label': 'JeKuntMeer.nl'
                }, {
                    'id': 'KNMI',
                    'label': 'KNMI'
                }, {
                    'id': 'Kadaster',
                    'label': 'Kadaster'
                }, {
                    'id': 'Landelijk Register Kinderopvang en Peuterspeelzalen',
                    'label': 'Landelijk Register Kinderopvang en Peuterspeelzalen'
                }, {
                    'id': 'Liander',
                    'label': 'Liander'
                }, {
                    'id': 'Ministerie van OCW',
                    'label': 'Ministerie van OCW'
                }, {
                    'id': 'Nationale Databank Wegverkeergegevens',
                    'label': 'Nationale Databank Wegverkeergegevens'
                }, {
                    'id': 'Open Cultuur Data',
                    'label': 'Open Cultuur Data'
                }, {
                    'id': 'Politie Amsterdam-Amstelland',
                    'label': 'Politie Amsterdam-Amstelland'
                }, {
                    'id': 'Rijksdienst voor Cultureel Erfgoed',
                    'label': 'Rijksdienst voor Cultureel Erfgoed'
                }, {
                    'id': 'Rijksdienst voor Ondernemend Nederland',
                    'label': 'Rijksdienst voor Ondernemend Nederland'
                }, {
                    'id': 'Rijksmuseum Amsterdam',
                    'label': 'Rijksmuseum Amsterdam'
                }, {
                    'id': 'Rijkswaterstaat',
                    'label': 'Rijkswaterstaat'
                }, {
                    'id': 'UWV',
                    'label': 'UWV'
                }, {
                    'id': 'Waag Society',
                    'label': 'Waag Society'
                }],
                licenseTypes: [{
                    'id': 'cc-by',
                    'label': 'Creative Commons, Naamsvermelding'
                }, {
                    'id': 'cc-by-nc',
                    'label': 'Creative Commons, Naamsvermelding, Niet-Commercieel'
                }, {
                    'id': 'cc-by-nc-nd',
                    'label': 'Creative Commons, Naamsvermelding, Niet-Commercieel, Geen Afgeleide Werken'
                }, {
                    'id': 'cc-by-nc-sa',
                    'label': 'Creative Commons, Naamsvermelding, Niet-Commercieel, Gelijk Delen'
                }, {
                    'id': 'cc-by-nd',
                    'label': 'Creative Commons, Naamsvermelding, Geen Afgeleide Werken'
                }, {
                    'id': 'cc-by-sa',
                    'label': 'Creative Commons, Naamsvermelding, Gelijk Delen'
                }, {
                    'id': 'cc-nc',
                    'label': 'Creative Commons, Niet-Commercieel'
                }, {
                    'id': 'cc-zero',
                    'label': 'Publiek Domein'
                }, {
                    'id': 'other-open',
                    'label': 'Anders, Open'
                }, {
                    'id': 'other-by',
                    'label': 'Anders, Naamsvermelding'
                }, {
                    'id': 'other-nc',
                    'label': 'Anders, Niet Commercieel'
                }, {
                    'id': 'other-not-open',
                    'label': 'Anders, Niet Open'
                }, {
                    'id': 'unspec',
                    'label': 'Niet gespecificeerd'
                }]

            };
        }
    }
})();
