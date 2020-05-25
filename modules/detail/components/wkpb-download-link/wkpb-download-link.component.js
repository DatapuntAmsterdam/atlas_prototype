import angular from 'angular'

angular.module('dpDetail').component('dpWkpbDownloadLink', {
  bindings: {
    url: '<',
    label: '<',
  },
  templateUrl: 'modules/detail/components/wkpb-download-link/wkpb-download-link.html',
  controller: DpWkpbDownloadLinkController,
  controllerAs: 'vm',
})

DpWkpbDownloadLinkController.$inject = ['api']

function DpWkpbDownloadLinkController(api) {
  const vm = this

  /* istanbul ignore next */
  this.$onInit = function () {
    api.createUrlWithToken(vm.url).then((tokenUrl) => (vm.downloadUrl = tokenUrl))
  }
}
