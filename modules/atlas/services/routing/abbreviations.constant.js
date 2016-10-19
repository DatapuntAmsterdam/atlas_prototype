(function () {
    angular
        .module('atlas')
        .constant('ABBREVIATIONS', {
            // key (unique variableName): value (arbitrary variableValue)
            api: 'api.datapunt.amsterdam.nl',
            fdvrog: 'financiële_dienstverlening_verhuur_van_roerend_en_onroerend_goed',
            gb: 'gebied',
            hc: 'horeca',
            hvo: 'handel_vervoer_opslag',
            l: 'lagen',
            lb: 'landbouw',
            lf: 'luchtfoto',
            sd: 'stadsdeel',
            tg: 'topografie',
            zb: 'zichtbaar'
        });
})();
