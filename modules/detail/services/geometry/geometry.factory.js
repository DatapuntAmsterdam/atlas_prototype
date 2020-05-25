import angular from 'angular'
import { isVestigingAmsterdam } from '../../../../src/shared/services/geometry/geometry'
import isObject from '../../../../src/shared/services/is-object'

angular.module('dpDetail').factory('geometry', geometryFactory)

geometryFactory.$inject = ['api']

function geometryFactory(api) {
  return {
    getGeoJSON,
  }

  /*
   * @param {String} url
   *
   * @returns {Promise} - An object with GeoJSON or null
   */
  function getGeoJSON(url) {
    return api.getByUrl(url).then(getGeometry)

    function getGeometry(data) {
      if (isObject(data.geometrie)) {
        return data.geometrie
      }
      if (isVestigingAmsterdam(data)) {
        return data.bezoekadres.geometrie
      }
      if (isAPerceel(url, data)) {
        return getGPerceel(data).then(getGeometry)
      }
      if (isNummeraanduiding(url)) {
        return getAdresseerbaarObject(data).then(getGeometry)
      }
      if (isMonument(url)) {
        return data.monumentcoordinaten
      }
      return null
    }

    function isAPerceel(anUrl, data) {
      return anUrl.indexOf('brk/object') !== -1 && data.index_letter === 'A'
    }

    function getGPerceel(aPerceelData) {
      // Retrieve a list of all related G percelen
      return api.getByUrl(aPerceelData.g_percelen.href).then(function (gPercelen) {
        // Get the first G perceel
        return api.getByUrl(gPercelen.results[0]._links.self.href)
      })
    }

    function isNummeraanduiding(anUrl) {
      return anUrl.indexOf('bag/nummeraanduiding') !== -1
    }

    function isMonument(anUrl) {
      return anUrl.indexOf('monumenten/monumenten') !== -1
    }

    function getAdresseerbaarObject(nummeraanduidingData) {
      let object = nummeraanduidingData.type
      object = object.toLowerCase()

      return api.getByUrl(nummeraanduidingData[object])
    }
  }
}
