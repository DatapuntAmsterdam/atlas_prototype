import fixtureSingle from './verblijfsobjecten.json'
import fixtureList from './verblijfsobjecten-list.json'
import type { Single } from './types'
import type { HALList } from '../../../types'

type List = HALList<{ verblijfsobjecten: Single[] }>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const fixtureId = '0363010000543292'
export const path = 'v1/bag/verblijfsobjecten/'

export type { Single, List }
