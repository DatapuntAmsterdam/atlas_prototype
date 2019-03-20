import getState from '../redux/get-state';
import mapLayers from '../../../map/services/map-layers/map-layers.config';

const findLayer = (id) => mapLayers.find((mapLayer) => mapLayer.id === id);

export class ActiveOverlays {
  constructor() {
    this.allOverlays = [];
  }

  getOverlays() {
    return this.allOverlays
      .filter((overlay) => ActiveOverlays.isAuthorised(overlay));
  }

  // Todo: this always returns false: look into mapLayers, since it doesn't have a minZoom / maxZoom
  static isVisibleAtCurrentZoom(overlay, zoomLevel) {
    const layer = findLayer(overlay);
    if (!layer) {
      return false;
    }
    const zoom = zoomLevel || getState().map.zoom;
    return zoom >= layer.minZoom && zoom <= layer.maxZoom;
  }

  static isAuthorised(overlay) {
    const state = getState();
    const user = state.user;
    const layer = state.mapLayers.find((item) => (
      (item.id && item.id === overlay.id) ||
      (item.legendItems && item.legendItems.length &&
        item.legendItems.some((legendItem) => (
          legendItem.id === overlay.id
        ))
      )
    ));
    const authScope = layer && layer.authScope;

    return findLayer(overlay.id) && layer && (
      !authScope || (user.authenticated && user.scopes.includes(authScope))
    );
  }

  getOverlaysWarning(zoom) {
    return this.getVisibleSources(zoom)
      .filter((source) => source.noDetail)
      .map((a) => a.label_short)
      .join(', ');
  }

  getVisibleSources(zoom) {
    return this.allOverlays
      .filter((source) => (
        source.isVisible &&
        ActiveOverlays.isAuthorised(source) &&
        ActiveOverlays.isVisibleAtCurrentZoom(source.id, zoom)
      ))
      .map((source) => findLayer(source.id));
  }
}

export default new ActiveOverlays();
