import ACTIONS from '../../../../../src/shared/actions';
import PAGES from '../../../../../src/pages';
import { switchPage } from '../../../../../src/shared/ducks/ui/ui';

(function () {
    'use strict';

    angular
        .module('dpSearchResults')
        .component('dpSearchResultsList', {
            bindings: {
                category: '=',
                limitResults: '='
            },
            templateUrl: 'modules/search-results/components/search-results/list/search-results-list.html',
            controller: DpSearchResultsListController,
            controllerAs: 'vm'
        });

    DpSearchResultsListController.$inject = ['store'];

    function DpSearchResultsListController (store) {
        const STATUS_OBJECT_GEVORMD = 18;

        const vm = this;

        vm.showSubtype = function (categorySlug, link) {
            return angular.isString(link.subtype) &&
                (
                    (categorySlug === 'ligplaats' || categorySlug === 'standplaats') ||
                    (categorySlug === 'openbareruimte' && link.subtype !== 'weg') ||
                    (categorySlug === 'adres' && link.subtype !== 'verblijfsobject') ||
                    categorySlug === 'gebied' ||
                    categorySlug === 'explosief' ||
                    (categorySlug === 'monument' && link.subtype === 'complex')
                );
        };

        vm.getExtraInfo = function (link) {
            if (angular.isObject(link)) {
                let extraInfo = '';

                if (link.hoofdadres === false) {
                    extraInfo += ' (nevenadres)';
                }

                if (angular.isObject(link.vbo_status) && Number(link.vbo_status.code) === STATUS_OBJECT_GEVORMD) {
                    extraInfo += ` (${link.vbo_status.omschrijving.toLowerCase()})`;
                }

                return extraInfo;
            }
        };

        vm.openDetail = (endpoint) => {
            // link.endpoint
            store.dispatch({
                type: ACTIONS.FETCH_DETAIL,
                payload: endpoint
            });
            store.dispatch(switchPage(PAGES.KAART_DETAIL));
        };
    }
})();
