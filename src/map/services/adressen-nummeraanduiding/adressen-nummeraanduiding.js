import { fetchWithToken } from '../../../shared/services/api/api'
import environment from '../../../environment'
import { adressenVerblijfsobject } from '../normalize/normalize'

const normalize = async (result) => {
  let verblijfsobjectData
  if (result.verblijfsobject) {
    verblijfsobjectData = adressenVerblijfsobject(await fetchWithToken(result.verblijfsobject))
  }
  const additionalFields = {
    isNevenadres: result.type_adres === 'Nevenadres',
    // eslint-disable-next-line no-underscore-dangle
    geometry: result._geometrie,
  }

  return { ...result, ...additionalFields, verblijfsobjectData }
}

export function fetchByPandId(pandId) {
  const searchParams = {
    pand: pandId,
  }

  const queryString = Object.keys(searchParams)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
    .join('&')

  return fetchWithToken(`${environment.API_ROOT}bag/v1.1/nummeraanduiding/?${queryString}`).then(
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

  return fetchWithToken(`${environment.API_ROOT}bag/v1.1/nummeraanduiding/?${queryString}`).then(
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

  return fetchWithToken(`${environment.API_ROOT}bag/v1.1/nummeraanduiding/?${queryString}`).then(
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
