import { TileLayer } from 'react-leaflet';
import L from 'leaflet';
import queryString from 'querystring';
import 'leaflet.nontiledlayer';

class NonTiledLayer extends TileLayer {
  createLeafletElement(props) {
    const { url, params, ...args } = props;

    const query = (params) ? queryString.stringify(params) : '';
    const layerUrl = (query) ? `${url}?${query}` : url;

    return L.nonTiledLayer.wms(layerUrl, this.getOptions(args));
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
    if (toProps.params !== fromProps.params) {
      this.leafletElement.setParams(toProps.params);
    }

    if (toProps.url !== fromProps.url) {
      // eslint-disable-next-line no-underscore-dangle
      this.leafletElement._wmsUrl = toProps.url;
      this.leafletElement.wmsParams.layers = toProps.layers;
    }

    if (toProps.opacity !== fromProps.opacity) {
      this.leafletElement.setOpacity(toProps.opacity);
    }
  }
}

export default NonTiledLayer;
