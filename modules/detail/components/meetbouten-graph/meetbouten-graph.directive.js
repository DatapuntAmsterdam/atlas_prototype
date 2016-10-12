(function () {
    'use strict';

    angular
        .module('atlasDetail')
        .directive('atlasMeetboutGraph', atlasMeetboutGraphDirective);

    atlasMeetboutGraphDirective.$inject = ['api', 'd3', 'dateConverter'];

    function atlasMeetboutGraphDirective (api, d3, dateConverter) {
        return {
            restrict: 'E',
            scope: {
                href: '@',
                pageSize: '='
            },
            link: linkFunction
        };

        function linkFunction (scope, element) {
            // Alleen een grafiek tonen als we 2 of meer metingen hebben
            if (scope.pageSize <= 1) {
                return;
            }

            // parse url om alle metingen te krijgen voor de meetbout
            var href = scope.href + '&page_size=' + scope.pageSize;
            api.getByUrl(href).then(function (response) {
                // data laden
                scope.objects = response.results;

                // variabelen
                // global
                var margin = {top: 10, right: 60, bottom: 30, left: 60},
                    width = 750 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;

                // x scale min-max
                var xAs = d3.time.scale()
                    .domain(d3.extent(scope.objects, function (d) {
                        return dateConverter.ymdToDate(d.datum);
                    }))
                    .range([0, width]);

                var xAxis = d3.svg.axis()
                    .scale(xAs)
                    .orient('bottom');

                // Y as 1, zakking
                var yZakking = d3.scale.linear()
                    .domain(d3.extent(scope.objects, function (d) {
                        return d.zakking;
                    }))
                    .range([0, height]);

                var yZakkingAxis = d3.svg.axis()
                    .scale(yZakking)
                    .orient('left');

                // y as 2, zakkingsnelheid
                var yzakkingssnelheid = d3.scale.linear()
                    .domain(d3.extent(scope.objects, function (d) {
                        return d.zakkingssnelheid;
                    }))
                    .range([height, 0]);

                var yzakkingssnelheidAxis = d3.svg.axis()
                    .scale(yzakkingssnelheid)
                    .orient('right');

                // definieren grafiek lijnen
                var zakkingLine = d3.svg.line()
                    .x(function (d) {
                        return xAs(dateConverter.ymdToDate(d.datum));
                    })
                    .y(function (d) {
                        return yZakking(d.zakking);
                    });

                var zakkingssnelheidLine = d3.svg.line()
                    .x(function (d) {
                        return xAs(dateConverter.ymdToDate(d.datum));
                    })
                    .y(function (d) {
                        return yzakkingssnelheid(d.zakkingssnelheid);
                    });

                // Dom manipulatie
                // Initieren svg voor grafiek
                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('class', 'c-meetbout')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                // intekenen x as
                svg.append('g')
                    .attr('class', 'c-meetbout__axis')
                    .attr('transform', 'translate(0,' + height + ')')
                    .call(xAxis);

                // intekenen y as zakking
                svg.append('g')
                    .attr('class', 'c-meetbout__axis c-meetbout__axis--y-zakking')
                    .call(yZakkingAxis)
                    .append('text')
                    .attr('transform', d3.transform('rotate(-90) translate(-185, -60)'))
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'middle')
                    .text('Zakking (mm)');

                // intekenen y as zakkingssnelheid
                svg.append('g')
                    .attr('class', 'c-meetbout__axis c-meetbout__axis--y-zakkingssnelheid')
                    .attr('transform', 'translate(' + width + ',0)')
                    .call(yzakkingssnelheidAxis)
                    .append('text')
                    .attr('transform', d3.transform('rotate(-90) translate(-185, 35)'))
                    .attr('y', 6)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'middle')
                    .text('Zakkingssnelheid (mm/j)');

                // tekenen grafiek 1 zakking
                svg.append('path')
                    .attr('class', 'c-meetbout__line c-meetbout__line--zakking')
                    .attr('d', zakkingLine(scope.objects));

                // tekenen grafiek 2 zakkingssnelheid
                svg.append('path')
                    .attr('class', 'c-meetbout__line c-meetbout__line--zakkingssnelheid')
                    .attr('d', zakkingssnelheidLine(scope.objects));
            });
        }
    }
})();
