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
        label: result._display,
        location: result.location || wgs84Center,
        status: {
          code: result.status ? result.status.code : '',
          description: result.status ? result.status.omschrijving : ''
        },
        nenName: result.naam_24_posities || ''
      };
    });
}
