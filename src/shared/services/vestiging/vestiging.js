import { getAuthHeaders } from '../auth/auth';
import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';
import maatschappelijkeActiviteit from '../maatschappelijke-activiteit/maatschappelijke-activiteit';
import apiUrl from '../api';


export default function fetchByUri(uri) {
  return fetch(uri, { headers: getAuthHeaders() })
    .then((response) => response.json())
    .then((result) => {
      const geometryCenter =
        (result.geometrie && getCenter(result.geometrie)) ||
        (result.bezoekadres.geometrie && getCenter(result.bezoekadres.geometrie));
      const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null;
      const vestigingResult = {
        ...result,
        location: result.location || wgs84Center
      };

      return result.maatschappelijke_activiteit ?
        maatschappelijkeActiviteit(result.maatschappelijke_activiteit)
        .then((mac) => ({
          ...vestigingResult,
          activities: (vestigingResult.activiteiten || []).map((activity) => ({
            ...activity,
            sbiCode: activity.sbi_code,
            sbiDescription: activity.sbi_omschrijving
          })),
          bijzondereRechtstoestand: vestigingResult._bijzondere_rechts_toestand,
          kvkNumber: mac.kvk_nummer,
          label: vestigingResult._display,
          visitingAddress: vestigingResult.bezoekadres
        })) : vestigingResult;
    });
}

export function fetchByPandId(pandId) {
  const searchParams = {
    pand: pandId
  };

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&');

  return fetch(`${apiUrl}handelsregister/vestiging/?${queryString}`,
    { headers: getAuthHeaders() }
  )
    .then((response) => response.json())
    .then((data) => data.results);
}

export function fetchByAddressId(addressId) {
  const searchParams = {
    nummeraanduiding: addressId
  };

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&');

  return fetch(`${apiUrl}handelsregister/vestiging/?${queryString}`,
    { headers: getAuthHeaders() }
  )
    .then((response) => response.json())
    .then((data) => data.results);
}
