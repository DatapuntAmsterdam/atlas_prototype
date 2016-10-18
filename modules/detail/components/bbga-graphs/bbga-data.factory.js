(function () {
    'use strict';

    angular
        .module('dpDetail')
        .factory('bbgaDataService', bbgaDataService);

    bbgaDataService.$inject = ['$q', '$http', 'BBGA_CONFIG', 'environment'];

    function bbgaDataService ($q, $http, BBGA_CONFIG, environment) {
        return {
            getGraphData: getGraphData
        };

        /**
         *
         * @param {String} visualisation - A reference to a key of BBGA_CONFIG
         * @param {String} gebiedHeading - The name of the gebied
         * @param {String} gebiedCode - A code that matches the bbga/gebieden/ endpoint variabelen
         *
         * @returns {Promise.Object} - Formatted data, ready for the third party BBGA graphs.
         */
        function getGraphData (visualisation, gebiedHeading, gebiedCode) {
            var variables = {};

            BBGA_CONFIG[visualisation].forEach(function (variableConfig) {
                variables[variableConfig.variable] = getVariable(variableConfig, gebiedHeading, gebiedCode);
            });

            return $q.all(variables);
        }

        function getVariable (variableConfig, gebiedHeading, gebiedCode) {
            var variableName,
                dataRequests = [];

            variableName = variableConfig.variable;

            dataRequests.push(getData(variableName, gebiedHeading, gebiedCode));

            if (variableConfig.compareWithAmsterdam) {
                dataRequests.push(getData(variableName, 'Amsterdam', 'STAD'));
            }

            return $q.all({
                meta: getMetaData(variableName),
                data: $q.all(dataRequests)
            }).then(setYearMetaData);
        }

        function getMetaData (variableName) {
            return $http({
                method: 'GET',
                url: environment.API_ROOT + 'bbga/meta/',
                params: {
                    variabele: variableName
                }
            }).then(function (response) {
                return {
                    label: response.data.results[0].label,
                    peildatum: response.data.results[0].peildatum
                };
            });
        }

        function getData (variableName, gebiedHeading, gebiedCode) {
            return $http({
                method: 'GET',
                url: environment.API_ROOT + 'bbga/cijfers/',
                params: {
                    variabele: variableName,
                    gebiedcode15: gebiedCode,
                    jaar: 'latest'
                }
            }).then(function (response) {
                return {
                    label: gebiedHeading,
                    code: gebiedCode,
                    waarde: response.data.count > 0 ? response.data.results[0].waarde : null,
                    jaar: response.data.count > 0 ? response.data.results[0].jaar : null
                };
            });
        }

        // We're assuming that all data for a variable gets updated at the same time
        function setYearMetaData (variableData) {
            // Make the jaar part of the meta data
            variableData.meta.jaar = variableData.data[0].jaar;

            // Remove the jaar from it's old position
            variableData.data.map(function (data) {
                delete data.jaar;

                return data;
            });

            return variableData;
        }
    }
})();
