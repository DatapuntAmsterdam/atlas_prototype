/* eslint-disable camelcase */
import type { Links, SmallAPIReference } from '../../types'

export interface List {
  count: number
  results: Meting[]
}

// fields zakking, hoogte_nap, zakkingssnelheid and zakking_cumulatief are actually floating point values, but the API returns them as string values 🙄

export interface Meting {
  id: string
  datum: string
  zakking: string | null
  hoogte_nap: string | null
  zakkingssnelheid: string | null
  zakking_cumulatief: string | null
  dataset: string
}

export interface Single extends Meting {
  _links: Links
  _display: string
  metingidentificatie: string
  type: string
  meetbout: string
  onderneming: string
  aantal_dagen: any
  referentiepunt: SmallAPIReference
}
