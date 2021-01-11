export interface Root {
  count: number
  results: Meting[]
}

// fields zakking, hoogte_nap, zakkingssnelheid and zakking_cumulatief are actually floating point values, but the API returns them as string values 🙄

export interface Meting {
  id: string
  datum: string
  zakking: string | null
  // eslint-disable-next-line camelcase
  hoogte_nap: string | null
  zakkingssnelheid: string | null
  // eslint-disable-next-line camelcase
  zakking_cumulatief: string | null
  dataset: string
}
