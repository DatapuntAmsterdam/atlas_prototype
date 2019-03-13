import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

export default function fetchByUri(uri) {
  return getByUrl(uri)
    .then((result) => {
      const geometryCenter = result.wkb_geometry && getCenter(result.wkb_geometry);
      const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null;

      return ({
        label: result._display,
        category: (result.categorie_naam) ? `${result.categorie_naam} (${result.categorie})` : null,
        location: wgs84Center,
        geometrie: result.wkb_geometry
      });
    });
}
