import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';
import SHARED_CONFIG from '../shared-config/shared-config';

import { getByUrl } from '../api/api';

export default function fetchByUri(uri) {
  return getByUrl(uri)
    .then((result) => {
      const geometryCenter =
        (result.geometrie && getCenter(result.geometrie)) ||
        (result.monumentcoordinaten && getCenter(result.monumentcoordinaten));
      const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null;

      return {
        ...result,
        label: result._display,
        location: result.location || wgs84Center,
        number: result.monumentnummer,
        status: result.monumentstatus,
        type: result.monumenttype
      };
    });
}

export function fetchByPandId(pandId) {
  const searchParams = {
    betreft_pand: pandId
  };

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&');

  return getByUrl(`${SHARED_CONFIG.API_ROOT}monumenten/monumenten/?${queryString}`)
    .then((data) => data.results);
}
