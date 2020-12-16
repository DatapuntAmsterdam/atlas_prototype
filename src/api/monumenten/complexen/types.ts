/* eslint-disable camelcase */
import { APIReference, SmallAPIReference } from '../../types'

export interface Root extends APIReference {
  identificerende_sleutel_complex: string
  monumentnummer_complex: number
  complexnaam: string
  monumenten: SmallAPIReference
}
