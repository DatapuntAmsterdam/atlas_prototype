import fixture from './pand.json'
import { Root as Pand } from './types'
import getListFixture from '../../../getListFixture'
import listResultFixture from './listResult.json'
import { APIReference } from '../../../types'
import environment from '../../../../environment'

export const singleFixture = fixture as Pand
export const path = 'bag/v1.1/pand/'
export const fixtureId = '0363100012168052'
export const listFixture = getListFixture(
  listResultFixture as APIReference,
  `${environment.API_ROOT}${path}`,
  50,
  `${environment.API_ROOT}${path}`,
  `${environment.API_ROOT}${path}`,
)
