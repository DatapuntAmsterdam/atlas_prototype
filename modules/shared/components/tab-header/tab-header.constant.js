((() => {
    'use strict';

    angular
        .module('dpShared')
        .constant('TAB_HEADER_CONFIG', {
            'data-datasets': {
                data: {
                    title: 'Data',
                    action: 'FETCH_SEARCH_RESULTS_BY_QUERY',
                    getPayload: query => query,
                    tip: 'maak de zoekcriteria minder specifiek (bijv. een straat i.p.v. specifiek adres)'
                },
                datasets: {
                    title: 'Datasets',
                    action: 'FETCH_DATA_SELECTION',
                    getPayload: query => {
                        return {dataset: 'catalogus', view: 'CARDS', query, filters: {}, page: 1};
                    },
                    tip: 'in datasets kun je momenteel alleen zoeken op hele woorden (dus zoek niet op \'zonne\' ' +
                        'maar op \'zonnepanelen\' of \'zonnepaneel\'). Alternatief is de optie \'Alle datasets ' +
                        'tonen\' en filteren op thema.'
                }
            }
        });
}))();
