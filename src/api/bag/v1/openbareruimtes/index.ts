import fixtureSingle from './openbareruimtes.json'
import fixtureList from './openbareruimtes-list.json'
import type { Single } from './types'
import type { HALList } from '../../../types'

type List = HALList<{ openbareruimtes: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '0363300000000869'
export const path = 'v1/bag/openbareruimtes/'

export type { Single, List }
