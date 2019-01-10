import SHARED_CONFIG from '../shared-config/shared-config';
import verblijfsobject from './adressen-verblijfsobject';

import getCenter from '../geo-json/geo-json';
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter';

import { getByUrl } from '../api/api';

export default function fetchByUri(uri) {
  return getByUrl(uri)
    .then((result) => ({
      ...result,
      label: result._display,
      isNevenadres: !result.hoofdadres
    }))
    .then((result) => (
      result.verblijfsobject ?
        verblijfsobject(result.verblijfsobject)
          .then((vboResult) => ({
            ...vboResult,
            label: result.label,
            isNevenadres: result.isNevenadres
          })) :
        result
    ))
    .then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      const geometryCenter = result._geometrie && getCenter(result._geometrie);
      const wgs84Center = geometryCenter && rdToWgs84(geometryCenter);

      return {
        ...result,
        location: result.location || wgs84Center
      };
    });
}

export function fetchByPandId(pandId) {
  const searchParams = {
    pand: pandId
  };

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&');

  return getByUrl(`${SHARED_CONFIG.API_ROOT}bag/nummeraanduiding/?${queryString}`)
    .then((data) => data.results);
}

export function fetchByLigplaatsId(ligplaatsId) {
  const searchParams = {
    ligplaats: ligplaatsId
  };

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&');

  return getByUrl(`${SHARED_CONFIG.API_ROOT}bag/nummeraanduiding/?${queryString}`)
    .then((data) => data.results
      .map((result) => ({
        ...result,
        id: result.landelijk_id
      }))
    );
}

export function fetchHoofdadresByLigplaatsId(ligplaatsId) {
  return fetchByLigplaatsId(ligplaatsId)
    .then((results) => results.find((result) => result.hoofdadres));
}

export function fetchByStandplaatsId(standplaatsId) {
  const searchParams = {
    standplaats: standplaatsId
  };

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&');

  return getByUrl(`${SHARED_CONFIG.API_ROOT}bag/nummeraanduiding/?${queryString}`)
    .then((data) => data.results
      .map((result) => ({
        ...result,
        id: result.landelijk_id
      }))
    );
}

export function fetchHoofdadresByStandplaatsId(standplaatsId) {
  return fetchByStandplaatsId(standplaatsId)
    .then((results) => results.find((result) => result.hoofdadres));
}
