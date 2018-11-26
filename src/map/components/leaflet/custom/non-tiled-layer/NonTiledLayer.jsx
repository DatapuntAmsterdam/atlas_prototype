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
}

export default NonTiledLayer;
