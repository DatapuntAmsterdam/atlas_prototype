/* eslint-disable import/first */
/* eslint-disable import/no-extraneous-dependencies */
import 'core-js'
import 'regenerator-runtime/runtime'
import angular from 'angular'
// All our modules' javascript
import '../modules/atlas/atlas.module'
import '../modules/atlas/atlas.run'
import '../modules/atlas/services/redux/store.run'
import '../modules/data-selection/data-selection.module'
import '../modules/data-selection/components/available-filters/available-filters.component'
import '../modules/data-selection/components/sbi-filter/sbi-filter.component'
import '../modules/data-selection/components/pagination/pagination-link.component'
import '../modules/data-selection/components/pagination/pagination.component'
import '../modules/data-selection/services/document-title/document-title.factory'
import '../modules/shared/shared.module'
import '../modules/shared/components/coordinates/coordinates.filter'
import '../modules/shared/components/expand-collapse/expand-collapse.directive'
// import '../modules/shared/components/link/link.component';
import '../modules/shared/components/loading-indicator/loading-indicator.component'
import '../modules/shared/components/message/message.component'
import '../modules/shared/components/panel/panel.component'
import '../modules/shared/components/panorama-thumbnail/panorama-thumbnail.component'
import '../modules/shared/services/api/api.factory'
import '../modules/shared/services/crs/crs-config.constant'
import '../modules/shared/services/crs/crs-converter.factory'
import '../modules/shared/services/window-error-handler/window-error-handler.factory'
import '../modules/shared/services/window-error-handler/window-error-handler.run'
import '../modules/shared/services/http-error-registrar/http-error-registrar.factory'
import '../modules/shared/services/http-error-registrar/http-status.factory'
import '../modules/shared/services/localization/localization.factory'
import '../modules/shared/services/redux/store.factory'
import '../modules/shared/services/storage/instance-storage.factory'
import '../modules/shared/services/storage/storage.factory'
import '../modules/shared/shared.vendor'
// The mocks
import 'angular-mocks'
import '../modules/shared/components/link/link.component.mock'
// All our modules' javascript tests
import '../modules/data-selection/components/available-filters/available-filters.component.test'
import '../modules/data-selection/components/sbi-filter/sbi-filter.component.test'
import '../modules/data-selection/services/document-title/document-title.factory.test'
import '../modules/shared/components/expand-collapse/expand-collapse.directive.test'
import '../modules/shared/components/link/link.component.test'
import '../modules/shared/components/panorama-thumbnail/panorama-thumbnail.component.test'
import '../modules/shared/components/panel/panel.component.test'
import '../modules/shared/components/message/message.component.test'
import '../modules/shared/components/loading-indicator/loading-indicator.component.test'
import '../modules/shared/components/coordinates/coordinates.filter.test'
import '../modules/shared/services/storage/storage.factory.test'
import '../modules/shared/services/redux/store.factory.test'
import '../modules/shared/services/window-error-handler/window-error-handler.factory.test'
import '../modules/shared/services/http-error-registrar/http-error-registrar.factory.test'
import '../modules/shared/services/http-error-registrar/http-status.factory.test'
import '../modules/shared/services/api/api.factory.test'
import '../modules/shared/services/localization/localization.factory.test'
import '../modules/shared/services/crs/crs-converter.factory.test'

// Import the templates and inject them into angular
const templates = require.context('../modules', true, /\.html$/)
const origInject = angular.mock.inject
angular.mock.inject = (callback) => {
  origInject(($templateCache) => {
    templates.keys().forEach((key) => {
      // Remove the dot from './dir/template.html' and prepend with
      // 'modules' to get 'modules/dir/template.html'.
      const templateId = `modules${key.substr(1)}`
      $templateCache.put(templateId, templates(key))
    })
  })
  origInject(callback)
}
/* eslint-enable */
