(function () {
    angular
        .module('atlas')
        .constant('URL_ABBREVIATIONS', new Map([
            // key (unique variableName): value (arbitrary variableValue)
            // WARNING: For compatibility reasons always add new variables at the end!
            // NOTE: abbreviations are case sensitive
            // RECOMMENDATION: Use abbreviations only for large strings or heavily used strings
            ['@', 'api.datapunt.amsterdam.nl'],
            ['b', 'burger'],
            ['bs', 'bestemming'],
            ['bp', 'beperking'],
            ['cb', 'combinatie'],
            ['dv', 'dienstverlening'],
            ['fc', 'financiële'],
            ['g', 'gemeente'],
            ['gs', 'grootstedelijk'],
            ['gg', 'gebiedsgericht'],
            ['ks', 'kadastra'],
            ['l', 'lagen'],
            ['lb', 'landbouw'],
            ['lf', 'luchtfoto'],
            ['mb', 'meetbout'],
            ['o', 'overheid'],
            ['pr', 'productie'],
            ['pv', 'Parkeervak'],
            ['r', 'roerend'],
            ['sb', 'Straatbeeld'],
            ['sd', 'stadsde'],
            ['tc', 'telecommunicatie'],
            ['tg', 'topografie'],
            ['vh', 'verhuur'],
            ['zb', 'zichtbaar'],
            ['zk', 'zakelijk']
        ]));
})();
