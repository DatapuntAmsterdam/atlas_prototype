import fixture from './nummeraanduiding.json'
import listResultFixture from './listResult.json'
import { Root as Nummeraanduiding } from './types'
import getListFixture from '../../../getListFixture'
import { APIReference } from '../../../types'
import environment from '../../../../environment'

export const singleFixture = fixture as Nummeraanduiding
export const path = 'bag/v1.1/nummeraanduiding/'
export const fixtureId = '0363200000006110'
export const listFixture = getListFixture(
  listResultFixture as APIReference,
  `${environment.API_ROOT}${path}`,
  50,
  `${environment.API_ROOT}${path}`,
  `${environment.API_ROOT}${path}`,
)
