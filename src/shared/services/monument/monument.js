import { getAuthHeaders } from '../auth/auth';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';
import apiUrl from '../api';


export default function fetchByUri(uri) {
  return fetch(uri, { headers: getAuthHeaders() })
    .then((response) => response.json())
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

  return fetch(`${apiUrl}monumenten/monumenten/?${queryString}`,
    { headers: getAuthHeaders() }
  )
    .then((response) => response.json())
    .then((data) => data.results);
}
