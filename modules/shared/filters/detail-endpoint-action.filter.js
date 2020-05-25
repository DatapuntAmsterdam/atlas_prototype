import angular from 'angular'
import { VIEW_MODE } from '../../../src/shared/ducks/ui/ui'
import { toDetailFromEndpoint } from '../../../src/store/redux-first-router/actions'

angular.module('dpShared').filter('detailEndpointAction', detailEndpointAction)

function detailEndpointAction() {
  return (endpoint) => {
    if (!endpoint) {
      return
    }
    return toDetailFromEndpoint(endpoint, VIEW_MODE.SPLIT)
  }
}
