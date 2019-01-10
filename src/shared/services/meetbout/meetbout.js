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
        address: result.adres,
        label: result.meetboutidentificatie,
        location: result.location || wgs84Center,
        speed: parseFloat(result.zakkingssnelheid)
      };
    });
}
