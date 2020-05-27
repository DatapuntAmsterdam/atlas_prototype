import angular from 'angular'

angular.module('dpDetail').directive('dpMeetboutGraph', dpMeetboutGraphDirective)

dpMeetboutGraphDirective.$inject = ['api', 'd3', 'dateConverter', 'dateFormatter']

function dpMeetboutGraphDirective(api, d3, dateConverter, dateFormatter) {
  return {
    restrict: 'E',
    scope: {
      href: '@',
      pageSize: '=',
    },
    link: linkFunction,
  }

  function linkFunction(scope, element) {
    // Alleen een grafiek tonen als we 2 of meer metingen hebben
    if (scope.pageSize <= 1) {
      return
    }

    // parse url om alle metingen te krijgen voor de meetbout
    const href = `${scope.href}&page_size=${scope.pageSize}`
    api.getByUrl(href).then(function (response) {
      // data laden
      scope.objects = response.results

      // variabelen
      // global
      const margin = { top: 15, right: 60, bottom: 30, left: 35 }
      const width = 750 - margin.left - margin.right
      const height = 400 - margin.top - margin.bottom

      // x scale min-max
      const xAs = d3.time
        .scale()
        .domain(
          d3.extent(scope.objects, function (d) {
            return dateConverter.ymdToDate(d.datum)
          }),
        )
        .range([0, width])
        .nice()

      const xAxis = d3.svg
        .axis()
        .scale(xAs)
        .orient('bottom')
        .tickFormat(dateFormatter.tickFormatter)

      // Y as 1, zakking cumulatief
      const yZakkingCum = d3.scale
        .linear()
        .domain(
          d3.extent(scope.objects, function (d) {
            // d3 does not seem to handle rounding errors well
            // values like -4.9999999999998 leaves us with a y
            // axis ranging from 0 to -1 strange enough.
            // Ceiling and flooring solves this problem
            return d.zakking_cumulatief > 0
              ? Math.ceil(d.zakking_cumulatief)
              : Math.floor(d.zakking_cumulatief)
          }),
        )
        .range([0, height])
        .nice()

      const yZakkingCumAxis = d3.svg.axis().scale(yZakkingCum).orient('left')

      // definieren grafiek lijnen
      const zakkingCumLine = d3.svg
        .line()
        .x(function (d) {
          return xAs(dateConverter.ymdToDate(d.datum))
        })
        .y(function (d) {
          return yZakkingCum(d.zakking_cumulatief)
        })

      // Dom manipulatie
      // Initieren svg voor grafiek
      const svg = d3
        .select(element[0])
        .append('svg')
        .attr('class', 'c-meetbout')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // background
      svg
        .append('g')
        .attr('class', 'c-meetbout__background')
        .append('rect')
        .attr('width', width)
        .attr('height', height)

      // intekenen x as
      svg
        .append('g')
        .attr('class', 'c-meetbout__axis c-meetbout__axis-x')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

      // set class in whole years only
      svg.selectAll('.c-meetbout__axis-x .tick').attr('class', (d) => {
        return d.getMonth() === 0 ? 'tick c-meetbout__axis-x-year' : 'tick'
      })

      // intekenen y as zakking
      svg.append('g').attr('class', 'c-meetbout__axis c-meetbout__axis-y').call(yZakkingCumAxis)

      // set y axis lines to full width of chart
      svg.selectAll('.c-meetbout__axis-y .tick line').attr('x2', width)

      // tekenen grafiek zakking cumulatief
      svg
        .append('path')
        .attr('class', 'c-meetbout__line c-meetbout__line--zakking-cum')
        .attr('d', zakkingCumLine(scope.objects))
    })
  }
}
