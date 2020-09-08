import getState from '../redux/get-state'

const findLayer = (mapLayers, id) => mapLayers.find((mapLayer) => mapLayer.id === id)

export class ActiveOverlays {
  constructor() {
    this.allOverlays = []
  }

  getOverlays() {
    return this.allOverlays.filter((overlay) => ActiveOverlays.isAuthorised(overlay))
  }

  // Todo: this always returns false: look into mapLayers, since it doesn't have a minZoom
  static isVisibleAtCurrentZoom(overlay, zoomLevel) {
    const { map, mapLayers } = getState()
    const { items: mapLayerItems } = mapLayers.layers

    const layer = findLayer(mapLayerItems, overlay)
    if (!layer) {
      return false
    }
    const zoom = zoomLevel || map.zoom
    return zoom >= layer.minZoom
  }

  static isAuthorised(overlay) {
    const { user, mapLayers } = getState()
    const { items: mapLayerItems } = mapLayers.layers

    const layer = mapLayerItems.find(
      (item) =>
        (item.id && item.id === overlay.id) ||
        (item.legendItems &&
          item.legendItems.length &&
          item.legendItems.some((legendItem) => legendItem.id === overlay.id)),
    )
    const authScope = layer && layer.authScope

    return (
      findLayer(mapLayerItems, overlay.id) &&
      layer &&
      (!authScope || (user.authenticated && user.scopes.includes(authScope)))
    )
  }

  getOverlaysWarning(zoom) {
    return this.getVisibleSources(zoom)
      .filter((source) => source.noDetail)
      .map((a) => a.label_short)
      .join(', ')
  }

  getVisibleSources(zoom) {
    const { mapLayers } = getState()
    const { items: mapLayerItems } = mapLayers.layers

    return this.allOverlays
      .filter(
        (source) =>
          source.isVisible &&
          ActiveOverlays.isAuthorised(source) &&
          ActiveOverlays.isVisibleAtCurrentZoom(source.id, zoom),
      )
      .map((source) => findLayer(mapLayerItems, source.id))
  }
}

export default new ActiveOverlays()
