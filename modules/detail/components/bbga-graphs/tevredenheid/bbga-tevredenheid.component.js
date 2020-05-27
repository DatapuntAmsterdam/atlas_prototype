import angular from 'angular'

angular.module('dpDetail').component('dpBbgaTevredenheid', {
  templateUrl: 'modules/detail/components/bbga-graphs/tevredenheid/bbga-tevredenheid.html',
  bindings: {
    gebiedHeading: '@',
    gebiedCode: '@',
  },
  controller: DpBbgaTevredenheid,
  controllerAs: 'vm',
})

DpBbgaTevredenheid.$inject = ['BBGA_TEVREDENHEID_CONFIG', 'bbgaDataService']

function DpBbgaTevredenheid(BBGA_TEVREDENHEID_CONFIG, bbgaDataService) {
  const vm = this

  this.$onInit = function () {
    bbgaDataService
      .getGraphData('TEVREDENHEID', vm.gebiedHeading, vm.gebiedCode)
      .then(function (bbgaData) {
        vm.tableData = []

        BBGA_TEVREDENHEID_CONFIG.forEach(function (rowConfig) {
          if (angular.isNumber(bbgaData[rowConfig.variable].data[0].waarde)) {
            vm.tableData.push({
              label: rowConfig.label,
              meta: bbgaData[rowConfig.variable].meta,
              data: bbgaData[rowConfig.variable].data,
            })
          }
        })

        if (vm.tableData.length) {
          vm.year = vm.tableData[0].meta.jaar
        }
      })
  }
}
