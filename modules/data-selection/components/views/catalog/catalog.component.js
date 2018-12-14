import removeMd from 'remove-markdown';
import { routing } from '../../../../../src/app/routes';

(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionCatalog', {
            bindings: {
                content: '<',
                catalogFilters: '<'
            },
            controller: DpDataSelectionCatalogController,
            templateUrl: 'modules/data-selection/components/views/catalog/catalog.html',
            controllerAs: 'vm'
        });

    DpDataSelectionCatalogController.$inject = ['$filter'];

    function DpDataSelectionCatalogController ($filter) {
        const vm = this;

        vm.$onChanges = function () {
            if (!Object.keys(vm.catalogFilters).length) {
                return false;
            }

            const formatMap = arrayToObject(vm.catalogFilters.formatTypes, 'id');
            const serviceMap = arrayToObject(vm.catalogFilters.serviceTypes, 'id');
            const distributionMap = arrayToObject(vm.catalogFilters.distributionTypes, 'id');

            vm.items = vm.content.map((item) => {
                const formats = item['dcat:distribution'].map(resource => {
                    if (resource['ams:distributionType'] === 'file') {
                        return formatMap[resource['dcat:mediaType']];
                    } else if (resource['ams:distributionType'] === 'api') {
                        return serviceMap[resource['ams:serviceType']];
                    } else {
                        return distributionMap[resource['ams:distributionType']];
                    }
                });

                const id = item['dct:identifier'];
                const linkTo = {
                    type: routing.datasetsDetail.type,
                    payload: { id }
                };

                return {
                    header: item['dct:title'],
                    description: removeMd(item['dct:description']),
                    modified: item['ams:sort_modified'],
                    formats: $filter('aggregate')(formats),
                    tags: item['dcat:keyword'],
                    linkTo
                };
            });
        };

        sessionStorage.setItem('DCATD_LIST_REDIRECT_URL', document.location.href);
    }

    function arrayToObject (array, keyField) {
        return array.reduce((obj, item) => {
            obj[item[keyField]] = item.label;
            return obj;
        }, {});
    }
}) ();
