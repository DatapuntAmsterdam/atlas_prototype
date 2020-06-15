import { fetchWithToken } from '../../../shared/services/api/api'
import mapFetch from '../map-fetch/map-fetch'
import { adressenVerblijfsobject } from '../normalize/normalize'

const normalize = async (result) => {
  let verblijfsobject
  if (result.verblijfsobject) {
    verblijfsobject = await mapFetch(result.verblijfsobject, false, adressenVerblijfsobject)
  }

  const additionalFields = {
    ...((await verblijfsobject)
      ? {
          verblijfsobject: {
            gebruiksdoelen: verblijfsobject.gebruiksdoelen,
            gebruik: verblijfsobject.gebruik || '',
            status: verblijfsobject.status || '',
            size: verblijfsobject.size,
            statusLevel: verblijfsobject.statusLevel,
          },
        }
      : {}),
    isNevenadres: result.type_adres === 'Nevenadres',
    // eslint-disable-next-line no-underscore-dangle
    geometry: result._geometrie,
  }

  return { ...result, ...additionalFields }
}

export function fetchByPandId(pandId) {
  const searchParams = {
    pand: pandId,
  }

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&')

  return fetchWithToken(`${process.env.API_ROOT}bag/v1.1/nummeraanduiding/?${queryString}`).then(
    (data) => data.results,
  )
}

export function fetchByLigplaatsId(ligplaatsId) {
  const searchParams = {
    ligplaats: ligplaatsId,
  }

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&')

  return fetchWithToken(`${process.env.API_ROOT}bag/v1.1/nummeraanduiding/?${queryString}`).then(
    (data) =>
      data.results.map((result) => ({
        ...result,
        id: result.landelijk_id,
      })),
  )
}

export function fetchHoofdadresByLigplaatsId(ligplaatsId) {
  return fetchByLigplaatsId(ligplaatsId).then((results) =>
    results.find((result) => result.hoofdadres),
  )
}

export function fetchByStandplaatsId(standplaatsId) {
  const searchParams = {
    standplaats: standplaatsId,
  }

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&')

  return fetchWithToken(`${process.env.API_ROOT}bag/v1.1/nummeraanduiding/?${queryString}`).then(
    (data) =>
      data.results.map((result) => ({
        ...result,
        id: result.landelijk_id,
      })),
  )
}

export function fetchHoofdadresByStandplaatsId(standplaatsId) {
  return fetchByStandplaatsId(standplaatsId).then((results) =>
    results.find((result) => result.hoofdadres),
  )
}

export default normalize
