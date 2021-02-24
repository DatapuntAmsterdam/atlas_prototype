import fixtureSingle from './openbareruimtes.json'
import fixtureList from './openbareruimtes-list.json'
import { Single } from './types'
import { BagList } from '../types'

type List = BagList<{ openbareruimtes: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '0363300000000869'
export const path = 'v1/bag/openbareruimtes/'

export { Single, List }
