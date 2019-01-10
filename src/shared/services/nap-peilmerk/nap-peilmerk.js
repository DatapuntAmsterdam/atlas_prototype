import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

export default function fetchByUri(uri) {
  return getByUrl(uri)
    .then((result) => {
      const geometryCenter = result.geometrie && getCenter(result.geometrie);
      const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null;

      return {
        ...result,
        description: result.omschrijving,
        height: parseFloat(result.hoogte_nap),
        label: result.peilmerkidentificatie,
        location: result.location || wgs84Center,
        wallCoordinates: ((result.x_muurvlak || result.x_muurvlak === 0) &&
            (result.y_muurvlak || result.y_muurvlak === 0)) ? [
              parseFloat(result.x_muurvlak),
              parseFloat(result.y_muurvlak)
            ] : undefined,
        windDirection: result.windrichting,
        year: result.jaar
      };
    });
}
